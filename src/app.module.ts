import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatasourcesModule } from './modules/datasources/datasources.module';
import { UsersModule } from './modules/features/users/users.module';
import { AuthenticationsModule } from './modules/features/authentications/authentications.module';
import { InterceptorModule } from './commons/interceptors/interceptors.module';

@Module({
  imports: [
    DatasourcesModule,
    UsersModule,
    AuthenticationsModule,
    InterceptorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
