import {
  CommissarBuilder,
} from 'xingine';

// Test route for debugging hooks issue - different from login
export const TEST_ROUTE_COMMISSAR = CommissarBuilder.create()
  .path('/test-route')
  .wrapper()
  .content('<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #e8f5e8;"><div style="padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"><h1>🧪 Test Route</h1><p>This is a test route to debug hooks issue on navigation.</p></div></div>')
  .build();
