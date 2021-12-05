import ActionType from '~enums/module/TagsGenerator';
import { Keywords, TagsState, TagStatisticItem } from '~types/state';
import { TagsAction } from '~types/action';
import produce from 'immer';
import { saveStringAsFile } from '~utils/SaveUtils';
import { ContentType } from '~enums/Http';
import { CompvolObj, FileActionType } from '~types/response';
import { FileAction, FileContent, FileFormat } from '~enums/File';

export const initialState: TagsState = {
  keywords: {},
  tags: [],
  tagsStatistic: [],
  tagsStatisticCount: 0,
  tagsStatisticStartDate: null,
  testConnection: null,
  isLoadingExportToJson: false,
  isLoadingExportToCsv: false,
  isLoadingExportToXls: false,
  isLoadingGeneration: false,
  isLoadingStatistic: false,
  isFileActionFailed: false
};

const startGeneration = (draft: TagsState): TagsState => {
  draft.isLoadingGeneration = true;
  return draft;
};

const endGeneration = (draft: TagsState): TagsState => {
  draft.isLoadingGeneration = false;
  return draft;
};

const refreshStatistic = (draft: TagsState): TagsState => {
  draft.tagsStatisticCount = 0;
  draft.tagsStatistic = [];
  return draft;
};

const startLoadStatistic = (draft: TagsState): TagsState => {
  draft.isLoadingStatistic = true;
  draft.tagsStatisticStartDate = Date.now();
  return refreshStatistic(draft);
};

const endLoadStatistic = (draft: TagsState): TagsState => {
  draft.isLoadingStatistic = false;
  return draft;
};

const testConnectionSuccess = (draft: TagsState): TagsState => {
  draft.testConnection = 'success';
  return draft;
};

const testConnectionFailed = (draft: TagsState): TagsState => {
  draft.testConnection = 'failed';
  return draft;
};

const testConnectionRefresh = (draft: TagsState): TagsState => {
  draft.testConnection = null;
  return draft;
};

const generationSuccess = (draft: TagsState, data: string[]): TagsState => {
  draft.tags = data;
  return endGeneration(draft);
};

const incStatisticCounter = (draft: TagsState): TagsState => {
  draft.tagsStatisticCount += 1;
  return draft;
};

const addStatisticSuccess = (draft: TagsState, compvol: CompvolObj): TagsState => {
  Object.keys(compvol).forEach((tag) => {
    draft.tagsStatistic.push({
      tag,
      volume: compvol[tag].estimated_monthly_search,
      competition: compvol[tag].competition / 100,
      rank: compvol[tag].overall / 100
    });
  });
  return incStatisticCounter(draft);
};

const fileActionSuccess = (
  draft: TagsState, fileAction: FileActionType, fileName: string, stringData: string, content: unknown): TagsState => {
  draft.isFileActionFailed = false;
  draft.fileActionError = null;
  if (fileAction.actionType === FileAction.EXPORT) {
    switch (fileAction.format) {
      case FileFormat.JSON: {
        saveStringAsFile(stringData, fileName, ContentType.JSON);
        draft.isLoadingExportToJson = false;
        break;
      }
      case FileFormat.CSV: {
        saveStringAsFile(stringData, fileName, ContentType.CSV);
        draft.isLoadingExportToCsv = false;
        break;
      }
      case FileFormat.EXCEL: {
        saveStringAsFile(stringData, fileName, ContentType.XLSX);
        draft.isLoadingExportToXls = false;
        break;
      }
    }
  } else {
    switch (fileAction.contentType) {
      case FileContent.STATISTIC: {
        draft.tagsStatistic = content as TagStatisticItem[];
        break;
      }
      case FileContent.TAGS: {
        draft.tags = content as string[];
        break;
      }
      case FileContent.KEYWORDS: {
        draft.keywords = content as Keywords;
        break;
      }
    }
  }
  return draft;
};

const fileActionFail = (draft: TagsState, importError: string): TagsState => {
  draft.isFileActionFailed = true;
  draft.fileActionError = importError;
  return draft;
};

const switchFileAction = (isLoading: boolean) => (draft: TagsState, fileAction: FileActionType): TagsState => {
  if (fileAction.actionType === FileAction.EXPORT) {
    switch (fileAction.format) {
      case FileFormat.JSON: {
        draft.isLoadingExportToJson = isLoading;
        break;
      }
      case FileFormat.CSV: {
        draft.isLoadingExportToCsv = isLoading;
        break;
      }
      case FileFormat.EXCEL: {
        draft.isLoadingExportToXls = isLoading;
        break;
      }
    }
  }
  return draft;
};

const startFileAction = (draft: TagsState, fileAction: FileActionType): TagsState => switchFileAction(true)(
  draft, fileAction);

const endFileAction = (draft: TagsState, fileAction: FileActionType): TagsState => switchFileAction(false)(
  draft, fileAction);


const tagsGenerator = (state: TagsState = initialState, action: TagsAction): TagsState =>
  produce(state, (draft: TagsState): TagsState => {
    switch (action.type) {
      case ActionType.TAGS_GENERATION_SUCCESS:
        return generationSuccess(draft, action.tagsCloud);
      case ActionType.START_TAGS_GENERATION:
        return startGeneration(draft);
      case ActionType.END_TAGS_GENERATION:
        return endGeneration(draft);
      case ActionType.ADD_STATISTIC_SUCCESS:
        return addStatisticSuccess(draft, action.statisticResponse);
      case ActionType.START_LOAD_STATISTIC:
        return startLoadStatistic(draft);
      case ActionType.END_LOAD_STATISTIC:
        return endLoadStatistic(draft);
      case ActionType.INCREMENT_STATISTIC_COUNT:
        return incStatisticCounter(draft);
      case ActionType.REFRESH_STATISTIC_COUNT:
        return refreshStatistic(draft);
      case ActionType.TEST_CONNECTION_SUCCESS:
        return testConnectionSuccess(draft);
      case ActionType.TEST_CONNECTION_FAILED:
        return testConnectionFailed(draft);
      case ActionType.TEST_CONNECTION_REFRESH:
        return testConnectionRefresh(draft);
      case ActionType.START_FILE_ACTION:
        return startFileAction(draft, action.fileAction);
      case ActionType.END_FILE_ACTION:
        return endFileAction(draft, action.fileAction);
      case ActionType.FILE_ACTION_SUCCESS:
        return fileActionSuccess(draft, action.fileAction, action.fileName, action.stringData, action.importContent);
      case ActionType.FILE_ACTION_FAIL:
        return fileActionFail(draft, action.fileActionError);
      case ActionType.INIT:
        return initialState;
      default:
        return draft;
    }
  });

export default tagsGenerator;
