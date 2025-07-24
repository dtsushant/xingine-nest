import { Injectable, ExecutionContext, BadRequestException, CallHandler, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from } from 'rxjs';
import { getEnhancedCommissarProperties, COMMISSAR_METADATA } from '../xingine-nest.decorator';
import { CommissarOptions } from '../interfaces/layout-interfaces';

/**
 * Interceptor that handles action execution flow for @Commissar decorated methods
 * Executes: preAction → mainMethod → postAction
 */
@Injectable()
export class CommissarActionInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const controller = context.getClass();
    
    // Check if method has @Commissar decorator
    const commissarMeta = this.getCommissarMetadata(handler);
    if (!commissarMeta) {
      return next.handle(); // No @Commissar decorator, proceed normally
    }

    // Only process new format commissars with action hooks
    if (!this.hasActionHooks(commissarMeta)) {
      return next.handle(); // No action hooks, proceed normally
    }
    
    // Execute action chain with proper error handling
    return from(this.executeActionChain(context, next, commissarMeta));
  }

  /**
   * Get commissar metadata from method handler
   */
  private getCommissarMetadata(handler: Function): CommissarOptions | null {
    const metadata = this.reflector.get(COMMISSAR_METADATA, handler);
    
    // Check if it's the new format with component definition
    if (metadata && 'component' in metadata && metadata.component) {
      return metadata as CommissarOptions;
    }
    
    return null;
  }

  /**
   * Check if commissar has preAction or postAction hooks
   */
  private hasActionHooks(commissar: CommissarOptions): boolean {
    return !!(commissar.preAction || commissar.postAction);
  }

  /**
   * Execute the complete action chain: preAction → mainMethod → postAction
   */
  private async executeActionChain(
    context: ExecutionContext, 
    next: CallHandler, 
    commissarMeta: CommissarOptions
  ): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const controllerInstance = context.getClass().prototype;
    
    try {
      // Execute preAction if defined
      if (commissarMeta.preAction) {
        console.log(`Executing preAction: ${commissarMeta.preAction}`);
        await this.executeAction(controllerInstance, commissarMeta.preAction, context);
      }
      
      // Execute main method
      const result = await next.handle().toPromise();
      
      // Execute postAction if defined (even if main method succeeds)
      if (commissarMeta.postAction) {
        try {
          console.log(`Executing postAction: ${commissarMeta.postAction}`);
          await this.executeAction(controllerInstance, commissarMeta.postAction, context);
        } catch (postError) {
          // Log postAction errors but don't fail the request
          console.error(`PostAction '${commissarMeta.postAction}' failed:`, postError);
        }
      }
      
      return result;
    } catch (error) {
      // If preAction or main method fails, don't execute postAction
      console.error(`Action execution failed:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Action execution failed: ${errorMessage}`);
    }
  }

  /**
   * Execute an individual action method on the controller
   */
  private async executeAction(
    controllerInstance: any, 
    actionName: string, 
    context: ExecutionContext
  ): Promise<any> {
    if (typeof controllerInstance[actionName] !== 'function') {
      throw new Error(`Action method '${actionName}' not found on controller`);
    }

    // Get controller instance from context if available, otherwise use prototype
    const request = context.switchToHttp().getRequest();
    const actualInstance = request.controller || controllerInstance;

    try {
      // Execute the action method with proper context
      const result = await actualInstance[actionName].call(actualInstance);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Action method '${actionName}' execution failed: ${errorMessage}`);
    }
  }
}

/**
 * Detailed action execution result for debugging and monitoring
 */
export interface ActionExecutionResult {
  preActionExecuted: boolean;
  preActionResult?: any;
  preActionError?: string;
  mainMethodExecuted: boolean;
  mainMethodResult?: any;
  mainMethodError?: string;
  postActionExecuted: boolean;
  postActionResult?: any;
  postActionError?: string;
  totalExecutionTime: number;
  success: boolean;
}

/**
 * Enhanced interceptor with detailed execution tracking
 */
@Injectable()
export class DetailedCommissarActionInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const commissarMeta = this.getCommissarMetadata(handler);
    
    if (!commissarMeta || !this.hasActionHooks(commissarMeta)) {
      return next.handle();
    }
    
    return from(this.executeWithTracking(context, next, commissarMeta));
  }

  private getCommissarMetadata(handler: Function): CommissarOptions | null {
    const metadata = this.reflector.get(COMMISSAR_METADATA, handler);
    if (metadata && 'component' in metadata && metadata.component) {
      return metadata as CommissarOptions;
    }
    return null;
  }

  private hasActionHooks(commissar: CommissarOptions): boolean {
    return !!(commissar.preAction || commissar.postAction);
  }

  /**
   * Execute action chain with detailed tracking
   */
  private async executeWithTracking(
    context: ExecutionContext,
    next: CallHandler,
    commissarMeta: CommissarOptions
  ): Promise<any> {
    const startTime = Date.now();
    const result: ActionExecutionResult = {
      preActionExecuted: false,
      mainMethodExecuted: false,
      postActionExecuted: false,
      totalExecutionTime: 0,
      success: false
    };

    const controllerInstance = context.getClass().prototype;

    try {
      // Execute preAction
      if (commissarMeta.preAction) {
        try {
          result.preActionResult = await this.executeAction(
            controllerInstance, 
            commissarMeta.preAction, 
            context
          );
          result.preActionExecuted = true;
        } catch (error) {
          result.preActionError = error instanceof Error ? error.message : 'Unknown error';
          throw error; // Abort chain on preAction failure
        }
      }

      // Execute main method
      try {
        const mainResult = await next.handle().toPromise();
        result.mainMethodResult = mainResult;
        result.mainMethodExecuted = true;
      } catch (error) {
        result.mainMethodError = error instanceof Error ? error.message : 'Unknown error';
        throw error; // Abort chain on main method failure
      }

      // Execute postAction (always attempt if main method succeeds)
      if (commissarMeta.postAction) {
        try {
          result.postActionResult = await this.executeAction(
            controllerInstance,
            commissarMeta.postAction,
            context
          );
          result.postActionExecuted = true;
        } catch (error) {
          result.postActionError = error instanceof Error ? error.message : 'Unknown error';
          // Don't throw - postAction failures don't abort the request
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`PostAction failed: ${errorMessage}`);
        }
      }

      result.success = true;
      result.totalExecutionTime = Date.now() - startTime;

      // Log execution summary
      console.log('Action execution completed:', {
        preAction: commissarMeta.preAction || 'none',
        postAction: commissarMeta.postAction || 'none',
        executionTime: result.totalExecutionTime,
        success: result.success
      });

      return result.mainMethodResult;

    } catch (error) {
      result.success = false;
      result.totalExecutionTime = Date.now() - startTime;
      
      console.error('Action execution failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: result.totalExecutionTime,
        result
      });

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Action execution failed: ${errorMessage}`);
    }
  }

  private async executeAction(
    controllerInstance: any,
    actionName: string,
    context: ExecutionContext
  ): Promise<any> {
    if (typeof controllerInstance[actionName] !== 'function') {
      throw new Error(`Action method '${actionName}' not found on controller`);
    }

    const request = context.switchToHttp().getRequest();
    const actualInstance = request.controller || controllerInstance;

    return await actualInstance[actionName].call(actualInstance);
  }
}