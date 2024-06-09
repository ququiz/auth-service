import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { SuccessResponse } from '../interfaces';
import { HealthCheckResult } from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get('healthz')
  public async check(): Promise<SuccessResponse<HealthCheckResult>> {
    const result = await this.healthService.checkDatabaseHealth();

    return {
      data: result,
      message: 'Health check completed',
    };
  }
}
