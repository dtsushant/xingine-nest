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

      // Create inspector service with mocked dependencies
      const testInspectorService = new XingineInspectorService(
        mockDiscoveryService,
        mockMetadataScanner,
        mockReflector
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
  });
});