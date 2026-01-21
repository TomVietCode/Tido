import { ApiProperty } from '@nestjs/swagger'

export class BaseResponseDto {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number

  @ApiProperty({ example: 'Success', description: 'Response message' })
  message: string
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100, description: 'Total records' })
  total: number

  @ApiProperty({ example: 1, description: 'Current page' })
  page: number

  @ApiProperty({ example: 10, description: 'Number of records per page' })
  limit: number

  @ApiProperty({ example: 10, description: 'Total pages' })
  totalPages: number
}
