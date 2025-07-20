import { LayoutRenderer, LayoutComponentDetailBuilder, LayoutRendererBuilder } from 'xingine';
import { DefaultLayoutConfig, LoginLayoutConfig } from '../interfaces/layout-interfaces';

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

/**
 * Create login layout template with header, content, and footer (no sider)
 */
export function createLoginLayout(): LayoutRenderer {
  const header = LayoutComponentDetailBuilder.create()
    .wrapper()
    .className('layout-login-header bg-white shadow-sm')
    .addChild(
      LayoutComponentDetailBuilder.create()
        .wrapper()
        .className('flex items-center justify-center px-4 py-6')
        .build()
    )
    .build();

  const footer = LayoutComponentDetailBuilder.create()
    .wrapper()
    .className('layout-login-footer bg-gray-50 border-t')
    .addChild(
      LayoutComponentDetailBuilder.create()
        .wrapper()
        .className('flex items-center justify-center px-4 py-4 text-sm text-gray-600')
        .build()
    )
    .build();

  return LayoutRendererBuilder.create()
    .type('login')
    .withHeader(header, { className: 'layout-login-header-container' })
    .withContent([], { className: 'layout-login-content flex-1 flex items-center justify-center p-8' })
    .withFooter(footer, { className: 'layout-login-footer-container' })
    .className('layout-login flex flex-col h-screen bg-gray-100')
    .build();
}

/**
 * Get default layout configuration
 */
export function getDefaultLayoutConfig(): DefaultLayoutConfig {
  const layout = createDefaultLayout();
  return {
    header: layout.header!.meta!,
    sider: layout.sider!.meta!,
    footer: layout.footer!.meta!,
    style: layout.style
  };
}

/**
 * Get login layout configuration
 */
export function getLoginLayoutConfig(): LoginLayoutConfig {
  const layout = createLoginLayout();
  return {
    header: layout.header!.meta!,
    footer: layout.footer!.meta!,
    style: layout.style
  };
}

/**
 * Custom layout builder function
 */
export function createCustomLayout(
  type: string,
  config: Partial<DefaultLayoutConfig | LoginLayoutConfig>
): LayoutRenderer {
  // Base template on default layout
  const builder = LayoutRendererBuilder.create()
    .type(type)
    .withContent([], { className: `layout-${type}-content flex-1 p-4` })
    .className(`layout-${type} flex flex-col h-screen`);

  // Apply custom configuration
  if (config.header) {
    builder.withHeader(config.header, { className: `layout-${type}-header-container` });
  }

  if ('sider' in config && config.sider) {
    builder.withSider(config.sider, { className: `layout-${type}-sider-container` });
  }

  if (config.footer) {
    builder.withFooter(config.footer, { className: `layout-${type}-footer-container` });
  }

  if (config.style && config.style.className) {
    builder.className(config.style.className);
  }

  return builder.build();
}