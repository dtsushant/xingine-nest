import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { XingineModule } from 'xingine-nest';
import { UserModule } from './modules/user.module';
import { DynamicModule as AppDynamicModule } from './modules/dynamic.module';
import config from '../mikro-orm.config';
import {XingineAppModule} from "@modules/xingine-app.module";

@Module({
  imports: [
    // Database configuration
    MikroOrmModule.forRoot(config),
      // Feature modules
    UserModule,
    AppDynamicModule,
    XingineAppModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
