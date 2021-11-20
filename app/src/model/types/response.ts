export interface AnyResponse {
  [key: string]: string | unknown;

  responseStatus?: string;
  responseId?: string;
  responseTitle?: string;
  responseMessage?: string;
}

export interface ReportResponse extends AnyResponse {
  data?: number[];
  fileName?: string;
}
