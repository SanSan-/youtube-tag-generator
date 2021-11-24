import ActionType from '~enums/module/TagsGenerator';
import { TagsState } from '~types/state';
import { TagsAction } from '~types/action';
import produce from 'immer';
import { saveStringAsFile } from '~utils/SaveUtils';
import { ContentType } from '~enums/Http';

export const initialState: TagsState = {
  tagsCloud: [],
  isLoadingExportToJson: false,
  isLoadingExportToCsv: false,
  isLoadingExportToXls: false,
  isLoadingGeneration: false,
  isLoadingStatistic: false
};

const startExportToJson = (draft: TagsState): TagsState => {
  draft.isLoadingExportToJson = true;
  return draft;
};

const endExportToJson = (draft: TagsState): TagsState => {
  draft.isLoadingExportToJson = false;
  return draft;
};

const startExportToCsv = (draft: TagsState): TagsState => {
  draft.isLoadingExportToCsv = true;
  return draft;
};

const endExportToCsv = (draft: TagsState): TagsState => {
  draft.isLoadingExportToCsv = false;
  return draft;
};

const startExportToXls = (draft: TagsState): TagsState => {
  draft.isLoadingExportToXls = true;
  return draft;
};

const endExportToXls = (draft: TagsState): TagsState => {
  draft.isLoadingExportToXls = false;
  return draft;
};

const startGeneration = (draft: TagsState): TagsState => {
  draft.isLoadingGeneration = true;
  return draft;
};

const endGeneration = (draft: TagsState): TagsState => {
  draft.isLoadingGeneration = false;
  return draft;
};

const startLoadStatistic = (draft: TagsState): TagsState => {
  draft.isLoadingStatistic = true;
  return draft;
};

const endLoadStatistic = (draft: TagsState): TagsState => {
  draft.isLoadingStatistic = false;
  return draft;
};

const exportToJsonSuccess = (draft: TagsState, data: string, fileName: string): TagsState => {
  saveStringAsFile(data, fileName, ContentType.JSON);
  return endExportToJson(draft);
};

const exportToCsvSuccess = (draft: TagsState, data: string, fileName: string): TagsState => {
  saveStringAsFile(data, fileName, ContentType.CSV);
  return endExportToCsv(draft);
};

const exportToXlsSuccess = (draft: TagsState, data: string, fileName: string): TagsState => {
  saveStringAsFile(data, fileName, ContentType.XLSX);
  return endExportToXls(draft);
};

const generationSuccess = (draft: TagsState, data: string[]): TagsState => {
  draft.tagsCloud = data;
  return endGeneration(draft);
};

const loadStatisticSuccess = (draft: TagsState): TagsState => endLoadStatistic(draft);

const tagsGenerator = (state: TagsState = initialState, action: TagsAction): TagsState =>
  produce(state, (draft: TagsState): TagsState => {
    switch (action.type) {
      case ActionType.TAGS_GENERATION_SUCCESS:
        return generationSuccess(draft, action.tagsCloud);
      case ActionType.START_TAGS_GENERATION:
        return startGeneration(draft);
      case ActionType.END_TAGS_GENERATION:
        return endGeneration(draft);
      case ActionType.LOAD_STATISTIC_SUCCESS:
        return loadStatisticSuccess(draft);
      case ActionType.START_LOAD_STATISTIC:
        return startLoadStatistic(draft);
      case ActionType.END_LOAD_STATISTIC:
        return endLoadStatistic(draft);
      case ActionType.EXPORT_TO_JSON_SUCCESS:
        return exportToJsonSuccess(draft, action.stringData, action.fileName);
      case ActionType.START_EXPORT_TO_JSON:
        return startExportToJson(draft);
      case ActionType.END_EXPORT_TO_JSON:
        return endExportToJson(draft);
      case ActionType.EXPORT_TO_CSV_SUCCESS:
        return exportToCsvSuccess(draft, action.stringData, action.fileName);
      case ActionType.START_EXPORT_TO_CSV:
        return startExportToCsv(draft);
      case ActionType.END_EXPORT_TO_CSV:
        return endExportToCsv(draft);
      case ActionType.EXPORT_TO_EXCEL_SUCCESS:
        return exportToXlsSuccess(draft, action.stringData, action.fileName);
      case ActionType.START_EXPORT_TO_EXCEL:
        return startExportToXls(draft);
      case ActionType.END_EXPORT_TO_EXCEL:
        return endExportToXls(draft);
      case ActionType.INIT:
        return initialState;
      default:
        return draft;
    }
  });

export default tagsGenerator;
