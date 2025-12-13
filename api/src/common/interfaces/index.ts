export interface ApiResponse<T> {
  statusCode: number
  message: string 
  data?: T
}

export interface JwtPayload {
  sub: string,
  role: string
}