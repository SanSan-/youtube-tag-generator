import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Form, message, Progress, Rate, Row, Statistic, Switch, Table, Tooltip, Upload } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  YoutubeOutlined
} from '@ant-design/icons';
import * as actions from '~actions/module/tagsGenerator';
import { Keywords, TagItem, TagsState, TagStatisticItem, TagStatisticTableData } from '~types/state';
import { GeneralState } from '~types/store';
import { bindActionCreators } from 'redux';
import { TagsAction, ThunkResult } from '~types/action';
import dayjs from 'dayjs';
import './style.less';
import EditableTable from '~components/antd/EditableTable';
import { getTagsMap } from '~utils/TagsUtils';
import { isEmpty, isEmptyArray, isEmptyObject } from '~utils/CommonUtils';
import { tagsCloudHeaders, tagsStatisticHeaders } from '~dictionaries/headers';
import InputFilter from '~components/antd/InputFilter';
import FieldIdEnum from '~enums/module/TagsGeneratorFileds';
import defaultValidators from '~model/states/validators/TagsGenerator';
import defaultFilter from '~model/states/filters/TagsGenerator';
import { textValidator } from '~utils/ValidationUtils';
import { TEXT_VALIDATOR } from '~const/log';
import { createSetValidator, handleUpdateFilter } from '~utils/FilterUtils';
import { DOT_SIGN, EMPTY_STRING, EXPORT_DATE_FORMAT, SPACE_SIGN } from '~const/common';
import ValidationStatus from '~enums/ValidationStatus';
import { FORM_ELEM_DEFAULT_SIZE } from '~const/settings';
import { COMP_OPTIONS } from '~dictionaries/options';
import ResultTable from '~components/antd/ResultTable';
import { statisticCondFormat, statisticTableHeaders, tagsTableHeaders } from '~dictionaries/tableHeaders';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import { FileActionType } from '~types/response';
import { FileContent } from '~enums/File';

const { Countdown } = Statistic;

interface Props {
  state: TagsState;
  generateTagsCloud: (cloudMap: string[][]) => ThunkResult<void, TagsAction>;
  importFromJson: (fileAction: FileActionType, data: string) => ThunkResult<void, TagsAction>;
  exportDataToJson: (fileName: string, data: string) => ThunkResult<void, TagsAction>;
  exportDataToCsv: <T extends TagItem> (fileName: string, json: T[]) => ThunkResult<void, TagsAction>;
  exportDataToExcel: <T extends TagItem> (
    fileName: string, json: T[], type: string, headers: Record<string, unknown>[],
    conditionalFormatting?: Record<string, unknown>[]
  ) => ThunkResult<Promise<void>, TagsAction>;
  testConnection: (jwtToken: string) => ThunkResult<Promise<void>, TagsAction>;
  testConnectionRefresh: () => TagsAction;
  collectStatistic: (tagsCloud: string[], jwtToken: string) => ThunkResult<void, TagsAction>;
}

const calcDeadline = (startDate: number, doneCount: number, allCount: number): number => {
  const now = Date.now();
  return now + ((allCount - doneCount) * ((now - startDate) / doneCount));
};

const showTestConnectionIcon = (testConnection: string): ReactElement => {
  switch (testConnection) {
    case 'success':
      return <Tooltip placement='right' title={'???????????????? ????????????????????'} color={'green'}>
        <CheckCircleOutlined style={{ color: 'green' }}/>
      </Tooltip>;
    case 'failed':
      return <Tooltip placement='right' title={'???????????? ????????????????????'} color={'red'}>
        <CloseCircleOutlined style={{ color: 'red' }}/>
      </Tooltip>;
    default:
      return <Tooltip placement='right' title={'?????????????????? JWT Token?'} color={'blue'}>
        <ExclamationCircleOutlined style={{ color: 'blue' }}/>
      </Tooltip>;
  }
};

const TagGenerator: React.FC<Props> = (props: Props): ReactElement => {
  const { state, exportDataToExcel } = props;
  const [filter, setFilter] = useState(defaultFilter);
  const [validators, setValidators] = useState(defaultValidators);
  const [keywords, setKeywords] = useState({} as Keywords);
  const [tagsCount, setTagsCount] = useState(0);
  const [tagsMap, setTagsMap] = useState([] as string[][]);
  const [tags, setTags] = useState([] as TagItem[]);
  const [tagsStatistic, setTagsStatistic] = useState([] as TagStatisticTableData[]);
  const [addTimestamp, setAddTimestamp] = useState(false);
  useEffect(() => {
    setTags(state.tags.map((tag, i) => ({ key: i, tag })));
  }, [state.tags]);
  useEffect(() => {
    state.isFileActionFailed && message.error('?????????????????? ???????????? ???? ?????????? ??????????????');
    state.fileActionError && message.error(state.fileActionError);
  }, [state.isFileActionFailed]);
  useEffect(() => {
    !state.isLoadingStatistic && !isEmptyArray(state.tagsStatistic) && setTagsStatistic(state.tagsStatistic.map(
      (item: TagStatisticItem, i: number) => ({
        key: i,
        tag: item.tag,
        volume: <Statistic groupSeparator={SPACE_SIGN} precision={0} value={item.volume}/>,
        competition: COMP_OPTIONS[Math.ceil(item.competition * 5) - 1],
        rank: <Rate disabled allowHalf defaultValue={item.rank * 5}/>
      })));
  }, [state.isLoadingStatistic, state.tagsStatistic]);
  useEffect(() => {
    const filteredKeys = Object.keys(keywords).filter((key) => keywords[key].length > 0);
    setTagsCount(filteredKeys.length);
    setTagsMap(getTagsMap(
      Object.values(keywords).filter((values) => values.length > 0)
        .map((values) => values.map((value) => value.toLowerCase())),
      filteredKeys.reduce((prev, key) => prev * keywords[key].length, 1)
    ));
  }, [keywords]);
  const setValidator = createSetValidator(setValidators);
  const validateInput = (
    key: string,
    callback: (text: string) => boolean,
    errorMessage = '???????????? ??????????????????'
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
  const handleInput = (callback: () => TagsAction = null) =>
    (key: string) => (e: ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;
      if (isEmpty(value)) {
        setValidator(key, null, EMPTY_STRING);
      }
      callback && callback();
      handleUpdateFilter(key, value.replace(/ +(?= )/g, EMPTY_STRING), setFilter);
    };
  const handleUploadJson = (contentType: string) => ({ file }: UploadChangeParam): void => {
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file.originFileObj, 'utf-8');
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    }).then((value) => {
      props.importFromJson({ contentType }, value as string);
    });
  };
  return <Form
    labelCol={{ span: 6 }}
    wrapperCol={{ span: 18 }}
    layout='horizontal'
  >
    <Form.Item>
      <InputFilter
        id={FieldIdEnum.JWT_TOKEN}
        value={filter.jwtToken}
        validatorState={validators.jwtToken}
        validator={textValidator}
        errorMessage={TEXT_VALIDATOR}
        label={{ text: 'JWT Token (VidIQ.com)', labelCol: 5, wrapperCol: 19 }}
        placeholder={'???????????????????? ?????????? ?????? ???????????????? ?????????????????? ????????'}
        onChange={handleInput(props.testConnectionRefresh)}
        onBlur={validateInput}
      />
      <Button onClick={() => {
        if (isEmpty(filter.jwtToken)) {
          message.error('JWT Token (VidIQ.com) ???? ?????????? ???????? ????????????!');
        } else {
          props.testConnection(filter.jwtToken);
        }
      }}>
        ?????????????????? ????????????????????
      </Button>&nbsp;&nbsp;{showTestConnectionIcon(state.testConnection)}
    </Form.Item>
    <br/>
    <Form.Item>
      <InputFilter
        id={FieldIdEnum.FILENAME}
        value={filter.fileName}
        validatorState={validators.fileName}
        validator={textValidator}
        errorMessage={TEXT_VALIDATOR}
        label={{ text: '?????? ???????????????????????? ??????????', labelCol: 5, wrapperCol: 19 }}
        placeholder={'???????????????????? ?????? ??????????'}
        onChange={handleInput()}
        onBlur={validateInput}
      />
    </Form.Item>
    <Form.Item label={`???????????????? ?? ?????????? ?????????????????? ?????????? (${EXPORT_DATE_FORMAT})`} valuePropName='checked'
      labelCol={{ span: 18 }}
      wrapperCol={{ span: 6 }}>
      <Switch onChange={() => setAddTimestamp(!addTimestamp)}
        checkedChildren={'????'}
        unCheckedChildren={'??????'}/>
    </Form.Item>
    <Form.Item>
      <Upload onChange={handleUploadJson(FileContent.KEYWORDS)}>
        <Button icon={<UploadOutlined/>}>?????????????????? ???????????????? ?????????? ???? JSON</Button>
      </Upload>
      &nbsp;
      <Upload onChange={handleUploadJson(FileContent.TAGS)}>
        <Button icon={<UploadOutlined/>}>?????????????????? ???????? ???? JSON</Button>
      </Upload>
      &nbsp;
      <Upload onChange={handleUploadJson(FileContent.STATISTIC)}>
        <Button icon={<UploadOutlined/>}>?????????????????? ???????????????????? ???? JSON</Button>
      </Upload>
    </Form.Item>
    <Form.Item>
      ???????????????? ??????????
      <EditableTable keywords={state.keywords} onUpdate={(altKeywords) => {
        setKeywords(altKeywords);
      }}/>
      <Button hidden={isEmptyObject(keywords)} loading={state.isLoadingExportToJson}
        onClick={() => props.exportDataToJson(
          `${filter.fileName}.keywords${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.json`,
          JSON.stringify(keywords)
        )}>
        <DownloadOutlined/> ?????????????????? ?? JSON
      </Button>
    </Form.Item>
    <br/>
    <Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title={'???????????????????? ???????????????? ???????? (?????? ??????????????????)'} value={tagsCount}/>
        </Col>
        <Col span={12}>
          <div hidden={isEmptyArray(state.tags)}>
            <Statistic title={'???????????????????? ???????????????????? ???? ???????????????? ????????'} value={state.tags.length}/>
          </div>
        </Col>
      </Row>
    </Form.Item>
    <br/>
    <Form.Item label='?????????????????????????? ?????? ?????????????????? ???????????????????? ???? ???????????????? ????????'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}>
      <Button type='primary' loading={state.isLoadingGeneration} onClick={() => props.generateTagsCloud(tagsMap)}>
        ?????????????????????????? ???????????? ??????????
      </Button>
      &nbsp;
      <Button hidden={isEmptyArray(state.tags)} loading={state.isLoadingExportToJson}
        onClick={() => props.exportDataToJson(
          `${filter.fileName}.tags${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.json`,
          JSON.stringify(state.tags)
        )}>
        <DownloadOutlined/> ?????????????????? ?? JSON
      </Button>
      &nbsp;
      <Button hidden={isEmptyArray(state.tags)} loading={state.isLoadingExportToCsv}
        onClick={() => props.exportDataToCsv(
          `${filter.fileName}.tags${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.csv`,
          tags
        )}>
        <DownloadOutlined/> ?????????????????? ?? CSV
      </Button>
      &nbsp;
      <Button hidden={isEmptyArray(state.tags)} loading={state.isLoadingExportToXls}
        onClick={() => exportDataToExcel(
          `${filter.fileName}.tags${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.xlsx`,
          tags,
          'Tags Cloud',
          tagsTableHeaders
        )}>
        <DownloadOutlined/> ?????????????????? ?? Excel
      </Button>
    </Form.Item>
    <br/>
    <Form.Item hidden={isEmptyArray(tags)}>
      <Table dataSource={tags} columns={tagsCloudHeaders} showHeader={false}
        size={FORM_ELEM_DEFAULT_SIZE}/>
    </Form.Item>
    <Form.Item hidden={isEmptyArray(state.tags) && isEmptyArray(state.tagsStatistic)}>
      <Button loading={state.isLoadingStatistic} type={isEmptyArray(tagsStatistic) ? 'default' : 'primary'}
        hidden={isEmptyArray(tags)}
        onClick={() => {
          if (isEmpty(filter.jwtToken) || state.testConnection !== 'success') {
            message.error('?????????????? ???????????????? JWT Token (VidIQ.com) ?????? ?????????????????? ????????????????????');
          } else {
            props.collectStatistic(state.tags, filter.jwtToken);
          }
        }}>
        <YoutubeOutlined style={{ color: 'red' }}/> ?????????????? ????????????????????
      </Button>
      &nbsp;
      <Button loading={state.isLoadingExportToJson} hidden={isEmptyArray(tagsStatistic)}
        onClick={() => props.exportDataToJson(
          `${filter.fileName}.statistic${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.json`,
          JSON.stringify(state.tagsStatistic)
        )}>
        <DownloadOutlined/> ?????????????????? ???????????????????? ?? JSON
      </Button>
      &nbsp;
      <Button loading={state.isLoadingExportToCsv} hidden={isEmptyArray(tagsStatistic)}
        onClick={() => props.exportDataToCsv(
          `${filter.fileName}.statistic${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.csv`,
          state.tagsStatistic
        )}>
        <DownloadOutlined/> ?????????????????? ???????????????????? ?? CSV
      </Button>
      &nbsp;
      <Button loading={state.isLoadingExportToXls} hidden={isEmptyArray(tagsStatistic)}
        onClick={() => exportDataToExcel(
          `${filter.fileName}.statistic${addTimestamp ? DOT_SIGN + dayjs().format(EXPORT_DATE_FORMAT) : ''}.xlsx`,
          state.tagsStatistic,
          'Statistic',
          statisticTableHeaders,
          statisticCondFormat
        )}>
        <DownloadOutlined/> ?????????????????? ???????????????????? ?? Excel
      </Button>
    </Form.Item>
    <br/>
    <Form.Item hidden={!state.isLoadingStatistic}>
      <Progress status={state.isLoadingStatistic ? 'active' : 'normal'}
        percent={state.tagsStatisticCount > 0 ? Math.round((state.tagsStatisticCount / state.tags.length) * 100) :
          0}/>
      <Countdown title={'????????????????'}
        value={calcDeadline(state.tagsStatisticStartDate, state.tagsStatisticCount, state.tags.length)}/>
    </Form.Item>
    <Form.Item hidden={state.isLoadingStatistic || isEmptyArray(tagsStatistic)}>
      <ResultTable data={tagsStatistic} headers={tagsStatisticHeaders}/>
    </Form.Item>
  </Form>;
};

export default connect((state: GeneralState) => ({
  state: state.app.module.tagsGenerator
}), (dispatch) => bindActionCreators(actions, dispatch))(TagGenerator);
