export enum APIResponseStatusEnum {
  success,
  error,
}

export interface APIResponse<T> {
  status: APIResponseStatusEnum;
  error?: string;
  data?: T;
}
