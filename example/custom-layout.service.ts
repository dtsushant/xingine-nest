import { Injectable, OnModuleInit } from '@nestjs/common';
import { LayoutRegistryService } from '../src/services/layout-registry.service';
import { LayoutRendererBuilder, LayoutComponentDetailBuilder } from 'xingine';
import { homeIconMeta, searchIcon, darkModeIcon } from '../src/constants/shared-icons';

/**
 * Example service showing how client applications can register custom layouts
 */
@Injectable()
export class CustomLayoutService implements OnModuleInit {
  constructor(private layoutRegistryService: LayoutRegistryService) {}

  async onModuleInit() {
    // Register custom layouts from client application
    this.registerTailwindLayout();
    this.registerAntDesignLayout();
    this.registerMinimalLayout();
  }

  /**
   * Register a Tailwind CSS-based layout
   */
  private registerTailwindLayout() {
    const tailwindHeader = LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg')
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('container mx-auto px-4 py-3 flex items-center justify-between')
          .addChild(
            // Brand section with home icon
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex items-center space-x-3')
              .addChild(
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('w-8 h-8 text-white')
                  .build()
              )
              .addChild(
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-xl font-bold')
                  .build()
              )
              .build()
          )
          .addChild(
            // Search and actions
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex items-center space-x-4')
              .addChild(
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('hidden md:flex items-center bg-white bg-opacity-20 rounded-lg px-3 py-2')
                  .build()
              )
              .build()
          )
          .build()
      )
      .build();

    const tailwindSider = LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-gray-900 text-gray-100 w-64 min-h-screen shadow-xl')
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('p-4 space-y-2')
          .build()
      )
      .build();

    const tailwindFooter = LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-gray-800 text-gray-300 border-t border-gray-700')
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('container mx-auto px-4 py-6 text-center text-sm')
          .build()
      )
      .build();

    const tailwindLayout = LayoutRendererBuilder.create()
      .type('tailwind')
      .withHeader(tailwindHeader, { className: 'tailwind-header' })
      .withSider(tailwindSider, { className: 'tailwind-sider' })
      .withContent([], { className: 'flex-1 bg-gray-50 p-6 overflow-auto' })
      .withFooter(tailwindFooter, { className: 'tailwind-footer' })
      .className('flex flex-col h-screen bg-gray-100')
      .build();

    this.layoutRegistryService.registerLayout('tailwind', tailwindLayout);
    console.log('✅ Tailwind layout registered successfully');
  }

  /**
   * Register an Ant Design-based layout
   */
  private registerAntDesignLayout() {
    const antHeader = LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('ant-layout-header bg-white shadow-sm border-b')
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('flex items-center justify-between h-16 px-6')
          .build()
      )
      .build();

    const antSider = LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('ant-layout-sider bg-white shadow-md border-r')
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('p-4 h-full')
          .build()
      )
      .build();

    const antFooter = LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('ant-layout-footer bg-gray-50 border-t text-center')
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('py-4 text-gray-600 text-sm')
          .build()
      )
      .build();

    const antLayout = LayoutRendererBuilder.create()
      .type('ant.d')
      .withHeader(antHeader, { className: 'ant-header-container' })
      .withSider(antSider, { className: 'ant-sider-container' })
      .withContent([], { className: 'ant-layout-content bg-white p-6 m-4 rounded shadow-sm min-h-96' })
      .withFooter(antFooter, { className: 'ant-footer-container' })
      .className('ant-layout h-screen')
      .build();

    this.layoutRegistryService.registerLayout('ant.d', antLayout);
    console.log('✅ Ant Design layout registered successfully');
  }

  /**
   * Register a minimal layout for simple applications
   */
  private registerMinimalLayout() {
    const minimalHeader = LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('minimal-header bg-white border-b px-4 py-2')
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('text-lg font-semibold text-gray-800')
          .build()
      )
      .build();

    const minimalLayout = LayoutRendererBuilder.create()
      .type('minimal')
      .withHeader(minimalHeader, { className: 'minimal-header-container' })
      .withContent([], { className: 'flex-1 p-4 bg-gray-50' })
      .className('flex flex-col h-screen')
      .build();

    this.layoutRegistryService.registerLayout('minimal', minimalLayout);
    console.log('✅ Minimal layout registered successfully');
  }
}