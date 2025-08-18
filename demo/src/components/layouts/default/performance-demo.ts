import {
  CommissarBuilder,
  LayoutComponentDetailBuilder,
} from 'xingine';

export const PERFORMANCE_DEMO_COMMISSAR = CommissarBuilder.create()
  .path('/performance-demo')
  .wrapper()
  .className('min-h-full max-w-full w-full p-6 bg-gray-50')
  .addChildren([
    // Page Header
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8')
      .content('<h1 class="text-3xl font-bold text-gray-900 mb-4">🚀 Performance Demo</h1>')
      .content('<p class="text-lg text-gray-600">Comprehensive performance testing and optimization showcase</p>')
      .build(),

    // Performance Metrics Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg mb-6')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .content('<h2 class="text-xl font-bold text-blue-800 mb-2">📊 Real-time Performance Metrics</h2>')
          .content('<p class="text-blue-600">Live monitoring of React performance and optimization effectiveness</p>')
          .build(),

        // Performance Stats Grid
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('grid grid-cols-1 md:grid-cols-4 gap-4 mb-6')
          .addChildren([
            // Render Count
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow text-center')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-2xl font-bold text-blue-600')
                  .property('id', 'render-count')
                  .content('0')
                  .build(),
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-sm text-gray-600')
                  .content('Total Renders')
                  .build(),
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-xs text-gray-500 mt-1')
                  .content('Since page load')
                  .build(),
              ])
              .build(),

            // Action Count
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow text-center')
              .content('<div class="text-2xl font-bold text-green-600" id="action-count">0</div><div class="text-sm text-gray-600">Actions Executed</div><div class="text-xs text-gray-500 mt-1">State changes</div>')
              .build(),

            // Memory Usage
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow text-center')
              .content('<div class="text-2xl font-bold text-purple-600" id="memory-usage">N/A</div><div class="text-sm text-gray-600">Memory Usage</div><div class="text-xs text-gray-500 mt-1">Heap size (MB)</div>')
              .build(),

            // Component Count
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow text-center')
              .content('<div class="text-2xl font-bold text-orange-600" id="component-count">0</div><div class="text-sm text-gray-600">Active Components</div><div class="text-xs text-gray-500 mt-1">In memory</div>')
              .build(),
          ])
          .build(),

        // Performance Graph Placeholder
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-6 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Performance Timeline</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('h-32 bg-gradient-to-r from-blue-100 to-green-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center')
              .content('<div class="text-center text-gray-500">')
              .content('<div class="text-lg font-semibold">📈 Real-time Performance Graph</div>')
              .content('<div class="text-sm mt-2">Render times • Action latency • Memory usage</div>')
              .content('<div class="text-xs mt-1 text-blue-600" id="graph-status">Collecting data...</div>')
              .content('</div>')
              .build(),
          ])
          .build(),

        // Live Performance Indicators
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('grid grid-cols-1 md:grid-cols-3 gap-4')
          .addChildren([
            // Render Performance
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow')
              .content('<h4 class="text-md font-semibold text-gray-800 mb-2">🎨 Render Performance</h4>')
              .content('<div class="text-sm text-gray-600">Average render time: <span id="avg-render-time" class="font-mono text-green-600">< 1ms</span></div>')
              .content('<div class="text-sm text-gray-600">Last render: <span id="last-render-time" class="font-mono text-blue-600">N/A</span></div>')
              .content('<div class="text-xs text-gray-500 mt-2">✅ useCallback optimizations active</div>')
              .build(),

            // State Performance
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow')
              .content('<h4 class="text-md font-semibold text-gray-800 mb-2">⚡ State Performance</h4>')
              .content('<div class="text-sm text-gray-600">State updates: <span id="state-updates" class="font-mono text-purple-600">0</span></div>')
              .content('<div class="text-sm text-gray-600">Selector hits: <span id="selector-hits" class="font-mono text-orange-600">0</span></div>')
              .content('<div class="text-xs text-gray-500 mt-2">✅ Hierarchical state optimizations active</div>')
              .build(),

            // Memory Performance
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow')
              .content('<h4 class="text-md font-semibold text-gray-800 mb-2">🧠 Memory Performance</h4>')
              .content('<div class="text-sm text-gray-600">Components created: <span id="components-created" class="font-mono text-red-600">0</span></div>')
              .content('<div class="text-sm text-gray-600">Components cleaned: <span id="components-cleaned" class="font-mono text-green-600">0</span></div>')
              .content('<div class="text-xs text-gray-500 mt-2">✅ Cleanup optimizations active</div>')
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Optimized State Demo Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-green-50 border-l-4 border-green-400 p-6 rounded-lg mb-6')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .content('<h2 class="text-xl font-bold text-green-800 mb-2">⚡ Optimized State Demonstrations</h2>')
          .content('<p class="text-green-600">Interactive demos showing React optimization techniques in action</p>')
          .build(),

        // High Frequency Updates Demo
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-6 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-4')
              .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">🏃‍♂️ High-Frequency Updates Test</h3>')
              .content('<p class="text-gray-600">Test rapid state changes with optimized rendering</p>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-4 items-center mb-4')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'startHighFrequencyTest',
                    content: 'Start Rapid Updates',
                    event: { 
                      onClick: {
                        action: 'startHighFrequencyTest',
                        args: {}
                      }
                    },
                    className: 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'stopHighFrequencyTest',
                    content: 'Stop Test',
                    event: { 
                      onClick: {
                        action: 'stopHighFrequencyTest',
                        args: {}
                      }
                    },
                    className: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-lg font-mono font-bold text-blue-600')
                  .content('<span id="high-frequency-counter">#{highFrequencyCounter || 0}</span>')
                  .build(),
              ])
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded')
              .content('<strong>Optimization:</strong> Uses useCallback and selective re-rendering to maintain 60fps during rapid updates')
              .content('<div class="mt-2">Updates per second: <span id="updates-per-second" class="font-mono">0</span> | Render efficiency: <span id="render-efficiency" class="font-mono text-green-600">100%</span></div>')
              .build(),
          ])
          .build(),

        // State Selector Demo
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-6 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-4')
              .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">🎯 State Selector Optimization</h3>')
              .content('<p class="text-gray-600">Demonstrates granular state updates without unnecessary re-renders</p>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('grid grid-cols-1 md:grid-cols-3 gap-4 mb-4')
              .addChildren([
                // Counter A (affects only A)
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-4 border border-blue-200 rounded-lg bg-blue-50')
                  .addChildren([
                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('mb-3')
                      .content('<h4 class="font-semibold text-blue-800">Counter A (Isolated)</h4>')
                      .build(),

                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('flex items-center gap-2 mb-2')
                      .addChildren([
                        LayoutComponentDetailBuilder.create()
                          .withMeta('ButtonRenderer', {
                            name: 'counterA-btn',
                            content: '+',
                            event: { 
                              onClick: {
                                action: 'incrementSelectorCounter',
                                args: { counter: 'A' }
                              }
                            },
                            className: 'w-8 h-8 bg-blue-500 text-white rounded text-sm hover:bg-blue-600',
                          })
                          .build(),

                        LayoutComponentDetailBuilder.create()
                          .wrapper()
                          .className('text-lg font-bold text-blue-600 min-w-8 text-center')
                          .content('<span id="counter-a">#{selectorCounterA || 0}</span>')
                          .build(),
                      ])
                      .build(),

                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('text-xs text-gray-600')
                      .content('<div>Renders: <span id="counter-a-renders" class="font-mono">0</span></div>')
                      .content('<div class="text-green-600">✅ Only this counter re-renders</div>')
                      .build(),
                  ])
                  .build(),

                // Counter B (affects only B)
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-4 border border-purple-200 rounded-lg bg-purple-50')
                  .addChildren([
                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('mb-3')
                      .content('<h4 class="font-semibold text-purple-800">Counter B (Isolated)</h4>')
                      .build(),

                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('flex items-center gap-2 mb-2')
                      .addChildren([
                        LayoutComponentDetailBuilder.create()
                          .withMeta('ButtonRenderer', {
                            name: 'counterB-btn',
                            content: '+',
                            event: { 
                              onClick: {
                                action: 'incrementSelectorCounter',
                                args: { counter: 'B' }
                              }
                            },
                            className: 'w-8 h-8 bg-purple-500 text-white rounded text-sm hover:bg-purple-600',
                          })
                          .build(),

                        LayoutComponentDetailBuilder.create()
                          .wrapper()
                          .className('text-lg font-bold text-purple-600 min-w-8 text-center')
                          .content('<span id="counter-b">#{selectorCounterB || 0}</span>')
                          .build(),
                      ])
                      .build(),

                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('text-xs text-gray-600')
                      .content('<div>Renders: <span id="counter-b-renders" class="font-mono">0</span></div>')
                      .content('<div class="text-green-600">✅ Only this counter re-renders</div>')
                      .build(),
                  ])
                  .build(),

                // Combined Display (shows both)
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-4 border border-orange-200 rounded-lg bg-orange-50')
                  .addChildren([
                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('mb-3')
                      .content('<h4 class="font-semibold text-orange-800">Combined View</h4>')
                      .build(),

                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('mb-2')
                      .content('<div class="text-sm">A: <span class="font-bold text-blue-600">#{selectorCounterA || 0}</span></div>')
                      .content('<div class="text-sm">B: <span class="font-bold text-purple-600">#{selectorCounterB || 0}</span></div>')
                      .content('<div class="text-sm">Sum: <span class="font-bold text-orange-600">#{(selectorCounterA || 0) + (selectorCounterB || 0)}</span></div>')
                      .build(),

                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('text-xs text-gray-600')
                      .content('<div>Renders: <span id="combined-renders" class="font-mono">0</span></div>')
                      .content('<div class="text-green-600">✅ Re-renders only when sum changes</div>')
                      .build(),
                  ])
                  .build(),
              ])
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded')
              .content('<strong>Optimization:</strong> State selectors ensure components only re-render when their specific slice of state changes')
              .content('<div class="mt-2">Total renders saved: <span id="renders-saved" class="font-mono text-green-600">0</span> | Efficiency gain: <span id="efficiency-gain" class="font-mono text-green-600">0%</span></div>')
              .build(),
          ])
          .build(),

        // Component Cleanup Demo
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-6 rounded-lg shadow')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-4')
              .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">🧹 Memory Leak Prevention</h3>')
              .content('<p class="text-gray-600">Demonstrates proper component cleanup and memory management</p>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-4 items-center mb-4')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'createComponents',
                    content: 'Create 100 Components',
                    event: { 
                      onClick: {
                        action: 'createMassComponents',
                        args: { count: 100 }
                      }
                    },
                    className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'cleanupComponents',
                    content: 'Cleanup All',
                    event: { 
                      onClick: {
                        action: 'cleanupMassComponents',
                        args: {}
                      }
                    },
                    className: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-sm text-gray-600')
                  .content('<div>Active: <span id="active-components" class="font-mono font-bold text-blue-600">0</span></div>')
                  .content('<div>Memory: <span id="component-memory" class="font-mono font-bold text-purple-600">0 KB</span></div>')
                  .build(),
              ])
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-gray-50 p-4 rounded mb-4')
              .content('<div class="text-sm font-semibold text-gray-700 mb-2">Cleanup Log:</div>')
              .content('<div class="h-24 overflow-y-auto text-xs font-mono text-gray-600 bg-white p-2 rounded border" id="cleanup-log">Ready for component creation...</div>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded')
              .content('<strong>Optimization:</strong> All components properly cleanup event listeners, timers, and state subscriptions')
              .content('<div class="mt-2">Memory leaks prevented: <span id="leaks-prevented" class="font-mono text-green-600">0</span> | Cleanup efficiency: <span id="cleanup-efficiency" class="font-mono text-green-600">100%</span></div>')
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Mass Component Test Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg mb-6')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .content('<h2 class="text-xl font-bold text-orange-800 mb-2">🏋️ Mass Component Performance Test</h2>')
          .content('<p class="text-orange-600">Stress testing with hundreds of components to validate optimization effectiveness</p>')
          .build(),

        // Test Controls
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-6 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-4')
              .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">🎛️ Test Controls</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('grid grid-cols-1 md:grid-cols-4 gap-4 mb-4')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'create50Components',
                    content: 'Create 50',
                    event: { 
                      onClick: {
                        action: 'createMassComponents',
                        args: { count: 50 }
                      }
                    },
                    className: 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'create100Components',
                    content: 'Create 100',
                    event: { 
                      onClick: {
                        action: 'createMassComponents',
                        args: { count: 100 }
                      }
                    },
                    className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'create500Components',
                    content: 'Create 500',
                    event: { 
                      onClick: {
                        action: 'createMassComponents',
                        args: { count: 500 }
                      }
                    },
                    className: 'px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-center',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'clearAllComponents',
                    content: 'Clear All',
                    event: { 
                      onClick: {
                        action: 'cleanupMassComponents',
                        args: {}
                      }
                    },
                    className: 'px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-center',
                  })
                  .build(),
              ])
              .build(),

            // Mass Update Test
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-4 items-center mb-4')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'massUpdate',
                    content: 'Mass Update All Components',
                    event: { 
                      onClick: {
                        action: 'massUpdateComponents',
                        args: {}
                      }
                    },
                    className: 'px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-sm text-gray-600')
                  .content('<div>Last update: <span id="last-mass-update" class="font-mono">Never</span></div>')
                  .content('<div>Update time: <span id="mass-update-time" class="font-mono text-blue-600">N/A</span></div>')
                  .build(),
              ])
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded')
              .content('<strong>Performance Target:</strong> Maintain responsive UI even with 500+ components')
              .content('<div class="mt-2">Frame rate: <span id="frame-rate" class="font-mono text-green-600">60fps</span> | Lag: <span id="ui-lag" class="font-mono text-green-600">None</span></div>')
              .build(),
          ])
          .build(),

        // Component Grid Display
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-6 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-4')
              .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">📊 Component Status Grid</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('grid grid-cols-1 md:grid-cols-5 gap-4 mb-4')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-center p-3 bg-blue-50 rounded')
                  .content('<div class="text-2xl font-bold text-blue-600" id="total-components">0</div>')
                  .content('<div class="text-sm text-gray-600">Total</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-center p-3 bg-green-50 rounded')
                  .content('<div class="text-2xl font-bold text-green-600" id="active-component-count">0</div>')
                  .content('<div class="text-sm text-gray-600">Active</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-center p-3 bg-yellow-50 rounded')
                  .content('<div class="text-2xl font-bold text-yellow-600" id="updating-components">0</div>')
                  .content('<div class="text-sm text-gray-600">Updating</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-center p-3 bg-red-50 rounded')
                  .content('<div class="text-2xl font-bold text-red-600" id="error-components">0</div>')
                  .content('<div class="text-sm text-gray-600">Errors</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-center p-3 bg-gray-50 rounded')
                  .content('<div class="text-2xl font-bold text-gray-600" id="cleanup-components">0</div>')
                  .content('<div class="text-sm text-gray-600">Cleaned</div>')
                  .build(),
              ])
              .build(),

            // Visual Component Display Area
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-32 bg-gray-50')
              .content('<div class="text-center text-gray-500 mb-2">📦 Component Visualization Area</div>')
              .content('<div class="grid grid-cols-10 gap-1" id="component-grid">')
              .content('<div class="text-xs text-center text-gray-400">Create components to see them appear here...</div>')
              .content('</div>')
              .build(),
          ])
          .build(),

        // Performance Impact Analysis
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-6 rounded-lg shadow')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-4')
              .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">📈 Performance Impact Analysis</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('grid grid-cols-1 md:grid-cols-3 gap-4')
              .addChildren([
                // Before Optimization
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-4 bg-red-50 border border-red-200 rounded-lg')
                  .content('<h4 class="font-semibold text-red-800 mb-2">❌ Before Optimization</h4>')
                  .content('<div class="text-sm text-red-700 space-y-1">')
                  .content('<div>• Every state change triggers full re-render</div>')
                  .content('<div>• Memory leaks from uncleaned components</div>')
                  .content('<div>• UI freezes with 100+ components</div>')
                  .content('<div>• Action execution blocks rendering</div>')
                  .content('</div>')
                  .content('<div class="mt-2 text-xs bg-red-100 p-2 rounded">Estimated: 500ms+ render time</div>')
                  .build(),

                // After Optimization
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-4 bg-green-50 border border-green-200 rounded-lg')
                  .content('<h4 class="font-semibold text-green-800 mb-2">✅ After Optimization</h4>')
                  .content('<div class="text-sm text-green-700 space-y-1">')
                  .content('<div>• Selective re-rendering with useCallback</div>')
                  .content('<div>• Automatic component cleanup</div>')
                  .content('<div>• Smooth UI with 500+ components</div>')
                  .content('<div>• Non-blocking action execution</div>')
                  .content('</div>')
                  .content('<div class="mt-2 text-xs bg-green-100 p-2 rounded">Actual: <span id="actual-render-time">< 16ms</span> render time</div>')
                  .build(),

                // Performance Gain
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-4 bg-blue-50 border border-blue-200 rounded-lg')
                  .content('<h4 class="font-semibold text-blue-800 mb-2">🚀 Performance Gain</h4>')
                  .content('<div class="text-sm text-blue-700 space-y-1">')
                  .content('<div>• Render time improvement: <span id="render-improvement" class="font-bold">95%+</span></div>')
                  .content('<div>• Memory usage reduction: <span id="memory-improvement" class="font-bold">70%+</span></div>')
                  .content('<div>• Component capacity: <span id="capacity-improvement" class="font-bold">500%+</span></div>')
                  .content('<div>• User experience: <span id="ux-improvement" class="font-bold">Excellent</span></div>')
                  .content('</div>')
                  .content('<div class="mt-2 text-xs bg-blue-100 p-2 rounded">Performance Score: <span id="performance-score" class="font-bold">A+</span></div>')
                  .build(),
              ])
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Debug Information Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-gray-50 border border-gray-200 p-6 rounded-lg')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .content('<h2 class="text-xl font-bold text-gray-800 mb-2">🔧 Debug Information</h2>')
          .content('<p class="text-gray-600">Technical details and real-time debugging information</p>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('grid grid-cols-1 md:grid-cols-2 gap-4')
          .addChildren([
            // React DevTools Info
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow')
              .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">⚛️ React DevTools</h3>')
              .content('<div class="text-sm text-gray-600 space-y-1">')
              .content('<div>Component tree depth: <span id="component-depth" class="font-mono">N/A</span></div>')
              .content('<div>Profiler recordings: <span id="profiler-recordings" class="font-mono">0</span></div>')
              .content('<div>Suspended components: <span id="suspended-components" class="font-mono">0</span></div>')
              .content('<div>Error boundaries: <span id="error-boundaries" class="font-mono">0</span></div>')
              .content('</div>')
              .content('<div class="mt-2 text-xs text-blue-600">Open React DevTools to see detailed component analysis</div>')
              .build(),

            // System Information
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded-lg shadow')
              .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">💻 System Info</h3>')
              .content('<div class="text-sm text-gray-600 space-y-1">')
              .content('<div>Browser: <span id="browser-info" class="font-mono">Detecting...</span></div>')
              .content('<div>Memory limit: <span id="memory-limit" class="font-mono">N/A</span></div>')
              .content('<div>Performance API: <span id="performance-api" class="font-mono">Checking...</span></div>')
              .content('<div>Worker threads: <span id="worker-threads" class="font-mono">N/A</span></div>')
              .content('</div>')
              .content('<div class="mt-2 text-xs text-gray-500">System capabilities and limitations</div>')
              .build(),
          ])
          .build(),

        // Performance Log
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mt-4 bg-white p-4 rounded-lg shadow')
          .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">📋 Performance Log</h3>')
          .content('<div class="h-32 overflow-y-auto text-xs font-mono text-gray-600 bg-gray-50 p-3 rounded border" id="performance-log">Performance monitoring started...</div>')
          .content('<div class="mt-2 text-xs text-gray-500">Real-time log of performance events and optimizations</div>')
          .build(),
      ])
      .build(),
  ])
  .build();
