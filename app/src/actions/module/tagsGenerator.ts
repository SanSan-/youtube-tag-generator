import { TagsAction, ThunkResult } from '~types/action';
import ActionType from '~enums/module/TagsGenerator';
import { exportApi } from '~dictionaries/backend';
import { exportToExcelAction } from '~utils/SaveUtils';

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

export const exportData = (json: string): ThunkResult<Promise<void>, TagsAction> => exportToExcelAction(
  { json }, exportApi.toExcel, exportSuccess, endExport);
