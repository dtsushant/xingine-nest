import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { LayoutComponentDetail } from 'xingine';

@ApiTags('dynamic')
@Controller('api')
export class DynamicController {
  constructor(private readonly userService: UserService) {}

  @Post('dynamic')
  @ApiOperation({ summary: 'Dynamic component endpoint for xingine-react APIRenderer' })
  async getDynamicComponent(@Body() params: any): Promise<{ success: boolean; result?: LayoutComponentDetail; error?: string }> {
    try {
      // Extract userId from route params (e.g., /user/:userId)
      const userId = params.userId;

      if (!userId) {
        return {
          success: false,
          error: 'User ID is required'
        };
      }

      // Fetch user data
      const user = await this.userService.findOne(userId);

      // Return the USER_DETAIL_COMPONENT structure with user data
      const componentDetail: LayoutComponentDetail = {
        meta: {
          component: 'WrapperRenderer',
          properties: {
            className: 'min-h-full max-w-7xl mx-auto p-8 bg-gray-50',
            children: [
              // Page Header
              {
                meta: {
                  component: 'WrapperRenderer',
                  properties: {
                    className: 'bg-white shadow rounded-lg p-6 mb-6',
                    children: [
                      {
                        meta: {
                          component: 'WrapperRenderer',
                          properties: {
                            content: `<h1 class="text-3xl font-bold text-gray-900">👤 User Profile</h1>`
                          }
                        }
                      },
                      {
                        meta: {
                          component: 'WrapperRenderer',
                          properties: {
                            content: `<p class="text-gray-600 mt-2">Complete user information and details</p>`
                          }
                        }
                      }
                    ]
                  }
                }
              },

              // User Basic Info Section
              {
                meta: {
                  component: 'WrapperRenderer',
                  properties: {
                    className: 'bg-white shadow rounded-lg p-6 mb-6',
                    children: [
                      {
                        meta: {
                          component: 'WrapperRenderer',
                          properties: {
                            content: `<h2 class="text-xl font-semibold text-gray-800 mb-4">📋 Basic Information</h2>`
                          }
                        }
                      },
                      {
                        meta: {
                          component: 'WrapperRenderer',
                          properties: {
                            className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                            children: [
                              {
                                meta: {
                                  component: 'WrapperRenderer',
                                  properties: {
                                    className: 'p-3 bg-gray-50 rounded',
                                    content: `<div><label class="font-medium text-gray-600">Full Name:</label><p class="text-gray-900">${user.firstName} ${user.lastName}</p></div>`
                                  }
                                }
                              },
                              {
                                meta: {
                                  component: 'WrapperRenderer',
                                  properties: {
                                    className: 'p-3 bg-gray-50 rounded',
                                    content: `<div><label class="font-medium text-gray-600">Email:</label><p class="text-gray-900">${user.email}</p></div>`
                                  }
                                }
                              },
                              {
                                meta: {
                                  component: 'WrapperRenderer',
                                  properties: {
                                    className: 'p-3 bg-gray-50 rounded',
                                    content: `<div><label class="font-medium text-gray-600">Phone:</label><p class="text-gray-900">#{user.phone || 'N/A'}</p></div>`
                                  }
                                }
                              },
                              {
                                meta: {
                                  component: 'WrapperRenderer',
                                  properties: {
                                    className: 'p-3 bg-gray-50 rounded',
                                    content: `<div><label class="font-medium text-gray-600">Age:</label><p class="text-gray-900">#{user.age || 'N/A'}</p></div>`
                                  }
                                }
                              }
                            ]
                          }
                        }
                      }
                    ]
                  }
                }
              },

              // Company Information Section (only if user has company)
              ...(user.hasCompanyInfo && user.company ? [{
                meta: {
                  component: 'WrapperRenderer',
                  properties: {
                    className: 'bg-white shadow rounded-lg p-6 mb-6',
                    children: [
                      {
                        meta: {
                          component: 'WrapperRenderer',
                          properties: {
                            content: `<h2 class="text-xl font-semibold text-gray-800 mb-4">🏢 Company Information</h2>`
                          }
                        }
                      },
                      {
                        meta: {
                          component: 'WrapperRenderer',
                          properties: {
                            className: 'grid grid-cols-1 md:grid-cols-3 gap-4',
                            children: [
                              {
                                meta: {
                                  component: 'WrapperRenderer',
                                  properties: {
                                    className: 'p-3 bg-gray-50 rounded',
                                    content: `<div><label class="font-medium text-gray-600">Company Name:</label><p class="text-gray-900">${user.company.name}</p></div>`
                                  }
                                }
                              },
                              {
                                meta: {
                                  component: 'WrapperRenderer',
                                  properties: {
                                    className: 'p-3 bg-gray-50 rounded',
                                    content: `<div><label class="font-medium text-gray-600">Address:</label><p class="text-gray-900">${user.company.address || 'N/A'}</p></div>`
                                  }
                                }
                              },
                              {
                                meta: {
                                  component: 'WrapperRenderer',
                                  properties: {
                                    className: 'p-3 bg-gray-50 rounded',
                                    content: `<div><label class="font-medium text-gray-600">City:</label><p class="text-gray-900">${user.company.city || 'N/A'}</p></div>`
                                  }
                                }
                              }
                            ]
                          }
                        }
                      },
                      // Phone Numbers Section
                      ...(user.company.providePhoneNo && user.company.phones.length > 0 ? [{
                        meta: {
                          component: 'WrapperRenderer',
                          properties: {
                            className: 'mt-4',
                            content: `<div><h3 class="text-lg font-medium text-gray-700 mb-2">📞 Contact Numbers</h3><div class="space-y-2">${user.company.phones.getItems().map(phone =>
                              `<div class="p-3 bg-gray-50 rounded flex justify-between"><span class="font-medium">${phone.phoneNumber}</span><span class="text-gray-600">${phone.phoneType}</span></div>`
                            ).join('')}</div></div>`
                          }
                        }
                      }] : [])
                    ]
                  }
                }
              }] : [])
            ]
          }
        }
      };

      return {
        success: true,
        result: componentDetail
      };

    } catch (error) {
      console.error('Dynamic component error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate dynamic component'
      };
    }
  }
}
