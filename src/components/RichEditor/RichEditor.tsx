import React, { useEffect, useState } from 'react';
import {
  ContentBlock,
  convertToRaw,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import classes from './RichEditor.module.scss';
import { Button, Dropdown, Menu, MenuProps, Space } from 'antd';
import {
  DownOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import draftToHtml from 'draftjs-to-html';

type PropsType = {
  placeholder?: string;
};

const RichEditor = (props: PropsType) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    const markup = draftToHtml(rawContentState);
    console.log(markup);
  }, [editorState]);

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
          onChange={setEditorState}
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
