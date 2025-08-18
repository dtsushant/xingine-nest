import {
  CommissarBuilder,
  LayoutComponentDetailBuilder,
} from 'xingine';

// Content-level state demonstration
const contentStateFields = [
  {
    name: 'contentTitle',
    label: 'Content Title',
    inputType: 'input' as const,
    required: false,
    properties: { placeholder: 'Enter content title...' },
  },
  {
    name: 'contentDescription',
    label: 'Content Description',
    inputType: 'textarea' as const,
    required: false,
    properties: { rows: 3, placeholder: 'Enter content description...' },
  },
  {
    name: 'contentCategory',
    label: 'Content Category',
    inputType: 'select' as const,
    properties: {
      options: [
        { value: 'blog', label: 'Blog Post' },
        { value: 'news', label: 'News Article' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'documentation', label: 'Documentation' },
      ],
    },
  },
];

// Global State Controls Component
const globalStateControls = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(
    'bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6'
  )
  .addChildren([
    // Header
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-4')
      .content('<h2 class="text-2xl font-bold mb-2">🌐 Global State Management</h2>')
      .content('<p class="text-blue-100">These controls affect the entire application layout and theme</p>')
      .build(),

    // Global Controls Grid
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('grid grid-cols-1 md:grid-cols-3 gap-4')
      .addChildren([
        // Dark Mode Toggle
        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'darkModeToggle',
            text: '#{darkMode ? "🌙 Dark Mode ON" : "☀️ Light Mode"}',
            action: 'toggleState',
            args: { key: 'darkMode' },
            className: 'w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 #{darkMode ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-yellow-400 text-gray-800 hover:bg-yellow-300"}',
            properties: {
              tooltip: 'Toggle between dark and light theme for entire application'
            }
          })
          .build(),

        // Sidebar Toggle
        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'sidebarToggle',
            text: '#{collapsed ? "📤 Expand Sidebar" : "📥 Collapse Sidebar"}',
            action: 'toggleState',
            args: { key: 'collapsed' },
            className: 'w-full px-4 py-3 rounded-lg font-semibold bg-white text-blue-600 hover:bg-blue-50 transition-all duration-200',
            properties: {
              tooltip: 'Toggle sidebar visibility across all pages'
            }
          })
          .build(),

        // Screen Size Display
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('bg-white bg-opacity-20 rounded-lg p-3 text-center')
          .content('<div class="text-sm font-medium">Screen Size</div>')
          .content('<div class="text-lg font-bold">#{currentScreenSize}px</div>')
          .build(),
      ])
      .build(),

    // Global State Display
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mt-4 bg-white bg-opacity-10 rounded-lg p-4')
      .content('<h3 class="text-lg font-semibold mb-2">📊 Current Global State:</h3>')
      .content('<pre class="text-sm bg-black bg-opacity-30 p-3 rounded overflow-x-auto">#{JSON.stringify({darkMode: darkMode, collapsed: collapsed, hasSider: hasSider, hasHeader: hasHeader, hasFooter: hasFooter, currentScreenSize: currentScreenSize}, null, 2)}</pre>')
      .build(),
  ])
  .build();

// Content State Controls Component
const contentStateControls = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(
    'bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg shadow-lg mb-6'
  )
  .addChildren([
    // Header
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-4')
      .content('<h2 class="text-2xl font-bold mb-2">📄 Content State Management</h2>')
      .content('<p class="text-green-100">These controls manage page-specific content state</p>')
      .build(),

    // Content Form
    LayoutComponentDetailBuilder.create()
      .withMeta('FormRenderer', {
        action: 'updateContentState',
        fields: contentStateFields,
        event: {
          onChange: {
            action: 'updateContentState',
            args: { target: 'content' }
          }
        },
        properties: {
          title: 'Content Configuration',
          submitText: 'Update Content State',
          className: 'bg-white p-4 rounded-lg text-gray-800',
          showSubmit: true,
        },
      })
      .build(),

    // Content State Display
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mt-4 bg-white bg-opacity-10 rounded-lg p-4')
      .content('<h3 class="text-lg font-semibold mb-2">📊 Current Content State:</h3>')
      .content('<pre class="text-sm bg-black bg-opacity-30 p-3 rounded overflow-x-auto" id="content-state-display">{}</pre>')
      .build(),
  ])
  .build();

// Component State Demo - Counter Component
const counterComponent1 = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('bg-white p-4 rounded-lg shadow border-l-4 border-red-500')
  .addChildren([
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-3')
      .content('<h4 class="text-lg font-semibold text-red-600">🔴 Counter Component #1</h4>')
      .content('<p class="text-sm text-gray-600">Independent component state - only this component updates</p>')
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('flex items-center gap-4 mb-3')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'counter1Decrement',
            text: '➖',
            action: 'decrementCounter',
            args: { componentId: 'counter1' },
            className: 'w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors',
          })
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('px-4 py-2 bg-gray-100 rounded-lg font-bold text-xl min-w-16 text-center')
          .content('<span id="counter1-value">0</span>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'counter1Increment',
            text: '➕',
            action: 'incrementCounter',
            args: { componentId: 'counter1' },
            className: 'w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors',
          })
          .build(),
      ])
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('text-xs text-gray-500 bg-gray-50 p-2 rounded')
      .content('<strong>Component State:</strong> <span id="counter1-state">{ "value": 0, "lastUpdated": null }</span>')
      .build(),
  ])
  .build();

// Component State Demo - Second Counter Component
const counterComponent2 = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('bg-white p-4 rounded-lg shadow border-l-4 border-blue-500')
  .addChildren([
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-3')
      .content('<h4 class="text-lg font-semibold text-blue-600">🔵 Counter Component #2</h4>')
      .content('<p class="text-sm text-gray-600">Another independent component - operates separately</p>')
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('flex items-center gap-4 mb-3')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'counter2Decrement',
            text: '➖',
            action: 'decrementCounter',
            args: { componentId: 'counter2' },
            className: 'w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors',
          })
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('px-4 py-2 bg-gray-100 rounded-lg font-bold text-xl min-w-16 text-center')
          .content('<span id="counter2-value">0</span>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'counter2Increment',
            text: '➕',
            action: 'incrementCounter',
            args: { componentId: 'counter2' },
            className: 'w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors',
          })
          .build(),
      ])
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('text-xs text-gray-500 bg-gray-50 p-2 rounded')
      .content('<strong>Component State:</strong> <span id="counter2-state">{ "value": 0, "lastUpdated": null }</span>')
      .build(),
  ])
  .build();

// Input Component with Local State
const inputComponent1 = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('bg-white p-4 rounded-lg shadow border-l-4 border-green-500')
  .addChildren([
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-3')
      .content('<h4 class="text-lg font-semibold text-green-600">🟢 Input Component #1</h4>')
      .content('<p class="text-sm text-gray-600">Local input state - changes only affect this component</p>')
      .build(),

    LayoutComponentDetailBuilder.create()
      .withMeta('InputRenderer', {
        name: 'localInput1',
        placeholder: 'Type something here...',
        action: 'updateLocalInput',
        args: { componentId: 'input1' },
        className: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500',
        properties: {
          onChange: 'updateLocalInput'
        }
      })
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded')
      .content('<strong>Component State:</strong> <span id="input1-state">{ "value": "", "length": 0, "lastUpdated": null }</span>')
      .build(),
  ])
  .build();

// Toggle Component with Local State
const toggleComponent1 = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('bg-white p-4 rounded-lg shadow border-l-4 border-purple-500')
  .addChildren([
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-3')
      .content('<h4 class="text-lg font-semibold text-purple-600">🟣 Toggle Component</h4>')
      .content('<p class="text-sm text-gray-600">Local toggle state - independent of other components</p>')
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('flex items-center gap-3 mb-3')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'toggle1Button',
            text: '#{toggle1 ? "🟢 ON" : "🔴 OFF"}',
            action: 'toggleLocalState',
            args: { componentId: 'toggle1' },
            className: 'px-6 py-2 rounded-lg font-semibold transition-all duration-200 #{toggle1 ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}',
          })
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('text-sm text-gray-600')
          .content('<span id="toggle1-status">Status: OFF</span>')
          .build(),
      ])
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('text-xs text-gray-500 bg-gray-50 p-2 rounded')
      .content('<strong>Component State:</strong> <span id="toggle1-state">{ "enabled": false, "toggleCount": 0, "lastToggled": null }</span>')
      .build(),
  ])
  .build();

// State Interaction Demonstration
const stateInteractionDemo = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className(
    'bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-lg mb-6'
  )
  .addChildren([
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-4')
      .content('<h2 class="text-2xl font-bold mb-2">⚡ State Interaction Demonstration</h2>')
      .content('<p class="text-orange-100">See how different state levels interact and affect components</p>')
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('grid grid-cols-1 md:grid-cols-2 gap-4 mb-4')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'randomizeButton',
            text: '🎲 Randomize All Component States',
            action: 'randomizeComponentStates',
            args: {},
            className: 'w-full px-4 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors',
          })
          .build(),

        LayoutComponentDetailBuilder.create()
          .withMeta('ButtonRenderer', {
            name: 'resetButton',
            text: '🔄 Reset All Component States',
            action: 'resetComponentStates',
            args: {},
            className: 'w-full px-4 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors',
          })
          .build(),
      ])
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-white bg-opacity-10 rounded-lg p-4')
      .content('<h3 class="text-lg font-semibold mb-2">📈 State Update Performance:</h3>')
      .content('<div class="grid grid-cols-3 gap-4 text-center">')
      .content('<div><div class="text-2xl font-bold" id="global-updates">0</div><div class="text-sm">Global Updates</div></div>')
      .content('<div><div class="text-2xl font-bold" id="content-updates">0</div><div class="text-sm">Content Updates</div></div>')
      .content('<div><div class="text-2xl font-bold" id="component-updates">0</div><div class="text-sm">Component Updates</div></div>')
      .content('</div>')
      .build(),
  ])
  .build();

// State Architecture Explanation
const stateArchitectureExplanation = LayoutComponentDetailBuilder.create()
  .wrapper()
  .className('bg-white p-6 rounded-lg shadow-lg mb-6 border')
  .addChildren([
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-6')
      .content('<h2 class="text-2xl font-bold text-gray-800 mb-2">🏗️ Xingine State Architecture</h2>')
      .content('<p class="text-gray-600">Understanding the three-tier hierarchical state management system</p>')
      .build(),

    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('grid grid-cols-1 md:grid-cols-3 gap-6')
      .addChildren([
        // Global State Explanation
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('border border-blue-200 rounded-lg p-4 bg-blue-50')
          .content('<h3 class="text-lg font-semibold text-blue-800 mb-3">🌐 Global State</h3>')
          .content('<ul class="text-sm text-blue-700 space-y-2">')
          .content('<li>• Application-wide settings</li>')
          .content('<li>• Theme preferences (dark/light)</li>')
          .content('<li>• Layout configuration</li>')
          .content('<li>• User authentication status</li>')
          .content('<li>• Screen size and responsive data</li>')
          .content('</ul>')
          .content('<div class="mt-3 p-2 bg-blue-100 rounded text-xs"><strong>Scope:</strong> Entire application</div>')
          .build(),

        // Content State Explanation
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('border border-green-200 rounded-lg p-4 bg-green-50')
          .content('<h3 class="text-lg font-semibold text-green-800 mb-3">📄 Content State</h3>')
          .content('<ul class="text-sm text-green-700 space-y-2">')
          .content('<li>• Page-specific data</li>')
          .content('<li>• Form data and validation</li>')
          .content('<li>• API responses for the page</li>')
          .content('<li>• Filters and search parameters</li>')
          .content('<li>• Page navigation state</li>')
          .content('</ul>')
          .content('<div class="mt-3 p-2 bg-green-100 rounded text-xs"><strong>Scope:</strong> Current page/route</div>')
          .build(),

        // Component State Explanation
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('border border-purple-200 rounded-lg p-4 bg-purple-50')
          .content('<h3 class="text-lg font-semibold text-purple-800 mb-3">🧩 Component State</h3>')
          .content('<ul class="text-sm text-purple-700 space-y-2">')
          .content('<li>• Individual component data</li>')
          .content('<li>• UI interaction states</li>')
          .content('<li>• Local form inputs</li>')
          .content('<li>• Component-specific flags</li>')
          .content('<li>• Isolated business logic</li>')
          .content('</ul>')
          .content('<div class="mt-3 p-2 bg-purple-100 rounded text-xs"><strong>Scope:</strong> Single component instance</div>')
          .build(),
      ])
      .build(),

    // Performance Benefits
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mt-6 bg-gray-50 p-4 rounded-lg')
      .content('<h3 class="text-lg font-semibold text-gray-800 mb-3">⚡ Performance Benefits</h3>')
      .content('<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">')
      .content('<div><strong>Isolated Updates:</strong> Component state changes only re-render that specific component</div>')
      .content('<div><strong>Efficient Subscriptions:</strong> Components subscribe only to relevant state slices</div>')
      .content('<div><strong>Minimal Re-renders:</strong> Hierarchical structure prevents unnecessary updates</div>')
      .content('<div><strong>Predictable Patterns:</strong> Clear separation of concerns for debugging</div>')
      .content('</div>')
      .build(),
  ])
  .build();

// Create the main state management page
export const STATE_MANAGEMENT_COMMISSAR = CommissarBuilder.create()
  .path('/state-management')
  .wrapper()
  .className('min-h-full max-w-full w-full #{darkMode ? "bg-gray-900" : "bg-gray-50"}')
  .addChildren([
    // Page Header
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('bg-white #{darkMode ? "bg-gray-800" : "bg-white"} shadow-sm border-b mb-8')
      .addChild(
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('max-w-7xl mx-auto px-4 py-6')
          .content('<h1 class="text-3xl font-bold #{darkMode ? "text-white" : "text-gray-900"}">State Management Demo</h1>')
          .content('<p class="text-lg #{darkMode ? "text-gray-300" : "text-gray-600"} mt-2">Demonstrating Xingine\'s three-tier hierarchical state management system</p>')
          .build()
      )
      .build(),

    // Main Content Container
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('max-w-7xl mx-auto px-4 pb-8')
      .addChildren([
        // State Architecture Explanation
        stateArchitectureExplanation,

        // Global State Controls
        globalStateControls,

        // Content State Controls
        contentStateControls,

        // Component State Demonstrations
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('mb-6')
          .content('<h2 class="text-2xl font-bold #{darkMode ? "text-white" : "text-gray-800"} mb-4">🧩 Component State Demonstrations</h2>')
          .content('<p class="#{darkMode ? "text-gray-300" : "text-gray-600"} mb-6">Each component below maintains its own isolated state. Notice how updating one component doesn\'t affect others.</p>')
          .build(),

        LayoutComponentDetailBuilder.create()
          .wrapper()
          .className('grid grid-cols-1 md:grid-cols-2 gap-6 mb-6')
          .addChildren([
            counterComponent1,
            counterComponent2,
            inputComponent1,
            toggleComponent1,
          ])
          .build(),

        // State Interaction Demo
        stateInteractionDemo,
      ])
      .build(),
  ])
  .build();
