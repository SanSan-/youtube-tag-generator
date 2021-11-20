import { AnyAction } from 'redux';
import { DefaultDispatch } from '~types/store';
import { GetStateAction } from '~types/action';
import { DefaultState, DefaultStringState } from '~types/state';

export interface ExceptionType extends DefaultStringState {
  errorType?: string;
  message?: string;
  originalStackTrace?: string;
}

export interface ErrorResponse extends ExceptionType {
  moduleId?: string;
  errorId?: string;
  originalMessage?: string;
}

export type ErrorType = ExceptionType | Error | unknown;
export type Spinner = string | boolean;

export type SpinnerShowCallback = (id?: string, message?: string) => AnyAction;
export type SpinnerHideCallback = (id?: string, force?: boolean) => (
  dispatch: DefaultDispatch, getState: GetStateAction
) => void;

export interface ActionResponse extends DefaultState {
  objectId?: string;
  isSuccess?: boolean;
  message?: string;
}
