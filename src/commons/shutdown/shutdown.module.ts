import { Module } from '@nestjs/common';
import { DatasourcesModule } from 'src/modules/datasources/datasources.module';
import { ShutdownService } from './shutdown.service';

@Module({
  imports: [DatasourcesModule],
  providers: [ShutdownService],
})
export class ShutdownModule {}
