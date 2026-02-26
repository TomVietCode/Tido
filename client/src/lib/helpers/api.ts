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
