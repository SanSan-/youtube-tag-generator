import Header from '~types/classes/Header';
import { ReactNode } from 'react';

export interface DefaultState {
  [key: string]: unknown;
}

export interface DefaultStringState {
  [key: string]: string;
}

export interface DefaultNumberState {
  [key: string]: number;
}

/**
 * BackendState interfaces
 */

export type RequestState = DefaultState

/**
 * CommonState interfaces
 */

export interface SpinnerState extends DefaultState {
  counter: number;
  message?: string;
  timestamp?: number;
}

export interface ModalState extends DefaultStringState {
  layerId?: string;
  title?: string;
  data?: string;
}

export interface CommonDialog extends DefaultState {
  type?: string;
  index?: number;
  title?: string;
  message?: ReactNode;
  okLabel?: string;
  cancelLabel?: string;
  details?: string;
}

export interface PromiseDialog extends CommonDialog {
  resolve: Promise<Response>;
  reject: Promise<void>;
}

/**
 * ModuleState interfaces
 */

export interface PageableState extends DefaultState {
  totalRecords: number;
  pageSizeOptions: string[];
  tableHeaders?: Header[]
}

export interface SortableState extends DefaultState {
  sortKey?: string;
  sortType?: string;
}

export interface BreadcrumbState extends DefaultStringState {
  title: string;
  link: string;
}

export interface TagsState {
  isLoadingExport?: boolean;
}

/**
 * Summary interfaces
 */

export interface BackendState extends DefaultState {
  request?: RequestState;
}

export interface CommonState extends DefaultState {
  spinner?: number;
  spinnerMessage?: string;
  spinnerTimestamp?: number;
  spinners?: Record<string, SpinnerState>;
  background?: boolean;
  modals?: ModalState[];
  dialogs?: PromiseDialog[]
}

export interface ModuleState extends DefaultState {
  breadcrumbs?: BreadcrumbState[];
  tagsGenerator?: TagsState;
}
