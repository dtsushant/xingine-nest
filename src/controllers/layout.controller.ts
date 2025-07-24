import { Controller, Get, Post, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { LayoutRenderer } from 'xingine';
import { XingineInspectorService } from '../xingine-inspector.service';
import { LayoutRegistryService } from '../services/layout-registry.service';

/**
 * REST API endpoints for layout management
 * Provides access to LayoutRenderer configurations and scanning capabilities
 */
@Controller('layouts')
export class LayoutController {
  constructor(
    private readonly inspectorService: XingineInspectorService,
    private readonly layoutRegistry: LayoutRegistryService
  ) {}

  /**
   * Get all available LayoutRenderer configurations
   * Groups controllers by layout type and returns complete LayoutRenderer objects
   * 
   * @returns Array of LayoutRenderer objects
   */
  @Get()
  getAllLayouts(): LayoutRenderer[] {
    try {
      const layouts = this.inspectorService.getAllLayoutRenderers();
      console.log(`Found ${layouts.length} layout renderers`);
      return layouts;
    } catch (error) {
      console.error('Error retrieving layouts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to retrieve layouts: ${errorMessage}`);
    }
  }

  /**
   * Get a specific layout by type
   * 
   * @param type - Layout type (e.g., 'default', 'login', 'custom')
   * @returns LayoutRenderer object for the specified type
   */
  @Get(':type')
  getLayout(@Param('type') type: string): LayoutRenderer {
    try {
      const layouts = this.inspectorService.getAllLayoutRenderers();
      const layout = layouts.find(l => l.type === type);
      
      if (!layout) {
        const availableTypes = layouts.map(l => l.type).join(', ');
        throw new NotFoundException(
          `Layout type '${type}' not found. Available types: ${availableTypes}`
        );
      }
      
      console.log(`Retrieved layout: ${type}`);
      return layout;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error retrieving layout '${type}':`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to retrieve layout '${type}': ${errorMessage}`);
    }
  }

  /**
   * Trigger a fresh scan of all controllers and rebuild layout configurations
   * Useful during development or when controllers are added dynamically
   * 
   * @returns Updated array of LayoutRenderer objects
   */
  @Post('scan')
  scanAndBuildLayouts(): { message: string; layouts: LayoutRenderer[]; scannedAt: string } {
    try {
      console.log('Triggering layout scan and rebuild...');
      const layouts = this.inspectorService.getAllLayoutRenderers();
      
      // Update registry with fresh layouts
      for (const layout of layouts) {
        this.layoutRegistry.registerLayout(layout.type, layout);
      }
      
      const result = {
        message: `Successfully scanned and built ${layouts.length} layout renderers`,
        layouts: layouts,
        scannedAt: new Date().toISOString()
      };
      
      console.log(`Layout scan completed: ${layouts.length} layouts found`);
      return result;
    } catch (error) {
      console.error('Error during layout scan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Layout scan failed: ${errorMessage}`);
    }
  }

  /**
   * Get layout registry information
   * Shows all registered layout types and their availability
   * 
   * @returns Registry information including available layout names
   */
  @Get('registry/info')
  getRegistryInfo(): { 
    availableLayouts: string[]; 
    totalCount: number; 
    registeredAt: string;
  } {
    try {
      const layoutNames = this.layoutRegistry.getLayoutNames();
      return {
        availableLayouts: layoutNames,
        totalCount: layoutNames.length,
        registeredAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error retrieving registry info:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to retrieve registry info: ${errorMessage}`);
    }
  }

  /**
   * Check if a specific layout type exists
   * 
   * @param type - Layout type to check
   * @returns Boolean indicating if layout exists
   */
  @Get('registry/exists/:type')
  checkLayoutExists(@Param('type') type: string): { exists: boolean; type: string } {
    try {
      const exists = this.layoutRegistry.hasLayout(type);
      return { exists, type };
    } catch (error) {
      console.error(`Error checking layout existence for '${type}':`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to check layout existence: ${errorMessage}`);
    }
  }

  /**
   * Get statistics about the layout system
   * 
   * @returns Statistics including layout counts, controller counts, and commissar counts
   */
  @Get('stats')
  getLayoutStats(): {
    totalLayouts: number;
    layoutTypes: { type: string; commissarCount: number; }[];
    totalCommissars: number;
    lastScanned: string;
  } {
    try {
      const layouts = this.inspectorService.getAllLayoutRenderers();
      const stats = {
        totalLayouts: layouts.length,
        layoutTypes: layouts.map(layout => ({
          type: layout.type,
          commissarCount: layout.content.meta.length
        })),
        totalCommissars: layouts.reduce((total, layout) => total + layout.content.meta.length, 0),
        lastScanned: new Date().toISOString()
      };
      
      return stats;
    } catch (error) {
      console.error('Error generating layout stats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to generate layout stats: ${errorMessage}`);
    }
  }
}