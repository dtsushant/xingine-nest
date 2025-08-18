import {
  CommissarBuilder,
  LayoutComponentDetailBuilder,
} from 'xingine';

/**
 * Component State Test Component
 * 
 * Tests component-level state operations:
 * - Individual component state isolation
 * - Component-specific data storage
 * - Component state interaction patterns
 */
export const COMPONENT_STATE_TEST_COMMISSAR = CommissarBuilder.create()
  .path('/test/component-state')
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
          .content('<h1 class="text-4xl font-bold text-green-900 mb-4">🧩 Component State Testing</h1>')
          .content('<p class="text-lg text-gray-600">Testing component-level state operations and isolation</p>')
          .build(),
      ])
      .build(),

    // Component State Debug Display
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h2 class="text-2xl font-bold text-green-800 mb-4">Current Component States</h2>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .withMeta('StateDebugRenderer', {
            name: 'componentStateDebug',
            stateLevel: 'component',
            className: 'w-full mb-4'
          })
          .build(),
      ])
      .build(),

    // Individual Component Counters
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-gray-50 p-6 rounded-lg border')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-gray-800 mb-4">Individual Component Counters</h3>')
          .content('<p class="text-gray-600 mb-4">Each counter maintains its own isolated state</p>')
          .build(),

        // Counter Component 1
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-6 p-4 bg-white border rounded')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .content('<h4 class="text-lg font-semibold text-green-700 mb-3">Counter Component A</h4>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3 p-3 bg-green-50 rounded text-center')
              .content('<div class="text-xl font-bold text-green-600">Value: #{simpleCounter}</div>')
              .content('<div class="text-sm text-gray-500">Component ID: simpleCounter</div>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-3 justify-center')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'counterA_increment',
                    content: 'A +1',
                    event: { 
                      onClick: {
                        action: 'incrementCounter',
                        args: { componentId: 'simpleCounter' }
                      }
                    },
                    className: 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'counterA_decrement',
                    content: 'A -1',
                    event: { 
                      onClick: {
                        action: 'decrementCounter',
                        args: { componentId: 'simpleCounter' }
                      }
                    },
                    className: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'counterA_reset',
                    content: 'Reset A',
                    event: { 
                      onClick: {
                        action: 'resetCounter',
                        args: { componentId: 'simpleCounter' }
                      }
                    },
                    className: 'px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600',
                  })
                  .build(),
              ])
              .build(),
          ])
          .build(),

        // Counter Component 2
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-6 p-4 bg-white border rounded')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .content('<h4 class="text-lg font-semibold text-blue-700 mb-3">Counter Component B</h4>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3 p-3 bg-blue-50 rounded text-center')
              .content('<div class="text-xl font-bold text-blue-600">Value: #{simpleCounterB}</div>')
              .content('<div class="text-sm text-gray-500">Component ID: simpleCounterB</div>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-3 justify-center')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'counterB_increment',
                    content: 'B +1',
                    event: { 
                      onClick: {
                        action: 'incrementCounter',
                        args: { componentId: 'simpleCounterB' }
                      }
                    },
                    className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'counterB_decrement',
                    content: 'B -1',
                    event: { 
                      onClick: {
                        action: 'decrementCounter',
                        args: { componentId: 'simpleCounterB' }
                      }
                    },
                    className: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'counterB_reset',
                    content: 'Reset B',
                    event: { 
                      onClick: {
                        action: 'resetCounter',
                        args: { componentId: 'simpleCounterB' }
                      }
                    },
                    className: 'px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600',
                  })
                  .build(),
              ])
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Component Toggle States
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 bg-gray-50 p-6 rounded-lg border')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h3 class="text-xl font-bold text-gray-800 mb-4">Component Toggle States</h3>')
          .content('<p class="text-gray-600 mb-4">Independent boolean states for different components</p>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('grid grid-cols-1 md:grid-cols-2 gap-6')
          .addChildren([
            // Toggle Component 1
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('p-4 bg-white border rounded')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .content('<h4 class="text-lg font-semibold text-purple-700 mb-3">Toggle Component Alpha</h4>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('mb-3 p-3 bg-purple-50 rounded text-center')
                  .content('<div class="text-xl font-bold #{simpleToggle ? "text-green-600" : "text-red-600"}">#{simpleToggle ? "ON" : "OFF"}</div>')
                  .content('<div class="text-sm text-gray-500">Component ID: simpleToggle</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'toggleAlpha',
                    content: 'Toggle Alpha',
                    event: { 
                      onClick: {
                        action: 'toggleState',
                        args: { componentId: 'simpleToggle' }
                      }
                    },
                    className: 'w-full px-4 py-2 #{simpleToggle ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white rounded',
                  })
                  .build(),
              ])
              .build(),

            // Toggle Component 2
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('p-4 bg-white border rounded')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .content('<h4 class="text-lg font-semibold text-orange-700 mb-3">Toggle Component Beta</h4>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('mb-3 p-3 bg-orange-50 rounded text-center')
                  .content('<div class="text-xl font-bold #{simpleToggleBeta ? "text-green-600" : "text-red-600"}">#{simpleToggleBeta ? "ON" : "OFF"}</div>')
                  .content('<div class="text-sm text-gray-500">Component ID: simpleToggleBeta</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'toggleBeta',
                    content: 'Toggle Beta',
                    event: { 
                      onClick: {
                        action: 'toggleState',
                        args: { componentId: 'simpleToggleBeta' }
                      }
                    },
                    className: 'w-full px-4 py-2 #{simpleToggleBeta ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white rounded',
                  })
                  .build(),
              ])
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
              .withMeta('ButtonRenderer', {
                name: 'navToGlobal',
                content: '🌐 Global State Test',
                event: { 
                  onClick: {
                    action: 'navigate',
                    args: { path: '/test/global-state' }
                  }
                },
                className: 'bg-blue-100 text-blue-800 border border-blue-300 px-6 py-3 rounded-lg font-semibold hover:bg-blue-200',
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('ButtonRenderer', {
                name: 'navToContent',
                content: '📄 Content State Test',
                event: { 
                  onClick: {
                    action: 'navigate',
                    args: { path: '/test/content-state' }
                  }
                },
                className: 'bg-purple-100 text-purple-800 border border-purple-300 px-6 py-3 rounded-lg font-semibold hover:bg-purple-200',
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('ButtonRenderer', {
                name: 'navToDashboard',
                content: '🏠 Back to Dashboard',
                event: { 
                  onClick: {
                    action: 'navigate',
                    args: { path: '/' }
                  }
                },
                className: 'bg-gray-100 text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200',
              })
              .build(),
          ])
          .build(),
      ])
      .build(),
  ])
  .build();
