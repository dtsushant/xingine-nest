import { LayoutRenderer, LayoutComponentDetailBuilder, LayoutRendererBuilder } from 'xingine';

/**
 * Create default layout template with header, sider, content, and footer
 */
export function createDefaultLayout(): LayoutRenderer {
  const header = LayoutComponentDetailBuilder.create()
    .wrapper()
    .className('layout-header bg-white shadow-sm border-b')
    .addChild(
      LayoutComponentDetailBuilder.create()
        .wrapper()
        .className('flex items-center justify-between px-4 py-3')
        .addChild(
          // Logo/Brand
          LayoutComponentDetailBuilder.create()
            .wrapper()
            .className('flex items-center space-x-2')
            .build()
        )
        .addChild(
          // Navigation and user menu
          LayoutComponentDetailBuilder.create()
            .wrapper()
            .className('flex items-center space-x-4')
            .build()
        )
        .build()
    )
    .build();

  const sider = LayoutComponentDetailBuilder.create()
    .wrapper()
    .className('layout-sider bg-gray-900 text-white')
    .addChild(
      LayoutComponentDetailBuilder.create()
        .wrapper()
        .className('h-full overflow-y-auto')
        .build()
    )
    .build();

  const footer = LayoutComponentDetailBuilder.create()
    .wrapper()
    .className('layout-footer bg-gray-50 border-t px-4 py-3')
    .addChild(
      LayoutComponentDetailBuilder.create()
        .wrapper()
        .className('flex items-center justify-between text-sm text-gray-600')
        .build()
    )
    .build();

  return LayoutRendererBuilder.create()
    .type('default')
    .withHeader(header, { className: 'layout-header-container' })
    .withSider(sider, { className: 'layout-sider-container' })
    .withContent([], { className: 'layout-content flex-1 p-4' })
    .withFooter(footer, { className: 'layout-footer-container' })
    .className('layout-default flex flex-col h-screen')
    .build();
}


