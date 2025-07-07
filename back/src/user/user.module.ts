import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [AdminModule],
  controllers: [UserController],
  providers: [],
  exports: [],
})
export class UserModule {}
