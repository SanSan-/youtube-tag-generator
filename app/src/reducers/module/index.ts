import { combineReducers } from 'redux';

import breadcrumbs from './breadcrumbs';
import tagsGenerator from './tagsGenerator';

export default combineReducers({
  breadcrumbs,
  tagsGenerator
});
