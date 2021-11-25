import { ContentType, Credentials, Headers, Method } from '~enums/Http';
import { Either, left, right } from '@sweet-monads/either';
import TimeoutException, { timeoutException } from '~exceptions/TimeoutException';
import { EMPTY_STRING } from '~const/common';
import JsonParsingException, { jsonParsingException } from '~exceptions/JsonParsingException';
import { JSON_PARSING_ERROR } from '~const/log';

const initRequestDetail = (otherHeaders: Record<string, unknown> = {}): RequestInit => ({
  credentials: Credentials.SAME_ORIGIN,
  headers: {
    ...otherHeaders,
    Accept: ContentType.JSON,
    [Headers.CONTENT_TYPE]: ContentType.URL_ENCODED_UTF_8
  }
});

export const wrapFetch = async (input: RequestInfo, init: RequestInit): Promise<Either<TimeoutException, Response>> => {
  try {
    const data = await fetch(input, init);
    return right(data);
  } catch (e) {
    return left(timeoutException(e instanceof Error ? e.message : JSON.stringify(e)));
  }
};

export const fetchGet = async (
  endpoint: string,
  headers: Record<string, unknown> = {}
): Promise<Either<TimeoutException, Response>> => await wrapFetch(
  endpoint,
  {
    ...initRequestDetail(headers),
    method: Method.GET
  }
);

export const fetchPost = async (
  endpoint: string,
  body: string = EMPTY_STRING,
  headers: Record<string, unknown> = {}
): Promise<Either<TimeoutException, Response>> => await wrapFetch(
  endpoint,
  {
    ...initRequestDetail(headers),
    method: Method.POST,
    body
  }
);

export const wrapJson = async <T> (response: Response): Promise<Either<JsonParsingException, T>> => {
  try {
    const json = await response.json() as T;
    return right(json);
  } catch (e) {
    return left(jsonParsingException(JSON_PARSING_ERROR));
  }
};
