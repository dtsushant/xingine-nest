import { Controller, Get, Post, Body } from '@nestjs/common';
import { Provisioneer, Commissar } from '../src/index';
import { LayoutComponentDetailBuilder } from 'xingine';

/**
 * Example controller demonstrating the new @Provisioneer and @Commissar decorators
 */
@Provisioneer({ layout: 'default' })
@Controller('users')
export class UserController {

  /**
   * Example using new @Commissar decorator with component definition in decorator
   */
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
    // Pure business logic - component definition is in decorator
    return { message: 'Dashboard data' };
  }

  /**
   * Example with layout override to login layout
   */
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
      .action("handleLogin")
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
    // This method handles the business logic
    return { message: 'Login form ready' };
  }

  /**
   * Example with table component
   */
  @Commissar({
    component: LayoutComponentDetailBuilder.create()
      .table()
      .dataSourceUrl("/api/users/data")
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
    // Return actual user data
    return [
      { name: 'John Doe', email: 'john@example.com', role: 'admin', active: true },
      { name: 'Jane Smith', email: 'jane@example.com', role: 'user', active: true }
    ];
  }

  // Pre/Post action methods
  validateDashboardAccess() {
    console.log('Validating dashboard access...');
  }

  handleLogin(loginData: any) {
    console.log('Processing login:', loginData);
  }
}

/**
 * Example controller with login layout
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
          label: "Email Address",
          inputType: "input",
          required: true,
          properties: { type: "email" }
        },
        {
          name: "password",
          label: "Password",
          inputType: "password",
          required: true
        }
      ])
      .action("authenticate")
      .submitLabel("Login")
      .build(),
    preAction: 'checkRateLimit',
    postAction: 'logAuthAttempt'
  })
  @Post('login')
  authenticate(@Body() credentials: any) {
    // Authentication logic
    return { token: 'jwt-token-example' };
  }

  // Action methods
  checkRateLimit() {
    console.log('Checking rate limit...');
  }

  logAuthAttempt() {
    console.log('Logging authentication attempt...');
  }
}