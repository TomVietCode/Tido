import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { BackendResponse } from '@src/common/interfaces'
import { Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Có lỗi không xác định xảy ra'
    let error = 'Unknown error'

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus()
      const exeptionResponse = exception.getResponse()

      if (typeof exeptionResponse === 'string') {
        message = exeptionResponse
        error = exeptionResponse
      } else if (typeof exeptionResponse === 'object') {
        const responseObj = exeptionResponse as Record<string, any>
        message = responseObj.message || exception.message
        error = responseObj.error || exception.name

        // Class validator
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message[0]
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message
      error = exception.name
    }

    const errResponse: BackendResponse<null> = {
      statusCode,
      message,
      success: false,
      error,
    }

    response.status(statusCode).json(errResponse)
  }
}
