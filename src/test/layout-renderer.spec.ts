import { Test, TestingModule } from '@nestjs/testing';
import { XingineModule } from '../xingine.module';
import { XingineInspectorService } from '../xingine-inspector.service';
import { LayoutRegistryService } from '../services/layout-registry.service';
import { LayoutComponentDetailBuilder, LayoutRendererBuilder, LayoutRenderer, Commissar } from 'xingine';

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

  describe('Complex LayoutRenderer Generation', () => {
    it('should generate a comprehensive LayoutRenderer with form, table, detail, and chart components', () => {
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

      // Create chart component using the builder
      const chartWrapperClass = `w-full h-[300px] bg-white p-4 shadow rounded`;
      const chartComponent = LayoutComponentDetailBuilder.create()
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
        .build();

      // Create form component using the builder
      const formComponent = LayoutComponentDetailBuilder.create()
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
        .build();

      // Create table component using the builder
      const tableComponent = LayoutComponentDetailBuilder.create()
        .table()
        .dataSourceUrl("/api/users")
        .columns([
          { title: "Name", dataIndex: "name", key: "name", sortable: true },
          { title: "Email", dataIndex: "email", key: "email", sortable: true },
          { title: "Role", dataIndex: "role", key: "role", sortable: true },
          { title: "Status", dataIndex: "active", key: "active" },
          { title: "Created", dataIndex: "createdAt", key: "createdAt" },
        ])
        .build();

      // Create detail component using the builder
      const detailComponent = LayoutComponentDetailBuilder.create()
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
        .build();

      // Create popup component using the builder
      const popupComponent = LayoutComponentDetailBuilder.create()
        .popup()
        .property("title", "User Profile Details")
        .property("triggerText", "View Full Profile")
        .property("width", 800)
        .property("height", 600)
        .property(
          "content",
          `
            <div class="flex items-center space-x-4">
              <img src="${userDetailData.profile.avatar}" alt="Profile" class="w-20 h-20 rounded-full">
              <div>
                <h2 class="text-2xl font-bold">${userDetailData.name}</h2>
                <p class="text-gray-600">${userDetailData.profile.department} Department</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h3 class="font-semibold mb-2">Contact Information</h3>
                <p><strong>Email:</strong> ${userDetailData.email}</p>
                <p><strong>Phone:</strong> ${userDetailData.profile.phone}</p>
              </div>
              <div>
                <h3 class="font-semibold mb-2">Role & Permissions</h3>
                <p><strong>Role:</strong> ${userDetailData.role}</p>
                <p><strong>Permissions:</strong> ${userDetailData.permissions.join(", ")}</p>
              </div>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Biography</h3>
              <p>${userDetailData.profile.bio}</p>
            </div>
          `,
        )
        .build();

      // Create comprehensive layout renderer using correct API
      const layoutRenderer: LayoutRenderer = LayoutRendererBuilder.create()
        .type("comprehensive-user-dashboard")
        .className("min-h-screen bg-gray-50")
        .addContentCommissar({
          ...chartComponent,
          path: "/dashboard/charts",
          permission: ["read"]
        })
        .addContentCommissar({
          ...formComponent,
          path: "/dashboard/form", 
          permission: ["write"]
        })
        .addContentCommissar({
          ...tableComponent,
          path: "/dashboard/table",
          permission: ["read"]
        })
        .addContentCommissar({
          ...detailComponent,
          path: "/dashboard/details",
          permission: ["read"]
        })
        .build();

      // Assertions to verify the generated layout renderer
      expect(layoutRenderer).toBeDefined();
      expect(layoutRenderer.type).toBe('comprehensive-user-dashboard');
      expect(layoutRenderer.style?.className).toContain('min-h-screen');
      expect(layoutRenderer.content).toBeDefined();
      expect(Array.isArray(layoutRenderer.content.meta)).toBe(true);
      expect(layoutRenderer.content.meta.length).toBe(4);

      // Verify chart component exists and has correct data
      const chartSection = layoutRenderer.content.meta[0];
      expect(chartSection.path).toBe('/dashboard/charts');
      expect(chartSection.permission).toContain('read');
      expect(chartSection.meta).toBeDefined();

      // Verify form component data
      const formSection = layoutRenderer.content.meta[1];
      expect(formSection.path).toBe('/dashboard/form');
      expect(formSection.permission).toContain('write');
      expect(formSection.meta).toBeDefined();

      // Verify table component data
      const tableSection = layoutRenderer.content.meta[2];
      expect(tableSection.path).toBe('/dashboard/table');
      expect(tableSection.meta).toBeDefined();

      // Verify detail component data
      const detailSection = layoutRenderer.content.meta[3];
      expect(detailSection.path).toBe('/dashboard/details');
      expect(detailSection.meta).toBeDefined();

      // Additional assertions to verify the data integrity
      expect(userFormFields).toHaveLength(3);
      expect(userFormFields[0].name).toBe('name');
      expect(userFormFields[1].name).toBe('email');
      expect(userFormFields[2].name).toBe('role');

      expect(userTableData).toHaveLength(2);
      expect(userTableData[0].name).toBe('John Doe');
      expect(userTableData[1].name).toBe('Jane Smith');

      expect(userDetailData.profile.department).toBe('Engineering');
      expect(userDetailData.permissions).toContain('admin');

      console.log('✅ LayoutRenderer generated successfully with comprehensive user dashboard components');
      console.log('📊 Chart component metadata:', chartComponent.meta?.component || 'No chart metadata');
      console.log('📝 Form fields:', userFormFields.length);
      console.log('📋 Table rows:', userTableData.length);
      console.log('👤 User detail fields:', userDetailData.profile ? 'Profile loaded' : 'No profile');
      console.log('🎯 Layout type:', layoutRenderer.type);
      console.log('📦 Content sections:', layoutRenderer.content.meta.length);
    });
  });
});