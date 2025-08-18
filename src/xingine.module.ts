import { Module } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { XingineInspectorService } from './xingine-inspector.service';
import { LayoutRegistryService } from './services/layout-registry.service';
import { CommissarActionInterceptor } from './interceptors/commissar-action.interceptor';
import { LayoutController } from './controllers/layout.controller';

@Module({
  imports: [DiscoveryModule],
  providers: [
    XingineInspectorService,
    MetadataScanner,
    LayoutRegistryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CommissarActionInterceptor,
    },
  ],
  controllers: [LayoutController],
  exports: [
    XingineInspectorService, 
    LayoutRegistryService
  ],
})
export class XingineModule {}
