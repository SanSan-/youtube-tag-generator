import { ValidatorState } from '~types/filter';
import { EMPTY_STRING } from '~const/common';

const defaultValidators: Record<string, ValidatorState> = {
  fileName: {
    validateStatus: null,
    help: EMPTY_STRING
  },
  jwtToken: {
    validateStatus: null,
    help: EMPTY_STRING
  }
};

export default defaultValidators;
