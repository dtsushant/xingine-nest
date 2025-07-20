# LayoutRenderer System Implementation Guide

## Overview

The LayoutRenderer system in xingine-nest provides a comprehensive solution for building layout-aware NestJS applications with automatic UI generation and action lifecycle management.

## Phase 2 Implementation: Action Execution & API Endpoints

### 🎯 Action Execution Interceptor

The `CommissarActionInterceptor` handles the complete action execution flow:

```
preAction → mainMethod → postAction
```

#### Key Features:
- **Automatic Detection**: Only intercepts methods with @Commissar decorator and action hooks
- **Error Handling**: preAction/mainMethod failures abort the chain; postAction failures are logged but don't fail the request
- **Performance Tracking**: Optional detailed execution tracking with timing and results
- **Type Safety**: Full TypeScript support with proper error handling

#### Usage Example:

```typescript
@Provisioneer({ layout: 'default' })
@Controller('users')
export class UserController {
  
  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .form()
      .fields([/* form fields */])
      .build(),
    preAction: 'validatePermissions',
    postAction: 'logActivity'
  })
  @Post('create')
  createUser(@Body() userData: CreateUserDto) {
    // Main business logic
    return this.userService.create(userData);
  }

  // Pre-action: Called BEFORE createUser()
  validatePermissions() {
    if (!this.currentUser.hasPermission('user.create')) {
      throw new ForbiddenException('Insufficient permissions');
    }
  }

  // Post-action: Called AFTER createUser() (even if it succeeds)
  logActivity() {
    this.auditService.log('USER_CREATED', { timestamp: new Date() });
  }
}
```

#### Execution Flow:

1. **Request Arrives**: Client makes REST call to decorated endpoint
2. **Interceptor Detection**: Checks for @Commissar metadata with action hooks
3. **preAction Execution**: Validates, authenticates, or prepares data
4. **Main Method Execution**: Handles core business logic
5. **postAction Execution**: Logs, cleans up, or sends notifications
6. **Response**: Returns main method result to client

#### Error Scenarios:

| Scenario | Behavior | Example |
|----------|----------|---------|
| preAction fails | Abort entire chain, return error | Authentication failure |
| Main method fails | Abort chain, skip postAction | Business logic exception |
| postAction fails | Log error, return main result | Logging service unavailable |

### 🛠️ Layout Management API

Complete REST API for layout inspection and management:

#### Endpoints:

```http
# Get all layout renderers
GET /layouts
Response: LayoutRenderer[]

# Get specific layout by type
GET /layouts/:type
Response: LayoutRenderer

# Trigger layout scan and rebuild
POST /layouts/scan
Response: { message, layouts, scannedAt }

# Get registry information
GET /layouts/registry/info
Response: { availableLayouts, totalCount, registeredAt }

# Check if layout exists
GET /layouts/registry/exists/:type
Response: { exists: boolean, type: string }

# Get layout statistics
GET /layouts/stats
Response: { totalLayouts, layoutTypes, totalCommissars, lastScanned }
```

#### API Response Examples:

**GET /layouts**
```json
[
  {
    "type": "default",
    "header": { "style": {...}, "meta": {...} },
    "sider": { "style": {...}, "meta": {...} },
    "content": { 
      "style": {...}, 
      "meta": [
        {
          "path": "/users/dashboard",
          "form": { "fields": [...], "action": "..." },
          "permission": ["user.view"]
        }
      ]
    },
    "footer": { "style": {...}, "meta": {...} },
    "style": { "className": "layout-default" }
  }
]
```

**GET /layouts/stats**
```json
{
  "totalLayouts": 2,
  "layoutTypes": [
    { "type": "default", "commissarCount": 3 },
    { "type": "login", "commissarCount": 1 }
  ],
  "totalCommissars": 4,
  "lastScanned": "2025-01-20T11:30:00.000Z"
}
```

### 🧪 Testing Infrastructure

Comprehensive testing suite covering:

#### Integration Tests:
- **Layout Scanner**: Validates controller discovery and grouping
- **LayoutRenderer Generation**: Tests complete pipeline from decorators to API
- **Action Execution**: Validates interceptor behavior and error handling
- **API Endpoints**: Full HTTP endpoint testing

#### Unit Tests:
- **Layout Templates**: Default and login layout generation
- **Registry Service**: Layout registration and retrieval
- **Decorator Validation**: Metadata storage and retrieval

#### Performance Tests:
- **Multiple Scans**: Ensures efficient repeated scanning
- **Large Controller Sets**: Tests scalability
- **Memory Usage**: Validates no memory leaks

### 🔧 Configuration & Setup

#### Module Registration:

```typescript
@Module({
  imports: [XingineModule],
  controllers: [UserController, AuthController],
})
export class AppModule {}
```

#### Custom Configuration:

```typescript
// Register custom layouts
@Injectable()
export class LayoutConfigService {
  constructor(private layoutRegistry: LayoutRegistryService) {
    this.registerCustomLayouts();
  }

  private registerCustomLayouts() {
    const adminLayout = createCustomLayout('admin', {
      header: LayoutComponentDetailBuilder.create()
        .wrapper()
        .className('admin-header bg-red-600')
        .build(),
      sider: LayoutComponentDetailBuilder.create()
        .wrapper()
        .className('admin-sidebar')
        .build()
    });

    this.layoutRegistry.registerLayout('admin', adminLayout);
  }
}
```

### 📊 Monitoring & Debugging

#### Execution Tracking:

```typescript
// Use DetailedCommissarActionInterceptor for debugging
{
  provide: APP_INTERCEPTOR,
  useClass: DetailedCommissarActionInterceptor, // Instead of CommissarActionInterceptor
}
```

#### Console Output:
```
Executing preAction: validatePermissions
Executing postAction: logActivity
Action execution completed: {
  preAction: 'validatePermissions',
  postAction: 'logActivity', 
  executionTime: 45,
  success: true
}
```

#### Layout Scan Logging:
```
Enhanced @Commissar applied to: UserController dashboard
Found 2 layout renderers
Retrieved layout: default
Layout scan completed: 2 layouts found
```

### 🚀 Development Workflow

#### 1. Create Controller with Layouts:
```typescript
@Provisioneer({ layout: 'default' })
@Controller('products')
export class ProductController {
  // Define commissars with complete component definitions
}
```

#### 2. Test Layout Generation:
```bash
curl http://localhost:3000/layouts
curl http://localhost:3000/layouts/default
```

#### 3. Verify Action Execution:
- Add preAction/postAction to @Commissar decorators
- Test REST endpoints to validate execution flow
- Monitor console logs for execution tracking

#### 4. Custom Layout Development:
- Create custom layout templates
- Register with LayoutRegistryService
- Test with new controller decorators

### 🔄 Integration with Frontend

The generated LayoutRenderer objects are compatible with xingine-react:

```typescript
// Frontend usage
const layouts = await fetch('/api/layouts').then(r => r.json());
const routes = getCommissarredRoutes(layouts);

// React Router integration
<BrowserRouter>
  <Routes>
    {routes.map(route => (
      <Route key={route.path} {...route} />
    ))}
  </Routes>
</BrowserRouter>
```

### 📈 Performance Optimizations

- **Lazy Layout Loading**: Templates loaded on demand
- **Metadata Caching**: Controller scanning results cached
- **Efficient Grouping**: Controllers grouped by layout type for optimal processing
- **Error Resilience**: Graceful handling of missing methods and invalid configurations

## Next Steps: Phase 3 Features

- Advanced validation and error handling
- Development CLI tools
- Performance optimization with caching strategies
- Migration guides and documentation
- Custom layout builder UI tools

The Phase 2 implementation provides a solid foundation for building complex, layout-aware NestJS applications with automatic UI generation and robust action lifecycle management.