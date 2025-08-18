import {
  CommissarBuilder,
  LayoutComponentDetailBuilder,
} from 'xingine';

// Simple State Management Demo - Basic Version
export const STATE_MANAGEMENT_COMMISSAR = CommissarBuilder.create()
  .path('/state-management')
  .wrapper()
  .className('min-h-full max-w-full w-full p-6 bg-gray-50')
  .addChildren([
    // Page Header
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8')
      .content('<h1 class="text-3xl font-bold text-gray-900 mb-4">State Management Demo</h1>')
      .content('<p class="text-lg text-gray-600">A simplified demonstration of Xingine state management</p>')
      .build(),

    // Debug State Display (NEW) - Enhanced with Raw JSON
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-6')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-3')
          .content('<h2 class="text-xl font-bold text-yellow-800 mb-2">🔍 Debug: Current State</h2>')
          .content('<p class="text-yellow-600">Real-time view of all state values with raw JSON</p>')
          .build(),

        // RAW JSON STATE DUMPS
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-red-100 border border-red-300 p-4 rounded mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-2')
              .content('<h3 class="text-lg font-bold text-red-800">🚨 RAW STATE JSON (Direct from Store)</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('StateDebugRenderer', {
                name: 'stateDebugDisplay',
                stateLevel: 'all',
                className: 'w-full'
              })
              .build(),
          ])
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('grid grid-cols-1 md:grid-cols-3 gap-4')
          .addChildren([
            // Global State JSON
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded shadow')
              .content('<h3 class="text-lg font-semibold text-blue-800 mb-2">🌐 Global State (Interpolated)</h3>')
              .content('<pre class="text-xs bg-blue-50 p-3 rounded overflow-auto font-mono max-h-32">{"hasSider": #{hasSider || true}, "hasHeader": #{hasHeader || true}, "hasFooter": #{hasFooter || true}, "collapsed": #{collapsed || false}, "darkMode": #{darkMode || false}, "userDropdownOpen": #{userDropdownOpen || false}, "currentScreenSize": #{currentScreenSize || 0}}</pre>')
              .build(),

            // Content State JSON
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded shadow')
              .content('<h3 class="text-lg font-semibold text-purple-800 mb-2">📄 Content State (Interpolated)</h3>')
              .content('<pre class="text-xs bg-purple-50 p-3 rounded overflow-auto font-mono max-h-32" id="debug-content-state">{"contentValue": "#{contentValue || ""}", "filterActive": #{filterActive || false}}</pre>')
              .build(),

            // Component State JSON
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-white p-4 rounded shadow')
              .content('<h3 class="text-lg font-semibold text-green-800 mb-2">🧩 Component State (Interpolated)</h3>')
              .content('<pre class="text-xs bg-green-50 p-3 rounded overflow-auto font-mono max-h-32" id="debug-component-state">{"simpleCounter": #{simpleCounter || 0}, "simpleToggle": #{simpleToggle || false}, "simpleInput": "#{simpleInput || ""}"}</pre>')
              .build(),
          ])
          .build(),

        // Action Log
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mt-4 bg-white p-4 rounded shadow')
          .content('<h3 class="text-lg font-semibold text-gray-800 mb-2">📋 Action Log</h3>')
          .content('<div class="text-xs bg-gray-50 p-3 rounded h-24 overflow-y-auto font-mono" id="debug-action-log">Waiting for actions...</div>')
          .build(),
      ])
      .build(),

    // Global State Section (Enhanced)
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-blue-50 p-6 rounded-lg mb-6')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .content('<h2 class="text-xl font-bold text-blue-800 mb-2">🌐 Global State</h2>')
          .content('<p class="text-blue-600">Controls that affect the entire application</p>')
          .build(),

        // Global Controls
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Global Controls</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex gap-4 mb-3')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'darkModeToggle',
                    content: 'Toggle Dark Mode',
                    event: { 
                      onClick: {
                        action: 'toggleState',
                        args: { key: 'GLOBAL.darkMode' }
                      }
                    },
                    className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'sidebarToggle',
                    content: 'Toggle Sidebar',
                    event: { 
                      onClick: {
                        action: 'toggleState',
                        args: { key: 'GLOBAL.collapsed' }
                      }
                    },
                    className: 'px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600',
                  })
                  .build(),
              ])
              .build(),

            // Global state display
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded font-mono')
              .content('<div>Has Sider: <span class="font-bold">#{hasSider || true}</span></div>')
              .content('<div>Has Header: <span class="font-bold">#{hasHeader || true}</span></div>')
              .content('<div>Has Footer: <span class="font-bold">#{hasFooter || true}</span></div>')
              .content('<div>Sidebar Collapsed: <span class="font-bold">#{collapsed || false}</span></div>')
              .content('<div>Dark Mode: <span class="font-bold">#{darkMode || false}</span></div>')
              .content('<div>User Dropdown Open: <span class="font-bold">#{userDropdownOpen || false}</span></div>')
              .content('<div>Current Screen Size: <span class="font-bold">#{currentScreenSize || 0}</span></div>')
              .build(),
          ])
          .build(),

        // Global Impact Display - Application Theme
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Global Impact: Application Theme</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('grid grid-cols-1 md:grid-cols-3 gap-4 mb-3')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-3 border rounded transition-colors duration-200')
                  .content('<div class="font-semibold">Header Bar</div>')
                  .content('<div class="text-sm text-gray-600" id="theme-header">Light Theme Active</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-3 border rounded transition-colors duration-200')
                  .content('<div class="font-semibold">Content Area</div>')
                  .content('<div class="text-sm text-gray-600" id="theme-content">Light Background</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-3 border rounded transition-colors duration-200')
                  .content('<div class="font-semibold">Sidebar</div>')
                  .content('<div class="text-sm text-gray-600" id="theme-sidebar">Expanded & Light</div>')
                  .build(),
              ])
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-xs text-blue-600 bg-blue-50 p-2 rounded')
              .content('Global theme changes affect: All page elements, navigation, forms, and components')
              .build(),
          ])
          .build(),

        // Global Impact Display - Layout Structure
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Global Impact: Layout Structure</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('border-2 border-dashed border-blue-300 p-4 rounded')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-center mb-3')
                  .content('<div class="text-sm font-semibold text-blue-700">Application Layout Preview</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('flex gap-2')
                  .addChildren([
                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('w-1/4 h-16 bg-blue-200 rounded flex items-center justify-center text-xs transition-all duration-200')
                      .content('<span id="layout-sidebar-preview">Sidebar</span>')
                      .build(),

                    LayoutComponentDetailBuilder.create()
                      .wrapper()
                      .className('flex-1 h-16 bg-blue-100 rounded flex items-center justify-center text-xs')
                      .content('<span id="layout-content-preview">Main Content Area</span>')
                      .build(),
                  ])
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('mt-2 text-xs text-gray-500 text-center')
                  .content('<span id="layout-status">Current: Sidebar Expanded, Light Mode</span>')
                  .build(),
              ])
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Component State Section
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-green-50 p-6 rounded-lg mb-6')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .content('<h2 class="text-xl font-bold text-green-800 mb-2">🧩 Component State</h2>')
          .content('<p class="text-green-600">Independent component with its own state</p>')
          .build(),

        // Counter Component
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Counter Component</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex items-center gap-4 mb-3')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'decrementBtn',
                    content: '-',
                    componentId: 'simpleCounter', // Add componentId for state management
                    event: { 
                      onClick: {
                        action: 'decrementCounter',
                        args: { componentId: 'simpleCounter' }
                      }
                    },
                    className: 'w-10 h-10 bg-red-500 text-white rounded hover:bg-red-600',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('px-4 py-2 bg-gray-100 rounded text-lg font-bold min-w-16 text-center')
                  .content('<span id="counter-display">#{simpleCounter || 0}</span>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'incrementBtn',
                    content: '+',
                    componentId: 'simpleCounter', // Add componentId for state management
                    event: { 
                      onClick: {
                        action: 'incrementCounter',
                        args: { componentId: 'simpleCounter' }
                      }
                    },
                    className: 'w-10 h-10 bg-green-500 text-white rounded hover:bg-green-600',
                  })
                  .build(),
              ])
              .build(),

            // Component state impact display
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded')
              .content('<strong>Component Impact:</strong> Counter value affects only this component')
              .content('<div class="mt-2">Current Value: <span id="counter-impact" class="font-mono">#{simpleCounter || 0}</span></div>')
              .build(),
          ])
          .build(),

        // Toggle Component  
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Toggle Component</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('flex items-center gap-4 mb-3')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .withMeta('ButtonRenderer', {
                    name: 'toggleBtn',
                    content: '#{simpleToggle ? "ON" : "OFF"}',
                    componentId: 'simpleToggle', // Add componentId for state management
                    event: { 
                      onClick: {
                        action: 'toggleComponent',
                        args: { componentId: 'simpleToggle' }
                      }
                    },
                    className: 'px-6 py-2 #{simpleToggle ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"} rounded hover:#{simpleToggle ? "bg-green-600" : "bg-gray-400"} transition-colors',
                  })
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('text-sm text-gray-600')
                  .content('<span id="toggle-status">Status: #{simpleToggle ? "Active" : "Inactive"}</span>')
                  .build(),
              ])
              .build(),

            // Toggle state impact display
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded')
              .content('<strong>Component Impact:</strong> Toggle state affects component styling and behavior')
              .content('<div class="mt-2">Background Color: <span id="toggle-impact" class="font-mono">#{simpleToggle ? "Green (Active)" : "Gray (Inactive)"}</span></div>')
              .build(),
          ])
          .build(),

        // Input Component
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Input Component</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('InputRenderer', {
                name: 'componentInput',
                placeholder: 'Type here to see component state change...',
                componentId: 'simpleInput', // Add componentId for state management
                event: { 
                  onChange: {
                    action: 'updateComponentInput',
                    args: { componentId: 'simpleInput' },
                    valueFromEvent: true
                  }
                },
                className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-3',
              })
              .build(),

            // Input state impact display
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded')
              .content('<strong>Component Impact:</strong> Input value stored in component state only')
              .content('<div class="mt-2">Character Count: <span id="input-impact" class="font-mono">#{(simpleInput || "").length || 0}</span></div>')
              .content('<div>Current Value: "<span id="input-value" class="font-mono">#{simpleInput || ""}</span>"</div>')
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Content State Section (Enhanced)
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-purple-50 p-6 rounded-lg mb-6')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .content('<h2 class="text-xl font-bold text-purple-800 mb-2">📄 Content State</h2>')
          .content('<p class="text-purple-600">Page-specific content state that affects multiple elements</p>')
          .build(),

        // Content Input Control
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Content Control</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('InputRenderer', {
                name: 'contentInput',
                placeholder: 'Enter content to see page-wide impact...',
                event: { 
                  onChange: {
                    action: 'updateContentState',
                    args: { key: 'contentValue' },
                    valueFromEvent: true
                  }
                },
                className: 'w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500 mb-3',
              })
              .build(),

            LayoutComponentDetailBuilder.create()
              .withMeta('ButtonRenderer', {
                name: 'contentFilterBtn',
                content: 'Content Filter: #{filterActive ? "ON" : "OFF"}',
                event: { 
                  onClick: {
                    action: 'toggleContentFilter',
                    args: { key: 'filterActive' }
                  }
                },
                className: 'px-4 py-2 #{filterActive ? "bg-purple-600 text-white" : "bg-purple-500 text-white"} rounded hover:bg-purple-600',
              })
              .build(),
          ])
          .build(),

        // Content Impact Display - Header
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-2')
              .content('<h3 class="text-lg font-semibold text-gray-800">Content Impact: Page Header</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('p-3 border border-purple-200 rounded bg-purple-25')
              .content('<div class="text-lg font-bold text-purple-800" id="content-header">#{contentValue ? `Page: ${contentValue}` : "Default Page Title"}</div>')
              .content('<div class="text-sm text-purple-600 mt-1">This title updates based on content state</div>')
              .build(),
          ])
          .build(),

        // Content Impact Display - Cards
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow mb-4')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">Content Impact: Dynamic Cards</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('grid grid-cols-1 md:grid-cols-2 gap-4')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-3 border border-purple-200 rounded')
                  .content('<div class="font-semibold text-purple-700">Card 1</div>')
                  .content('<div class="text-sm text-gray-600" id="content-card1">Content: #{contentValue || "Empty"}</div>')
                  .content('<div class="text-xs text-gray-500 mt-1" id="content-filter1">Filter: #{filterActive ? "Active" : "Inactive"}</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-3 border border-purple-200 rounded')
                  .content('<div class="font-semibold text-purple-700">Card 2</div>')
                  .content('<div class="text-sm text-gray-600" id="content-card2">Content: #{contentValue || "Empty"}</div>')
                  .content('<div class="text-xs text-gray-500 mt-1" id="content-filter2">Filter: #{filterActive ? "Active" : "Inactive"}</div>')
                  .build(),
              ])
              .build(),
          ])
          .build(),

        // Content State Summary
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-2')
              .content('<h3 class="text-lg font-semibold text-gray-800">Content State Summary</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('text-sm text-gray-600 bg-gray-50 p-3 rounded font-mono')
              .content('<div>Content Value: "<span id="content-summary-value">#{contentValue || ""}</span>"</div>')
              .content('<div>Filter Active: <span id="content-summary-filter">#{filterActive || false}</span></div>')
              .content('<div>Character Count: <span id="content-char-count">#{(contentValue || "").length || 0}</span></div>')
              .content('<div class="mt-2 text-xs text-purple-600">Changes here affect: Page Header + 2 Cards + Summary</div>')
              .build(),
          ])
          .build(),
      ])
      .build(),

    // Simple Status Display
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-gray-50 p-6 rounded-lg border')
      .content('<h2 class="text-xl font-bold text-gray-800 mb-2">📊 Status</h2>')
      .content('<p class="text-gray-600">Page loaded successfully with basic state management</p>')
      .content('<div class="mt-4 text-sm text-gray-500">This is a simplified version to prevent recursive rendering issues.</div>')
      .build(),

    // State Interaction Summary
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-l-4 border-orange-400')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-4')
          .content('<h2 class="text-xl font-bold text-orange-800 mb-2">⚡ State Interaction Overview</h2>')
          .content('<p class="text-orange-600">See how changes at different levels create cascading effects</p>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('grid grid-cols-1 md:grid-cols-3 gap-4 mb-4')
          .addChildren([
            // Global Impact Summary
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-blue-100 p-4 rounded-lg')
              .content('<h3 class="text-lg font-semibold text-blue-800 mb-2">🌐 Global Changes</h3>')
              .content('<ul class="text-sm text-blue-700 space-y-1">')
              .content('<li>• Affects entire application</li>')
              .content('<li>• Changes theme/layout for all pages</li>')
              .content('<li>• Updates header, sidebar, content</li>')
              .content('<li>• Persists across navigation</li>')
              .content('</ul>')
              .content('<div class="mt-2 text-xs bg-blue-200 p-2 rounded">Impact: <span id="global-impact-count">0</span> elements</div>')
              .build(),

            // Content Impact Summary
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-purple-100 p-4 rounded-lg')
              .content('<h3 class="text-lg font-semibold text-purple-800 mb-2">📄 Content Changes</h3>')
              .content('<ul class="text-sm text-purple-700 space-y-1">')
              .content('<li>• Affects current page only</li>')
              .content('<li>• Updates multiple page elements</li>')
              .content('<li>• Shares data between components</li>')
              .content('<li>• Resets on page navigation</li>')
              .content('</ul>')
              .content('<div class="mt-2 text-xs bg-purple-200 p-2 rounded">Impact: <span id="content-impact-count">0</span> elements</div>')
              .build(),

            // Component Impact Summary
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('bg-green-100 p-4 rounded-lg')
              .content('<h3 class="text-lg font-semibold text-green-800 mb-2">🧩 Component Changes</h3>')
              .content('<ul class="text-sm text-green-700 space-y-1">')
              .content('<li>• Affects single component only</li>')
              .content('<li>• Isolated state management</li>')
              .content('<li>• Independent from other components</li>')
              .content('<li>• Optimal performance</li>')
              .content('</ul>')
              .content('<div class="mt-2 text-xs bg-green-200 p-2 rounded">Impact: <span id="component-impact-count">0</span> elements</div>')
              .build(),
          ])
          .build(),

        // Real-time Activity Monitor
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white p-4 rounded-lg shadow')
          .addChildren([
            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mb-3')
              .content('<h3 class="text-lg font-semibold text-gray-800">📈 Real-time Activity Monitor</h3>')
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('grid grid-cols-3 gap-4 text-center')
              .addChildren([
                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-3 bg-blue-50 rounded')
                  .content('<div class="text-2xl font-bold text-blue-600" id="global-update-count">0</div>')
                  .content('<div class="text-sm text-blue-800">Global Updates</div>')
                  .content('<div class="text-xs text-gray-500 mt-1" id="global-last-update">Never</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-3 bg-purple-50 rounded')
                  .content('<div class="text-2xl font-bold text-purple-600" id="content-update-count">0</div>')
                  .content('<div class="text-sm text-purple-800">Content Updates</div>')
                  .content('<div class="text-xs text-gray-500 mt-1" id="content-last-update">Never</div>')
                  .build(),

                LayoutComponentDetailBuilder.create()
                  .wrapper()
                  .className('p-3 bg-green-50 rounded')
                  .content('<div class="text-2xl font-bold text-green-600" id="component-update-count">0</div>')
                  .content('<div class="text-sm text-green-800">Component Updates</div>')
                  .content('<div class="text-xs text-gray-500 mt-1" id="component-last-update">Never</div>')
                  .build(),
              ])
              .build(),

            LayoutComponentDetailBuilder.create()
              .wrapper()
              .className('mt-4 text-xs text-gray-500 text-center bg-gray-50 p-3 rounded')
              .content('Try interacting with different controls above to see real-time state management in action!')
              .build(),
          ])
          .build(),
      ])
      .build(),
  ])
  .build();
