import {
  CommissarBuilder,
  LayoutComponentDetailBuilder,
  ActionBuilder,
  ChainBuilder,
  ConditionBuilder,
  Actions
} from 'xingine';

// Login form commissar with enhanced FormRenderer
export const LOGIN_COMMISSAR = CommissarBuilder.create()
  .path('/login')
  .wrapper()
  .className('min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4')
  .addChild(
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg')
      .addChildren([
        // Header with icon and title
        LayoutComponentDetailBuilder.create()
          .withMeta('TextRenderer', {
            content: '🔐 Welcome Back',
            style: {
              className: 'text-2xl font-bold text-gray-800 mb-2 text-center'
            }
          })
          .build(),
        
        LayoutComponentDetailBuilder.create()
          .withMeta('TextRenderer', {
            content: 'Please sign in to your account',
            style: {
              className: 'text-gray-600 mb-6 text-center'
            }
          })
          .build(),

        // Enhanced login form with JSON editor and conditional rendering
        LayoutComponentDetailBuilder.create()
          .withMeta('FormRenderer', {
            showJsonEditor: true,
            action: 'auth/login',
            fields: [
              {
                name: 'username',
                label: 'Username',
                inputType: 'input',
                required: true,
                order: 1,
                properties: {
                  placeholder: 'Enter your username'
                }
              },
              {
                name: 'password',
                label: 'Password', 
                inputType: 'password',
                required: true,
                order: 2,
                properties: {
                  placeholder: 'Enter your password'
                }
              },
              {
                name: 'rememberMe',
                label: 'Remember Me',
                inputType: 'switch',
                required: false,
                order: 3,
                properties: {
                  checkedChildren: 'Yes',
                  unCheckedChildren: 'No'
                }
              },
              {
                name: 'loginMethod',
                label: 'Login Method',
                inputType: 'select',
                required: false,
                order: 4,
                properties: {
                  options: [
                    { value: 'standard', label: 'Standard Login' },
                    { value: 'admin', label: 'Admin Login' },
                    { value: 'guest', label: 'Guest Access' }
                  ]
                }
              },
              // Conditional field - only shows when admin login method is selected
              {
                name: 'adminCode',
                label: 'Admin Access Code',
                inputType: 'input',
                required: false,
                order: 5,
                conditionalRender: {
                  condition: {
                    operator: 'eq',
                    field: 'loginMethod',
                    value: 'admin'
                  }
                },
                properties: {
                  placeholder: 'Enter admin access code'
                }
              }
            ],
            event: {
              onSubmit: ActionBuilder.create('makeApiCall')
                .withArgs({
                  url: 'auth/login',
                  method: 'POST'
                })
                .withChains(
                  ChainBuilder.create()
                    .whenCondition(ConditionBuilder
                      .field('__result.success')
                      .equals(true)
                    )
                    .thenActionBuilders(
                      Actions.setStorage('token', '__result.token'),
                      Actions.setState('user', '__result.user'),
                      Actions.setState('isAuthenticated', true),
                      Actions.navigate('/dashboard')
                    )
                    .build()
                )
                .build()
            },
            properties: {
              submitText: 'Sign In',
              className: 'space-y-4'
            }
          })
          .build(),

        // Demo credentials info
        LayoutComponentDetailBuilder.create()
          .withMeta('TextRenderer', {
            content: 'Demo: admin/password or user/user123',
            style: {
              className: 'mt-6 text-center text-sm text-gray-500'
            }
          })
          .build(),

        // Interactive JSON editing info
        LayoutComponentDetailBuilder.create()
          .withMeta('TextRenderer', {
            content: '💡 Try editing the JSON on the right to see form fields update in real-time!',
            style: {
              className: 'mt-2 text-center text-sm text-blue-600 font-medium'
            }
          })
          .build()
      ])
      .build()
  )
  .build();
