# Enhanced LayoutRenderer System Examples

This directory contains examples demonstrating the enhanced LayoutRenderer system with registry-based layout management and shared icon constants.

## Key Features Demonstrated

### 1. Client Application Layout Registration

The `CustomLayoutService` shows how client applications can register custom layouts:

```typescript
// Register custom layouts on module initialization
@Injectable()
export class CustomLayoutService implements OnModuleInit {
  constructor(private layoutRegistryService: LayoutRegistryService) {}

  async onModuleInit() {
    this.registerTailwindLayout();
    this.registerAntDesignLayout();
    this.registerMinimalLayout();
  }
}
```

### 2. Layout Registry Validation

The enhanced `getAllLayoutRenderers()` method now:

- ✅ **Checks if layouts exist** in the registry before using them
- ✅ **Falls back to 'default'** layout if specified layout doesn't exist
- ✅ **Uses registered layouts** as base templates instead of creating new ones
- ✅ **Adds commissar content** to the appropriate registered layout

```typescript
// Layout validation logic
if (!this.layoutRegistryService.hasLayout(layoutType)) {
  console.warn(`Layout '${layoutType}' not found in registry, falling back to 'default' layout`);
  layoutType = 'default';
}

// Get base layout from registry with fallback
const baseLayout = this.layoutRegistryService.getLayoutWithFallback(layoutType);
```

### 3. Multiple Layout Types

The examples show controllers using different layout types:

#### Default Layout (provided by library)
```typescript
@Provisioneer({ layout: 'default' })
@Controller('dashboard')
export class DashboardController { ... }
```

#### Tailwind Layout (registered by client)
```typescript
@Provisioneer({ layout: 'tailwind' })
@Controller('products')
export class ProductController { ... }
```

#### Ant Design Layout (registered by client)
```typescript
@Provisioneer({ layout: 'ant.d' })
@Controller('admin')
export class AdminController { ... }
```

#### Fallback Behavior (nonexistent layout → default)
```typescript
@Provisioneer({ layout: 'nonexistent' })  // Will fallback to 'default'
@Controller('fallback')
export class FallbackController { ... }
```

### 4. Shared Icon Constants

Examples demonstrate using the new shared icon constants:

```typescript
import { homeIconMeta, searchIcon } from '../src/constants/shared-icons';

@Commissar({
  // ... component definition
  path: {
    path: '/products/list',
    icon: searchIcon,
    label: 'Product Catalog'
  }
})
```

Available shared icons:
- `collapseIconMeta` - Hamburger menu icon
- `homeIconMeta` - Home/dashboard icon  
- `searchIcon` - Search icon
- `darkModeIcon` - Dark mode toggle icon
- `SharedIcons` - Collection of all icons

### 5. Enhanced Registry API

The `LayoutRegistryService` now supports:

```typescript
// Register single layout
layoutRegistry.registerLayout('custom', customLayout);

// Register multiple layouts at once
layoutRegistry.registerLayouts({
  'tailwind': tailwindLayout,
  'bootstrap': bootstrapLayout,
  'material': materialLayout
});

// Check if layout exists
if (layoutRegistry.hasLayout('tailwind')) { ... }

// Get layout with fallback to default
const layout = layoutRegistry.getLayoutWithFallback('custom');

// Get registry statistics
const stats = layoutRegistry.getRegistryStats();
```

## Usage Flow

1. **Library Initialization**: Default and login layouts are automatically registered
2. **Client Registration**: Client applications register custom layouts during module initialization
3. **Controller Scanning**: `getAllLayoutRenderers()` scans controllers with `@Provisioneer` decorators
4. **Layout Validation**: Checks if specified layout exists in registry
5. **Content Addition**: Adds commissar routes to the appropriate registered layout
6. **Response**: Returns complete LayoutRenderer objects with commissar content

## Benefits

1. **🎯 Validation**: Ensures layouts exist before using them
2. **🔄 Fallback**: Graceful fallback to default layout
3. **🎨 Flexibility**: Client applications can register any number of custom layouts
4. **♻️ Reusability**: Shared icon constants reduce duplication
5. **📊 Monitoring**: Registry statistics for debugging and monitoring
6. **🛡️ Safety**: Cannot remove required 'default' layout

This enhanced system provides a robust foundation for layout-aware applications with proper validation and client customization capabilities.