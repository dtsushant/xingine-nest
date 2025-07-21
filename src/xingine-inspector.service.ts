import { Injectable, RequestMethod, Type } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import {
  Constructor,
  extractRouteParams,
  getProvisioneerProperties,
  GroupedPermission,
  ModuleProperties,
  Permission,
  LayoutRenderer,
  LayoutComponentDetail,
  PathProperties,
  Commissar,
  ProvisioneerProperties,
  LayoutRendererBuilder,
} from 'xingine';

import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { 
  getCommissarProperties, 
  getEnhancedCommissarProperties,
  getProvisioneerLayoutProperties,
  PROVISIONEER_LAYOUT_METADATA 
} from './xingine-nest.decorator';
import { extractMeta } from './utils/commissar.utils';
import { 
  CommissarOptions, 
  PathProperties as EnhancedPathProperties,
  ActionValidationResult 
} from './interfaces/layout-interfaces';
import { createDefaultLayout, createLoginLayout } from './templates/layout-templates';
import { LayoutRegistryService } from './services/layout-registry.service';

@Injectable()
export class XingineInspectorService {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly layoutRegistryService: LayoutRegistryService,
  ) {}

  /**
   * Get all layout renderers by scanning controllers with @Provisioneer decorators
   * Uses the LayoutRegistryService to check if layouts exist and adds commissar content to registered layouts
   * Handles layout overrides where @Commissar can specify different layout than controller's @Provisioneer
   */
  getAllLayoutRenderers(): LayoutRenderer[] {
    const layoutRenderers: LayoutRenderer[] = [];
    const controllers = this.getAllControllers();

    // Group controllers by layout type from layoutMandate
    const layoutGroups = new Map<string, {
      provisioneerProperties: any;
      controllers: Constructor<unknown>[];
    }>();

    // Collect layout overrides separately
    const layoutOverrides = new Map<string, Commissar[]>();

    for (const controller of controllers) {
      // Try new format first
      const layoutProperties = getProvisioneerLayoutProperties(controller);
      const provisioneerProperties = getProvisioneerProperties(controller);
      
      if (!layoutProperties && !provisioneerProperties) continue;

      // Use layoutMandate from new format or fall back to old format
      let layoutType = layoutProperties?.type || 
                      provisioneerProperties?.layoutMandate || 
                      'default';

      // Check if the specified layout exists in the registry
      if (!this.layoutRegistryService.hasLayout(layoutType)) {
        console.warn(`Layout '${layoutType}' not found in registry, falling back to 'default' layout`);
        layoutType = 'default';
      }

      if (!layoutGroups.has(layoutType)) {
        layoutGroups.set(layoutType, {
          provisioneerProperties: layoutProperties || provisioneerProperties,
          controllers: []
        });
      }
      layoutGroups.get(layoutType)!.controllers.push(controller);

      // Extract any layout overrides from this controller
      const overriddenRoutes = this.extractLayoutOverrideRoutes(controller);
      for (const [overrideLayoutType, routes] of overriddenRoutes) {
        if (!layoutOverrides.has(overrideLayoutType)) {
          layoutOverrides.set(overrideLayoutType, []);
        }
        layoutOverrides.get(overrideLayoutType)!.push(...routes);
      }
    }

    // Build LayoutRenderer for each layout type using registry
    for (const [layoutType, { provisioneerProperties, controllers }] of layoutGroups) {
      const commissarRoutes = this.extractCommissarRoutes(controllers, layoutType);
      
      // Get base layout from registry (with fallback to default)
      const baseLayout = this.layoutRegistryService.getLayoutWithFallback(layoutType);
      
      // Clone the base layout and add commissar content
      const layoutRenderer: LayoutRenderer = {
        ...baseLayout,
        type: layoutType,
        content: {
          style: baseLayout.content?.style || { className: 'layout-content' },
          meta: commissarRoutes // Add commissar routes to the content
        }
      };

      // Ensure style is set with proper className if not already present
      if (!layoutRenderer.style) {
        layoutRenderer.style = { className: `layout-${layoutType}` };
      }

      layoutRenderers.push(layoutRenderer);
    }

    // Handle layout overrides - add overridden routes to target layouts
    for (const [overrideLayoutType, overriddenRoutes] of layoutOverrides) {
      // Check if target layout exists in registry
      if (!this.layoutRegistryService.hasLayout(overrideLayoutType)) {
        console.warn(`Override target layout '${overrideLayoutType}' not found in registry, adding to default layout`);
        // Add to default layout instead
        const defaultLayout = layoutRenderers.find(lr => lr.type === 'default');
        if (defaultLayout) {
          defaultLayout.content.meta.push(...overriddenRoutes);
        }
        continue;
      }

      // Find existing layout renderer or create new one
      let targetLayoutRenderer = layoutRenderers.find(lr => lr.type === overrideLayoutType);
      
      if (!targetLayoutRenderer) {
        // Create new layout renderer for the override target
        const baseLayout = this.layoutRegistryService.getLayoutWithFallback(overrideLayoutType);
        targetLayoutRenderer = {
          ...baseLayout,
          type: overrideLayoutType,
          content: {
            style: baseLayout.content?.style || { className: 'layout-content' },
            meta: []
          }
        };
        
        if (!targetLayoutRenderer.style) {
          targetLayoutRenderer.style = { className: `layout-${overrideLayoutType}` };
        }
        
        layoutRenderers.push(targetLayoutRenderer);
      }
      
      // Add overridden routes to target layout
      targetLayoutRenderer.content.meta.push(...overriddenRoutes);
    }

    return layoutRenderers;
  }

  getAllModuleProperties(): ModuleProperties[] {
    const modules = this.discoveryService.getProviders();

    return this.fetchMappedModules();
  }

  getAllControllerPath(): GroupedPermission {
    const allTheApis: GroupedPermission = {};
    const controllers = this.getAllControllers();
    for (const controller of controllers) {
      const controllerPath =
        this.reflector.get<string>(PATH_METADATA, controller) || '';

      const definedPaths: Permission[] = [];
      allTheApis[controllerPath] = definedPaths;

      const prototype = controller.prototype;

      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (name) =>
          typeof prototype[name] === 'function' && name !== 'constructor',
      );
      for (const methodName of methodNames) {
        const method = this.reflector.get<RequestMethod>(
          METHOD_METADATA,
          prototype[methodName],
        );

        if (!RequestMethod[method]) continue;

        const routePath = this.reflector.get<string | string[]>(
          PATH_METADATA,
          prototype[methodName],
        );
        const fullPath = (path: string) =>
          `${RequestMethod[method]}::/${controllerPath}/${path.replace(/^\//, '')}`;

        if (typeof routePath === 'string') {
          definedPaths.push({ name: fullPath(routePath), description: '' });
        }
        if (Array.isArray(routePath)) {
          for (const path of routePath) {
            definedPaths.push({ name: fullPath(path), description: '' });
          }
        }
      }
    }
    return allTheApis;
  }

  private getAllControllers(): Constructor<unknown>[] {
    return this.discoveryService
      .getControllers()
      .map((w) => w.metatype)
      .filter(
        (meta): meta is Constructor =>
          typeof meta === 'function' && !!meta.name,
      );
  }

  private fetchMappedModules(): ModuleProperties[] {
    const moduleProperties: ModuleProperties[] = [];

    const controllers = this.getAllControllers();

    for (const controller of controllers) {
      const provisioneerProperties = getProvisioneerProperties(controller);

      if (!provisioneerProperties) continue;

      const controllerPath =
        this.reflector.get<string>(PATH_METADATA, controller) || '';
      const prototype = controller.prototype;

      const mod: ModuleProperties = {
        name: provisioneerProperties.name!,
        uiComponent: [],
        permissions: [],
      };
      moduleProperties.push(mod);

      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (name) =>
          typeof prototype[name] === 'function' && name !== 'constructor',
      );

      for (const methodName of methodNames) {
        const commissar = getCommissarProperties(controller, methodName);
        if (!commissar) continue;

        const routePath = this.reflector.get<string>(
          PATH_METADATA,
          prototype[methodName],
        );
        const method = this.reflector.get<RequestMethod>(
          METHOD_METADATA,
          prototype[methodName],
        );
        let fullPath: string | undefined = undefined;
        let uiPath = `/${provisioneerProperties?.name}/${methodName}`;
        if (routePath !== undefined && method !== undefined) {
          const methodString = RequestMethod[method];
          fullPath = `/${controllerPath}/${routePath}`.replace(/\/+/g, '/');
          console.log(`[${methodString}] ${fullPath}`);
        }

        const slugs = extractRouteParams(fullPath ?? '');
        if (slugs.length >= 1) {
          uiPath += slugs.reduce((acc, key) => {
            return `${acc}/:${key}`;
          }, '');
        }

        // Only process old format commissars for backward compatibility
        if ('operative' in commissar && 'directive' in commissar) {
          const legacyCommissar = commissar as any;
          const componentMeta = extractMeta(legacyCommissar, fullPath ?? '');

          const uiComponent = {
            component: typeof legacyCommissar.component === 'string' ? legacyCommissar.component : 'Unknown',
            layout: legacyCommissar.layout || 'default',
            path: uiPath,
            meta: componentMeta,
          };

          mod.uiComponent?.push(uiComponent);
        }
      }
    }
    return moduleProperties;
  }

  /**
   * Extract commissar routes from controllers supporting both old and new formats
   * Now filters out routes that have layout overrides for other layouts
   */
  private extractCommissarRoutes(controllers: Constructor<unknown>[], currentLayoutType: string): Commissar[] {
    const commissarRoutes: Commissar[] = [];
    
    for (const controller of controllers) {
      const controllerPath = this.reflector.get<string>(PATH_METADATA, controller) || '';
      const prototype = controller.prototype;
      const methodNames = Object.getOwnPropertyNames(prototype).filter(
        (name) => typeof prototype[name] === 'function' && name !== 'constructor'
      );

      for (const methodName of methodNames) {
        // Try enhanced commissar properties first, then fall back to old format
        const commissar = getEnhancedCommissarProperties(controller, methodName);
        if (!commissar) continue;

        // Check for layout override - skip if it overrides to a different layout
        const pathConfig = 'path' in commissar ? commissar.path : (commissar as any).layout;
        if (typeof pathConfig === 'object' && 'overrideLayout' in pathConfig && pathConfig.overrideLayout) {
          if (pathConfig.overrideLayout !== currentLayoutType) {
            // Skip routes that override to different layouts - they'll be handled separately
            continue;
          }
        }

        // Generate automatic path from controller + method routes
        const methodRoutePath = this.reflector.get<string>(PATH_METADATA, prototype[methodName]) || '';
        const autoGeneratedPath = `/${controllerPath}/${methodRoutePath}`.replace(/\/+/g, '/');
        
        // Determine final path
        let finalPath: string;
        if ('path' in commissar) {
          // New format
          finalPath = typeof commissar.path === 'string' 
            ? commissar.path 
            : (typeof commissar.path === 'object' && commissar.path?.path) 
              ? commissar.path.path 
              : autoGeneratedPath;
        } else {
          // Old format fallback
          finalPath = autoGeneratedPath;
        }

        // Get component definition
        let component: LayoutComponentDetail | undefined;
        if ('component' in commissar && commissar.component) {
          // New format - component is directly provided
          if (typeof commissar.component === 'object') {
            component = commissar.component;
          }
        } else {
          // Old format - skip for now as it needs different processing
          continue;
        }

        if (!component) {
          console.warn(`Warning: ${controller.name}.${methodName} @Commissar decorator missing component definition`);
          continue;
        }

        // Validate action methods for new format
        if ('preAction' in commissar || 'postAction' in commissar) {
          const actionValidation = this.validateCommissarActions(controller, commissar as CommissarOptions);
          if (!actionValidation.preActionValid || !actionValidation.postActionValid) {
            console.error(`Error: ${controller.name}.${methodName} has invalid action references`);
            continue;
          }
        }

        // Build final commissar route - Commissar extends LayoutComponentDetail
        const route: Commissar = {
          ...component, // Spread the component properties since Commissar extends LayoutComponentDetail
          path: finalPath,
          permission: (commissar as any).permissions || []
        };

        commissarRoutes.push(route);
      }
    }
    
    return commissarRoutes;
  }

  /**
   * Extract layout override routes from a controller
   * Returns a map of target layout types to their overridden routes
   */
  private extractLayoutOverrideRoutes(controller: Constructor<unknown>): Map<string, Commissar[]> {
    const overrideRoutes = new Map<string, Commissar[]>();
    
    const controllerPath = this.reflector.get<string>(PATH_METADATA, controller) || '';
    const prototype = controller.prototype;
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => typeof prototype[name] === 'function' && name !== 'constructor'
    );

    for (const methodName of methodNames) {
      const commissar = getEnhancedCommissarProperties(controller, methodName);
      if (!commissar) continue;

      // Check for layout override
      const pathConfig = 'path' in commissar ? commissar.path : (commissar as any).layout;
      if (!(typeof pathConfig === 'object' && 'overrideLayout' in pathConfig && pathConfig.overrideLayout)) {
        continue; // Not an override route
      }

      const targetLayoutType = pathConfig.overrideLayout;

      // Generate automatic path from controller + method routes
      const methodRoutePath = this.reflector.get<string>(PATH_METADATA, prototype[methodName]) || '';
      const autoGeneratedPath = `/${controllerPath}/${methodRoutePath}`.replace(/\/+/g, '/');
      
      // Determine final path
      let finalPath: string;
      if ('path' in commissar) {
        finalPath = typeof commissar.path === 'string' 
          ? commissar.path 
          : (typeof commissar.path === 'object' && commissar.path?.path) 
            ? commissar.path.path 
            : autoGeneratedPath;
      } else {
        finalPath = autoGeneratedPath;
      }

      // Get component definition
      let component: LayoutComponentDetail | undefined;
      if ('component' in commissar && commissar.component) {
        if (typeof commissar.component === 'object') {
          component = commissar.component;
        }
      } else {
        continue;
      }

      if (!component) {
        console.warn(`Warning: ${controller.name}.${methodName} @Commissar override decorator missing component definition`);
        continue;
      }

      // Validate action methods
      if ('preAction' in commissar || 'postAction' in commissar) {
        const actionValidation = this.validateCommissarActions(controller, commissar as CommissarOptions);
        if (!actionValidation.preActionValid || !actionValidation.postActionValid) {
          console.error(`Error: ${controller.name}.${methodName} has invalid override action references`);
          continue;
        }
      }

      // Build override route
      const route: Commissar = {
        ...component,
        path: finalPath,
        permission: (commissar as any).permissions || []
      };

      if (!overrideRoutes.has(targetLayoutType)) {
        overrideRoutes.set(targetLayoutType, []);
      }
      overrideRoutes.get(targetLayoutType)!.push(route);
    }
    
    return overrideRoutes;
  }

  /**
   * Validate that preAction and postAction methods exist on controller
   */
  private validateCommissarActions(
    controller: Constructor<unknown>, 
    commissar: CommissarOptions
  ): ActionValidationResult {
    const prototype = controller.prototype;
    
    const preActionValid = !commissar.preAction || 
      (typeof prototype[commissar.preAction] === 'function');
      
    const postActionValid = !commissar.postAction || 
      (typeof prototype[commissar.postAction] === 'function');

    const errors: string[] = [];
    
    if (!preActionValid) {
      errors.push(`Missing preAction method: ${commissar.preAction}`);
    }
    
    if (!postActionValid) {
      errors.push(`Missing postAction method: ${commissar.postAction}`);
    }

    return { 
      preActionValid, 
      postActionValid, 
      errors: errors.length > 0 ? errors : undefined 
    };
  }

  /**
   * Extract isMenuItem from path configuration
   */
  private getIsMenuItem(pathConfig: any): boolean {
    if (typeof pathConfig === 'object' && 'isMenuItem' in pathConfig) {
      return pathConfig.isMenuItem !== false;
    }
    return true; // Default to true
  }

  /**
   * Extract icon from path configuration
   */
  private getIcon(pathConfig: any): any {
    if (typeof pathConfig === 'object' && 'icon' in pathConfig) {
      return pathConfig.icon;
    }
    return undefined;
  }

  /**
   * Extract or generate label from path configuration or method name
   */
  private getLabel(pathConfig: any, methodName: string): string {
    if (typeof pathConfig === 'object' && 'label' in pathConfig && pathConfig.label) {
      return pathConfig.label;
    }
    return this.generateLabelFromMethodName(methodName);
  }

  /**
   * Generate human-readable label from method name
   */
  private generateLabelFromMethodName(methodName: string): string {
    // Convert camelCase to readable label
    // getUserDashboard -> Get User Dashboard
    return methodName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}