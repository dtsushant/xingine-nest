import { Controller, Get, Post, Body } from '@nestjs/common';
import { Provisioneer, Commissar } from '../src/index';
import { LayoutComponentDetailBuilder } from 'xingine';
import { homeIconMeta, searchIcon } from '../src/constants/shared-icons';

/**
 * Example controller using default layout
 */
@Provisioneer({ layout: 'default' })
@Controller('dashboard')
export class DashboardController {

  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .chart()
      .charts([
        {
          type: "bar",
          title: "Monthly Revenue",
          labels: ["Jan", "Feb", "Mar", "Apr"],
          datasets: [{
            label: "Revenue",
            data: [120, 190, 300, 500],
            backgroundColor: "#1890ff"
          }]
        }
      ])
      .build(),
    path: '/dashboard/analytics',
    preAction: 'validateAccess'
  })
  @Get('analytics')
  getAnalytics() {
    return { message: 'Analytics data loaded' };
  }

  validateAccess() {
    // Pre-action validation logic
    console.log('Validating dashboard access...');
  }
}

/**
 * Example controller using Tailwind layout (registered by client application)
 */
@Provisioneer({ layout: 'tailwind' })
@Controller('products')
export class ProductController {

  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .table()
      .columns([
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Price', dataIndex: 'price', key: 'price' },
        { title: 'Category', dataIndex: 'category', key: 'category' }
      ])
      .dataSourceUrl('/api/products')
      .build(),
    path: { 
      path: '/products/list',
      icon: searchIcon,
      label: 'Product Catalog'
    }
  })
  @Get('list')
  getProductList() {
    return { 
      data: [
        { id: 1, name: 'Laptop', price: '$999', category: 'Electronics' },
        { id: 2, name: 'Book', price: '$29', category: 'Education' }
      ]
    };
  }
}

/**
 * Example controller using Ant Design layout
 */
@Provisioneer({ layout: 'ant.d' })
@Controller('admin')
export class AdminController {

  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .form()
      .fields([
        {
          name: "title",
          label: "Title",
          inputType: "input",
          required: true,
          properties: { placeholder: "Enter title" }
        },
        {
          name: "description",
          label: "Description", 
          inputType: "textarea",
          properties: { rows: 4 }
        },
        {
          name: "status",
          label: "Status",
          inputType: "select",
          properties: {
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]
          }
        }
      ])
      .build(),
    path: {
      path: '/admin/create',
      icon: homeIconMeta,
      label: 'Create Item'
    },
    preAction: 'validateAdminAccess',
    postAction: 'logAdminAction'
  })
  @Post('create')
  createItem(@Body() data: any) {
    return { message: 'Item created successfully', data };
  }

  validateAdminAccess() {
    console.log('Validating admin access...');
  }

  logAdminAction() {
    console.log('Admin action logged');
  }
}

/**
 * Example controller that will fallback to default layout 
 * because 'nonexistent' layout is not registered
 */
@Provisioneer({ layout: 'nonexistent' })
@Controller('fallback')
export class FallbackController {

  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .detail()
      .fields([
        { name: 'message', label: 'Message', value: 'This uses default layout as fallback' }
      ])
      .build()
  })
  @Get('test')
  testFallback() {
    return { message: 'Fallback controller working' };
  }
}

/**
 * Example controller using login layout
 */
@Provisioneer({ layout: 'login' })
@Controller('auth')
export class AuthController {

  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .form()
      .fields([
        {
          name: "email",
          label: "Email",
          inputType: "input",
          required: true,
          properties: { type: "email", placeholder: "Enter your email" }
        },
        {
          name: "password",
          label: "Password",
          inputType: "input",
          required: true,
          properties: { type: "password", placeholder: "Enter your password" }
        }
      ])
      .build(),
    path: '/auth/login'
  })
  @Post('login')
  login(@Body() credentials: any) {
    return { message: 'Login successful', token: 'jwt-token-here' };
  }
}