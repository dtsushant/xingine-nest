import { LayoutComponentDetail, StyleMeta, IconMeta } from 'xingine';

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
export interface PathProperties {
  path?: string; // Custom path (defaults to auto-generated)
  overrideLayout?: string; // Override controller layout
  isMenuItem?: boolean; // Show in navigation menu (default: true)
  icon?: IconMeta; // Menu item icon
  label?: string; // Menu item label
  permissions?: string[]; // Route-level permissions
  component?: string; // Component identifier
}

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
 * Layout configuration for default layout
 */
export interface DefaultLayoutConfig {
  header: LayoutComponentDetail;
  sider: LayoutComponentDetail;
  footer: LayoutComponentDetail;
  style?: StyleMeta;
}

/**
 * Layout configuration for login layout
 */
export interface LoginLayoutConfig {
  header: LayoutComponentDetail;
  footer: LayoutComponentDetail;
  style?: StyleMeta;
}

/**
 * Action validation result
 */
export interface ActionValidationResult {
  preActionValid: boolean;
  postActionValid: boolean;
  errors?: string[];
}

/**
 * Layout renderer configuration with enhanced metadata
 */
export interface LayoutRendererConfig {
  type: string;
  provisioneerProperties: any;
  controllers: any[];
}