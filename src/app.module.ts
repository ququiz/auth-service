import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatasourcesModule } from './modules/datasources/datasources.module';
import { UsersModule } from './modules/features/users/users.module';

@Module({
  imports: [DatasourcesModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
