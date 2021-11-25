import { AnyAction } from 'redux';
import { Either, left, right } from '@sweet-monads/either';
import { hideSpinner, showResponseError, showSpinner } from '~actions/common';
import { fetchPost, wrapJson } from '~actions/backend/fetch';
import { UNAUTHENTICATED_ANSWER } from '~const/settings';
import Exceptions from '~enums/Exceptions';
import { ContentType, DispositionType, Headers, ResponseStatus } from '~enums/Http';
import { ControllerPath } from '~enums/Routes';
import Type from '~enums/Types';
import ResultStatus from '~enums/ResultStatus';
import { AsyncOptions, ThunkResult } from '~types/action';
import { ErrorType, ExceptionType, Spinner, SpinnerHideCallback, SpinnerShowCallback } from '~types/dto';
import { AnyResponse } from '~types/response';
import AccessDeniedException, { accessDeniedException } from '~exceptions/AccessDeniedException';
import ApplicationException, { applicationException } from '~exceptions/ApplicationException';
import JsonParsingException from '~exceptions/JsonParsingException';
import TimeoutException from '~exceptions/TimeoutException';
import TransportNoRouteException, { transportNoRouteException } from '~exceptions/TransportNoRouteException';
import UnexpectedException from '~exceptions/UnexpectedException';
import UnknownCommunicationException from '~exceptions/UnknownCommunicationException';
import { ACCESS_DENIED, ENDPOINT_NOT_AVAILABLE, INCORRECT_SERVER_RESULT, UNKNOWN_RESULT } from '~const/log';
import { AMPERSAND_SIGN, EMPTY_ACTION, EQUAL_SIGN, SPACE_SIGN, ZERO_SIGN } from '~const/common';
import saveAs from 'file-saver';

export const defaultOptions: AsyncOptions = {
  controllerPath: ControllerPath.INVOKE,
  moduleId: SERVER_MODULE_NAME,
  spinner: true
};

const processSpinner = (
  spinner: Spinner,
  callback: SpinnerShowCallback | SpinnerHideCallback
): ThunkResult<unknown, AnyAction> => (dispatch) => {
  if (typeof spinner === Type.STRING) {
    return dispatch(callback(spinner as string));
  } else if (spinner === true) {
    return dispatch(callback());
  }
};

export const processStart = (spinner: Spinner): ThunkResult<void, AnyAction> => processSpinner(spinner, showSpinner);
export const processEnd = (spinner: Spinner): ThunkResult<void, AnyAction> => processSpinner(spinner, hideSpinner);

export const handleErrorJson = (
  error: ExceptionType,
  unknownResultCallback?: () => Either<ErrorType, unknown>
): Either<ErrorType, unknown> => {
  switch (error.errorType) {
    case Exceptions.ACCESS_DENIED_EXCEPTION: {
      return left(new AccessDeniedException(error));
    }
    case Exceptions.APPLICATION_EXCEPTION: {
      return left(new ApplicationException(error));
    }
    case Exceptions.JSON_PARSING_EXCEPTION: {
      return left(new JsonParsingException(error));
    }
    case Exceptions.TIMEOUT_EXCEPTION: {
      return left(new TimeoutException(error));
    }
    case Exceptions.TRANSPORT_NO_ROUTE_EXCEPTION: {
      return left(new TransportNoRouteException(error));
    }
    case Exceptions.UNEXPECTED_EXCEPTION: {
      return left(new UnexpectedException(error));
    }
    case Exceptions.UNKNOWN_COMMUNICATION_EXCEPTION: {
      return left(new UnknownCommunicationException(error));
    }
    default: {
      return unknownResultCallback();
    }
  }
};

const executeRequestOk = (response: Response, requestOptions: AsyncOptions):
  ThunkResult<Promise<Either<ErrorType, AnyResponse | unknown>>, AnyAction> => async (dispatch) => {
  const contentType = response.headers.get(Headers.CONTENT_TYPE);
  const disposition = response.headers.get(Headers.CONTENT_DISPOSITION);
  if (contentType && contentType.startsWith(ContentType.HTML)) {
    return left(applicationException(UNAUTHENTICATED_ANSWER));
  }
  if (response.headers.get(Headers.CONTENT_LENGTH) === ZERO_SIGN) {
    return right(null);
  }
  if (requestOptions.controllerPath === ControllerPath.DOWNLOAD) {
    return right(response);
  }
  if (disposition && disposition.includes(DispositionType.ATTACHMENT)) {
    const blob = await response.blob();
    const startIndex = disposition.indexOf(Headers.FILENAME) + Headers.FILENAME.length;
    const endIndex = disposition.indexOf(Headers.FILENAME_END);
    const fileName = disposition.substring(startIndex, endIndex);
    saveAs(new Blob([blob], { type: contentType }), fileName);
    return right(null);
  }
  const json = await wrapJson<AnyResponse>(response);
  return json.mapRight((answer) => {
    if (answer && answer.responseStatus === ResultStatus.FATAL) {
      dispatch(showResponseError(answer));
    }
    return answer;
  });
};

const handleErrorResponse = (response: Response, text: string): Either<ErrorType, unknown> => {
  const handleUnknownResult = (): Either<ErrorType, unknown> => {
    // eslint-disable-next-line no-console
    console.error(`${UNKNOWN_RESULT}${text}`);
    return left(new Error(`${INCORRECT_SERVER_RESULT}${response.status}${SPACE_SIGN}${response.statusText}`));
  };
  if (response.status >= ResponseStatus._400 && response.status <= ResponseStatus._599) {
    let json;
    try {
      json = JSON.parse(text) as ExceptionType;
    } catch (_e) {
      return handleUnknownResult();
    }
    return handleErrorJson(json, handleUnknownResult);
  }
  return handleUnknownResult();
};

const fetchRequest = (endpoint: string, body: string, options: AsyncOptions):
  ThunkResult<Promise<Either<ErrorType, AnyResponse | unknown>>, AnyAction> => async (dispatch) => {
  const answer = await fetchPost(endpoint, body, options.headers);
  return answer.asyncChain(async (response) => {
    switch (response.status) {
      case ResponseStatus._200:
        return await dispatch(executeRequestOk(response, options));
      case ResponseStatus._403:
        return left(accessDeniedException(ACCESS_DENIED));
      case ResponseStatus._404:
        return left(transportNoRouteException(ENDPOINT_NOT_AVAILABLE));
      default: {
        const text = await response.text();
        return handleErrorResponse(response, text);
      }
    }
  });
};

export const executeRequest = <T extends AnyResponse> (
  endpoint: string,
  parameters?: Record<string, unknown>,
  options: AsyncOptions = null
): ThunkResult<Promise<Either<ErrorType, T>>, AnyAction> => async (dispatch) => {
    const requestOptions = { ...defaultOptions, ...options };
    dispatch(processStart(requestOptions.spinner));
    const body = Object.keys(parameters).map((key: string): string =>
      `${encodeURIComponent(key)}${EQUAL_SIGN}${encodeURIComponent(JSON.stringify(parameters[key]))}`
    ).join(AMPERSAND_SIGN);
    const response = await dispatch(fetchRequest(endpoint, body, { ...requestOptions })) as Either<ErrorType, T>;
    dispatch(processEnd(requestOptions.spinner));
    return response.mapLeft((error) => {
      throw error;
    });
  };

export const wrapResponse = (response: AnyResponse, successAction: AnyAction, errorAction = EMPTY_ACTION):
  ThunkResult<void, AnyAction> => (dispatch) => {
  if (response.responseStatus !== ResultStatus.SUCCESS) {
    dispatch(showResponseError(response));
    if (response.responseStatus === ResultStatus.WARNING) {
      dispatch(successAction);
    } else {
      dispatch(errorAction);
    }
  } else {
    dispatch(successAction);
  }
};
