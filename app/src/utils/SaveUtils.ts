import saveAs from 'file-saver';
import * as backend from '~actions/backend';
import { EMPTY_STRING } from '~const/common';
import { ContentType } from '~enums/Http';
import { SaveFileResponseAction, ThunkResult } from '~types/action';
import { AnyAction } from 'redux';
import { Either } from '@sweet-monads/either';
import { ErrorType } from '~types/dto';
import { isEmpty, isEmptyArray } from '~utils/CommonUtils';
import { TagItem } from '~types/state';
import { AnyResponse } from '~types/response';

const FILENAME_MASK = /filename[^;\n]*=\s*(UTF-\d['"]*)?((['"]).*?[.]$\2|[^;\n]*)?/gi;

export const saveBase64StringAsFile = (data: string, fileName: string): void => {
  const blob = new Blob(
    [new Uint8Array(window.atob(data).split(EMPTY_STRING).map((symbol) => symbol.charCodeAt(0)))],
    { type: ContentType.OCTET_STREAM }
  );
  saveAs(blob, fileName);
};

export const saveStringAsFile = (data: string, fileName: string, type: string): void => {
  const blob = new Blob(
    [data],
    { type }
  );
  saveAs(blob, fileName);
};

const regexExecAll = (str: string, regex: RegExp) => {
  let lastMatch: RegExpExecArray | null;
  const matches: RegExpExecArray[] = [];
  while ((lastMatch = regex.exec(str))) {
    matches.push(lastMatch);
    if (!regex.global) {
      break;
    }
  }
  return matches;
};

export const parseFileName = (contentDisposition: string): string => {
  const matches = regexExecAll(contentDisposition, FILENAME_MASK);
  if (isEmptyArray(matches)) {
    return EMPTY_STRING;
  }
  if (matches.length > 1) {
    return matches.map((match) => (match.length > 2 ? match[2] : match[0])).reduce((prev, cur) => {
      if (isEmpty(prev)) {
        return cur.replace(/"/gi, EMPTY_STRING);
      }
      return prev === cur ? prev : decodeURI(cur);
    }, EMPTY_STRING);
  }
  return matches.map((match) => (match.length > 2 ? match[2] : match[0]))
    .join(EMPTY_STRING).replace(/"/gi, EMPTY_STRING);
};

export const exportToExcelAction = (
  parameters: Record<string, unknown>,
  endpoint: string,
  startCallback: () => AnyAction,
  errorCallback: () => AnyAction
): ThunkResult<Promise<void>, SaveFileResponseAction> =>
  (dispatch) => {
    dispatch(startCallback());
    return dispatch(backend.executeRequest(endpoint, { ...parameters }, { spinner: false }))
      .then((either: Either<ErrorType, AnyResponse>) => {
        either.mapRight(() =>
          dispatch(errorCallback())
        ).mapLeft(() => dispatch(errorCallback()));
      })
      .catch((response: Error) => {
        // eslint-disable-next-line no-console
        console.error(response);
        dispatch(errorCallback());
      });
  };

export const parseJsonToCsv = <T extends TagItem> (jsonData: T[]): string => {
  if (isEmpty(jsonData)) {
    return EMPTY_STRING;
  }
  const header = Object.keys(jsonData[0]);
  const dataLines = jsonData.map((item) => Object.values(item)
    .toString()
    .replace(/,/g, ', '));
  return header.toString().replace(/,/g, ', ') + '\r\n' + dataLines.join('\r\n');
};
