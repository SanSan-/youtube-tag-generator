import ActionType from '~enums/module/TagsGenerator';
import { TagsState } from '~types/state';
import { TagsAction } from '~types/action';
import produce from 'immer';
import { saveBase64StringAsFile } from '~utils/SaveUtils';

export const initialState: TagsState = {
  tagsCloud: [],
  isLoadingExport: false,
  isLoadingGeneration: false,
  isLoadingStatistic: false
};

const startExport = (draft: TagsState): TagsState => {
  draft.isLoadingExport = true;
  return draft;
};

const endExport = (draft: TagsState): TagsState => {
  draft.isLoadingExport = false;
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

const exportSuccess = (draft: TagsState, data: string, fileName: string): TagsState => {
  saveBase64StringAsFile(data, fileName);
  return endExport(draft);
};

const generationSuccess = (draft: TagsState, data: string[]): TagsState => {
  draft.tagsCloud = data;
  return endGeneration(draft);
};

const loadStatisticSuccess = (draft: TagsState): TagsState => endLoadStatistic(draft);

const tagsGenerator = (state: TagsState = initialState, action: TagsAction): TagsState =>
  produce(state, (draft: TagsState): TagsState => {
    switch (action.type) {
      case ActionType.EXPORT_TO_EXCEL_SUCCESS:
        return exportSuccess(draft, action.binaryData.toString(), action.fileName);
      case ActionType.START_EXPORT_TO_EXCEL:
        return startExport(draft);
      case ActionType.END_EXPORT_TO_EXCEL:
        return endExport(draft);
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
      case ActionType.INIT:
        return initialState;
      default:
        return draft;
    }
  });

export default tagsGenerator;
