import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import { ApiPaginatedResponse, ApiWrappedResponse } from '@common/decorators'

interface SwaggerDocsOption {
  summary: string
  type?: any
  paginated?: boolean
}

export function ApiAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth('token'))
}

export function DocsInfo(options: SwaggerDocsOption) {
  if (options.paginated) {
    return applyDecorators(
      ApiOperation({ summary: options.summary }),
      ApiPaginatedResponse({ type: options.type || Boolean }),
    )
  }
  return applyDecorators(
    ApiOperation({ summary: options.summary }),
    ApiWrappedResponse({ type: options.type || Boolean }),
  )
}
