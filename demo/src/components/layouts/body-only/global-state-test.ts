import {
  CommissarBuilder,
  LayoutComponentDetailBuilder,
  
  
} from 'xingine';

/**
 * Global State Test Component
 * 
 * Tests global state operations:
 * - Setting/getting global variables
 * - Global counters and toggles
 * - Cross-component global state sharing
 */
export const GLOBAL_STATE_TEST_COMMISSAR = CommissarBuilder.create()
  .path('/test/global-state')
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
          .content('<h1 class="text-4xl font-bold text-blue-900 mb-4">🌐 Global State Testing</h1>')
          .content('<p class="text-lg text-gray-600">Testing global state operations across the entire application</p>')
          .build(),
      ])
      .build(),

    // Global State Debug Display
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h2 class="text-2xl font-bold text-blue-800 mb-4">Current Global State</h2>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .withMeta('StateDebugRenderer', {
            name: 'globalStateDebug',
            stateLevel: 'global',
            className: 'w-full mb-4'
          })
          .build(),
      ])
      .build(),

    // Global Counter Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-gray-50 p-6 rounded-lg border')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-gray-800 mb-4">Global Counter Operations</h3>')
          .content('<p class="text-gray-600 mb-4">These buttons modify global counter state that should be visible across all components</p>')
          .build(),

        // Counter Display
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4 p-4 bg-white border rounded text-center')
          .content('<div class="text-2xl font-bold text-blue-600">Global Counter: #{globalCounter}</div>')
          .content('<div class="text-sm text-gray-500 mt-2">Current Value: <code class="bg-gray-100 px-2 py-1 rounded">#{globalCounter}</code></div>')
          .build(),

        // Counter Controls
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('flex flex-wrap gap-4 justify-center')
          .addChildren([
            // TODO: add a dedicated ButtonBuilder
            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: 'Increment Global (+1)',
                event: { onClick: { action: 'incrementGlobalCounter' } },
                variant: 'primary',
                style: { className: 'bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold' }
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: 'Decrement Global (-1)',
                event: { onClick: { action: 'decrementGlobalCounter' } },
                variant: 'secondary',
                style: { className: 'bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold' }
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: 'Reset Global (=0)',
                event: { onClick: { action: 'resetGlobalCounter' } },
                variant: 'outline',
                style: { className: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold' }
              })
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Global Toggle Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-gray-50 p-6 rounded-lg border')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-gray-800 mb-4">Global Toggle State</h3>')
          .content('<p class="text-gray-600 mb-4">Global boolean flag that affects application-wide behavior</p>')
          .build(),

        // Toggle Display
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4 p-4 bg-white border rounded text-center')
          .content('<div class="text-2xl font-bold #{globalToggle ? "text-green-600" : "text-red-600"}">Global Toggle: #{globalToggle ? "ON" : "OFF"}</div>')
          .content('<div class="text-sm text-gray-500 mt-2">Raw Value: <code class="bg-gray-100 px-2 py-1 rounded">#{globalToggle}</code></div>')
          .build(),

        // Toggle Controls
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('flex flex-wrap gap-4 justify-center')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: 'Toggle Global State',
                event: { onClick: { action: 'toggleGlobalFlag' } },
                variant: 'primary',
                style: { className: '#{globalToggle ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-6 py-3 rounded-lg font-semibold' }
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: 'Set Global TRUE',
                event: { onClick: { action: 'setGlobalTrue' } },
                variant: 'outline',
                style: { className: 'bg-green-100 text-green-800 border-green-300 px-6 py-3 rounded-lg font-semibold hover:bg-green-200' }
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: 'Set Global FALSE',
                event: { onClick: { action: 'setGlobalFalse' } },
                variant: 'outline',
                style: { className: 'bg-red-100 text-red-800 border-red-300 px-6 py-3 rounded-lg font-semibold hover:bg-red-200' }
              })
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Global Text Input Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-gray-50 p-6 rounded-lg border')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-gray-800 mb-4">Global Text State</h3>')
          .content('<p class="text-gray-600 mb-4">Global text value that can be set and accessed from anywhere</p>')
          .build(),

        // Text Display
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4 p-4 bg-white border rounded')
          .content('<div class="text-lg font-semibold text-gray-800 mb-2">Current Global Text:</div>')
          .content('<div class="text-xl text-blue-600 font-mono bg-blue-50 p-3 rounded border">#{globalText || "No text set"}</div>')
          .content('<div class="text-sm text-gray-500 mt-2">Length: #{(globalText || "").length} characters</div>')
          .build(),

        // Text Input
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('flex gap-4')
          .addChildren([
            // TODO: add a dedicated InputBuilder
            LayoutComponentDetailBuilder.create()
              .withMeta('Input', {
                name: 'globalTextInput',
                placeholder: 'Enter global text value...',
                style: {
                  className: 'flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                }
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: 'Set Global Text',
                event: { onClick: { action: 'setGlobalText' } },
                variant: 'primary',
                style: { className: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold' }
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: 'Clear Global Text',
                event: { onClick: { action: 'clearGlobalText' } },
                variant: 'outline',
                style: { className: 'bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold' }
              })
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
              .withMeta('Button', {
                content: '📄 Content State Test',
                event: { onClick: { action: 'navigateToContentTest' } },
                variant: 'outline',
                style: { className: 'bg-purple-100 text-purple-800 border-purple-300 px-6 py-3 rounded-lg font-semibold hover:bg-purple-200' }
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: '🧩 Component State Test',
                event: { onClick: { action: 'navigateToComponentTest' } },
                variant: 'outline',
                style: { className: 'bg-green-100 text-green-800 border-green-300 px-6 py-3 rounded-lg font-semibold hover:bg-green-200' }
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('Button', {
                content: '🏠 Back to Dashboard',
                event: { onClick: { action: 'navigateToDashboard' } },
                variant: 'outline',
                style: { className: 'bg-gray-100 text-gray-800 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200' }
              })
              .build(),
          ])
          .build(),
      ])
      .build(),
  ])
  .build();
