import * as backend from '~actions/backend';
import { TagsAction, ThunkResult } from '~types/action';
import ActionType from '~enums/module/TagsGenerator';
import { exportApi, tagsApi, vidIqApi } from '~dictionaries/backend';
import { exportToExcelAction, parseJsonToCsv } from '~utils/SaveUtils';
import { TagCloudItem } from '~types/state';
import { CompvolObj, VidIqHotterSearchResponse } from '~types/response';
import { ErrorType } from '~types/dto';
import { Either } from '@sweet-monads/either';
import LocalStorageEnum from '~enums/LocalStorage';

export const startToXlsExport = (): TagsAction => ({
  type: ActionType.START_EXPORT_TO_EXCEL
});

export const endToXlsExport = (): TagsAction => ({
  type: ActionType.END_EXPORT_TO_EXCEL
});

export const exportToXlsSuccess = (fileName: string) => (stringData: string): TagsAction => ({
  type: ActionType.EXPORT_TO_EXCEL_SUCCESS,
  stringData,
  fileName
});

export const startToJsonExport = (): TagsAction => ({
  type: ActionType.START_EXPORT_TO_JSON
});

export const exportToJsonSuccess = (stringData: string, fileName: string): TagsAction => ({
  type: ActionType.EXPORT_TO_JSON_SUCCESS,
  stringData,
  fileName
});

export const startToCsvExport = (): TagsAction => ({
  type: ActionType.START_EXPORT_TO_CSV
});

export const endToCsvExport = (): TagsAction => ({
  type: ActionType.END_EXPORT_TO_CSV
});

export const exportToCsvSuccess = (stringData: string, fileName: string): TagsAction => ({
  type: ActionType.EXPORT_TO_CSV_SUCCESS,
  stringData,
  fileName
});

export const tagsGenerationSuccess = (tagsCloud: string[]): TagsAction => ({
  type: ActionType.TAGS_GENERATION_SUCCESS,
  tagsCloud
});

export const addStatisticSuccess = (tagStatistic: CompvolObj): TagsAction => ({
  type: ActionType.ADD_STATISTIC_SUCCESS,
  tagStatistic
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

export const exportDataToJson = (fileName: string, data: string): ThunkResult<void, TagsAction> => (dispatch) => {
  dispatch(startToJsonExport());
  dispatch(exportToJsonSuccess(data, fileName));
};

export const exportDataToCsv = <T extends TagCloudItem> (
  fileName: string, json: T[]): ThunkResult<void, TagsAction> => (dispatch) => {
    dispatch(startToCsvExport());
    try {
      dispatch(exportToCsvSuccess(parseJsonToCsv(json), fileName));
    } finally {
      endToCsvExport();
    }
  };

export const exportDataToExcel = <T extends TagCloudItem> (
  fileName: string,
  json: T[],
  type: string,
  headers: Record<string, unknown>[],
  conditionalFormatting: Record<string, unknown>[] = []
): ThunkResult<Promise<void>, TagsAction> => exportToExcelAction(
    headers ? { fileName, json, type, headers, conditionalFormatting } : { fileName, json, type }, exportApi.toExcel,
    startToXlsExport,
    endToXlsExport
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

export const collectStatistic = (
  tagsCloud: string[], jwtToken: string): ThunkResult<void, TagsAction> => async (dispatch) => {
  dispatch(startCollectStatistic());
  for (const tag of tagsCloud) {
    await dispatch(getStatistic(tag, jwtToken));
  }
  dispatch(endCollectStatistic());
};
