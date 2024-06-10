import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatasourcesModule } from './modules/datasources/datasources.module';
import { UsersModule } from './modules/features/users/users.module';
import { AuthenticationsModule } from './modules/features/authentications/authentications.module';
import { InterceptorModule } from './commons/interceptors/interceptors.module';
import { HealthModule } from './commons/health/health.module';
import { ShutdownModule } from './commons/shutdown/shutdown.module';

@Module({
  imports: [
    DatasourcesModule,
    ShutdownModule,
    UsersModule,
    AuthenticationsModule,
    InterceptorModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
