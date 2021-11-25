import saveAs from 'file-saver';
import * as backend from '~actions/backend';
import { EMPTY_STRING } from '~const/common';
import { ContentType } from '~enums/Http';
import { SaveFileResponseAction, ThunkResult } from '~types/action';
import { AnyAction } from 'redux';
import { Either } from '@sweet-monads/either';
import { ErrorType } from '~types/dto';
import { isEmpty } from '~utils/CommonUtils';
import { TagCloudItem } from '~types/state';
import { AnyResponse } from '~types/response';

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

export const exportToExcelAction = (
  parameters: Record<string, unknown>,
  endpoint: string,
  startCallback: () => AnyAction,
  errorCallback: () => AnyAction
): ThunkResult<Promise<void>, SaveFileResponseAction> =>
  (dispatch) => {
    dispatch(startCallback());
    return dispatch(backend.executeRequest(endpoint, { ...parameters }))
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

export const parseJsonToCsv = <T extends TagCloudItem> (jsonData: T[]): string => {
  if (isEmpty(jsonData)) {
    return EMPTY_STRING;
  }
  const header = Object.keys(jsonData[0]);
  const dataLines = jsonData.map((item) => Object.values(item)
    .toString()
    .replace(/,/g, ', '));
  return header.toString().replace(/,/g, ', ') + '\r\n' + dataLines.join('\r\n');
};
