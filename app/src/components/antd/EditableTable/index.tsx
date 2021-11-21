import React, { ReactElement } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import EditableRow from '~components/antd/EditableRow';
import EditableCell from '~components/antd/EditableCell';
import KeyWordGenerator from '~forms/KeyWordGenerator';
import { ColumnTypes, DataType, EditableTableProps, EditableTableState, TagsType } from '~types/state';

interface Props extends EditableTableProps {
  onUpdate: (tags: TagsType) => void;
}

const initialState: EditableTableState = {
  keywords: {},
  dataSource: [],
  count: 0
};

class EditableTable extends React.Component<Props, EditableTableState> {
  columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];

  constructor (props: Props) {
    super(props);
    this.columns = [
      {
        title: 'keywords',
        dataIndex: 'keywords'
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        width: '150px',
        render: (_, record: { key: React.Key }) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title='Уверен?' onConfirm={() => this.handleDelete(record.key)}>
              <a>Удалить</a>
            </Popconfirm>
          ) : null
      }
    ];
    this.state = initialState;
  }

  handleDelete = (key: React.Key): void => {
    const dataSource = [...this.state.dataSource];
    const newKeywords = Object.keys(this.state.keywords).filter((item) => (item != key)).reduce((obj, idx) => {
      obj[idx] = this.state.keywords[idx];
      return obj;
    }, {} as TagsType);
    this.setState({
      dataSource: dataSource.filter((item) => (item.key !== key)),
      keywords: newKeywords
    });
    this.props.onUpdate(newKeywords);
  };
  handleAdd = (): void => {
    const { count, keywords, dataSource } = this.state;
    const newData: DataType = {
      key: count,
      keywords: <KeyWordGenerator index={count} initTags={[]} onChange={(value, key) => {
        const newKeywords = { ...this.state.keywords, [key]: value };
        this.setState({ keywords: newKeywords });
        this.props.onUpdate(newKeywords);
      }}/>
    };
    this.setState({
      keywords: { ...keywords, [count]: [] },
      dataSource: [...dataSource, newData],
      count: count + 1
    });
    this.props.onUpdate({ ...keywords, [count]: [] });
  };
  handleClearAll = (): void => {
    this.setState(initialState);
    this.props.onUpdate({});
  };
  handleSave = (row: DataType): void => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => (row.key === item.key));
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ dataSource: newData });
  };

  render (): ReactElement {
    const { dataSource, keywords } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell
      }
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <div>
        <Button disabled={Object.keys(keywords).length >= 7} onClick={this.handleAdd} type='primary'
          style={{ marginBottom: 16 }}>
          <PlusOutlined/> ключевое слово
        </Button>
        &nbsp;
        <a onClick={this.handleClearAll} type='primary'
          style={{ marginBottom: 16, alignItems: 'end' }}>
          очистить всё
        </a>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          dataSource={dataSource}
          columns={columns as ColumnTypes}
          showHeader={false}
          pagination={false}
        />
      </div>
    );
  }
}

export default EditableTable;
