enum TagsGenerator {
  START_EXPORT_TO_EXCEL = '@@module/excel/START_EXPORT_TO_EXCEL',
  END_EXPORT_TO_EXCEL = '@@module/roster/END_EXPORT_TO_EXCEL',
  EXPORT_TO_EXCEL_SUCCESS = '@@module/roster/EXPORT_TO_EXCEL_SUCCESS',
  START_TAGS_GENERATION = '@@module/excel/START_TAGS_GENERATION',
  END_TAGS_GENERATION = '@@module/roster/END_TAGS_GENERATION',
  TAGS_GENERATION_SUCCESS = '@@module/roster/TAGS_GENERATION_SUCCESS',
  START_LOAD_STATISTIC = '@@module/excel/START_LOAD_STATISTIC',
  END_LOAD_STATISTIC = '@@module/roster/END_LOAD_STATISTIC',
  LOAD_STATISTIC_SUCCESS = '@@module/roster/LOAD_STATISTIC_SUCCESS',
  INIT = '@@module/roster/INIT'
}

export default TagsGenerator;