import { Injectable } from '@nestjs/common';
import { LayoutRenderer } from 'xingine';
import { createDefaultLayout, createLoginLayout } from '../templates/layout-templates';

/**
 * Service for managing layout registry and layout template registration
 * Supports client application registration of custom layouts
 */
@Injectable()
export class LayoutRegistryService {
  private layouts = new Map<string, LayoutRenderer>();

  constructor() {
    // Pre-register default layouts provided by the library
    this.initializeDefaultLayouts();
  }

  /**
   * Register a custom layout from client application
   * Used by client applications to register layouts like 'tailwind', 'ant.d', etc.
   */
  registerLayout(name: string, renderer: LayoutRenderer): void {
    this.layouts.set(name, renderer);
  }

  /**
   * Register multiple layouts at once
   * Useful for bulk registration from client applications
   */
  registerLayouts(layouts: { [name: string]: LayoutRenderer }): void {
    Object.entries(layouts).forEach(([name, renderer]: [string, LayoutRenderer]) => {
      this.layouts.set(name, renderer);
    });
  }

  /**
   * Get layout by name
   * Returns undefined if layout doesn't exist
   */
  getLayout(name: string): LayoutRenderer | undefined {
    return this.layouts.get(name);
  }

  /**
   * Get layout by name with fallback to default
   * Used by getAllLayoutRenderers to ensure a layout always exists
   */
  getLayoutWithFallback(name: string): LayoutRenderer {
    const layout = this.layouts.get(name);
    if (layout) {
      return layout;
    }
    
    // Fall back to default layout if requested layout doesn't exist
    const defaultLayout = this.layouts.get('default');
    if (defaultLayout) {
      return defaultLayout;
    }
    
    // Last resort: create a new default layout
    return createDefaultLayout();
  }

  /**
   * Get all registered layouts
   */
  getAllLayouts(): LayoutRenderer[] {
    return Array.from(this.layouts.values());
  }

  /**
   * Get all layout names
   */
  getLayoutNames(): string[] {
    return Array.from(this.layouts.keys());
  }

  /**
   * Check if layout exists in registry
   */
  hasLayout(name: string): boolean {
    return this.layouts.has(name);
  }

  /**
   * Remove a layout from registry
   * Cannot remove 'default' layout as it's required
   */
  removeLayout(name: string): boolean {
    if (name === 'default') {
      throw new Error('Cannot remove default layout - it is required by the system');
    }
    return this.layouts.delete(name);
  }

  /**
   * Get registry statistics
   */
  getRegistryStats(): { 
    totalLayouts: number; 
    layoutNames: string[]; 
    hasDefault: boolean; 
    hasLogin: boolean;
  } {
    return {
      totalLayouts: this.layouts.size,
      layoutNames: this.getLayoutNames(),
      hasDefault: this.hasLayout('default'),
      hasLogin: this.hasLayout('login')
    };
  }

  /**
   * Initialize default layouts provided by the library
   * Default layout is always available, login layout can be overridden by client
   */
  private initializeDefaultLayouts(): void {
    // Register the default layout - provided by library and always available
    this.layouts.set('default', createDefaultLayout());
    
    // Register basic login layout - can be overridden by client application
    this.layouts.set('login', createLoginLayout());
  }
}