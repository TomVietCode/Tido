import { applyDecorators, Type } from '@nestjs/common'
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginationMetaDto } from '@common/swagger'

interface ApiWrappedResponseOptions<T> {
  type: Type<T>
  status?: number
  description?: string
  isArray?: boolean
}

interface ApiPaginatedResponseOptions<T> {
  type: Type<T>
  status?: number
  description?: string
}

// Single/Array Response Decorator
export const ApiWrappedResponse = <T>(
  options: ApiWrappedResponseOptions<T>,
) => {
  const {
    type,
    status = 200,
    description = 'Success',
    isArray = false,
  } = options

  return applyDecorators(
    ApiExtraModels(type),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: status,
          },
          message: {
            type: 'string',
            example: 'Success',
          },
          data: isArray
            ? {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              }
            : {
                $ref: getSchemaPath(type),
              },
        },
        required: ['statusCode', 'message', 'data'],
      },
    }),
  )
}

// Paginated Response Decorator
export const ApiPaginatedResponse = <T>(
  options: ApiPaginatedResponseOptions<T>,
) => {
  const { type, status = 200, description = 'Success' } = options

  return applyDecorators(
    ApiExtraModels(type, PaginationMetaDto),
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: status,
          },
          message: {
            type: 'string',
            example: 'Success',
          },
          data: {
            type: 'object',
            properties: {
              meta: {
                $ref: getSchemaPath(PaginationMetaDto),
              },
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
            required: ['meta', 'data'],
          },
        },
        required: ['statusCode', 'message', 'data'],
      },
    }),
  )
}

// Error Response Decorator
export const ApiErrorResponse = (
  status: number,
  description: string,
  errorExample: string,
) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: status,
          },
          message: {
            type: 'string',
            example: errorExample,
          },
          error: {
            type: 'string',
            example: description,
          },
        },
        required: ['statusCode', 'message'],
      },
    }),
  )
}
