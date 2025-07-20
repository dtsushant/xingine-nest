import { Module } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { XingineInspectorService } from './xingine-inspector.service';
import { LayoutRegistryService } from './services/layout-registry.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    XingineInspectorService, 
    MetadataScanner, 
    LayoutRegistryService
  ],
  exports: [
    XingineInspectorService, 
    LayoutRegistryService
  ],
})
export class XingineModule {}
