import { BreadcrumbState, CommonDialog, PromiseDialog } from '~types/state';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GeneralState } from '~types/store';
import { ActionResponse, Spinner } from '~types/dto';
import { CompvolObj, FileActionType } from '~types/response';

export interface GetStateAction {
  (): GeneralState;
}

export type ThunkResult<R, T extends AnyAction> = ThunkAction<R, GeneralState, unknown, T>;

/**
 * Backend action interfaces
 */

export interface AsyncAction {
  moduleId?: string;
  spinner?: Spinner;
}

export interface AsyncOptions extends AsyncAction {
  controllerPath?: string;
  headers?: Record<string, unknown>;
  isGetRequest?: boolean;
}

export interface RequestAction extends AnyAction {
  moduleId: string;
  error?: string;
}

/**
 * Common action interfaces
 */

export interface CommonAction extends AnyAction {
  id?: string;
  index?: number;
  force?: boolean;
  layerId?: string;
  title?: string;
  data?: string;
  message?: string;
  payload?: CommonDialog | PromiseDialog;
}

/**
 * Common action interfaces
 */

export interface BreadcrumbAction extends AnyAction {
  value: BreadcrumbState;
  payload?: Window;
}

export interface TagsAction extends AnyAction {
  fileName?: string;
  binaryData?: number[];
  stringData?: string;
  tagsCloud?: string[];
  statisticResponse?: CompvolObj;
  importContent?: unknown;
  fileActionError?: string;
  fileAction?: FileActionType;
}

export interface SendActionResponseAction extends AnyAction {
  responses?: ActionResponse[];
}

export interface SaveFileResponseAction extends SendActionResponseAction {
  binaryData?: number[];
  fileName?: string;
}
