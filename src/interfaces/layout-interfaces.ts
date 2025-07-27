import {LayoutComponentDetail, StyleMeta, IconMeta, PathProperties} from 'xingine';

/**
 * Properties for @Provisioneer decorator
 */
export interface ProvisioneerOptions {
  layout: string; // 'default' | 'login' | custom layout name
  permissions?: string[];
  description?: string;
}

/**
 * Extended path properties for @Commissar decorator
 */
/*export interface PathProperties {
  path?: string; // Custom path (defaults to auto-generated)
  overrideLayout?: string; // Override controller layout
  isMenuItem?: boolean; // Show in navigation menu (default: true)
  icon?: IconMeta; // Menu item icon
  label?: string; // Menu item label
  permissions?: string[]; // Route-level permissions
  component?: string; // Component identifier
}*/

/**
 * Properties for @Commissar decorator with enhanced component definition
 */
export interface CommissarOptions {
  component: LayoutComponentDetail; // REQUIRED: Complete component definition
  path?: string | PathProperties; // Optional: defaults to controller+method path
  preAction?: string; // Optional: method name to call BEFORE main controller method
  postAction?: string; // Optional: method name to call AFTER main controller method
  permissions?: string[]; // Optional: route-level permissions
  cacheTimeout?: number; // Optional: component cache timeout in ms
}


/**
 * Action validation result
 */
export interface ActionValidationResult {
  preActionValid: boolean;
  postActionValid: boolean;
  errors?: string[];
}

