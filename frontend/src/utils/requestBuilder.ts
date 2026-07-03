export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface FilterParams {
  search?: string
  status?: string
  [key: string]: string | number | boolean | undefined
}

export class RequestBuilder {
  private url: string
  private params: Record<string, string | number | boolean> = {}

  constructor(endpoint: string) {
    this.url = endpoint
  }

  withPagination(params: PaginationParams): this {
    if (params.page) this.params.page = params.page
    if (params.limit) this.params.limit = params.limit
    if (params.sort_by) this.params.sort_by = params.sort_by
    if (params.sort_order) this.params.sort_order = params.sort_order
    return this
  }

  withFilters(filters: FilterParams): this {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        this.params[key] = value
      }
    })
    return this
  }

  withParam(key: string, value: string | number | boolean): this {
    if (value !== undefined && value !== null && value !== '') {
      this.params[key] = value
    }
    return this
  }

  build(): string {
    const stringParams: Record<string, string> = {}
    Object.entries(this.params).forEach(([key, value]) => {
      stringParams[key] = String(value)
    })
    const queryString = new URLSearchParams(stringParams).toString()
    return queryString ? `${this.url}?${queryString}` : this.url
  }

  getParams(): Record<string, string | number | boolean> {
    return this.params
  }
}

export const buildUrl = (endpoint: string, params?: PaginationParams & FilterParams): string => {
  const builder = new RequestBuilder(endpoint)
  if (params) {
    builder.withPagination(params).withFilters(params)
  }
  return builder.build()
}
