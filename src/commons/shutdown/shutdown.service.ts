import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ShutdownService implements OnModuleDestroy {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleDestroy() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('Closing connections gracefully...');
    await this.closeDatabaseConnection();
    console.log('Connections closed successfully');
  }

  private async closeDatabaseConnection() {
    console.log('Closing database connection...');
    await this.dataSource.destroy();
  }
}
