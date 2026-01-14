export {}
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface IRequest {
    url: string
    method: string
    body?: { [key: string]: any }
    queryParams?: any
    useCredentials?: boolean
    headers?: any
    nextOption?: any
  }

  interface IBackendRes<T> {
    statusCode: number | string
    success: boolean
    message?: string
    data?: T
    error?: string
  }

  interface IModelPaginate<T> {
    meta: {
      current: number
      pageSize: number
      pages: number
      total: number
    }
    result: T[]
  }

  interface IAuth {
    user: {
      id: string
      email: string
      fullName: string
      role: UserRole
      status: UserStatus
      avatarUrl: string
    }
    access_token: string
  }
}
