import {
  Constructor,
  PROVISIONEER_METADATA,
   ComponentMetaMap,
} from 'xingine';
import { ProvisioneerOptions, CommissarOptions } from './interfaces/layout-interfaces';

export const COMMISSAR_METADATA = 'xingine:provisioneer:commissar';
export const PROVISIONEER_LAYOUT_METADATA = 'xingine:provisioneer:layout';

/**
 * @Provisioneer decorator for controller-level layout assignment
 * Assigns a layout to all methods in the controller unless overridden
 */
export function Provisioneer(options: ProvisioneerOptions): ClassDecorator {
  return (target: any) => {
    // Validate layout name (basic validation)
    if (!options.layout || typeof options.layout !== 'string') {
      throw new Error('@Provisioneer requires a valid layout name');
    }

    // Store layout mandate in the format expected by the inspector
    const layoutMandate = {
      type: options.layout,
      permissions: options.permissions || [],
      description: options.description
    };

    // Set metadata for inspector service to detect
    Reflect.defineMetadata(PROVISIONEER_LAYOUT_METADATA, layoutMandate, target);
    
    // Also set the original provisioneer metadata for backward compatibility
    Reflect.defineMetadata(PROVISIONEER_METADATA, {
      name: target.name,
      layoutMandate,
      permissions: options.permissions || [],
      description: options.description
    }, target);

    console.log(`@Provisioneer applied to ${target.name} with layout: ${options.layout}`);
  };
}

/**
 * Get provisioneer layout properties from a controller class
 */
export function getProvisioneerLayoutProperties(constructor: Constructor): any {
  return Reflect.getMetadata(PROVISIONEER_LAYOUT_METADATA, constructor);
}

/**
 * A @Commissar is a controller action-level annotation used within a @Provisioneer to define a centrally authorized service endpoint
 * that also manages its UI representation and execution lifecycle hooks.
 * Each @Commissar determines how the action is visualized to the user (via component) and may specify logic to be executed before and/or after the core action.
 */
export function Commissar<
  TReq = unknown,
  TOperative extends keyof ComponentMetaMap = keyof ComponentMetaMap,
>(options: CommissarOptions): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const constructor = target.constructor;
    console.log('Enhanced @Commissar applied to:', constructor.name, propertyKey);

    // Validate that component is provided (required in new system)
    if (!options.component) {
      throw new Error(
        `@Commissar on ${constructor.name}.${String(propertyKey)} requires a component definition`
      );
    }

    // The prevents the commissar to be initiated before the provisioneer and throw error
    setTimeout(() => {
      const isProvisioned = Reflect.getMetadata(
        PROVISIONEER_METADATA,
        constructor,
      ) || Reflect.getMetadata(
        PROVISIONEER_LAYOUT_METADATA,
        constructor,
      );
      if (!isProvisioned) {
        throw new Error(
          `@Commissar can only be used in classes decorated with @Provisioneer. Method: ${String(propertyKey)}`,
        );
      }
    }, 0);

    // Build enhanced commissar properties
    const enhancedOptions = {
      ...options,
      methodName: String(propertyKey),
      controllerName: constructor.name
    };

    Reflect.defineMetadata(COMMISSAR_METADATA, enhancedOptions, descriptor.value);
  };
}

export function getCommissarProperties(
  provisioneer: Constructor,
  actionName: string,
): CommissarOptions | undefined {
  const action = provisioneer.prototype[actionName as string | symbol];
  if (typeof action !== 'function') return undefined;

  return Reflect.getMetadata(COMMISSAR_METADATA, action) as
    | CommissarOptions
    | undefined;
}

/**
 * Get enhanced commissar properties with both old and new format support
 */
export function getEnhancedCommissarProperties(
  provisioneer: Constructor,
  actionName: string,
): CommissarOptions | undefined {
  const action = provisioneer.prototype[actionName as string | symbol];
  if (typeof action !== 'function') return undefined;
 return Reflect.getMetadata(COMMISSAR_METADATA, action) as CommissarOptions | undefined;
}
