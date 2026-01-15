import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { BackendResponse } from "../interfaces";
import { Observable } from "rxjs";
import { map } from "rxjs/operators"

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, BackendResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BackendResponse<T>> {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse()

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message: "Success",
        data: data
      }))
    )
  }
}