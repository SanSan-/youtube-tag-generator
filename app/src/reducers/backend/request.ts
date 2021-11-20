import { RequestState } from '~types/state';
import { RequestAction } from '~types/action';
import produce from 'immer';

export const initialState: RequestState = {};

const request = (state: RequestState = initialState, action: RequestAction): RequestState =>
  produce(state, (draft: RequestState): RequestState => {
    switch (action.type) {
      default:
        return draft;
    }
  });

export default request;
