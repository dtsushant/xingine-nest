import {
  CommissarBuilder,
  LayoutComponentDetailBuilder,
  ButtonMetaBuilder,
} from 'xingine';

/**
 * Content State Test Component
 * 
 * Tests content-level state operations:
 * - Content-scoped variables
 * - Content state isolation
 * - Content-specific data management
 */
export const CONTENT_STATE_TEST_COMMISSAR = CommissarBuilder.create()
  .path('/test/content-state')
  .wrapper()
  .className('min-h-full max-w-6xl mx-auto p-8 bg-white')
  .addChildren([
    // Page Header
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 border-b pb-6')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h1 class="text-4xl font-bold text-purple-900 mb-4">📄 Content State Testing</h1>')
          .content('<p class="text-lg text-gray-600">Testing content-level state operations within page context</p>')
          .build(),
      ])
      .build(),

    // Content State Debug Display
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h2 class="text-2xl font-bold text-purple-800 mb-4">Current Content State</h2>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .withMeta('StateDebugRenderer', {
            name: 'contentStateDebug',
            stateLevel: 'content',
            className: 'w-full mb-4'
          })
          .build(),
      ])
      .build(),

    // Content Counter Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-gray-50 p-6 rounded-lg border')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-gray-800 mb-4">Content-Level Counter</h3>')
          .content('<p class="text-gray-600 mb-4">This counter is scoped to content level - separate from global state</p>')
          .build(),

        // Counter Display
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4 p-4 bg-white border rounded text-center')
          .content('<div class="text-2xl font-bold text-purple-600">Content Counter: #{contentCounter}</div>')
          .content('<div class="text-sm text-gray-500 mt-2">Content Value: <code class="bg-gray-100 px-2 py-1 rounded">#{contentCounter}</code></div>')
          .build(),

        // Counter Controls
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('flex flex-wrap gap-4 justify-center')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonMetaBuilder.create()
                .name('incrementContentCounter')
                .content('Content +1')
                .event({ onClick: { action: 'incrementContentCounter' } })
                .property('variant', 'primary')
                .style({ className: 'bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold' })
                .build())
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonMetaBuilder.create()
                .name('decrementContentCounter')
                .content('Content -1')
                .event({ onClick: { action: 'decrementContentCounter' } })
                .property('variant', 'secondary')
                .style({ className: 'bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold' })
                .build())
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonMetaBuilder.create()
                .name('resetContentCounter')
                .content('Reset Content')
                .event({ onClick: { action: 'resetContentCounter' } })
                .property('variant', 'outline')
                .style({ className: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold' })
                .build())
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Navigation
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mt-12 pt-6 border-t text-center')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-lg font-bold text-gray-800 mb-4">Navigate to Other State Tests</h3>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('flex flex-wrap gap-4 justify-center')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonMetaBuilder.create()
                .name('navigateToGlobalTest')
                .content('🌐 Global State Test')
                .event({ onClick: { action: 'navigateToGlobalTest' } })
                .property('variant', 'outline')
                .style({ className: 'bg-blue-100 text-blue-800 border-blue-300 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200' })
                .build())
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonMetaBuilder.create()
                .name('navigateToComponentTest')
                .content('🧩 Component State Test')
                .event({ onClick: { action: 'navigateToComponentTest' } })
                .property('variant', 'outline')
                .style({ className: 'bg-green-100 text-green-800 border-green-300 px-6 py-3 rounded-lg font-semibold hover:bg-green-200' })
                .build())
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonMetaBuilder.create()
                .name('navigateToDashboard')
                .content('🏠 Back to Dashboard')
                .event({ onClick: { action: 'navigateToDashboard' } })
                .property('variant', 'outline')
                .style({ className: 'bg-gray-100 text-gray-800 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200' })
                .build())
              .build(),
          ])
          .build(),
      ])
      .build(),
  ])
  .build();
