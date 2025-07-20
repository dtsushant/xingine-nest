# xingine-nest

A powerful NestJS extension for the Xingine framework that provides backend implementation for LayoutRenderer components and declarative UI generation through decorators.

## 🚀 Features

- **🎭 Decorator-Based UI Definition**: Use `@Provisioneer` and `@Commissar` decorators to define layouts and components
- **🏗️ LayoutRenderer System**: Complete backend implementation for header, sider, content, and footer components
- **🛣️ Route Generation**: Automatic React Router compatible route generation from controller metadata
- **🎨 Multiple Layout Types**: Support for default, login, and custom layouts
- **🔄 Backward Compatibility**: Seamless integration with existing Xingine functionality
- **📦 Type Safety**: Full TypeScript support with compile-time validation

## 📦 Installation

```bash
npm install xingine-nest
# or
yarn add xingine-nest
```

## 🏁 Quick Start

### 1. Import the Module

```typescript
import { Module } from '@nestjs/common';
import { XingineModule } from 'xingine-nest';

@Module({
  imports: [XingineModule],
  controllers: [UserController],
})
export class AppModule {}
```

### 2. Create a Controller with Layout

```typescript
import { Controller, Get } from '@nestjs/common';
import { Provisioneer, Commissar } from 'xingine-nest';
import { LayoutComponentDetailBuilder } from 'xingine';

@Provisioneer({ layout: 'default' })
@Controller('users')
export class UserController {
  
  @Commissar({ path: '/users/dashboard' })
  @Get('dashboard')
  getDashboard() {
    return LayoutComponentDetailBuilder.create()
      .chart()
      .charts([
        {
          type: "bar",
          title: "User Analytics",
          labels: ["Jan", "Feb", "Mar", "Apr"],
          datasets: [{
            label: "Active Users",
            data: [120, 190, 300, 500],
            backgroundColor: "#1890ff"
          }]
        }
      ])
      .build();
  }

  @Commissar({ 
    path: { 
      path: '/users/login', 
      overrideLayout: 'login' 
    } 
  })
  @Get('login')
  getLoginForm() {
    return LayoutComponentDetailBuilder.create()
      .form()
      .fields([
        {
          name: "username",
          label: "Username",
          inputType: "input",
          required: true
        },
        {
          name: "password", 
          label: "Password",
          inputType: "password",
          required: true
        }
      ])
      .action("handleLogin")
      .build();
  }
}
```

## 🎭 Decorators

### @Provisioneer

Controller-level decorator that assigns a layout to all methods in the controller.

```typescript
interface ProvisioneerOptions {
  layout: string; // 'default' | 'login' | custom layout name
  permissions?: string[];
  description?: string;
}

@Provisioneer({ layout: 'default' })
@Controller('api/users')
export class UserController {}
```

### @Commissar

Method-level decorator that defines the route and component for a controller method.

```typescript
interface CommissarOptions {
  path: string | PathProperties;
  component?: string;
  permissions?: string[];
}

interface PathProperties {
  path: string;
  overrideLayout?: string; // Override the Provisioneer layout
  isMenuItem?: boolean;
  icon?: IconMeta;
  label?: string;
}
```

**Simple Path:**
```typescript
@Commissar({ path: '/dashboard' })
@Get('dashboard')
getDashboard() { /* ... */ }
```

**Advanced Path with Layout Override:**
```typescript
@Commissar({ 
  path: { 
    path: '/login', 
    overrideLayout: 'login',
    isMenuItem: false 
  } 
})
@Get('login')
getLogin() { /* ... */ }
```

## 🏗️ Layout System

### Available Layouts

#### Default Layout
Complete application layout with header, sidebar, content, and footer.

```typescript
@Provisioneer({ layout: 'default' })
```

Features:
- **Header**: Navigation bar with search, user menu, dark mode toggle
- **Sidebar**: Collapsible navigation menu
- **Content**: Dynamic component rendering area
- **Footer**: Copyright, links, and version information

#### Login Layout
Simplified layout for authentication pages.

```typescript
@Provisioneer({ layout: 'login' })
```

Features:
- **Header**: Simple branding header
- **Content**: Centered content area
- **Footer**: Basic footer with links

### Custom Layouts

Register custom layouts with the layout registry:

```typescript
import { LayoutRegistryService } from 'xingine-nest';

// In your module or service
layoutRegistry.registerLayout('custom', customLayoutRenderer);
```

## 🛠️ Component Building

Use Xingine's builder pattern to create components:

### Form Components
```typescript
@Commissar({ path: '/users/create' })
@Post('create')
createUserForm() {
  return LayoutComponentDetailBuilder.create()
    .form()
    .fields([
      {
        name: "name",
        label: "Full Name", 
        inputType: "input",
        required: true
      },
      {
        name: "email",
        label: "Email Address",
        inputType: "input", 
        required: true,
        properties: { type: "email" }
      },
      {
        name: "role",
        label: "User Role",
        inputType: "select",
        properties: {
          options: [
            { label: "Admin", value: "admin" },
            { label: "User", value: "user" }
          ]
        }
      }
    ])
    .action("createUser")
    .build();
}
```

### Table Components
```typescript
@Commissar({ path: '/users/list' })
@Get('list')
getUserTable() {
  return LayoutComponentDetailBuilder.create()
    .table()
    .dataSourceUrl("/api/users/data")
    .columns([
      { title: "Name", dataIndex: "name", sortable: true },
      { title: "Email", dataIndex: "email", sortable: true },
      { title: "Role", dataIndex: "role", filterable: { apply: true } },
      { title: "Status", dataIndex: "active" }
    ])
    .build();
}
```

### Chart Components
```typescript
@Commissar({ path: '/analytics/dashboard' })
@Get('analytics')
getAnalytics() {
  return LayoutComponentDetailBuilder.create()
    .chart()
    .charts([
      {
        type: "line",
        title: "User Growth",
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [{
          label: "New Users",
          data: [65, 78, 90, 81, 120],
          borderColor: "#52c41a"
        }]
      },
      {
        type: "pie", 
        title: "User Distribution",
        labels: ["Admin", "User", "Guest"],
        datasets: [{
          data: [30, 60, 10],
          backgroundColor: ["#1890ff", "#52c41a", "#faad14"]
        }]
      }
    ])
    .build();
}
```

### Complex Nested Components
```typescript
@Commissar({ path: '/dashboard/overview' })
@Get('overview')
getDashboardOverview() {
  const chartComponent = LayoutComponentDetailBuilder.create()
    .chart()
    .charts([/* chart config */])
    .build();

  const tableComponent = LayoutComponentDetailBuilder.create()
    .table()
    .dataSourceUrl("/api/recent-activity")
    .columns([/* columns */])
    .build();

  return LayoutComponentDetailBuilder.create()
    .wrapper()
    .className("dashboard-overview")
    .addChild(
      LayoutComponentDetailBuilder.create()
        .wrapper()
        .className("grid grid-cols-1 md:grid-cols-2 gap-6")
        .addChild(chartComponent)
        .addChild(tableComponent)
        .build()
    )
    .build();
}
```

## 🔧 API Endpoints

xingine-nest automatically generates API endpoints for layout management:

### Get All Layouts
```http
GET /layouts
```

Returns all available LayoutRenderer configurations.

### Get Specific Layout
```http
GET /layouts/:type
```

Returns a specific layout configuration.

### Scan and Build Layouts
```http
POST /layouts/scan
```

Scans all controllers and rebuilds layout configurations.

## 🧪 Development & Testing

### Build the Project
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Development Mode
```bash
npm run yalc:dev
```

### Lint Code
```bash
npm run lint
```

## 📚 Advanced Usage

### Layout Inheritance
```typescript
// Base controller with default layout
@Provisioneer({ layout: 'default' })
@Controller('base')
export class BaseController {
  
  @Commissar({ path: '/dashboard' })
  @Get('dashboard')
  getDashboard() { /* inherits default layout */ }
  
  @Commissar({ 
    path: { path: '/login', overrideLayout: 'login' } 
  })
  @Get('login') 
  getLogin() { /* overrides to login layout */ }
}
```

### Permission Integration
```typescript
@Provisioneer({ 
  layout: 'default',
  permissions: ['admin'] 
})
@Controller('admin')
export class AdminController {
  
  @Commissar({ 
    path: '/admin/users',
    permissions: ['user.manage']
  })
  @Get('users')
  getUserManagement() { /* ... */ }
}
```

### Dynamic Component Generation
```typescript
@Commissar({ path: '/dynamic/:type' })
@Get('dynamic/:type')
getDynamicComponent(@Param('type') type: string) {
  switch(type) {
    case 'chart':
      return this.buildChartComponent();
    case 'table': 
      return this.buildTableComponent();
    default:
      return this.buildDefaultComponent();
  }
}
```

## 🔗 Integration with Frontend

The generated LayoutRenderer objects are compatible with xingine-react:

```typescript
// Frontend usage
import { getCommissarredRoutes } from 'xingine-react';

const layouts = await fetch('/api/layouts').then(r => r.json());
const routes = getCommissarredRoutes(layouts);

// Use with React Router
<BrowserRouter>
  <Routes>
    {routes.map(route => (
      <Route key={route.path} {...route} />
    ))}
  </Routes>
</BrowserRouter>
```

## 🚀 Migration Guide

### From Existing xingine-nest
The new decorator system is fully backward compatible. Existing functionality continues to work unchanged.

### Gradual Adoption
1. Add `@Provisioneer` to existing controllers
2. Convert methods to use `@Commissar` decorator
3. Migrate component definitions to use builders
4. Test layout generation and routes

## 📖 API Reference

### Services

#### XingineInspectorService
- `scanProvisioneerControllers()`: Find all @Provisioneer controllers
- `extractCommissarRoutes()`: Extract all @Commissar methods  
- `buildLayoutRenderer()`: Generate LayoutRenderer from metadata
- `validateLayoutConfiguration()`: Validate layout setup

#### LayoutRegistryService
- `registerLayout(name, renderer)`: Register a custom layout
- `getLayout(name)`: Get layout by name
- `getAllLayouts()`: Get all registered layouts

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [xingine](https://github.com/dtsushant/xingine) - Core Xingine framework
- [xingine-react](https://github.com/dtsushant/xingine-react) - React components for Xingine

## 📞 Support

- 📧 Email: support@xingine.dev
- 💬 Discord: [Xingine Community](https://discord.gg/xingine)
- 📝 Issues: [GitHub Issues](https://github.com/dtsushant/xingine-nest/issues)

---

**Made with ❤️ by the Xingine Team**