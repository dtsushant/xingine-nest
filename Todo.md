# xingine-nest Todo

## Overview
This document outlines the tasks needed to implement the new LayoutRenderer system in xingine-nest while maintaining backward compatibility with existing functionality.

## 🎯 Core Architecture Goals
- ✅ Maintain existing functionality without breaking changes
- 🔄 Implement new LayoutRenderer system alongside current implementation
- 🏗️ Create structured layout management with header, sider, content, footer
- 🛣️ Enable React Router DOM outlet integration through Commissar paths
- 🎨 Support multiple layout types (default, login, custom)

---

## 📋 Task Categories

### 🏛️ **1. Layout Infrastructure**

#### 1.1 Layout Registry System
- [ ] **Create Layout Registry Service**
  - [ ] `LayoutRegistryService` to manage available layouts
  - [ ] Methods: `registerLayout()`, `getLayout()`, `getAllLayouts()`
  - [ ] Pre-register default layouts: "default", "login"
  - [ ] Support for custom layout registration

#### 1.2 Layout Template Definitions
- [ ] **Default Layout Template**
  - [ ] Header: Navigation bar with search, user menu, dark mode toggle
  - [ ] Sider: Collapsible menu with navigation items
  - [ ] Footer: Copyright, links, version info
  - [ ] Content: Dynamic commissar outlet area

- [ ] **Login Layout Template**
  - [ ] Header: Simple branding header
  - [ ] Footer: Copyright and basic links
  - [ ] Content: Centered login form area
  - [ ] No sider component

#### 1.3 Layout Builder Functions
- [ ] **Backend Layout Builders**
  - [ ] `createDefaultLayout()` - Generate default LayoutRenderer
  - [ ] `createLoginLayout()` - Generate login LayoutRenderer
  - [ ] Layout customization utilities
  - [ ] Support for template variables (darkMode, collapsed, etc.)

### 🔍 **3. Inspector Service Enhancement**

#### 3.1 LayoutRenderer Extraction
- [ ] **Add getAllLayoutRenderers() method to XingineInspectorService**
  - [ ] Similar pattern to `getAllModuleProperties()` and `fetchMappedModules()`
  - [ ] Scan all controllers with @Provisioneer decorators
  - [ ] Group controllers by layout type (from `layoutMandate` property)
  - [ ] Build complete LayoutRenderer objects for each layout type
  
- [ ] **LayoutRenderer Generation Logic**
  - [ ] Extract commissar routes from controllers grouped by layout
  - [ ] Generate header/sider/content/footer components for each layout
  - [ ] Build proper LayoutRenderer structure with:
    ```typescript
    interface LayoutRenderer {
      type: string;
      style?: StyleMeta;
      header?: { style?: StyleMeta; meta?: LayoutComponentDetail; };
      content: { style?: StyleMeta; meta: Commissar[]; };
      sider?: { style?: StyleMeta; meta?: LayoutComponentDetail; };
      footer?: { style?: StyleMeta; meta?: LayoutComponentDetail; };
    }
    ```

#### 3.2 Helper Methods for Layout Building
- [ ] **Component Builder Methods**
  - [ ] `buildHeaderComponent(layoutType, controllers)` - Generate header meta
  - [ ] `buildSiderComponent(layoutType, controllers)` - Generate navigation menu
  - [ ] `buildContentComponent(layoutType, controllers)` - Extract commissar routes
  - [ ] `buildFooterComponent(layoutType, controllers)` - Generate footer meta

- [ ] **Route Extraction Methods**
  - [ ] `extractCommissarRoutes(controllers)` - Get all @Commissar decorated methods
  - [ ] Handle PathProperties with layout overrides
  - [ ] Extract LayoutComponentDetail directly from decorator metadata
  - [ ] Build menu items from commissar routes with `isMenuItem: true`
  - [ ] Generate automatic paths from controller+method routes
  - [ ] Support route parameters and path validation

- [ ] **Component Definition Processing**
  - [ ] Extract complete LayoutComponentDetail from @Commissar decorator
  - [ ] Validate component structure at build time
  - [ ] Handle different component types (form, table, chart, wrapper)
  - [ ] Cache component definitions for performance
  - [ ] Link component actions to controller methods

- [ ] **Action Mapping System**
  - [ ] Map component actions to controller method names
  - [ ] Handle preAction and postAction execution flow for REST API calls
  - [ ] Validate that referenced methods exist on controller
  - [ ] Support async action execution with proper error handling
  - [ ] Error handling for missing or invalid actions

- [ ] **REST API Action Execution Engine**
  - [ ] Create interceptor/middleware to handle @Commissar action flow
  - [ ] Extract preAction/postAction metadata from decorated methods
  - [ ] Execute preAction → mainMethod → postAction sequence
  - [ ] Handle exceptions in any phase of execution
  - [ ] Support both sync and async action methods
  - [ ] Preserve method parameters and return values through action chain

- [ ] **Action Validation and Error Handling**
  - [ ] Validate preAction/postAction methods exist on controller
  - [ ] Type checking for action method signatures
  - [ ] Exception handling: abort on preAction failure, log postAction failures
  - [ ] Provide clear error messages for missing or invalid actions
  - [ ] Runtime validation of action method accessibility

- [ ] **Path Generation Logic**
  - [ ] Auto-generate paths from `@Controller('path')` + `@Get('method')`
  - [ ] Override with custom path from PathProperties
  - [ ] Handle route parameters and dynamic segments
  - [ ] Ensure path uniqueness across all commissars

- [ ] **Layout Override Handling**
  - [ ] Process `overrideLayout` from PathProperties
  - [ ] Exclude overridden routes from parent layout content
  - [ ] Create separate LayoutRenderer for overridden layouts
  - [ ] Maintain route hierarchy and navigation structure

#### 3.3 Layout Type Resolution
- [ ] **Proper Layout Detection**
  - [ ] Use `provisioneerProperties.layoutMandate` instead of `.layout`
  - [ ] Handle layout inheritance and overrides from PathProperties
  - [ ] Default to 'default' layout when not specified
  - [ ] Support custom layout types

#### 3.4 API Endpoint Integration
- [ ] **Expose LayoutRenderer API**
  - [ ] `GET /layouts` - Return all layout renderers
  - [ ] `GET /layouts/:type` - Return specific layout
  - [ ] `POST /layouts/scan` - Trigger layout rebuild
  - [ ] Integration with existing xingine-nest endpoints

### 🎭 **2. Decorator System**

#### 2.1 @Provisioneer Decorator
- [ ] **Controller-Level Layout Assignment**
  ```typescript
  @Provisioneer({ layout: 'default' })
  @Controller('users')
  export class UserController {
    // All commissars inherit 'default' layout
  }
  ```
  - [ ] Layout string validation against registry
  - [ ] Metadata storage for controller layout
  - [ ] Integration with NestJS reflection API

#### 2.2 @Commissar Decorator Enhancement
- [ ] **Complete LayoutComponentDetail Definition in Decorator**
  ```typescript
  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .chart()
      .charts([
        {
          type: "bar",
          title: "User Dashboard",
          labels: ["Jan", "Feb", "Mar", "Apr"],
          datasets: [{
            label: "Active Users",
            data: [120, 190, 300, 500],
            backgroundColor: "#1890ff"
          }]
        }
      ])
      .build(),
    preAction?: 'validateUserAccess',  // Optional: controller method to call before rendering
    postAction?: 'logUserActivity'     // Optional: controller method to call after rendering
  })
  @Get('dashboard')
  getUserDashboard() {
    // Controller method handles business logic only
    // Component definition is entirely in the decorator
  }
  ```

- [ ] **Automatic Path Resolution**
  ```typescript
  // Path defaults to controller route + method route
  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .form()
      .fields([
        { name: "username", label: "Username", inputType: "input", required: true },
        { name: "password", label: "Password", inputType: "password", required: true }
      ])
      .action("handleLogin") // This will call the controller method
      .build()
  })
  @Get('login')  // Path becomes '/users/login' (controller path + method path)
  getLoginForm() {
    // Handles the actual login logic when form is submitted
  }
  ```

- [ ] **Layout Override with Component Definition**
  ```typescript
  @Commissar({ 
    component: LayoutComponentDetailBuilder.create()
      .form()
      .fields([/* login fields */])
      .action("handleLogin")
      .build(),
    path: { 
      overrideLayout: 'login',
      isMenuItem: false,
      icon: { name: 'login', color: '#1890ff' },
      label: 'User Login'
    }
  })
  @Get('login')
  getLoginForm() {
    // Business logic for login processing
  }
  ```

- [ ] **Enhanced @Commissar Interface with REST API Action Hooks**
  ```typescript
  interface CommissarOptions {
    component: LayoutComponentDetail;    // REQUIRED: Complete component definition
    path?: string | PathProperties;      // Optional: defaults to controller+method path
    preAction?: string;                  // Optional: method name to call BEFORE main controller method
    postAction?: string;                 // Optional: method name to call AFTER main controller method
    permissions?: string[];              // Optional: route-level permissions
    cacheTimeout?: number;               // Optional: component cache timeout in ms
  }
  ```

- [ ] **REST API Action Execution Flow**
  ```typescript
  // When a REST API call is made to a @Commissar decorated endpoint:
  // 1. Extract preAction and postAction from decorator metadata
  // 2. Execute preAction method (if defined)
  // 3. Execute main controller method
  // 4. Execute postAction method (if defined)
  // 5. Return result to client

  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .form()
      .fields([/* user fields */])
      .action("createUser")
      .build(),
    preAction: 'validateUserPermissions',   // Runs BEFORE createUser()
    postAction: 'logUserCreation'          // Runs AFTER createUser()
  })
  @Post('create')
  createUser(@Body() userData: any) {
    // Main business logic - called between preAction and postAction
    return this.userService.create(userData);
  }

  // Pre-action method - called before main method
  validateUserPermissions() {
    // Validate user has permission to create users
    // Throw exception to abort if validation fails
  }

  // Post-action method - called after main method
  logUserCreation() {
    // Log the user creation activity
    // Perform cleanup or notification tasks
  }
  ```

- [ ] **Action Execution Scenarios**
  ```typescript
  // Scenario 1: Only preAction defined
  @Commissar({
    component: /* ... */,
    preAction: 'validateAccess'
  })
  @Get('sensitive-data')
  getSensitiveData() { /* main logic */ }
  // Execution: validateAccess() -> getSensitiveData()

  // Scenario 2: Only postAction defined  
  @Commissar({
    component: /* ... */,
    postAction: 'logActivity'
  })
  @Get('dashboard')
  getDashboard() { /* main logic */ }
  // Execution: getDashboard() -> logActivity()

  // Scenario 3: Both preAction and postAction defined
  @Commissar({
    component: /* ... */,
    preAction: 'authenticate',
    postAction: 'auditLog'
  })
  @Delete(':id')
  deleteUser(@Param('id') id: string) { /* main logic */ }
  // Execution: authenticate() -> deleteUser() -> auditLog()

  // Scenario 4: No actions defined (default behavior)
  @Commissar({
    component: /* ... */
  })
  @Get('list')
  getUserList() { /* main logic */ }
  // Execution: getUserList() only
  ```

- [ ] **PathProperties Extended Definition**
  ```typescript
  interface PathProperties {
    path?: string;                       // Custom path (defaults to auto-generated)
    overrideLayout?: string;             // Override controller layout
    isMenuItem?: boolean;                // Show in navigation menu (default: true)
    icon?: IconMeta;                // Menu item icon
    label?: string;                  // Menu item label
    permissions?: string[];          // Route-level permissions
    component?: string;              // Component identifier
  }
  ```
  - [ ] Route validation and conflict detection

### � **3. Core Services & Implementation**

#### 3.1 Enhanced Inspector Service
- [ ] **XingineInspectorService Updates**
  - [ ] `scanProvisioneerControllers()` - Find all @Provisioneer controllers
  - [ ] `extractCommissarRoutes()` - Extract all @Commissar methods
  - [ ] `buildLayoutRenderer()` - Generate complete LayoutRenderer from metadata
  - [ ] `validateLayoutConfiguration()` - Check for conflicts and issues

#### 3.2 Layout Generation Pipeline
- [ ] **LayoutRenderer Generation**
  - [ ] Scan controllers for @Provisioneer decorators
  - [ ] Extract layout assignments per controller
  - [ ] Process @Commissar methods and build content.meta array
  - [ ] Handle layout overrides from PathProperties
  - [ ] Generate final LayoutRenderer objects

#### 3.3 Route Building Service
- [ ] **CommissarRouteBuilder** (New Service)
  - [ ] Convert @Commissar methods to Commissar objects
  - [ ] Handle path resolution and validation
  - [ ] Apply layout inheritance from @Provisioneer
  - [ ] Build content.meta arrays for LayoutRenderer

### 📦 **4. Type Definitions & Interfaces**

#### 4.1 Decorator Options Interfaces
```typescript
interface ProvisioneerOptions {
  layout: string; // 'default' | 'login' | custom
  permissions?: string[];
  description?: string;
}

interface CommissarOptions {
  path: string | PathProperties;
  component?: string; // Optional component override
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

#### 4.2 Layout Configuration Types
```typescript
interface DefaultLayoutConfig {
  header: LayoutComponentDetail;
  sider: LayoutComponentDetail;
  footer: LayoutComponentDetail;
  style?: StyleMeta;
}

interface LoginLayoutConfig {
  header: LayoutComponentDetail;
  footer: LayoutComponentDetail;
  style?: StyleMeta;
}
```

### 🛠️ **5. Implementation Examples**

#### 5.1 getAllLayoutRenderers() Implementation Details
```typescript
getAllLayoutRenderers(): LayoutRenderer[] {
  const layoutRenderers: LayoutRenderer[] = [];
  const controllers = this.getAllControllers();

  // Group controllers by layout type from layoutMandate
  const layoutGroups = new Map<string, {
    provisioneerProperties: ProvisioneerProperties;
    controllers: Constructor<unknown>[];
  }>();

  for (const controller of controllers) {
    const provisioneerProperties = getProvisioneerProperties(controller);
    if (!provisioneerProperties) continue;

    // Use layoutMandate instead of layout property
    const layoutType = provisioneerProperties.layoutMandate?.type || 'default';
    
    if (!layoutGroups.has(layoutType)) {
      layoutGroups.set(layoutType, {
        provisioneerProperties,
        controllers: []
      });
    }
    layoutGroups.get(layoutType)!.controllers.push(controller);
  }

  // Build LayoutRenderer for each layout type
  for (const [layoutType, { provisioneerProperties, controllers }] of layoutGroups) {
    const commissarRoutes = this.extractCommissarRoutes(controllers);
    
    const layoutRenderer: LayoutRenderer = {
      type: layoutType,
      header: this.buildHeaderComponent(layoutType, controllers),
      sider: layoutType !== 'login' ? this.buildSiderComponent(layoutType, controllers) : undefined,
      content: {
        style: { className: 'layout-content' },
        meta: commissarRoutes
      },
      footer: this.buildFooterComponent(layoutType, controllers),
      style: {
        className: `layout-${layoutType}`,
        theme: layoutType === 'login' ? 'minimal' : 'default'
      }
    };

    layoutRenderers.push(layoutRenderer);
  }

  return layoutRenderers;
}
```

#### 5.2 Helper Methods Implementation
```typescript
private extractCommissarRoutes(controllers: Constructor<unknown>[]): Commissar[] {
  const commissarRoutes: Commissar[] = [];
  
  for (const controller of controllers) {
    const controllerPath = this.reflector.get<string>(PATH_METADATA, controller) || '';
    const prototype = controller.prototype;
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => typeof prototype[name] === 'function' && name !== 'constructor'
    );

    for (const methodName of methodNames) {
      const commissar = getCommissarProperties(controller, methodName);
      if (!commissar) continue;

      // Handle PathProperties and layout overrides
      const pathConfig = commissar.path;
      if (typeof pathConfig === 'object' && pathConfig.overrideLayout) {
        // Skip routes that override to different layouts for this layout group
        continue;
      }

      // Generate automatic path from controller + method routes
      const methodRoutePath = this.reflector.get<string>(PATH_METADATA, prototype[methodName]) || '';
      const autoGeneratedPath = `/${controllerPath}/${methodRoutePath}`.replace(/\/+/g, '/');
      
      // Use custom path or auto-generated path
      const finalPath = typeof pathConfig === 'string' 
        ? pathConfig 
        : (typeof pathConfig === 'object' && pathConfig.path) 
          ? pathConfig.path 
          : autoGeneratedPath;

      // Extract LayoutComponentDetail directly from decorator
      const layoutComponentDetail = commissar.component;
      
      // Validate that component is defined
      if (!layoutComponentDetail) {
        console.warn(`Warning: ${controller.name}.${methodName} @Commissar decorator missing component definition`);
        continue;
      }

      // Validate preAction and postAction methods
      const actionValidation = this.validateCommissarActions(controller, commissar);
      if (!actionValidation.preActionValid || !actionValidation.postActionValid) {
        console.error(`Error: ${controller.name}.${methodName} has invalid action references`);
        continue;
      }

      commissarRoutes.push({
        path: finalPath,
        component: layoutComponentDetail,
        meta: {
          controllerName: controller.name,
          methodName: methodName,
          preAction: commissar.preAction,
          postAction: commissar.postAction,
          permissions: commissar.permissions || [],
          hasPreAction: !!commissar.preAction,
          hasPostAction: !!commissar.postAction
        },
        isMenuItem: typeof pathConfig === 'object' ? pathConfig.isMenuItem !== false : true,
        icon: typeof pathConfig === 'object' ? pathConfig.icon : undefined,
        label: typeof pathConfig === 'object' ? pathConfig.label : this.generateLabelFromMethodName(methodName)
      });
    }
  }
  
  return commissarRoutes;
}

private generateLabelFromMethodName(methodName: string): string {
  // Convert camelCase to readable label
  // getUserDashboard -> Get User Dashboard
  return methodName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

private validateCommissarActions(
  controller: Constructor<unknown>, 
  commissar: any
): { preActionValid: boolean; postActionValid: boolean } {
  const prototype = controller.prototype;
  
  const preActionValid = !commissar.preAction || 
    (typeof prototype[commissar.preAction] === 'function');
    
  const postActionValid = !commissar.postAction || 
    (typeof prototype[commissar.postAction] === 'function');

  if (!preActionValid) {
    console.error(`Error: ${controller.name} missing preAction method: ${commissar.preAction}`);
  }
  
  if (!postActionValid) {
    console.error(`Error: ${controller.name} missing postAction method: ${commissar.postAction}`);
  }

  return { preActionValid, postActionValid };
}
}

private buildSiderComponent(layoutType: string, controllers: Constructor<unknown>[]): { style?: StyleMeta; meta?: LayoutComponentDetail; } {
  const menuItems = this.extractMenuItems(controllers);
  
  return {
    style: { className: 'layout-sider' },
    meta: LayoutComponentDetailBuilder.create()
      .menu()
      .items(menuItems)
      .collapsed(false)
      .theme('dark')
      .build()
  };
}
```

#### 5.3 Sample Controller Implementation
```typescript
@Provisioneer({ layout: 'default' })
@Controller('users')
export class UserController {
  
  // Component definition entirely in decorator, path auto-generated: /users/dashboard
  @Commissar({
    component: LayoutComponentDetailBuilder.create()
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
      .build(),
    preAction: 'validateDashboardAccess'
  })
  @Get('dashboard')
  getDashboard() {
    // Pure business logic - no component concerns
    // Component is defined entirely in decorator
  }

  // Layout override with complete component definition
  @Commissar({ 
    component: LayoutComponentDetailBuilder.create()
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
      .action("handleLogin") // This calls the controller method
      .submitLabel("Sign In")
      .build(),
    path: { 
      overrideLayout: 'login',
      isMenuItem: false,
      icon: { name: 'login', color: '#1890ff' },
      label: 'User Login'
    }
  })
  @Get('login')
  getLoginForm() {
    // This method is called when the form action "handleLogin" is triggered
    // Handle actual login logic here
  }

  // Table component with data source action mapping
  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .table()
      .dataSourceUrl("/api/users/data") // This will call getUsersData method
      .columns([
        { title: "Name", dataIndex: "name", sortable: true },
        { title: "Email", dataIndex: "email", sortable: true },
        { title: "Role", dataIndex: "role", filterable: { apply: true } },
        { title: "Status", dataIndex: "active" }
      ])
      .pagination({ pageSize: 10, showSizeChanger: true })
      .build(),
    path: {
      icon: { name: 'table', color: '#1890ff' },
      label: 'User List'
    }
  })
  @Get('list') 
  getUserList() {
    // Method called when table needs data
    // Return actual user data here
  }

  // Form component with create action
  @Commissar({
    component: LayoutComponentDetailBuilder.create()
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
      .action("createUser") // Calls createUser method on form submit
      .submitLabel("Create User")
      .build(),
    path: {
      icon: { name: 'plus', color: '#52c41a' },
      label: 'Add User'
    },
    preAction: 'validateCreatePermissions',
    postAction: 'logUserCreation'
  })
  @Get('create')
  getCreateUserForm() {
    // Display form logic (if any)
  }

  // Business logic methods called by component actions
  handleLogin(loginData: any) {
    // Process login
  }

  createUser(userData: any) {
    // Create new user
  }

  getUsersData() {
    // Return user data for table
  }

  // Pre/Post action methods
  validateDashboardAccess() {
    // Validate user can access dashboard
  }

  validateCreatePermissions() {
    // Check if user can create new users
  }

  logUserCreation() {
    // Log user creation activity
  }
}
```
  })
  @Get('create')
  getCreateUserForm(): LayoutComponentDetail {
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
      .submitLabel("Create User")
      .build();
  }
}
```

#### 5.4 Controller Method Return Type Validation
```typescript
// The @Commissar decorator should validate that the method returns LayoutComponentDetail
type CommissarMethod = () => LayoutComponentDetail | Promise<LayoutComponentDetail>;

// Runtime validation in the inspector service
private validateCommissarReturnType(method: Function, controller: Constructor<unknown>, methodName: string): boolean {
  const returnType = this.reflector.get('design:returntype', method);
  
  // Check if return type is LayoutComponentDetail or Promise<LayoutComponentDetail>
  if (returnType === LayoutComponentDetail || 
      (returnType === Promise && this.isPromiseOfLayoutComponentDetail(method))) {
    return true;
  }
  return false;
}
```

#### 5.4 Action Mapping and Execution Flow
```typescript
// Component actions automatically map to controller methods
interface ActionMapping {
  componentActionName: string;    // e.g., "handleLogin", "createUser", "loadData"
  controllerMethodName: string;   // e.g., "handleLogin", "createUser", "getUsersData"
  executionFlow: 'preAction -> action -> postAction';
}

// Example execution flow for form submission:
// 1. Frontend submits form with action "createUser"
// 2. Backend executes: validateCreatePermissions() (preAction)
// 3. Backend executes: createUser(formData) (main action)
// 4. Backend executes: logUserCreation() (postAction)
// 5. Return result to frontend

// Action mapping validation
private validateActionMappings(controller: Constructor<unknown>, commissar: any): boolean {
  const prototype = controller.prototype;
  
  // Check if component actions reference valid controller methods
  const component = commissar.component;
  const actions = this.extractActionsFromComponent(component);
  
  for (const actionName of actions) {
    if (typeof prototype[actionName] !== 'function') {
      console.error(
        `Error: ${controller.name} missing action method: ${actionName} ` +
        `referenced in component definition`
      );
      return false;
    }
  }
  
  return true;
}

private extractActionsFromComponent(component: LayoutComponentDetail): string[] {
  const actions: string[] = [];
  
  // Extract actions from different component types
  if (component.form?.action) {
    actions.push(component.form.action);
  }
  
  if (component.table?.dataSourceUrl) {
    // Convert URL to method name: "/api/users/data" -> "getUsersData"
    const methodName = this.urlToMethodName(component.table.dataSourceUrl);
    actions.push(methodName);
  }
  
  // Add more component types as needed
  
  return actions;
}

private urlToMethodName(url: string): string {
  // Convert "/api/users/data" to "getUsersData"
  return url
    .split('/')
    .filter(segment => segment && segment !== 'api')
    .map((segment, index) => 
      index === 0 ? `get${segment.charAt(0).toUpperCase()}${segment.slice(1)}` 
                  : segment.charAt(0).toUpperCase() + segment.slice(1)
    )
    .join('');
}
```

#### 5.5 Path Generation Examples
```typescript
// Automatic path generation examples:

// @Controller('users') + @Get('dashboard') = '/users/dashboard'
// @Controller('admin') + @Get('settings') = '/admin/settings'  
// @Controller('api/v1/products') + @Post('create') = '/api/v1/products/create'

// Path override examples:
@Commissar({
  component: /* ... */,
  path: '/custom/login'  // Override: uses '/custom/login' instead of '/users/login'
})

@Commissar({
  component: /* ... */,
  path: {
    path: '/admin/dashboard',  // Custom path
    overrideLayout: 'admin',   // Different layout
    isMenuItem: true           // Show in menu
  }
})
```

  @Commissar({ 
    path: { 
      path: '/users/login', 
      overrideLayout: 'login' 
    } 
  })
  @Get('login')
  getLogin(): LayoutComponentDetail {
    return LayoutComponentDetailBuilder.create()
      .form()
      .fields([/* login fields */])
      .build();
  }
}
```

#### 5.2 Layout Template Functions
- [ ] **Create Backend Layout Templates**
  - [ ] `getDefaultTemplate()` - Based on your sample code
  - [ ] `getLoginTemplate()` - Simplified version for login
  - [ ] Template customization parameters
  - [ ] Dynamic component generation

#### 5.6 Key Architectural Changes Summary

**🎯 @Commissar Decorator Evolution:**
- **BEFORE**: Controller methods return `LayoutComponentDetail`
- **AFTER**: @Commissar decorator contains complete `LayoutComponentDetail` definition
- **BENEFIT**: Separation of concerns - decorators define UI, methods handle business logic

**🛣️ Path Resolution:**
- **AUTO-GENERATION**: `@Controller('users')` + `@Get('dashboard')` = `/users/dashboard`
- **OVERRIDE**: Use `path` property to customize route
- **INHERITANCE**: Routes inherit controller layout unless overridden

**⚡ Action Mapping:**
- **COMPONENT ACTIONS**: Form actions, table data sources automatically map to controller methods
- **EXECUTION FLOW**: `preAction` → `mainAction` → `postAction`
- **VALIDATION**: Ensure all referenced methods exist on controller

**🏗️ Component Definition:**
- **DECORATOR-BASED**: Complete UI definition in @Commissar decorator
- **TYPE-SAFE**: Full LayoutComponentDetail with builder pattern
- **REUSABLE**: Component definitions are cacheable and portable

### 🧪 **6. Testing & Validation**

#### 6.1 Decorator Testing
- [ ] **@Provisioneer Tests**
  - [ ] Layout assignment validation
  - [ ] Metadata storage verification
  - [ ] Multiple controller scenarios

- [ ] **@Commissar Tests**
  - [ ] Component definition validation
  - [ ] Path auto-generation and overrides
  - [ ] Action mapping verification
  - [ ] Layout override functionality

#### 6.2 Integration Testing
- [ ] **End-to-End Scenarios**
  - [ ] Controller scan → LayoutRenderer generation
  - [ ] Layout inheritance and overrides
  - [ ] Route conflict detection
  - [ ] Action validation and execution flow
  - [ ] Invalid component definition handling

### 🔄 **7. Migration & API Endpoints**

#### 7.1 Layout API Endpoints
- [ ] **REST Endpoints for Layout Management**
  ```typescript
  @Controller('layouts')
  export class LayoutController {
    @Get()
    getAllLayouts(): LayoutRenderer[]
    
    @Get(':type')
    getLayout(@Param('type') type: string): LayoutRenderer
    
    @Post('scan')
    scanAndBuildLayouts(): LayoutRenderer[]
  }
  ```

#### 7.2 Development Tools
- [ ] **Development Utilities**
  - [ ] Layout validation CLI command
  - [ ] Route scanning and preview
  - [ ] Layout template generation tools
  - [ ] Debug endpoint for layout inspection

---

## 🚀 **Priority Implementation Phases**

### **Phase 1: Core Foundation** (High Priority)
1. ✅ Create @Provisioneer and @Commissar decorators
2. ✅ Implement basic layout registry service
3. ✅ Build default and login layout templates
4. ✅ Create LayoutRenderer generation pipeline

### **Phase 2: Integration & Testing** (Medium Priority)
1. Enhanced XingineInspectorService
2. Route building and validation
3. Comprehensive testing suite
4. API endpoints for layout management

### **Phase 3: Advanced Features** (Low Priority)
1. Dynamic layout customization
2. Development tools and CLI
3. Performance optimization
4. Advanced validation and error handling

---

## 🔗 **Key Dependencies & Technical Notes**

### Implementation Details
- **Layout Inheritance**: @Commissar inherits layout from @Provisioneer unless overridden
- **Path Resolution**: Support both string paths and PathProperties objects
- **Component Generation**: Use LayoutComponentDetailBuilder pattern
- **Template System**: Based on your sample getDefaultTemplate() approach

### Integration Points
- **NestJS Metadata**: Use reflection API for decorator scanning
- **React Router**: Generate compatible route structures
- **xingine Core**: Leverage existing builder patterns and interfaces

### Performance Considerations
- **Layout Caching**: Cache generated LayoutRenderer objects
- **Lazy Loading**: Load layout templates on demand
- **Route Optimization**: Minimize route scanning overhead

---

## 📝 **Next Steps**
1. Start with @Provisioneer decorator implementation
2. Create basic layout registry with default/login templates  
3. Implement @Commissar decorator with path handling
4. Build LayoutRenderer generation pipeline
5. Create sample controller to test the flow

### 🚀 **8. REST API Action Execution System**

#### 8.1 CommissarActionInterceptor Implementation
- [ ] **Create NestJS Interceptor for Action Execution**
  ```typescript
  @Injectable()
  export class CommissarActionInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const handler = context.getHandler();
      const controller = context.getClass();
      
      // Extract @Commissar metadata
      const commissarMeta = getCommissarProperties(controller, handler.name);
      if (!commissarMeta) {
        return next.handle(); // No @Commissar decorator, proceed normally
      }
      
      // Execute preAction -> mainMethod -> postAction flow
      return from(this.executeActionChain(context, next, commissarMeta));
    }
    
    private async executeActionChain(
      context: ExecutionContext, 
      next: CallHandler, 
      commissarMeta: any
    ): Promise<any> {
      const request = context.switchToHttp().getRequest();
      const controllerInstance = request.controller || context.getClass().prototype;
      
      try {
        // Execute preAction if defined
        if (commissarMeta.preAction) {
          console.log(`Executing preAction: ${commissarMeta.preAction}`);
          await this.executeAction(controllerInstance, commissarMeta.preAction, context);
        }
        
        // Execute main method
        const result = await next.handle().toPromise();
        
        // Execute postAction if defined
        if (commissarMeta.postAction) {
          console.log(`Executing postAction: ${commissarMeta.postAction}`);
          await this.executeAction(controllerInstance, commissarMeta.postAction, context);
        }
        
        return result;
      } catch (error) {
        console.error(`Action execution failed:`, error);
        throw new BadRequestException(`Action execution failed: ${error.message}`);
      }
    }

    private async executeAction(
      controllerInstance: any, 
      actionName: string, 
      context: ExecutionContext
    ): Promise<any> {
      if (typeof controllerInstance[actionName] !== 'function') {
        throw new Error(`Action method '${actionName}' not found on controller`);
      }

      // Execute the action method with proper context
      const result = await controllerInstance[actionName].call(controllerInstance);
      return result;
    }
  }
  ```

#### 8.2 Module Integration
- [ ] **Register Interceptor Globally**
  ```typescript
  @Module({
    imports: [XingineModule],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass: CommissarActionInterceptor,
      },
      XingineInspectorService,
    ],
    exports: [XingineInspectorService],
  })
  export class XingineNestModule {}
  ```

#### 8.3 Action Execution Flow Examples
- [ ] **Complete REST API Call Flow**
  ```typescript
  // 1. Client makes REST call: POST /api/users/create
  // 2. NestJS routes to UserController.createUser()
  // 3. CommissarActionInterceptor intercepts the call
  // 4. Interceptor checks for @Commissar metadata
  // 5. Executes: validateUserPermissions() [preAction]
  // 6. Executes: createUser() [main method]
  // 7. Executes: logUserCreation() [postAction]
  // 8. Returns result to client

  @Controller('users')
  export class UserController {
    @Commissar({
      component: LayoutComponentDetailBuilder.create()
        .form()
        .fields([/* form fields */])
        .action("createUser")
        .build(),
      preAction: 'validateUserPermissions',
      postAction: 'logUserCreation'
    })
    @Post('create')
    async createUser(@Body() userData: CreateUserDto) {
      // Main business logic
      return await this.userService.create(userData);
    }

    // Pre-action: Called before createUser()
    async validateUserPermissions() {
      // Check if current user has permission to create users
      const currentUser = this.getCurrentUser();
      if (!currentUser.hasPermission('user.create')) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    // Post-action: Called after createUser()
    async logUserCreation() {
      // Log the user creation activity
      await this.auditService.log('USER_CREATED', {
        timestamp: new Date(),
        action: 'create_user'
      });
    }
  }
  ```

#### 8.4 Error Handling Strategy
- [ ] **Action Execution Error Scenarios**
  ```typescript
  // Scenario 1: preAction throws exception
  // Result: Main method and postAction are not executed, error returned to client

  // Scenario 2: Main method throws exception  
  // Result: postAction is not executed, error returned to client

  // Scenario 3: postAction throws exception
  // Result: Main method result is still returned, but postAction error is logged

  private async executeActionChain(context, next, commissarMeta): Promise<any> {
    let mainResult;
    
    try {
      // preAction failure aborts entire chain
      if (commissarMeta.preAction) {
        await this.executeAction(controllerInstance, commissarMeta.preAction, context);
      }
      
      // Main method execution
      mainResult = await next.handle().toPromise();
      
    } catch (error) {
      // preAction or main method failed - abort chain
      throw error;
    }
    
    try {
      // postAction failure doesn't affect main result
      if (commissarMeta.postAction) {
        await this.executeAction(controllerInstance, commissarMeta.postAction, context);
      }
    } catch (postError) {
      // Log postAction errors but don't fail the request
      console.error(`PostAction '${commissarMeta.postAction}' failed:`, postError);
    }
    
    return mainResult;
  }
  ```

---

**Last Updated:** July 20, 2025  
**Status:** Planning Phase - Ready for Implementation  
**Priority:** Phase 1 Foundation Tasks
