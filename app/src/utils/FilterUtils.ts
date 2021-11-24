import { FilterBuffer, ValidateStatus, ValidatorState } from '~types/filter';
import { Dispatch, SetStateAction } from 'react';
import produce from 'immer';
import { StringBiRecordType } from '~types/dto';

export const createSetValidator = (
  setValidators: Dispatch<SetStateAction<Record<string, ValidatorState>>>
): (key: string, validateStatus: ValidateStatus, help: string) => void =>
  (key: string, validateStatus: ValidateStatus, help: string): void => {
    setValidators((prevState) => produce(prevState, (draft: Record<string, ValidatorState>) => {
      draft[key] = {
        validateStatus,
        help
      };
    }));
  };

export const handleUpdateFilter = <T extends StringBiRecordType> (
  key: string,
  value: string | boolean,
  setFilter: Dispatch<SetStateAction<T>>,
  setBuffer?: Dispatch<SetStateAction<FilterBuffer<T>>>
): void => {
  setFilter((prevState) => produce(prevState, (draft: T) => {
    draft[key] = value;
  }));
  setBuffer && setBuffer({});
};
