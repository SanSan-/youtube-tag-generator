import { TagsAction, ThunkResult } from '~types/action';
import ActionType from '~enums/module/TagsGenerator';
import { exportApi } from '~dictionaries/backend';
import { exportToExcelAction } from '~utils/SaveUtils';
import { getTagsCloud } from '~utils/TagsUtils';

export const exportSuccess = (binaryData: number[], fileName: string): TagsAction => ({
  type: ActionType.EXPORT_TO_EXCEL_SUCCESS,
  binaryData,
  fileName
});

export const startExport = (): TagsAction => ({
  type: ActionType.START_EXPORT_TO_EXCEL
});

export const endExport = (): TagsAction => ({
  type: ActionType.END_EXPORT_TO_EXCEL
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

export const exportData = (json: string): ThunkResult<Promise<void>, TagsAction> => exportToExcelAction(
  { json }, exportApi.toExcel, exportSuccess, endExport);

export const generateTagsCloud = (cloudMap: string[][]): ThunkResult<void, TagsAction> => (dispatch) => {
  dispatch(startTagsGeneration());
  try {
    const tagsCloud = getTagsCloud(cloudMap);
    dispatch(tagsGenerationSuccess(tagsCloud));
  } finally {
    dispatch(endTagsGeneration());
  }
};
