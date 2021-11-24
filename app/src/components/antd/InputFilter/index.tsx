import React, { ChangeEventHandler, EventHandler, ReactElement, SyntheticEvent } from 'react';
import { Form, Input } from 'antd';
import { LabelType, ValidatorState } from '~types/filter';
import { FORM_ELEM_DEFAULT_SIZE, LABEL_DEFAULT_ALIGN } from '~const/settings';

const Item = Form.Item;

export interface InputFilterProps {
  id: string;
  value: string;
  validatorState?: ValidatorState;
  validator?: (text: string) => boolean;
  errorMessage?: string;
  label: LabelType;
  placeholder?: string;
  onChange: (key: string) => (e: ChangeEventHandler<HTMLInputElement>) => void;
  onBlur?: (
    key: string, callback: (text: string) => boolean, error: string) => (e: EventHandler<SyntheticEvent>) => void;
}

const InputFilter = ({
  id,
  value,
  validatorState,
  validator,
  errorMessage,
  label,
  placeholder,
  onChange,
  onBlur
}: InputFilterProps): ReactElement => {
  const { text, labelCol, wrapperCol } = label;
  return <Item
    label={text}
    hasFeedback
    labelCol={labelCol && { span: labelCol }}
    wrapperCol={wrapperCol && { span: wrapperCol }}
    labelAlign={LABEL_DEFAULT_ALIGN}
    validateStatus={validatorState && validatorState.validateStatus}
    help={validatorState && validatorState.help}
  >
    <Input
      id={id}
      size={FORM_ELEM_DEFAULT_SIZE}
      placeholder={placeholder}
      value={value}
      allowClear
      onChange={onChange(id)}
      onBlur={onBlur && onBlur(id, validator, errorMessage)}
      onPressEnter={onBlur && onBlur(id, validator, errorMessage)}
    />
  </Item>;
};

export default InputFilter;
