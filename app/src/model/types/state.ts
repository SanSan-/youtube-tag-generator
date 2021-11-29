import Header from '~types/classes/Header';
import React, { ReactElement, ReactNode } from 'react';
import { Table } from 'antd';

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

export type EditableTableProps = Parameters<typeof Table>[0];

export type TagsType = Record<React.Key, string[]>;

export type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export interface DataType {
  key: React.Key;
  keywords: ReactElement;
}

export interface EditableTableState {
  keywords: TagsType;
  dataSource: DataType[];
  count: number;
}

/**
 * ModuleState interfaces
 */

export interface PageableState extends DefaultState {
  totalRecords: number;
  pageSizeOptions: string[];
  tableHeaders?: Header[];
}

export interface SortableState extends DefaultState {
  sortKey?: string;
  sortType?: string;
}

export interface BreadcrumbState extends DefaultStringState {
  title: string;
  link: string;
}

export interface TagCloudItem extends DefaultState {
  key?: number;
  tag: string;
}

export interface TagStatisticItem extends TagCloudItem {
  volume: number;
  competition: number;
  rank: number;
}

export interface TagStatisticTableData extends TagCloudItem {
  volume: ReactElement;
  competition: ReactElement;
  rank: ReactElement;
}

export type ConnectionState = 'success' | 'failed' | null;

export interface TagsState extends DefaultState {
  tagsCloud?: string[];
  tagsStatistic?: TagStatisticItem[];
  testConnection?: ConnectionState;
  tagsStatisticCount?: number;
  tagsStatisticStartDate?: number;
  isLoadingExportToJson?: boolean;
  isLoadingExportToCsv?: boolean;
  isLoadingExportToXls?: boolean;
  isLoadingGeneration?: boolean;
  isLoadingStatistic?: boolean;
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
  dialogs?: PromiseDialog[];
}

export interface ModuleState extends DefaultState {
  breadcrumbs?: BreadcrumbState[];
  tagsGenerator?: TagsState;
}
