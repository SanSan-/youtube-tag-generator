import * as backend from '~actions/backend';
import { TagsAction, ThunkResult } from '~types/action';
import ActionType from '~enums/module/TagsGenerator';
import { exportApi, tagsApi, vidIqApi } from '~dictionaries/backend';
import { exportToExcelAction, parseJsonToCsv } from '~utils/SaveUtils';
import { Keywords, TagItem } from '~types/state';
import { CompvolObj, FileActionType, VidIqHotterSearchResponse } from '~types/response';
import { ErrorType } from '~types/dto';
import { Either } from '@sweet-monads/either';
import LocalStorageEnum from '~enums/LocalStorage';
import { FileAction, FileContent, FileFormat } from '~enums/File';
import { EMPTY_STRING } from '~const/common';

export const tagsGenerationSuccess = (tagsCloud: string[]): TagsAction => ({
  type: ActionType.TAGS_GENERATION_SUCCESS,
  tagsCloud
});

export const addStatisticSuccess = (statisticResponse: CompvolObj): TagsAction => ({
  type: ActionType.ADD_STATISTIC_SUCCESS,
  statisticResponse
});

export const startTagsGeneration = (): TagsAction => ({
  type: ActionType.START_TAGS_GENERATION
});

export const endTagsGeneration = (): TagsAction => ({
  type: ActionType.END_TAGS_GENERATION
});

export const startCollectStatistic = (): TagsAction => ({
  type: ActionType.START_LOAD_STATISTIC
});

export const endCollectStatistic = (): TagsAction => ({
  type: ActionType.END_LOAD_STATISTIC
});

const testConnectionSuccess = (): TagsAction => ({
  type: ActionType.TEST_CONNECTION_SUCCESS
});

const testConnectionFailed = (): TagsAction => ({
  type: ActionType.TEST_CONNECTION_FAILED
});

export const testConnectionRefresh = (): TagsAction => ({
  type: ActionType.TEST_CONNECTION_REFRESH
});

const incStatisticCounter = (): TagsAction => ({
  type: ActionType.INCREMENT_STATISTIC_COUNT
});

export const refreshStatisticCounter = (): TagsAction => ({
  type: ActionType.REFRESH_STATISTIC_COUNT
});

export const startFileAction = (fileAction: FileActionType): TagsAction => ({
  type: ActionType.START_FILE_ACTION,
  fileAction
});

export const endFileAction = (fileAction: FileActionType): TagsAction => ({
  type: ActionType.END_FILE_ACTION,
  fileAction
});

export const fileActionSuccess = (
  fileAction: FileActionType, stringData?: string, fileName?: string, importContent?: unknown
): TagsAction => ({
  type: ActionType.FILE_ACTION_SUCCESS,
  fileAction,
  stringData,
  fileName,
  importContent
});

export const fileActionFailed = (fileAction: FileActionType, fileActionError?: string): TagsAction => ({
  type: ActionType.FILE_ACTION_FAIL,
  fileActionError,
  fileAction
});

const getKeyByFileContentType = (contentType: string): string => {
  switch (contentType) {
    case FileContent.TAGS:
      return 'tags';
    case FileContent.KEYWORDS:
      return 'keywords';
    case FileContent.STATISTIC:
      return 'tagsStatistic';
    default:
      return EMPTY_STRING;
  }
};

export const importFromJson = (
  fileAction: FileActionType, data: string): ThunkResult<void, TagsAction> => (dispatch) => {
  try {
    const json = JSON.parse(data) as Record<string, unknown> | Record<string, unknown>[];
    switch (fileAction.contentType) {
      case FileContent.STATISTIC: {
        if (json instanceof Array) {
          dispatch(
            fileActionSuccess(
              { ...fileAction, format: FileFormat.JSON, actionType: FileAction.IMPORT }, null, null, json));
        } else if (json instanceof Object &&
          Object.keys(json).includes(getKeyByFileContentType(fileAction.contentType))) {
          dispatch(
            fileActionSuccess({ ...fileAction, format: FileFormat.JSON, actionType: FileAction.IMPORT }, null, null,
              json[getKeyByFileContentType(fileAction.contentType)] as unknown[]
            ));
        } else {
          dispatch(fileActionFailed({ ...fileAction, format: FileFormat.JSON, actionType: FileAction.IMPORT }));
        }
        break;
      }
      case FileContent.TAGS: {
        dispatch(
          fileActionSuccess(
            { ...fileAction, format: FileFormat.JSON, actionType: FileAction.IMPORT }, null, null, json));
        break;
      }
      case FileContent.KEYWORDS: {
        dispatch(
          fileActionSuccess({ ...fileAction, format: FileFormat.JSON, actionType: FileAction.IMPORT }, null, null,
            json as Keywords
          ));
        break;
      }
    }
  } catch (error) {
    dispatch(fileActionFailed({ ...fileAction, format: FileFormat.JSON, actionType: FileAction.IMPORT }, error));
  }
};

export const exportDataToJson = (fileName: string, data: string): ThunkResult<void, TagsAction> => (dispatch) => {
  dispatch(startFileAction({ actionType: FileAction.EXPORT, format: FileFormat.JSON }));
  dispatch(fileActionSuccess({ actionType: FileAction.EXPORT, format: FileFormat.JSON }, data, fileName));
};

export const exportDataToCsv = <T extends TagItem> (
  fileName: string, json: T[]): ThunkResult<void, TagsAction> => (dispatch) => {
    dispatch(startFileAction({ actionType: FileAction.EXPORT, format: FileFormat.CSV }));
    try {
      dispatch(
        fileActionSuccess({ actionType: FileAction.EXPORT, format: FileFormat.CSV }, parseJsonToCsv(json), fileName));
    } finally {
      endFileAction({ actionType: FileAction.EXPORT, format: FileFormat.CSV });
    }
  };

export const exportDataToExcel = <T extends TagItem> (
  fileName: string,
  json: T[],
  type: string,
  headers: Record<string, unknown>[],
  conditionalFormatting: Record<string, unknown>[] = []
): ThunkResult<Promise<void>, TagsAction> => exportToExcelAction(
    headers ? { fileName, json, type, headers, conditionalFormatting } : { fileName, json, type }, exportApi.toExcel,
    () => startFileAction({ actionType: FileAction.EXPORT, format: FileFormat.EXCEL }),
    () => endFileAction({ actionType: FileAction.EXPORT, format: FileFormat.EXCEL })
  );

export const generateTagsCloud = (cloudMap: string[][]): ThunkResult<void, TagsAction> => (dispatch) => {
  dispatch(startTagsGeneration());
  dispatch(backend.executeRequest(tagsApi.generate, { map: cloudMap }, { spinner: false }))
    .then((either: Either<ErrorType, string[]>) => {
      either.mapRight((response) => dispatch(tagsGenerationSuccess(response)))
        .mapLeft(() => dispatch(endTagsGeneration()));
    })
    .catch((response: Error) => {
      // eslint-disable-next-line no-console
      console.error(response);
      dispatch(endTagsGeneration());
    });
};

export const testConnection = (jwtToken: string): ThunkResult<Promise<void>, TagsAction> => (dispatch) => (
  dispatch(backend.executeRequest(vidIqApi('геншин').hotterSearch, {},
    { headers: { Accept: 'application/json', Authorization: `Bearer ${jwtToken}` }, isGetRequest: true }
  ))
    .then((either: Either<ErrorType, VidIqHotterSearchResponse>) => {
      either.mapRight((response) => {
        localStorage.setItem(LocalStorageEnum.VID_IQ_JWT_TOKEN, jwtToken);
        return dispatch(
          backend.wrapResponse(Object.keys(response.search_stats.compvol).includes('геншин'), testConnectionSuccess(),
            testConnectionFailed()
          ));
      })
        .mapLeft(() => dispatch(testConnectionFailed()));
    })
    // eslint-disable-next-line no-console
    .catch((response: Error) => console.error(response))
);

const getStatistic = (tag: string, jwtToken: string): ThunkResult<Promise<void>, TagsAction> => (dispatch) => (
  dispatch(backend.executeRequest(vidIqApi(tag).hotterSearch, {},
    { headers: { Accept: 'application/json', Authorization: `Bearer ${jwtToken}` }, isGetRequest: true, spinner: false }
  ))
    .then((either: Either<ErrorType, VidIqHotterSearchResponse>) => {
      either.mapRight((response) => dispatch(
        backend.wrapResponse(
          Object.keys(response.search_stats.compvol).includes(tag),
          addStatisticSuccess(response.search_stats.compvol),
          incStatisticCounter()
        )))
        .mapLeft(() => dispatch(testConnectionFailed()));
    })
    // eslint-disable-next-line no-console
    .catch((response: Error) => console.error(response))
);

const collectStatisticParallel = (
  tags: string[], jwtToken: string): ThunkResult<Promise<void>, TagsAction> => (dispatch) => (Promise.allSettled(
  tags.map((tag) => dispatch(getStatistic(tag, jwtToken))))
  // eslint-disable-next-line no-console
  .catch((response: Error) => console.error(response)));

export const collectStatistic = (
  tagsCloud: string[], jwtToken: string, threadCount = 3): ThunkResult<void, TagsAction> => async (dispatch) => {
  dispatch(startCollectStatistic());
  let start = 0;
  while (start < tagsCloud.length) {
    await dispatch(collectStatisticParallel(tagsCloud.slice(start, start + threadCount), jwtToken));
    start += threadCount;
  }
  dispatch(endCollectStatistic());
};
