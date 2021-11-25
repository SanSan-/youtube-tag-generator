import { TagsGeneratorFilter } from '~types/filter';
import LocalStorageEnum from '~enums/LocalStorage';

const defaultFilter: TagsGeneratorFilter = {
  fileName: null,
  jwtToken: localStorage.getItem(LocalStorageEnum.VID_IQ_JWT_TOKEN)
};

export default defaultFilter;
