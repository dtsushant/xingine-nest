import { Test, TestingModule } from '@nestjs/testing';
import { XingineModule } from '../xingine.module';
import { XingineInspectorService } from '../xingine-inspector.service';
import { LayoutRegistryService } from '../services/layout-registry.service';
import { LayoutComponentDetailBuilder, LayoutRendererBuilder, LayoutRenderer, Commissar } from 'xingine';
import { Controller, Get, Post, RequestMethod } from '@nestjs/common';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Provisioneer, Commissar as CommissarDecorator } from '../xingine-nest.decorator';

describe('LayoutRenderer System', () => {
  let module: TestingModule;
  let inspectorService: XingineInspectorService;
  let layoutRegistry: LayoutRegistryService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [XingineModule],
    }).compile();

    inspectorService = module.get<XingineInspectorService>(XingineInspectorService);
    layoutRegistry = module.get<LayoutRegistryService>(LayoutRegistryService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('Layout Registry Service', () => {
    it('should be defined', () => {
      expect(layoutRegistry).toBeDefined();
    });

    it('should have pre-registered default layouts', () => {
      expect(layoutRegistry.hasLayout('default')).toBe(true);
      expect(layoutRegistry.hasLayout('login')).toBe(true);
    });

    it('should return layout names', () => {
      const names = layoutRegistry.getLayoutNames();
      expect(names).toContain('default');
      expect(names).toContain('login');
    });
  });

  describe('Inspector Service', () => {
    it('should be defined', () => {
      expect(inspectorService).toBeDefined();
    });

    it('should have getAllLayoutRenderers method', () => {
      expect(typeof inspectorService.getAllLayoutRenderers).toBe('function');
    });

    it('should return layout renderers array', () => {
      const layouts = inspectorService.getAllLayoutRenderers();
      expect(Array.isArray(layouts)).toBe(true);
    });
  });

  describe('Complex LayoutRenderer Generation from Controller', () => {
    it('should extract comprehensive LayoutRenderer from controller using @Provisioneer and @Commissar decorators', () => {
      // Test data as provided by the user
      const userFormFields = [
        {
          name: "name",
          label: "Name",
          inputType: "input" as const,
          required: true,
          properties: {},
        },
        {
          name: "email",
          label: "Email",
          inputType: "input" as const,
          required: true,
          properties: {},
        },
        {
          name: "role",
          label: "Role",
          inputType: "select" as const,
          properties: {},
        },
      ];

      const userTableData = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "Admin",
          active: true,
          createdAt: "2024-01-01",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "User",
          active: true,
          createdAt: "2024-01-02",
        },
      ];

      const userDetailData = {
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
        active: true,
        createdAt: "2024-01-01",
        lastLogin: "2024-01-15T10:30:00Z",
        profile: {
          avatar: "https://example.com/avatar.jpg",
          department: "Engineering",
          phone: "+1-555-0123",
          bio: "Software engineer with 5 years of experience in web development.",
        },
        permissions: ["read", "write", "admin"],
      };

      // Create test controller class with complex components
      const chartWrapperClass = `w-full h-[300px] bg-white p-4 shadow rounded`;
      
      @Provisioneer({ layout: 'comprehensive-user-dashboard' })
      @Controller('user-dashboard')
      class ComplexUserDashboardController {
        
        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .chart()
            .charts([
              {
                type: "bar",
                height: 300,
                width: 300,
                title: "Sales Performance",
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Sales",
                    data: [4000, 3000, 2000, 2780, 1890, 2390],
                    backgroundColor: "#1890ff",
                  },
                ],
                style: {
                  className: chartWrapperClass
                }
              },
              {
                type: "line",
                title: "User Growth",
                height: 300,
                width: 300,
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Users",
                    data: [240, 221, 229, 200, 218, 250],
                    borderColor: "#52c41a",
                  },
                ],
                style: {
                  className: chartWrapperClass
                }
              },
              {
                type: "pie",
                title: "Device Distribution",
                height: 300,
                width: 300,
                datasets: [
                  {
                    label: "Devices",
                    data: [400, 300, 300, 200],
                    backgroundColor: "#1890ff",
                  },
                ],
                style: {
                  className: chartWrapperClass
                },
                labels: ["Desktop", "Mobile", "Tablet", "Other"],
              },
              {
                type: "scatter",
                title: "Revenue Analysis",
                height: 300,
                width: 300,
                labels: ["Q1", "Q2", "Q3", "Q4"],
                datasets: [
                  {
                    label: "Revenue",
                    data: [
                      { x: 1, y: 2400 },
                      { x: 2, y: 1398 },
                      { x: 3, y: 9800 },
                      { x: 4, y: 3908 },
                    ],
                    backgroundColor: "#722ed1",
                  },
                ],
                style: {
                  className: chartWrapperClass
                }
              },
            ])
            .build(),
          preAction: 'validateChartAccess'
        })
        @Get('charts')
        getCharts() {
          return { message: 'Chart data loaded' };
        }

        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .withMeta("FormRenderer", {
              action: "handleUserCreate",
              fields: userFormFields,
              event: {
                onSubmit: {
                  action: 'navigate',
                  args: {
                    path: '/thank-you'
                  }
                },
              },
              properties: {
                title: "Create User",
                submitText: "Create User",
                className: "bg-white dark:bg-gray-800 p-6 rounded-lg shadow",
              },
            } as any)
            .build(),
          postAction: 'logUserCreation'
        })
        @Post('form')
        createUser() {
          return { message: 'User creation form' };
        }

        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .table()
            .dataSourceUrl("/api/users")
            .columns([
              { title: "Name", dataIndex: "name", key: "name", sortable: true },
              { title: "Email", dataIndex: "email", key: "email", sortable: true },
              { title: "Role", dataIndex: "role", key: "role", sortable: true },
              { title: "Status", dataIndex: "active", key: "active" },
              { title: "Created", dataIndex: "createdAt", key: "createdAt" },
            ])
            .build()
        })
        @Get('table')
        getUserTable() {
          return userTableData;
        }

        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .detailRenderer()
            .action("viewUser")
            .fields([
              { name: "name", label: "Name", inputType: "text" as const, properties: {} },
              {
                name: "email",
                label: "Email",
                inputType: "text" as const,
                properties: {},
              },
              {
                name: "role",
                label: "Role",
                inputType: "badge" as const,
                properties: {},
              },
              {
                name: "active",
                label: "Status",
                inputType: "switch" as const,
                properties: {},
              },
              {
                name: "createdAt",
                label: "Created",
                inputType: "date" as const,
                properties: {},
              },
              {
                name: "lastLogin",
                label: "Last Login",
                inputType: "date" as const,
                properties: {},
              },
            ])
            .build(),
          preAction: 'checkUserPermissions',
          postAction: 'trackUserView'
        })
        @Get('details/:id')
        getUserDetails() {
          return userDetailData;
        }

        // Action methods
        validateChartAccess() {
          console.log('Validating chart access...');
        }

        logUserCreation() {
          console.log('Logging user creation...');
        }

        checkUserPermissions() {
          console.log('Checking user permissions...');
        }

        trackUserView() {
          console.log('Tracking user detail view...');
        }
      }

      // Mock the discovery service to return our test controller
      const mockDiscoveryService = {
        getControllers: () => [{ metatype: ComplexUserDashboardController }],
        getProviders: () => []
      } as any;

      const mockMetadataScanner = {} as any;
      const mockReflector = {
        get: jest.fn().mockImplementation((metadata, target) => {
          if (metadata === PATH_METADATA) {
            if (target === ComplexUserDashboardController) {
              return 'user-dashboard';
            }
            // Return method-specific paths
            const methodName = target?.name || '';
            if (methodName === 'getCharts') return 'charts';
            if (methodName === 'createUser') return 'form';
            if (methodName === 'getUserTable') return 'table';
            if (methodName === 'getUserDetails') return 'details/:id';
          }
          if (metadata === METHOD_METADATA) {
            const methodName = target?.name || '';
            if (methodName === 'getCharts') return RequestMethod.GET;
            if (methodName === 'createUser') return RequestMethod.POST;
            if (methodName === 'getUserTable') return RequestMethod.GET;
            if (methodName === 'getUserDetails') return RequestMethod.GET;
          }
          return undefined;
        })
      } as any;

      // Create mock layout registry service
      const mockLayoutRegistryService = {
        hasLayout: jest.fn().mockImplementation((name: string) => {
          return name === 'default' || name === 'comprehensive-user-dashboard';
        }),
        getLayoutWithFallback: jest.fn().mockImplementation((name: string) => {
          if (name === 'comprehensive-user-dashboard') {
            return LayoutRendererBuilder.create()
              .type('comprehensive-user-dashboard')
              .withContent([], { className: 'layout-content' })
              .className('layout-comprehensive-user-dashboard')
              .build();
          }
          return LayoutRendererBuilder.create()
            .type('default')
            .withContent([], { className: 'layout-content' })
            .className('layout-default')
            .build();
        })
      } as any;

      // Create inspector service with mocked dependencies
      const testInspectorService = new XingineInspectorService(
        mockDiscoveryService,
        mockMetadataScanner,
        mockReflector,
        mockLayoutRegistryService
      );

      // Extract layout renderers from the controller
      const layoutRenderers = testInspectorService.getAllLayoutRenderers();

      // Assertions to verify the extracted layout renderer
      expect(layoutRenderers).toBeDefined();
      expect(Array.isArray(layoutRenderers)).toBe(true);
      expect(layoutRenderers.length).toBeGreaterThan(0);

      // Find our comprehensive dashboard layout
      const dashboardLayout = layoutRenderers.find(lr => lr.type === 'comprehensive-user-dashboard');
      expect(dashboardLayout).toBeDefined();

      // Verify content structure
      expect(dashboardLayout!.content).toBeDefined();
      expect(Array.isArray(dashboardLayout!.content.meta)).toBe(true);
      expect(dashboardLayout!.content.meta.length).toBe(4);

      // Verify chart component
      const chartRoute = dashboardLayout!.content.meta.find(route => {
        const path = typeof route.path === 'string' ? route.path : route.path?.path;
        return path?.includes('charts');
      });
      expect(chartRoute).toBeDefined();
      expect(chartRoute!.meta).toBeDefined();

      // Verify form component  
      const formRoute = dashboardLayout!.content.meta.find(route => {
        const path = typeof route.path === 'string' ? route.path : route.path?.path;
        return path?.includes('form');
      });
      expect(formRoute).toBeDefined();
      expect(formRoute!.meta).toBeDefined();

      // Verify table component
      const tableRoute = dashboardLayout!.content.meta.find(route => {
        const path = typeof route.path === 'string' ? route.path : route.path?.path;
        return path?.includes('table');
      });
      expect(tableRoute).toBeDefined();
      expect(tableRoute!.meta).toBeDefined();

      // Verify detail component
      const detailRoute = dashboardLayout!.content.meta.find(route => {
        const path = typeof route.path === 'string' ? route.path : route.path?.path;
        return path?.includes('details');
      });
      expect(detailRoute).toBeDefined();
      expect(detailRoute!.meta).toBeDefined();

      // Additional data integrity assertions
      expect(userFormFields).toHaveLength(3);
      expect(userFormFields[0].name).toBe('name');
      expect(userFormFields[1].name).toBe('email');
      expect(userFormFields[2].name).toBe('role');

      expect(userTableData).toHaveLength(2);
      expect(userTableData[0].name).toBe('John Doe');
      expect(userTableData[1].name).toBe('Jane Smith');

      expect(userDetailData.profile.department).toBe('Engineering');
      expect(userDetailData.permissions).toContain('admin');

      console.log('✅ LayoutRenderer extracted successfully from controller with @Provisioneer and @Commissar decorators');
      console.log('🎯 Layout type:', dashboardLayout!.type);
      console.log('📦 Content sections extracted:', dashboardLayout!.content.meta.length);
      console.log('📊 Chart route found:', !!chartRoute);
      console.log('📝 Form route found:', !!formRoute);
      console.log('📋 Table route found:', !!tableRoute);
      console.log('👤 Detail route found:', !!detailRoute);
    });

    it('should extract LayoutRenderer with @Provisioneer using default layout', () => {
      // Create test controller using default layout
      @Provisioneer({ layout: 'default' })
      @Controller('default-test')
      class DefaultLayoutController {
        
        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .table()
            .columns([
              { title: 'ID', dataIndex: 'id', key: 'id' },
              { title: 'Name', dataIndex: 'name', key: 'name' }
            ])
            .build()
        })
        @Get('users')
        getUsers() {
          return [{ id: 1, name: 'Test User' }];
        }

        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .withMeta('FormRenderer', {
              action: 'createUser',
              fields: [
                { name: 'name', label: 'Name', inputType: 'input' as const, properties: {} }
              ]
            } as any)
            .build()
        })
        @Post('create')
        createUser() {
          return { message: 'User created' };
        }
      }

      // Mock discovery service
      const mockDiscoveryService = {
        getControllers: () => [{ metatype: DefaultLayoutController }],
        getProviders: () => []
      } as any;

      const mockMetadataScanner = {} as any;
      const mockReflector = {
        get: jest.fn().mockImplementation((metadata, target) => {
          if (metadata === PATH_METADATA) {
            if (target === DefaultLayoutController) {
              return 'default-test';
            }
            const methodName = target?.name || '';
            if (methodName === 'getUsers') return 'users';
            if (methodName === 'createUser') return 'create';
          }
          if (metadata === METHOD_METADATA) {
            const methodName = target?.name || '';
            if (methodName === 'getUsers') return RequestMethod.GET;
            if (methodName === 'createUser') return RequestMethod.POST;
          }
          return undefined;
        })
      } as any;

      // Mock layout registry service
      const mockLayoutRegistryService = {
        hasLayout: jest.fn().mockImplementation((name: string) => {
          return name === 'default' || name === 'login';
        }),
        getLayoutWithFallback: jest.fn().mockImplementation((name: string) => {
          return LayoutRendererBuilder.create()
            .type('default')
            .withContent([], { className: 'layout-content' })
            .className('layout-default')
            .build();
        })
      } as any;

      // Create inspector service
      const testInspectorService = new XingineInspectorService(
        mockDiscoveryService,
        mockMetadataScanner,
        mockReflector,
        mockLayoutRegistryService
      );

      // Extract layout renderers
      const layoutRenderers = testInspectorService.getAllLayoutRenderers();

      // Assertions
      expect(layoutRenderers).toBeDefined();
      expect(layoutRenderers.length).toBeGreaterThan(0);
      
      const defaultLayout = layoutRenderers.find(lr => lr.type === 'default');
      expect(defaultLayout).toBeDefined();
      expect(defaultLayout!.content.meta).toBeDefined();
      expect(defaultLayout!.content.meta.length).toBe(2); // table + form components

      // Verify mockLayoutRegistryService.hasLayout was called with 'default'
      expect(mockLayoutRegistryService.hasLayout).toHaveBeenCalledWith('default');
      expect(mockLayoutRegistryService.getLayoutWithFallback).toHaveBeenCalledWith('default');

      console.log('✅ Default layout extraction successful');
      console.log('📦 Default layout content sections:', defaultLayout!.content.meta.length);
    });

    it('should extract LayoutRenderer with @Provisioneer using client-registered layout', () => {
      // Create custom layout that would be registered by client application
      const customClientLayout = LayoutRendererBuilder.create()
        .type('tailwind-custom')
        .withContent([], { className: 'tailwind-layout-content bg-gray-100' })
        .style({ className: 'layout-tailwind-custom' })
        .withHeader(
          LayoutComponentDetailBuilder.create()
            .wrapper()
            .content('Tailwind Dashboard')
            .style({ className: 'bg-blue-500 text-white' })
            .build(),
          { className: 'bg-blue-500 text-white' }
        )
        .build();

      // Create test controller using client-registered layout
      @Provisioneer({ layout: 'tailwind-custom' })
      @Controller('client-layout-test')
      class ClientLayoutController {
        
        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .chart()
            .charts([{
              type: 'bar',
              title: 'Performance Metrics',
              height: 250,
              width: 400,
              labels: ['Q1', 'Q2', 'Q3', 'Q4'],
              datasets: [{
                label: 'Revenue',
                data: [1000, 1200, 1500, 1800],
                backgroundColor: '#3B82F6'
              }]
            }])
            .build()
        })
        @Get('dashboard')
        getDashboard() {
          return { revenue: [1000, 1200, 1500, 1800] };
        }

        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .detailRenderer()
            .action('viewProfile')
            .fields([
              { name: 'username', label: 'Username', inputType: 'text' as const, properties: {} },
              { name: 'email', label: 'Email', inputType: 'text' as const, properties: {} }
            ])
            .build()
        })
        @Get('profile/:id')
        getProfile() {
          return { username: 'testuser', email: 'test@example.com' };
        }
      }

      // Mock discovery service
      const mockDiscoveryService = {
        getControllers: () => [{ metatype: ClientLayoutController }],
        getProviders: () => []
      } as any;

      const mockMetadataScanner = {} as any;
      const mockReflector = {
        get: jest.fn().mockImplementation((metadata, target) => {
          if (metadata === PATH_METADATA) {
            if (target === ClientLayoutController) {
              return 'client-layout-test';
            }
            const methodName = target?.name || '';
            if (methodName === 'getDashboard') return 'dashboard';
            if (methodName === 'getProfile') return 'profile/:id';
          }
          if (metadata === METHOD_METADATA) {
            const methodName = target?.name || '';
            if (methodName === 'getDashboard') return RequestMethod.GET;
            if (methodName === 'getProfile') return RequestMethod.GET;
          }
          return undefined;
        })
      } as any;

      // Mock layout registry service with client-registered layout
      const mockLayoutRegistryService = {
        hasLayout: jest.fn().mockImplementation((name: string) => {
          return name === 'default' || name === 'login' || name === 'tailwind-custom';
        }),
        getLayoutWithFallback: jest.fn().mockImplementation((name: string) => {
          if (name === 'tailwind-custom') {
            return customClientLayout;
          }
          return LayoutRendererBuilder.create()
            .type('default')
            .withContent([], { className: 'layout-content' })
            .style({ className: 'layout-default' })
            .build();
        })
      } as any;

      // Create inspector service
      const testInspectorService = new XingineInspectorService(
        mockDiscoveryService,
        mockMetadataScanner,
        mockReflector,
        mockLayoutRegistryService
      );

      // Extract layout renderers
      const layoutRenderers = testInspectorService.getAllLayoutRenderers();

      // Assertions
      expect(layoutRenderers).toBeDefined();
      expect(layoutRenderers.length).toBeGreaterThan(0);
      
      const clientLayout = layoutRenderers.find(lr => lr.type === 'tailwind-custom');
      expect(clientLayout).toBeDefined();
      expect(clientLayout!.content.meta).toBeDefined();
      expect(clientLayout!.content.meta.length).toBe(2); // chart + detail components

      // Verify client layout properties are preserved
      expect(clientLayout!.style?.className).toBe('layout-tailwind-custom');
      expect(clientLayout!.header?.meta).toBeDefined();
      
      // Verify registry was checked for client layout
      expect(mockLayoutRegistryService.hasLayout).toHaveBeenCalledWith('tailwind-custom');
      expect(mockLayoutRegistryService.getLayoutWithFallback).toHaveBeenCalledWith('tailwind-custom');

      console.log('✅ Client-registered layout extraction successful');
      console.log('🎨 Custom layout type:', clientLayout!.type);
      console.log('📦 Custom layout content sections:', clientLayout!.content.meta.length);
      console.log('🏠 Custom layout has header:', !!clientLayout!.header?.meta);
    });

    it('should handle @Commissar layout override - content should be listed in overridden layout', () => {
      // Create test controller with layout override scenario
      @Provisioneer({ layout: 'default' })
      @Controller('override-test')
      class LayoutOverrideController {
        
        // This component should go to default layout
        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .table()
            .columns([
              { title: 'ID', dataIndex: 'id', key: 'id' },
              { title: 'Title', dataIndex: 'title', key: 'title' }
            ])
            .build()
        })
        @Get('posts')
        getPosts() {
          return [{ id: 1, title: 'Test Post' }];
        }

        // This component should override to admin layout
        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .withMeta('FormRenderer', {
              action: 'adminAction',
              fields: [
                { name: 'adminField', label: 'Admin Field', inputType: 'input' as const, properties: {} }
              ]
            } as any)
            .build(),
          path: {
            path: '/admin/settings',
            overrideLayout: 'admin',
            label: 'Admin Settings',
            isMenuItem: true
          }
        })
        @Get('admin-settings')
        getAdminSettings() {
          return { message: 'Admin settings' };
        }

        // This component should also override to admin layout
        @CommissarDecorator({
          component: LayoutComponentDetailBuilder.create()
            .chart()
            .charts([{
              type: 'line',
              title: 'Admin Analytics',
              height: 300,
              width: 500,
              labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
              datasets: [{
                label: 'Admin Metrics',
                data: [50, 75, 100, 125],
                borderColor: '#EF4444'
              }]
            }])
            .build(),
          path: {
            path: '/admin/analytics',
            overrideLayout: 'admin',
            label: 'Admin Analytics'
          }
        })
        @Get('admin-analytics')
        getAdminAnalytics() {
          return { analytics: [50, 75, 100, 125] };
        }
      }

      // Mock discovery service
      const mockDiscoveryService = {
        getControllers: () => [{ metatype: LayoutOverrideController }],
        getProviders: () => []
      } as any;

      const mockMetadataScanner = {} as any;
      const mockReflector = {
        get: jest.fn().mockImplementation((metadata, target) => {
          if (metadata === PATH_METADATA) {
            if (target === LayoutOverrideController) {
              return 'override-test';
            }
            const methodName = target?.name || '';
            if (methodName === 'getPosts') return 'posts';
            if (methodName === 'getAdminSettings') return 'admin-settings';
            if (methodName === 'getAdminAnalytics') return 'admin-analytics';
          }
          if (metadata === METHOD_METADATA) {
            const methodName = target?.name || '';
            if (methodName === 'getPosts') return RequestMethod.GET;
            if (methodName === 'getAdminSettings') return RequestMethod.GET;
            if (methodName === 'getAdminAnalytics') return RequestMethod.GET;
          }
          return undefined;
        })
      } as any;

      // Create admin layout for override testing
      const mockAdminLayout = LayoutRendererBuilder.create()
        .type('admin')
        .withContent([], { className: 'admin-layout-content' })
        .style({ className: 'layout-admin' })
        .withHeader(
          LayoutComponentDetailBuilder.create()
            .wrapper()
            .content('Admin Dashboard')
            .style({ className: 'bg-red-600 text-white' })
            .build(),
          { className: 'bg-red-600 text-white' }
        )
        .build();

      // Mock layout registry service with both default and admin layouts
      const mockLayoutRegistryService = {
        hasLayout: jest.fn().mockImplementation((name: string) => {
          return name === 'default' || name === 'login' || name === 'admin';
        }),
        getLayoutWithFallback: jest.fn().mockImplementation((name: string) => {
          if (name === 'admin') {
            return mockAdminLayout;
          }
          return LayoutRendererBuilder.create()
            .type('default')
            .withContent([], { className: 'layout-content' })
            .style({ className: 'layout-default' })
            .build();
        })
      } as any;

      // Create inspector service
      const testInspectorService = new XingineInspectorService(
        mockDiscoveryService,
        mockMetadataScanner,
        mockReflector,
        mockLayoutRegistryService
      );

      // Extract layout renderers
      const layoutRenderers = testInspectorService.getAllLayoutRenderers();

      // Assertions
      expect(layoutRenderers).toBeDefined();
      expect(layoutRenderers.length).toBeGreaterThanOrEqual(2); // Should have at least default and admin
      
      // Should have default layout with 1 component (posts table)
      const defaultLayout = layoutRenderers.find(lr => lr.type === 'default');
      expect(defaultLayout).toBeDefined();
      expect(defaultLayout!.content.meta.length).toBe(1); // Only posts table

      // Should have admin layout with 2 components (admin settings form + admin analytics chart)
      const adminLayoutResult = layoutRenderers.find(lr => lr.type === 'admin');
      expect(adminLayoutResult).toBeDefined();
      expect(adminLayoutResult!.content.meta.length).toBe(2); // Admin settings + admin analytics

      // Verify admin layout properties
      expect(adminLayoutResult!.style?.className).toBe('layout-admin');
      expect(adminLayoutResult!.header?.meta).toBeDefined();

      // Verify that layout registry was checked for both layouts
      expect(mockLayoutRegistryService.hasLayout).toHaveBeenCalledWith('default');
      expect(mockLayoutRegistryService.hasLayout).toHaveBeenCalledWith('admin');

      // Find specific routes in admin layout
      const adminSettingsRoute = adminLayoutResult!.content.meta.find(route => {
        const path = typeof route.path === 'string' ? route.path : route.path?.path;
        return path?.includes('admin/settings');
      });
      
      const adminAnalyticsRoute = adminLayoutResult!.content.meta.find(route => {
        const path = typeof route.path === 'string' ? route.path : route.path?.path;
        return path?.includes('admin/analytics');
      });

      expect(adminSettingsRoute).toBeDefined();
      expect(adminAnalyticsRoute).toBeDefined();

      console.log('✅ Layout override test completed');
      console.log('📦 Default layout content sections:', defaultLayout!.content.meta.length);
      console.log('🔧 Admin layout content sections:', adminLayoutResult!.content.meta.length);
      
      // Log which components were found in each layout
      console.log('🏠 Default layout routes:');
      defaultLayout!.content.meta.forEach((route, index) => {
        const path = typeof route.path === 'string' ? route.path : route.path?.path;
        console.log(`  🔗 Route ${index + 1}: ${path}`);
      });
      
      console.log('🔧 Admin layout routes:');
      adminLayoutResult!.content.meta.forEach((route, index) => {
        const path = typeof route.path === 'string' ? route.path : route.path?.path;
        console.log(`  🔗 Route ${index + 1}: ${path}`);
      });
    });
  });
});