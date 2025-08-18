# Xingine-Nest Context & Architecture Documentation

## 📋 Overview

Xingine-Nest is a NestJS integration layer for the Xingine framework that enables declarative UI generation, layout management, and dynamic component rendering within NestJS applications. It bridges the gap between backend API logic and frontend UI structure through decorators and metadata-driven approaches.

## 🏗️ Core Architecture

### 1. **Module System**
```typescript
@Module({
  imports: [XingineModule],
  // ... other modules
})
export class AppModule {}
```

The `XingineModule` provides:
- **Layout Registry Service**: Manages layout templates and component registrations
- **Xingine Inspector Service**: Scans controllers for metadata and builds component trees
- **Layout Controller**: Exposes layout endpoints for frontend consumption
- **Commissar Action Interceptor**: Handles action execution and response formatting

### 2. **Decorator-Based Component Declaration**

#### **@Provisioneer Decorator**
Declares layout types for controllers:
```typescript
@Provisioneer({ layout: 'dashboard' })
@Controller('admin')
export class AdminController {
  // All methods inherit dashboard layout
}
```

#### **@Commissar Decorator**
Defines UI components and their behavior:
```typescript
@Commissar({
  path: '/admin/users',
  component: {
    meta: {
      rendererType: 'ButtonRenderer',
      content: 'User Management',
      properties: {
        className: 'btn btn-primary'
      },
      event: {
        onClick: {
          type: 'navigate',
          payload: { path: '/admin/users' }
        }
      }
    }
  }
})
@Get('users')
getUserList() {
  // Business logic
}
```

### 3. **Layout System Architecture**

#### **TypedLayoutExposition**
The core data structure that maps controller metadata to UI components:
```typescript
interface TypedLayoutExposition {
  type: string;           // Layout type (dashboard, public, minimal)
  presidium?: string;     // Header component key
  assembly: string[];     // Content component keys (from @Commissar)
  sider?: string;         // Sidebar component key
  doctrine?: string;      // Footer component key
}
```

#### **LayoutRenderer**
The final UI structure consumed by frontend frameworks:
```typescript
interface LayoutRenderer {
  type: string;
  header?: { meta: LayoutComponentDetail; style?: any };
  content: { meta: LayoutComponentDetail[]; style?: any };
  sider?: { meta: LayoutComponentDetail; style?: any };
  footer?: { meta: LayoutComponentDetail; style?: any };
  style?: any;
}
```

## 🔄 Data Flow & Processing Pipeline

### 1. **Controller Scanning Phase**
```
Controllers with @Provisioneer → Discovery Service → Metadata Extraction
```

The `XingineInspectorService` uses NestJS's `DiscoveryService` to:
- Find all controllers with `@Provisioneer` decorators
- Group them by layout type
- Extract route metadata and component definitions

### 2. **Component Registration Phase**
```
@Commissar Metadata → Component Registry → Unique Keys
```

Each `@Commissar` decorator generates:
- **Component Key**: `${layoutType}_commissar_${index}` or `${layoutType}_override_${index}`
- **Component Definition**: Complete UI component specification
- **Path Mapping**: Route path to component association

### 3. **Layout Assembly Phase**
```
Base Layout + Registered Components → TypedLayoutExposition → LayoutRenderer
```

Process:
1. Load base layout template from `LayoutRegistryService`
2. Register base components (header, sider, footer) with unique keys
3. Register `@Commissar` components with generated keys
4. Build `TypedLayoutExposition` with component key references
5. Transform to `LayoutRenderer` using component registry

### 4. **Frontend Consumption**
```
GET /api/layouts → LayoutRenderer[] → Frontend Framework → UI Rendering
```

## 🏛️ Layout Templates & Component System

### **Base Layout Structure**
```typescript
const dashboardLayout = {
  type: 'dashboard',
  header: {
    style: { className: 'dashboard-header' },
    meta: {
      rendererType: 'NavigationRenderer',
      properties: { /* navigation config */ }
    }
  },
  content: {
    style: { className: 'dashboard-content' },
    meta: [] // Populated with @Commissar components
  },
  sider: {
    style: { className: 'dashboard-sider' },
    meta: {
      rendererType: 'MenuRenderer',
      properties: { /* menu config */ }
    }
  },
  footer: {
    style: { className: 'dashboard-footer' },
    meta: {
      rendererType: 'FooterRenderer',
      properties: { /* footer config */ }
    }
  }
};
```

### **Component Registry Mapping**
```
Layout Type + Component Position → Unique Key → Component Definition

Examples:
- dashboard_header → Dashboard header navigation
- dashboard_commissar_0 → First @Commissar component
- public_footer → Public layout footer
- minimal_commissar_1 → Second component in minimal layout
```

## 🚀 Integration Patterns

### 1. **Standard REST API Pattern**
```typescript
@Provisioneer({ layout: 'dashboard' })
@Controller('api/users')
export class UserController {
  @Commissar({
    path: '/users',
    component: {
      meta: {
        rendererType: 'TableRenderer',
        properties: {
          title: 'User Management',
          columns: ['name', 'email', 'role']
        }
      }
    }
  })
  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.findAll();
  }
}
```

### 2. **Dynamic Component Generation Pattern**
```typescript
@Controller('api')
export class DynamicController {
  @Post('dynamic')
  async getDynamicComponent(@Body() params: any) {
    const user = await this.userService.findOne(params.userId);
    
    return {
      success: true,
      result: {
        rendererType: 'UserDetailRenderer',
        properties: {
          user: user,
          editable: user.accountType !== 'admin'
        },
        children: [
          // Dynamic child components based on user data
        ]
      }
    };
  }
}
```

### 3. **Layout Override Pattern**
```typescript
@Provisioneer({ layout: 'public' })
@Controller('public')
export class PublicController {
  @Commissar({
    path: { path: '/special', overrideLayout: 'dashboard' },
    component: { /* component config */ }
  })
  @Get('special')
  getSpecialPage() {
    // This component appears in dashboard layout, not public
  }
}
```

## 🔧 Service Interactions

### **XingineInspectorService**
**Primary Functions:**
- `getAllTypedLayoutExpositions()`: Scans controllers and builds layout expositions
- `getAllLayoutRenderers()`: Transforms expositions to frontend-ready format
- Component registry management and key generation

**Dependencies:**
- `DiscoveryService`: Controller discovery
- `MetadataScanner`: Method scanning
- `Reflector`: Metadata extraction
- `LayoutRegistryService`: Layout template management

### **LayoutRegistryService**
**Primary Functions:**
- `getLayout(type)`: Retrieve specific layout template
- `getLayoutWithFallback(type)`: Get layout or default fallback
- `hasLayout(type)`: Check layout existence
- Layout template registration and management

### **CommissarActionInterceptor**
**Primary Functions:**
- Intercepts requests to methods with `@Commissar` decorators
- Handles action execution and response formatting
- Provides consistent API response structure

## 🌐 Frontend Integration Points

### **Layout Endpoint**
```
GET /api/layouts
Response: LayoutRenderer[]
```

Provides complete layout structure for frontend frameworks to consume.

### **Dynamic Component Endpoints**
```
POST /api/dynamic
Body: { userId: "123", ... }
Response: { success: boolean, result: LayoutComponentDetail }
```

Enables runtime component generation based on user context or data.

### **Action Execution Endpoints**
All `@Commissar` decorated methods become actionable endpoints that return:
```typescript
{
  success: boolean;
  result?: any;
  error?: string;
  message?: string;
}
```

## 🔍 Development & Debugging

### **Inspector Endpoints**
- `GET /api/layouts/debug` - Layout structure debugging
- `GET /api/layouts/registry` - Component registry contents
- `GET /api/layouts/expositions` - Raw exposition data

### **Real-Time Development**
```bash
npm run dev:realtime
```
- Watches xingine core and xingine-nest packages
- Automatic rebuild and server restart on changes
- Yalc integration for seamless package updates

### **Testing Integration**
```typescript
describe('Layout Generation', () => {
  it('should generate correct layout structure', () => {
    const expositions = inspectorService.getAllTypedLayoutExpositions();
    const renderers = inspectorService.getAllLayoutRenderers();
    
    expect(expositions).toHaveLength(3);
    expect(renderers).toHaveLength(3);
  });
});
```

## 📊 Performance Considerations

### **Caching Strategy**
- Layout templates cached in `LayoutRegistryService`
- Component registry built once at startup
- Exposition generation optimized for minimal reflection calls

### **Lazy Loading**
- Controllers discovered on-demand
- Component registration happens during first layout request
- Memory-efficient component key generation

### **Scalability**
- Horizontal scaling supported (stateless design)
- Component registry can be externalized
- Layout templates configurable via environment

## 🔗 Integration with Frontend Frameworks

### **React Integration (via xingine-react)**
```typescript
// Frontend consumes layouts from NestJS
const layouts = await fetch('/api/layouts').then(r => r.json());
<LayoutRenderer layouts={layouts} />
```

### **API-First Design**
```typescript
// Dynamic components consumed by any frontend
const userDetail = await fetch('/api/dynamic', {
  method: 'POST',
  body: JSON.stringify({ userId: '123' })
}).then(r => r.json());

if (userDetail.success) {
  <RenderComponent {...userDetail.result} />
}
```

## 📝 Best Practices

### **1. Layout Organization**
- Use semantic layout names (`dashboard`, `public`, `minimal`)
- Group related controllers under same layout
- Keep layout templates simple and focused

### **2. Component Design**
- Make components stateless and reusable
- Use consistent naming patterns for actions
- Implement proper error handling in components

### **3. Performance Optimization**
- Minimize reflection usage in production
- Cache frequently accessed layouts
- Use lazy loading for large component trees

### **4. Development Workflow**
- Use real-time development setup for faster feedback
- Test layouts with multiple frontend frameworks
- Validate component metadata with TypeScript

## 🚨 Common Patterns & Pitfalls

### **✅ Good Patterns**
```typescript
// Clear component structure
@Commissar({
  path: '/users',
  component: {
    meta: {
      rendererType: 'ButtonRenderer',
      content: 'Users',
      properties: {
        variant: 'primary',
        size: 'large'
      }
    }
  }
})

// Consistent error handling
async getDynamicComponent() {
  try {
    const result = await this.service.getData();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### **❌ Pitfalls to Avoid**
```typescript
// Avoid complex nested components in @Commissar
@Commissar({
  component: {
    meta: {
      // Too complex - move to dynamic endpoint
      rendererType: 'ComplexFormRenderer',
      children: [/* 50+ child components */]
    }
  }
})

// Avoid layout type mismatches
@Provisioneer({ layout: 'dashboard' })
class Controller {
  @Commissar({
    path: { path: '/route', overrideLayout: 'nonexistent' } // Error!
  })
}
```

This context document provides a comprehensive understanding of xingine-nest's architecture, working principles, and integration patterns. It serves as both a reference for developers and a guide for implementing effective UI generation patterns in NestJS applications.
