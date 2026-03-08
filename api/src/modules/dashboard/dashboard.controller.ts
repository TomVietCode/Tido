import { Controller, Get, UseGuards } from '@nestjs/common'
import { DashboardService } from '@modules/dashboard/dashboard.service'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import { RoleGuard } from '@modules/auth/guards/role.guard'
import { Roles } from '@modules/auth/decorators/role.decorator'
import { Role } from '@common/enums'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Get admin dashboard data' })
  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  async getDashboardData() {
    return this.dashboardService.getDashboardData()
  }
}
