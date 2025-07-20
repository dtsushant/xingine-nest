import { Injectable } from '@nestjs/common';
import { LayoutRenderer } from 'xingine';

/**
 * Service for managing layout registry and layout template registration
 */
@Injectable()
export class LayoutRegistryService {
  private layouts = new Map<string, LayoutRenderer>();

  constructor() {
    // Pre-register default layouts
    this.initializeDefaultLayouts();
  }

  /**
   * Register a custom layout
   */
  registerLayout(name: string, renderer: LayoutRenderer): void {
    this.layouts.set(name, renderer);
  }

  /**
   * Get layout by name
   */
  getLayout(name: string): LayoutRenderer | undefined {
    return this.layouts.get(name);
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
   * Check if layout exists
   */
  hasLayout(name: string): boolean {
    return this.layouts.has(name);
  }

  /**
   * Remove a layout
   */
  removeLayout(name: string): boolean {
    return this.layouts.delete(name);
  }

  /**
   * Initialize default layouts (placeholder for now, will be populated by templates)
   */
  private initializeDefaultLayouts(): void {
    // These will be populated by the layout template functions
    // For now, just reserve the names
    this.layouts.set('default', {} as LayoutRenderer);
    this.layouts.set('login', {} as LayoutRenderer);
  }
}