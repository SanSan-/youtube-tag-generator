import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Switch, Table } from 'antd';
import * as actions from '~actions/module/tagsGenerator';
import { TagsState, TagsType } from '~types/state';
import { GeneralState } from '~types/store';
import { bindActionCreators } from 'redux';
import { TagsAction, ThunkResult } from '~types/action';
import dayjs from 'dayjs';
import './style.less';
import EditableTable from '~components/antd/EditableTable';
import { sumNk } from '~utils/MathUtils';
import { getTagsCloudMap } from '~utils/TagsUtils';

interface Props {
  state: TagsState;
  exportData: (json: string) => ThunkResult<Promise<void>, TagsAction>;
  generateTagsCloud: (cloudMap: string[][]) => ThunkResult<void, TagsAction>;
}

const TagGenerator: React.FC<Props> = (props: Props): ReactElement => {
  const { state, exportData } = props;
  const [tags, setTags] = useState({} as TagsType);
  const [tagsCount, setTagsCount] = useState(0);
  const [tagsCloudCount, setTagsCloudCount] = useState(0);
  const [tagsCloudMap, setTagsCloudMap] = useState([] as string[][]);
  const [isXLS, setIsXLS] = useState(false);
  const [addTimestamp, setAddTimestamp] = useState(false);
  useEffect(() => {
    if (state.isLoadingExport) {
      exportData('');
    }
  }, []);
  useEffect(() => {
    const filter = Object.keys(tags).filter((key) => tags[key].length > 0);
    const combNum = filter.reduce((prev, key) => prev * tags[key].length, 1);
    setTagsCount(filter.length);
    setTagsCloudCount(combNum * sumNk(filter.length));
    setTagsCloudMap(getTagsCloudMap(
      Object.values(tags).filter((values) => values.length > 0),
      combNum
    ));
  }, [tags]);
  return <Form
    labelCol={{ span: 3 }}
    wrapperCol={{ span: 21 }}
    layout='horizontal'
  >
    <Form.Item/>
    <Form.Item label='JWT Token (VidIQ.com)'>
      <Input style={{ width: '800px' }}/><Button>Проверить соединение</Button>
    </Form.Item>
    <Form.Item label='Имя выгружаемого файла'>
      <Input style={{ width: '800px' }}/>
      {addTimestamp ? dayjs().format('YYYY-MM-DD_HH:mm:ss') : ''}{isXLS ? '.xls' : '.json'}
    </Form.Item>
    <Form.Item label={isXLS ? 'Выгружать в Excel' : 'Выгружать в JSON'} valuePropName='checked'
      labelCol={{ span: 22 }}
      wrapperCol={{ span: 2 }}>
      <Switch onChange={() => setIsXLS(!isXLS)}/>
    </Form.Item>
    <Form.Item label='Добавить в конце временную метку (YYYY-MM-DD_HH:MM:SS)?' valuePropName='checked'
      labelCol={{ span: 22 }}
      wrapperCol={{ span: 2 }}>
      <Switch onChange={() => setAddTimestamp(!addTimestamp)}/>
    </Form.Item>
    <Form.Item label='Ключевые слова'>
      <EditableTable onUpdate={(altKeywords) => {
        setTags(altKeywords);
      }}/>
    </Form.Item>
    <Form.Item>Количество ключевых слов (без синонимов): {JSON.stringify(tagsCount)}</Form.Item>
    <Form.Item>Количество комбинаций из ключевых слов: {JSON.stringify(tagsCloudCount)}</Form.Item>
    <Form.Item label='Сгенерировать все возможные комбинации из ключевых слов'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}>
      <Button type='primary' loading={state.isLoadingGeneration} onClick={() => props.generateTagsCloud(tagsCloudMap)}>
        Сгенерировать облако тегов
      </Button>
    </Form.Item>
    <Table dataSource={props.state.tagsCloud.map((tag, i) => ({ key: i, tag }))} columns={[ {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag'
    } ]} showHeader={false}/>
  </Form>;
};

export default connect((state: GeneralState) => ({
  state: state.app.module.tagsGenerator
}), (dispatch) => bindActionCreators(actions, dispatch))(TagGenerator);
