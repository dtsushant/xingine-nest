import {
  CommissarBuilder,
} from 'xingine';

// ULTRA Simplified login commissar for debugging hooks issue - just text
export const LOGIN_COMMISSAR_SIMPLE = CommissarBuilder.create()
  .path('/login')
  .wrapper()
  .content('<div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f0f0f0;"><div style="padding: 40px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);"><h1>🔐 Ultra Simple Login</h1><p>If you see this, the hooks issue is NOT in this component.</p></div></div>')
  .build();
