import React, { useEffect, useState } from 'react';
import {
  ContentBlock,
  ContentState,
  convertFromHTML,
  convertToRaw,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import draftToHtml from 'draftjs-to-html';
import { Button, Dropdown, Menu, MenuProps, Space } from 'antd';
import {
  DownOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import classes from './RichEditor.module.scss';

type PropsType = {
  placeholder?: string;
  value?: string;
  onChange: (e: any) => void;
};

const RichEditor = (props: PropsType) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [savedValue, setSavedValue] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    /** Save html value and do not redraw the current view if it's the same */
    if (props.value !== savedValue) {
      const blocksFromHTML = convertFromHTML(props.value || '');
      const newState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      setEditorState(EditorState.createWithContent(newState));
      setSavedValue(props.value || null);
    }
  }, [props.value]);

  const handleOnChange = (editorState: EditorState): void => {
    setEditorState(editorState);
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markup = draftToHtml(rawContentState);
    setSavedValue(markup);
    props.onChange?.(markup);
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  const handleBlockStyling = (contentBlock: ContentBlock): string => {
    const type = contentBlock.getType();
    return type || '';
  };

  const onInlineStyleClick = (action: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, action));
  };

  const onBlockStyleClick = (action: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, action));
  };

  const handleHeaderMenuClick: MenuProps['onClick'] = (e) => {
    onBlockStyleClick(e.key);
  };

  const headersMenu = (
    <Menu
      onClick={handleHeaderMenuClick}
      items={[
        {
          label: 'Header 1',
          key: 'header-one',
        },
        {
          label: 'Header 2',
          key: 'header-two',
        },
        {
          label: 'Header 3',
          key: 'header-three',
        },
        {
          label: 'Header 4',
          key: 'header-four',
        },
        {
          label: 'Header 5',
          key: 'header-five',
        },
      ]}
    />
  );

  return (
    <div className={classes.editorContainer}>
      <div className={classes.tooltip}>
        <div>
          <Button onClick={() => onInlineStyleClick('BOLD')}>
            <strong>B</strong>
          </Button>
          <Button onClick={() => onInlineStyleClick('ITALIC')}>
            <i>I</i>
          </Button>
          <Button onClick={() => onInlineStyleClick('UNDERLINE')}>
            <u>U</u>
          </Button>
          <Button onClick={() => onInlineStyleClick('STRIKETHROUGH')}>
            <s>S</s>
          </Button>
          <Button onClick={() => onInlineStyleClick('CODE')}>
            <code>M</code>
          </Button>
        </div>
        <div>
          <Dropdown overlay={headersMenu}>
            <Button>
              <Space>
                Header
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </div>
        <div>
          <Button
            onClick={() => onBlockStyleClick('unordered-list-item')}
            icon={<UnorderedListOutlined />}
          />
          <Button
            onClick={() => onBlockStyleClick('ordered-list-item')}
            icon={<OrderedListOutlined />}
          />
          <Button onClick={() => onBlockStyleClick('code-block')}>
            &#123; &#125;
          </Button>
          <Button onClick={() => onBlockStyleClick('blockquote')}>
            &quot;
          </Button>
        </div>
      </div>

      <div
        className={
          classes.editorCard + (isFocused ? ' ' + classes.editorCardFocus : '')
        }
      >
        <Editor
          editorState={editorState}
          onChange={handleOnChange}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={handleBlockStyling}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  );
};

export default RichEditor;
