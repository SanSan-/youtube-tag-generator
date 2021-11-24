import { TagsAction, ThunkResult } from '~types/action';
import ActionType from '~enums/module/TagsGenerator';
import { exportApi } from '~dictionaries/backend';
import { exportToExcelAction, parseJsonToCsv } from '~utils/SaveUtils';
import { getTagsCloud } from '~utils/TagsUtils';
import { TagCloudItem } from '~types/state';

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

export const startTagsGeneration = (): TagsAction => ({
  type: ActionType.START_TAGS_GENERATION
});

export const endTagsGeneration = (): TagsAction => ({
  type: ActionType.END_TAGS_GENERATION
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
  fileName: string, json: T[], type: string): ThunkResult<Promise<void>, TagsAction> => exportToExcelAction(
    { fileName, json, type }, exportApi.toExcel, startToXlsExport, endToXlsExport);

export const generateTagsCloud = (cloudMap: string[][]): ThunkResult<void, TagsAction> => (dispatch) => {
  dispatch(startTagsGeneration());
  try {
    const tagsCloud = getTagsCloud(cloudMap);
    dispatch(tagsGenerationSuccess(tagsCloud));
  } finally {
    dispatch(endTagsGeneration());
  }
};
