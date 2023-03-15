import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Input } from 'antd';
import { EditableContext } from '~components/antd/EditableRow';
import { EMPTY_FUNC } from '~const/common';

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<typeof Input>(null);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const asyncSave = async () => {
    try {
      const values = await form.validateFields() as Item;

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.error('Save failed:', errInfo);
    }
  };
  const save = () => {
    asyncSave().then(EMPTY_FUNC);
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
