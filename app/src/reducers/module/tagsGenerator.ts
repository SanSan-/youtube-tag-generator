import ActionType from '~enums/module/TagsGenerator';
import { TagsState } from '~types/state';
import { TagsAction } from '~types/action';
import produce from 'immer';
import { saveBase64StringAsFile } from '~utils/SaveUtils';

export const initialState: TagsState = {
  isLoadingExport: false
};

const startExport = (draft: TagsState): TagsState => {
  draft.isLoadingExport = true;
  return draft;
};

const endExport = (draft: TagsState): TagsState => {
  draft.isLoadingExport = true;
  return draft;
};

const exportSuccess = (draft: TagsState, data: string, fileName: string): TagsState => {
  saveBase64StringAsFile(data, fileName);
  return endExport(draft);
};

const tagsGenerator = (state: TagsState = initialState, action: TagsAction): TagsState =>
  produce(state, (draft: TagsState): TagsState => {
    switch (action.type) {
      case ActionType.EXPORT_TO_EXCEL_SUCCESS:
        return exportSuccess(draft, action.binaryData.toString(), action.fileName);
      case ActionType.START_EXPORT_TO_EXCEL:
        return startExport(draft);
      case ActionType.END_EXPORT_TO_EXCEL:
        return endExport(draft);
      case ActionType.INIT:
        return initialState;
      default:
        return draft;
    }
  });

export default tagsGenerator;
