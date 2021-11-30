enum TagsGenerator {
  START_FILE_ACTION = '@@module/tags-generator/START_FILE_ACTION',
  END_FILE_ACTION = '@@module/tags-generator/END_FILE_ACTION',
  FILE_ACTION_SUCCESS = '@@module/tags-generator/FILE_ACTION_SUCCESS',
  FILE_ACTION_FAIL = '@@module/tags-generator/FILE_ACTION_FAIL',
  START_TAGS_GENERATION = '@@module/tags-generator/START_TAGS_GENERATION',
  END_TAGS_GENERATION = '@@module/tags-generator/END_TAGS_GENERATION',
  TAGS_GENERATION_SUCCESS = '@@module/tags-generator/TAGS_GENERATION_SUCCESS',
  START_LOAD_STATISTIC = '@@module/tags-generator/START_LOAD_STATISTIC',
  END_LOAD_STATISTIC = '@@module/tags-generator/END_LOAD_STATISTIC',
  ADD_STATISTIC_SUCCESS = '@@module/tags-generator/ADD_STATISTIC_SUCCESS',
  INCREMENT_STATISTIC_COUNT = '@@module/tags-generator/INCREMENT_STATISTIC_COUNT',
  REFRESH_STATISTIC_COUNT = '@@module/tags-generator/REFRESH_STATISTIC_COUNT',
  TEST_CONNECTION_SUCCESS = '@@module/tags-generator/TEST_CONNECTION_SUCCESS',
  TEST_CONNECTION_FAILED = '@@module/tags-generator/TEST_CONNECTION_FAILED',
  TEST_CONNECTION_REFRESH = '@@module/tags-generator/TEST_CONNECTION_REFRESH',
  INIT = '@@module/tags-generator/INIT'
}

export default TagsGenerator;
