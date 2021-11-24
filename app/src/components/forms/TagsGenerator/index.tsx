import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Switch, Table } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as actions from '~actions/module/tagsGenerator';
import { TagCloudItem, TagsState, TagsType } from '~types/state';
import { GeneralState } from '~types/store';
import { bindActionCreators } from 'redux';
import { TagsAction, ThunkResult } from '~types/action';
import dayjs from 'dayjs';
import './style.less';
import EditableTable from '~components/antd/EditableTable';
import { getTagsCloudMap } from '~utils/TagsUtils';
import { isEmpty, isEmptyArray } from '~utils/CommonUtils';
import { tagsCloudHeaders } from '~dictionaries/headers';
import InputFilter from '~components/antd/InputFilter';
import FieldIdEnum from '~enums/module/TagsGeneratorFileds';
import defaultValidators from '~model/states/validators/TagsGenerator';
import defaultFilter from '~model/states/filters/TagsGenerator';
import { textValidator } from '~utils/ValidationUtils';
import { TEXT_VALIDATOR } from '~const/log';
import { createSetValidator, handleUpdateFilter } from '~utils/FilterUtils';
import { DOT_SIGN, EMPTY_STRING, EXPORT_DATE_FORMAT } from '~const/common';
import ValidationStatus from '~enums/ValidationStatus';
import { FORM_ELEM_DEFAULT_SIZE } from '~const/settings';

interface Props {
  state: TagsState;
  generateTagsCloud: (cloudMap: string[][]) => ThunkResult<void, TagsAction>;
  exportDataToJson: (fileName: string, data: string) => ThunkResult<void, TagsAction>;
  exportDataToCsv: <T extends TagCloudItem> (fileName: string, json: T[]) => ThunkResult<void, TagsAction>;
  exportDataToExcel: <T extends TagCloudItem> (
    fileName: string, json: T[], type: string) => ThunkResult<Promise<void>, TagsAction>;
}

const TagGenerator: React.FC<Props> = (props: Props): ReactElement => {
  const { state, exportDataToExcel } = props;
  const [filter, setFilter] = useState(defaultFilter);
  const [validators, setValidators] = useState(defaultValidators);
  const [tags, setTags] = useState({} as TagsType);
  const [tagsCount, setTagsCount] = useState(0);
  const [tagsCloudMap, setTagsCloudMap] = useState([] as string[][]);
  const [tagsCloud, setTagsCloud] = useState([] as TagCloudItem[]);
  const [addTimestamp, setAddTimestamp] = useState(false);
  useEffect(() => {
    setTagsCloud(state.tagsCloud.map((tag) => ({ tag })));
  }, [state.tagsCloud]);
  useEffect(() => {
    const filtered = Object.keys(tags).filter((key) => tags[key].length > 0);
    const combNum = filtered.reduce((prev, key) => prev * tags[key].length, 1);
    setTagsCount(filtered.length);
    setTagsCloudMap(getTagsCloudMap(
      Object.values(tags).filter((values) => values.length > 0),
      combNum
    ));
  }, [tags]);
  const setValidator = createSetValidator(setValidators);
  const validateInput = (
    key: string,
    callback: (text: string) => boolean,
    errorMessage = 'Ошибка валидации'
  ) => (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (isEmpty(value)) {
      return setValidator(key, null, EMPTY_STRING);
    }
    if (callback(value)) {
      setValidator(key, ValidationStatus.SUCCESS, EMPTY_STRING);
    } else {
      setValidator(key, ValidationStatus.ERROR, errorMessage);
    }
  };
  const handleInput = (key: string) => (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (isEmpty(value)) {
      setValidator(key, null, EMPTY_STRING);
    }
    handleUpdateFilter(key, value.replace(/ +(?= )/g, EMPTY_STRING), setFilter);
  };
  return <Form
    labelCol={{ span: 3 }}
    wrapperCol={{ span: 21 }}
    layout='horizontal'
  >
    <Form.Item/>
    <InputFilter
      id={FieldIdEnum.JWT_TOKEN}
      value={filter.jwtToken}
      validatorState={validators.jwtToken}
      validator={textValidator}
      errorMessage={TEXT_VALIDATOR}
      label={{ text: 'JWT Token (VidIQ.com)', labelCol: 3, wrapperCol: 21 }}
      placeholder={'скопируйте токен для отправки сообщений сюда'}
      onChange={handleInput}
      onBlur={validateInput}
    />
    <Button>Проверить соединение</Button>
    <InputFilter
      id={FieldIdEnum.FILENAME}
      value={filter.fileName}
      validatorState={validators.fileName}
      validator={textValidator}
      errorMessage={TEXT_VALIDATOR}
      label={{ text: 'Имя выгружаемого файла', labelCol: 3, wrapperCol: 21 }}
      placeholder={'придумайте имя файла'}
      onChange={handleInput}
      onBlur={validateInput}
    />
    <Form.Item label={`Добавить в конце временную метку (${EXPORT_DATE_FORMAT})`} valuePropName='checked'
      labelCol={{ span: 22 }}
      wrapperCol={{ span: 2 }}>
      <Switch onChange={() => setAddTimestamp(!addTimestamp)}
        checkedChildren={'да'}
        unCheckedChildren={'нет'}/>
    </Form.Item>
    <Form.Item label='Ключевые слова'>
      <EditableTable onUpdate={(altKeywords) => {
        setTags(altKeywords);
      }}/>
    </Form.Item>
    <Form.Item>Количество ключевых слов (без синонимов): {JSON.stringify(tagsCount)}</Form.Item>
    <Form.Item hidden={isEmptyArray(state.tagsCloud)}>Количество комбинаций из ключевых слов: {JSON.stringify(
      state.tagsCloud.length)}</Form.Item>
    <Form.Item label='Сгенерировать все возможные комбинации из ключевых слов'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}>
      <Button type='primary' loading={state.isLoadingGeneration} onClick={() => props.generateTagsCloud(tagsCloudMap)}>
        Сгенерировать облако тегов
      </Button>
      &nbsp;
      <Button hidden={isEmptyArray(state.tagsCloud)} loading={state.isLoadingExportToJson}
        onClick={() => props.exportDataToJson(
          `${filter.fileName}.tags${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.json`,
          JSON.stringify(state.tagsCloud)
        )}>
        <DownloadOutlined/> Выгрузить в JSON
      </Button>
      &nbsp;
      <Button hidden={isEmptyArray(state.tagsCloud)} loading={state.isLoadingExportToCsv}
        onClick={() => props.exportDataToCsv(
          `${filter.fileName}.tags${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.csv`,
          tagsCloud
        )}>
        <DownloadOutlined/> Выгрузить в CSV
      </Button>
      &nbsp;
      <Button hidden={isEmptyArray(state.tagsCloud)} loading={state.isLoadingExportToXls}
        onClick={() => exportDataToExcel(
          `${filter.fileName}.tags${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.xlsx`,
          tagsCloud,
          'Tags Cloud'
        )}>
        <DownloadOutlined/> Выгрузить в Excel
      </Button>
    </Form.Item>
    <br/>
    <Form.Item hidden={isEmptyArray(state.tagsCloud)}>
      <Table dataSource={tagsCloud} columns={tagsCloudHeaders} showHeader={false}
        size={FORM_ELEM_DEFAULT_SIZE}/>
    </Form.Item>
  </Form>;
};

export default connect((state: GeneralState) => ({
  state: state.app.module.tagsGenerator
}), (dispatch) => bindActionCreators(actions, dispatch))(TagGenerator);
