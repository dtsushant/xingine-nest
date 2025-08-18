import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import {Commissar,Provisioneer} from "xingine-nest";
import {userAnalytics} from "@/components/content/user/user.commissar";
import {userProvisioneer} from "@/components/content/user/user.provisioneer";

@ApiTags('users')
@Controller('api/users')
@Provisioneer(userProvisioneer)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

    @Commissar(userAnalytics)
    @Get('user-analytics')
    async userAnalytics(): Promise<{ msg: string }> {
        return { msg: 'success' };
    }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all users' })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.remove(id);
    return { message: 'User deleted successfully' };
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed database with sample users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Database seeded successfully' })
  async seed(): Promise<{ message: string }> {
    await this.userService.seed();
    return { message: 'Database seeded with sample users' };
  }
}

// Specific endpoints for xingine-react integration
@Controller('api')
export class XingineUserController {
  constructor(private readonly userService: UserService) {}

  @Post('user/save')
  @ApiOperation({ summary: 'Save user (for xingine-react form submission)' })
  async saveUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return {
        success: true,
        result: user,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to create user'
      };
    }
  }

  @Get('fetch-user/:userId')
  @ApiOperation({ summary: 'Fetch user for xingine-react' })
  async fetchUser(@Param('userId') userId: string) {
    try {
      const user = await this.userService.findOne(userId);
      return {
        success: true,
        result: user,
        message: 'User fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to fetch user'
      };
    }
  }
}
