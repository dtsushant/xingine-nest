import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { Phone } from '../entities/phone.entity';
import { UserService } from '../services/user.service';
import { UserController, XingineUserController } from '../controllers/user.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([User, Company, Phone]),
  ],
  controllers: [UserController, XingineUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
