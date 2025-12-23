export const sendRequest = async <T>(props: IRequest) => {
  let { url, method, body, queryParams, headers, nextOption } = props
  const baseUrl = process.env.NEXT_PUBLIC_API_URL

  if (url.startsWith("/")) {
    url = `${baseUrl}${url}`
  }

  // Query Params
  if (queryParams) {
    const searchParams = new URLSearchParams()
    for (const key in queryParams) {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        searchParams.append(key, queryParams[key].toString())
      }
    }
    const queryString = searchParams.toString()
    if (queryString) {
      url = `${url}${url.includes("?") ? "&" : "?"}${queryString}`
    }
  }

  // B. Cấu hình Fetch Options
  const options: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: new Headers({
      "Content-Type": "application/json",
      ...headers,
    }),
    body: body ? JSON.stringify(body) : undefined,
    next: nextOption,
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T 
    } else {
      return res.json().then(function (json) {
        return {
          statusCode: res.status,
          success: false,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T
      })
    }
  })
}
