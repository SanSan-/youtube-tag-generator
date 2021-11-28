import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { Input, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useFocus } from '~hooks/UseFocus';

interface Props {
  index: number;
  initTags: string[];
  onChange: (value: string[], key: number) => void;
}

const KeyWordGenerator: React.FC<Props> = ({ index, initTags, onChange }: Props): ReactElement => {
  const [tags, setTags] = useState(initTags);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const [inputRef, focusInputRef] = useFocus();
  const [editInputRef, focusEditInputRef] = useFocus();
  useEffect(() => {
    onChange(tags, index);
  }, [tags]);
  const showInput = () => {
    setInputVisible(true);
    focusInputRef();
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };
  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    setTags(() => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;
      return newTags;
    });
    setEditInputIndex(-1);
    setEditInputValue('');
  };
  const handleClose = (removedTag: string) => {
    setTags(tags.filter((tag) => tag !== removedTag));
  };
  return (
    <>
      {tags.map((tag, idx) => {
        if (editInputIndex === idx) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size='small'
              className='tag-input'
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            className='edit-tag'
            key={tag}
            closable={true}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={(e) => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  focusEditInputRef();
                  e.preventDefault();
                }
              }}
            >
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={inputRef}
          type='text'
          size='small'
          className='tag-input'
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag visible={tags && tags.length < 10} className='site-tag-plus' onClick={showInput}>
          <PlusOutlined/> {tags && tags.length === 0 ? 'новый тег' : 'синоним'}
        </Tag>
      )}
    </>
  );
};

export default KeyWordGenerator;
