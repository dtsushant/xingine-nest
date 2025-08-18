import {
  CommissarBuilder,
  LayoutComponentDetailBuilder,
  ButtonBuilder,
  InputBuilder,
} from 'xingine';

/**
 * Content State Test Component
 * 
 * Tests content-level state operations:
 * - Content-scoped variables
 * - Content state isolati              .className('bg-white                                  .variant('outline')
                .className('bg-gray-100 text-gray-800 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200')      .className('bg-green-100 text-green-800 border-green-300 px-6 py-3 rounded-lg font-semibold hover:bg-green-200')      .className('bg-blue-100 text-blue-800 border-blue-300 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200')-4 rounded border')             .className('bg-white p-4 rounded border')n
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
              .withMeta('Button', ButtonBuilder.create()
                .buttonText('Content +1')
                .action('incrementContentCounter')
                .variant('primary')
                .className('bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold')
                .build())
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonBuilder.create()
                .buttonText('Content -1')
                .action('decrementContentCounter')
                .variant('secondary')
                .className('bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold')
                .build())
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonBuilder.create()
                .buttonText('Reset Content')
                .action('resetContentCounter')
                .variant('outline')
                .className('bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold')
                .build())
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Content Filter State
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-gray-50 p-6 rounded-lg border')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-gray-800 mb-4">Content Filter State</h3>')
          .content('<p class="text-gray-600 mb-4">Filter states that affect content display and behavior</p>')
          .build(),

        // Filter Active Toggle
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4 p-4 bg-white border rounded')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .content('<div class="flex items-center justify-between mb-3">')
              .content('<span class="text-lg font-semibold">Filter Active:</span>')
              .content('<span class="text-2xl font-bold #{filterActive ? "text-green-600" : "text-red-600"}">#{filterActive ? "ENABLED" : "DISABLED"}</span>')
              .content('</div>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-4 justify-center')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('Button', ButtonBuilder.create()
                    .buttonText('Toggle Filter')
                    .action('toggleContentFilter')
                    .variant('primary')
                    .className('#{filterActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-6 py-3 rounded-lg font-semibold')
                    .build())
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('Button', ButtonBuilder.create()
                    .buttonText('Enable Filter')
                    .action('enableContentFilter')
                    .variant('outline')
                    .className='bg-green-100 text-green-800 border-green-300 px-6 py-3 rounded-lg font-semibold hover:bg-green-200'
                    .build())
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('Button', ButtonBuilder.create()
                    .buttonText('Disable Filter')
                    .action('disableContentFilter')
                    .variant('outline')
                    .className='bg-red-100 text-red-800 border-red-300 px-6 py-3 rounded-lg font-semibold hover:bg-red-200'
                    .build())
                  .build(),
              ])
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Content Data Management
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-gray-50 p-6 rounded-lg border')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-gray-800 mb-4">Content Data Storage</h3>')
          .content('<p class="text-gray-600 mb-4">Store and manage content-specific data values</p>')
          .build(),

        // Content Value Display
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4 p-4 bg-white border rounded')
          .content('<div class="text-lg font-semibold text-gray-800 mb-2">Content Value:</div>')
          .content('<div class="text-xl text-purple-600 font-mono bg-purple-50 p-3 rounded border">#{contentValue || "No content value set"}</div>')
          .content('<div class="text-sm text-gray-500 mt-2">Type: #{typeof contentValue} | Length: #{(contentValue || "").length}</div>')
          .build(),

        // Content Data Input
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-4 mb-3')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('Input', InputBuilder.create()
                    .name('contentValueInput')
                    .placeholder('Enter content data...')
                    .className('flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500')
                    .build())
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('Button', ButtonBuilder.create()
                    .buttonText('Set Content Data')
                    .action('setContentValue')
                    .variant('primary')
                    .className('bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold')
                    .build())
                  .build(),
              ])
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-4 justify-center')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('Button', ButtonBuilder.create()
                    .buttonText('Clear Content Data')
                    .action('clearContentValue')
                    .variant('outline')
                    .className('bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold')
                    .build())
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('Button', ButtonBuilder.create()
                    .buttonText('Set Sample Data')
                    .action('setSampleContentData')
                    .variant('outline')
                    .className('bg-purple-100 text-purple-800 border-purple-300 px-6 py-3 rounded-lg font-semibold hover:bg-purple-200')
                    .build())
                  .build(),
              ])
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Cross-State Comparison
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-yellow-800 mb-4">🔄 Cross-State Comparison</h3>')
          .content('<p class="text-yellow-600 mb-4">Compare content state with global state values</p>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('grid grid-cols-1 md:grid-cols-2 gap-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className='bg-white p-4 rounded border'
              .content('<div class="text-sm font-semibold text-blue-600 mb-2">🌐 Global Counter</div>')
              .content('<div class="text-2xl font-bold text-blue-800">#{globalCounter}</div>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className='bg-white p-4 rounded border'
              .content('<div class="text-sm font-semibold text-purple-600 mb-2">📄 Content Counter</div>')
              .content('<div class="text-2xl font-bold text-purple-800">#{contentCounter}</div>')
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
              .withMeta('Button', ButtonBuilder.create()
                .buttonText('🌐 Global State Test')
                .action('navigateToGlobalTest')
                .variant('outline')
                .className='bg-blue-100 text-blue-800 border-blue-300 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200'
                .build())
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonBuilder.create()
                .buttonText('🧩 Component State Test')
                .action('navigateToComponentTest')
                .variant('outline')
                .className='bg-green-100 text-green-800 border-green-300 px-6 py-3 rounded-lg font-semibold hover:bg-green-200'
                .build())
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', ButtonBuilder.create()
                .buttonText('🏠 Back to Dashboard')
                .action('navigateToDashboard')
                .variant='outline'
                .className='bg-gray-100 text-gray-800 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200'
                .build())
              .build(),
          ])
          .build(),
      ])
      .build(),
  ])
  .build();
