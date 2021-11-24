import { DefaultState } from '~types/state';
import { StringBiRecordType } from '~types/dto';

export type ValidateStatus = '' | 'success' | 'warning' | 'error' | 'validating';

export interface ValidatorState {
  [key: string]: ValidateStatus | string;

  validateStatus?: ValidateStatus;
  help: string;
}

export interface LabelType extends DefaultState {
  text: string;
  maxRows?: number;
  labelCol?: number;
  wrapperCol?: number;
}

export interface FilterBuffer<T extends StringBiRecordType> {
  [key: string]: T | Record<string, unknown>;

  filter?: T;
  validators?: Record<string, unknown>;
}

/**
 * User filters
 */

export interface TagsGeneratorFilter extends StringBiRecordType {
  fileName?: string;
  jwtToken?: string;
}
