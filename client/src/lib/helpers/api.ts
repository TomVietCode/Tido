export class HttpError extends Error {
  status: number
  error?: string
  payload?: unknown

  constructor(message: string, status: number, error?: string, payload?: unknown) {
    super(message)
    this.name = "HttpError"
    this.status = status
    this.error = error
    this.payload = payload
  }
}

export const sendRequest = async <T>(props: IRequest) => {
  let { url, method, body, queryParams, headers, nextOption } = props
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  if (url.startsWith("/")) {
    url = `${baseUrl}${url}`
  }

  // Query Params
  let queryString = ""

  if (queryParams instanceof URLSearchParams) {
    queryString = queryParams.toString()
  } else if (queryParams) {
    const sp = new URLSearchParams()
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null) sp.append(key, String(value))
    }
    queryString = sp.toString()
  }
  
  if (queryString) {
    url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`
  }

  const options: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: new Headers({
      "Content-Type": "application/json",
      ...headers,
    }),
    body: body ? JSON.stringify(body) : undefined,
    next: nextOption,
  }

  const res = await fetch(url, options)

  let payload: any = null
  try {
    payload = await res.json()
  } catch (error) {
    payload = null
  }

  if (!res.ok) {
    throw new HttpError(
      payload?.message || "Lỗi không xác định!",
      res.status || 500,
      payload?.error,
      payload
    )
  }

  return payload as T
}
