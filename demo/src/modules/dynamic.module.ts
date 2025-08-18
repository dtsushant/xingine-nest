import { Module } from '@nestjs/common';
import { DynamicController } from '../controllers/dynamic.controller';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [DynamicController],
})
export class DynamicModule {}
