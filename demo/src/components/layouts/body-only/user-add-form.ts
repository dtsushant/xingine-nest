import {
    Actions,
    CommissarBuilder, ConditionBuilder, FieldMetaBuilder,
    LayoutComponentDetailBuilder,
} from 'xingine';

/**
 * User Add Form Component - Proper Xingine Framework Pattern
 *
 * Uses proper withMeta FormRenderer with onInit actions for conditional rendering
 * instead of custom ConditionalFormBuilder or direct builder usage
 */
export const USER_ADD_FORM_COMMISSAR = CommissarBuilder.create()
  .path('/user/add')
  .wrapper()
  .className('min-h-full max-w-7xl mx-auto p-8 bg-gray-50')
  .addChildren([
    // Page Header
    LayoutComponentDetailBuilder.create()
      .wrapper()
      .className('mb-8 text-center')
      .addChildren([
        LayoutComponentDetailBuilder.create()
          .wrapper()
          .content('<h1 class="text-4xl font-bold text-gray-900 mb-4">👤 Create New User Profile</h1>')
          .build(),
      ])
      .build(),
    LayoutComponentDetailBuilder.create()
        .form()
        .fields([
                {
                    name: 'firstName',
                    label: 'First Name *',
                    inputType: 'input',
                    required: true,
                    properties: { placeholder: 'Enter your first name (e.g., John)' },
                    order: 1
                },
                {
                    name: 'lastName',
                    label: 'Last Name *',
                    inputType: 'input',
                    required: true,
                    properties: { placeholder: 'Enter your last name (e.g., Doe)' },
                    order: 2
                },
                {
                    name: 'email',
                    label: 'Email Address *',
                    inputType: 'input',
                    required: true,
                    properties: { placeholder: 'Enter your email (e.g., john.doe@company.com)' },
                    order: 3
                },
                {
                    name: 'hasCompanyInfo',
                    label: 'Provide Company Information',
                    inputType: 'checkbox',
                    required: false,
                    conditionalRender: {
                        condition: {
                            field: 'accountType',
                            operator: 'eq',
                            value: 'business'
                        }
                    },
                    order: 5
                },
                FieldMetaBuilder.create()
                .name('company')
                .label('Company Name')
                .inputType('object')
                .order(6)
                .properties({
                    fields: [
                        FieldMetaBuilder.create()
                            .name('name')
                            .label('Company Name *')
                            .inputType('input')
                            .required(true)
                            .properties({ placeholder: 'Enter company name' })
                            .build(),
                        FieldMetaBuilder.create()
                            .name('address')
                            .label('Address')
                            .inputType('input')
                            .properties({ placeholder: '123 Main St' })
                            .build(),
                        FieldMetaBuilder.create()
                            .name('city')
                            .label('City')
                            .inputType('input')
                            .properties({ placeholder: 'New York' })
                            .build(),
                        {
                            name: 'providePhoneNo',
                            label: 'Provide Phone Information',
                            inputType: 'checkbox',
                            required: false,
                        },
                        FieldMetaBuilder.create()
                            .name('phones')
                            .label('phone No')
                            .inputType('object[]')
                            .properties({
                                itemFields: [
                                    FieldMetaBuilder.create()
                                        .name('phoneNumber')
                                        .label('Phone Number *')
                                        .inputType('input')
                                        .required(true)
                                        .properties({ placeholder: 'Enter phone number' })
                                        .build(),
                                    FieldMetaBuilder.create()
                                        .name('phoneType')
                                        .label('Type')
                                        .inputType('select')
                                        .properties({
                                            options: [
                                                { value: 'mobile', label: '📱 Mobile' },
                                                { value: 'landline', label: '☎️ Landline' }
                                            ]
                                        })
                                        .build()
                                ]
                            })
                            .withCondition(ConditionBuilder.field('company.providePhoneNo').isTrue().build())
                            .build()
                    ],

                })
                    .withCondition(ConditionBuilder.
                    and(
                        ConditionBuilder.field('hasCompanyInfo')
                        .isTrue()
                        .build(),
                        ConditionBuilder.field('accountType')
                        .equals('business')
                        .build()
                    )
                    .build())
                .build(),
                {
                    name: 'accountType',
                    label: 'Account Type *',
                    inputType: 'select',
                    required: true,
                    properties: {
                        options: [
                            { value: 'individual', label: '👤 Individual User' },
                            { value: 'business', label: '🏢 Business Account' },
                            { value: 'admin', label: '🔧 Administrator' }
                        ]
                    },
                    order: 4
                },
            FieldMetaBuilder.create()
                .name('adminCode')
                .label('Admin Code *')
                .inputType('input')
                .required(true)
                .properties({ placeholder: 'Enter your Admin code' })
                .order(5)
                .showWhen('accountType', 'eq', 'admin')
                .build()
        ])
        .action('/api/users/save')
        .onLoad([
            Actions.apiCall('/api/users/fetch/:userId','GET',{userId:1})
                .then(
                    Actions.setFormData({setFromResult:true}).build(),
                )
                .build(),
        ])
        .onSubmitSuccess({
            actionsToExecute:[
                Actions.navigate('/user-detail/:userId',{userId:1}).build(),
            ]
        })
        .onSubmitFailure(
            {
                actionsToExecute:[
                    Actions.showToast('Error message needs result handling','error').build(),
                ]
            }
        )
        .showJsonEditor(true)
        .build(),
  ])
  .build();

export const USER_DETAIL_COMMISSAR = CommissarBuilder.create()
    .path('/user-detail/:userId')
    .apiComponent()
    .actionUrl("/api/users/user-detail/:userId")
    .build();

export const USER_DETAIL_COMPONENT = LayoutComponentDetailBuilder.create()
    .wrapper()
    .className('min-h-full max-w-7xl mx-auto p-8 bg-gray-50')
    .addChildren([
        // Page Header
        LayoutComponentDetailBuilder.create()
            .wrapper()
            .className('mb-8 text-center')
            .addChildren([
                LayoutComponentDetailBuilder.create()
                    .wrapper()
                    .content('<h1 class="text-4xl font-bold text-gray-900 mb-4">👤 User Profile Details</h1>')
                    .build(),
            ])
            .build(),

        // User Information Card
        LayoutComponentDetailBuilder.create()
            .wrapper()
            .className('bg-white rounded-lg shadow-lg p-6 mb-6')
            .addChildren([
                // Personal Information Section
                LayoutComponentDetailBuilder.create()
                    .wrapper()
                    .className('mb-6')
                    .addChildren([
                        LayoutComponentDetailBuilder.create()
                            .wrapper()
                            .content('<h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">📋 Personal Information</h2>')
                            .build(),
                        LayoutComponentDetailBuilder.create()
                            .wrapper()
                            .className('grid grid-cols-1 md:grid-cols-2 gap-4')
                            .addChildren([
                                LayoutComponentDetailBuilder.create()
                                    .wrapper()
                                    .className('p-3 bg-gray-50 rounded')
                                    .content('<div><label class="font-medium text-gray-600">First Name:</label><p class="text-gray-900" data-bind="firstName">Loading...</p></div>')
                                    .build(),
                                LayoutComponentDetailBuilder.create()
                                    .wrapper()
                                    .className('p-3 bg-gray-50 rounded')
                                    .content('<div><label class="font-medium text-gray-600">Last Name:</label><p class="text-gray-900" data-bind="lastName">Loading...</p></div>')
                                    .build(),
                                LayoutComponentDetailBuilder.create()
                                    .wrapper()
                                    .className('p-3 bg-gray-50 rounded')
                                    .content('<div><label class="font-medium text-gray-600">Email Address:</label><p class="text-gray-900" data-bind="email">Loading...</p></div>')
                                    .build(),
                                LayoutComponentDetailBuilder.create()
                                    .wrapper()
                                    .className('p-3 bg-gray-50 rounded')
                                    .content('<div><label class="font-medium text-gray-600">Account Type:</label><p class="text-gray-900" data-bind="accountType">Loading...</p></div>')
                                    .build(),
                            ])
                            .build(),
                    ])
                    .build(),

                // Company Information Section
                LayoutComponentDetailBuilder.create()
                    .wrapper()
                    .className('mb-6')
                    .addChildren([
                        LayoutComponentDetailBuilder.create()
                            .wrapper()
                            .content('<h2 class="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">🏢 Company Information</h2>')
                            .build(),
                        LayoutComponentDetailBuilder.create()
                            .wrapper()
                            .className('grid grid-cols-1 md:grid-cols-2 gap-4')
                            .addChildren([
                                LayoutComponentDetailBuilder.create()
                                    .wrapper()
                                    .className('p-3 bg-gray-50 rounded')
                                    .content('<div><label class="font-medium text-gray-600">Company Name:</label><p class="text-gray-900" data-bind="company.name">N/A</p></div>')
                                    .build(),
                                LayoutComponentDetailBuilder.create()
                                    .wrapper()
                                    .className('p-3 bg-gray-50 rounded')
                                    .content('<div><label class="font-medium text-gray-600">Address:</label><p class="text-gray-900" data-bind="company.address">N/A</p></div>')
                                    .build(),
                                LayoutComponentDetailBuilder.create()
                                    .wrapper()
                                    .className('p-3 bg-gray-50 rounded')
                                    .content('<div><label class="font-medium text-gray-600">City:</label><p class="text-gray-900" data-bind="company.city">N/A</p></div>')
                                    .build(),
                            ])
                            .build(),
                        LayoutComponentDetailBuilder.create()
                            .wrapper()
                            .className('mt-4')
                            .content('<div><h3 class="text-lg font-medium text-gray-700 mb-2">📞 Contact Numbers</h3><div class="space-y-2"><div data-repeat="company.phones"><div class="p-3 bg-gray-50 rounded flex justify-between"><span class="font-medium" data-bind="phoneNumber">Phone Number</span><span class="text-gray-600" data-bind="phoneType">Type</span></div></div></div></div>')
                            .build(),
                    ])
                    .build(),
            ])
            .build(),

        // Action Buttons
        LayoutComponentDetailBuilder.create()
            .wrapper()
            .className('flex justify-center space-x-4')
            .addChildren([
                LayoutComponentDetailBuilder.create()
                    .button()
                    .content('✏️ Edit User')
                    .className('px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors')
                    .event({
                        onClick: Actions.navigate('/user/edit/:userId', {userId: 'fromContext'}).build()
                    })
                    .build(),
                LayoutComponentDetailBuilder.create()
                    .button()
                    .content('📋 User List')
                    .className('px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors')
                    .event({
                        onClick: Actions.navigate('/users').build()
                    })
                    .build(),
            ])
            .build(),
    ])
    .build();
