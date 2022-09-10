import React, { ElementRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  CompositeDecorator,
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
  LinkOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';

import classes from './RichEditor.module.scss';
import RichEditorLinkModal from '../RichEditorLinkModal/RichEditorLinkModal';
import { EditTypeEnum } from '../../models/utils.model';

type PropsType = {
  placeholder?: string;
  value?: string;
  onChange: (e: any) => void;
};

function findLinkEntities(contentBlock: any, callback: any, contentState: any) {
  contentBlock.findEntityRanges((character: any) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === 'LINK'
    );
  }, callback);
}

const Link = (props: any) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();
  return <a href={url}>{props.children}</a>;
};

const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

const RichEditor = (props: PropsType) => {
  const linkModalRef = useRef<ElementRef<typeof RichEditorLinkModal>>(null);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(decorator),
  );
  const [savedValue, setSavedValue] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const inlineStyle = useMemo(
    () => editorState.getCurrentInlineStyle(),
    [editorState],
  );

  const blockStyle = useMemo(() => {
    const currentSelection = editorState.getSelection();
    const blockKey = currentSelection.getStartKey();
    return editorState.getCurrentContent().getBlockForKey(blockKey).getType();
  }, [editorState]);

  const isLinkSelected = useMemo(() => {
    const contentState = editorState.getCurrentContent();
    const startKey = editorState.getSelection().getStartKey();
    const startOffset = editorState.getSelection().getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    return !!linkKey;
  }, [editorState]);

  useEffect(() => {
    /** Save html value and do not redraw the current view if it's the same */
    if (props.value !== savedValue) {
      const blocksFromHTML = convertFromHTML(props.value || '');
      const newState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      setEditorState(EditorState.createWithContent(newState, decorator));
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

  const onLinkClick = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
      let url = '';
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
        linkModalRef?.current?.openModal({
          type: EditTypeEnum.edit,
          initialValues: { href: url },
        });
      } else {
        linkModalRef?.current?.openModal({ type: EditTypeEnum.add });
      }
    }
  };

  const onLinkSet = (href: string | null) => {
    if (href) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        'LINK',
        'MUTABLE',
        { url: href },
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      let newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity,
      });

      newEditorState = RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey,
      );

      setEditorState(
        RichUtils.toggleLink(
          newEditorState,
          newEditorState.getSelection(),
          entityKey,
        ),
      );
    } else {
      removeLink();
    }
  };

  const removeLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  const handleHeaderMenuClick: MenuProps['onClick'] = (e) => {
    onBlockStyleClick(e.key);
  };

  const headersMenu = (
    <Menu
      onClick={handleHeaderMenuClick}
      selectedKeys={[blockStyle]}
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
    <>
      <div className={classes.editorContainer}>
        <div className={classes.tooltip}>
          <div>
            <Button
              type={inlineStyle.has('BOLD') ? 'primary' : 'default'}
              onClick={() => onInlineStyleClick('BOLD')}
            >
              <strong>B</strong>
            </Button>
            <Button
              type={inlineStyle.has('ITALIC') ? 'primary' : 'default'}
              onClick={() => onInlineStyleClick('ITALIC')}
            >
              <i>I</i>
            </Button>
            <Button
              type={inlineStyle.has('UNDERLINE') ? 'primary' : 'default'}
              onClick={() => onInlineStyleClick('UNDERLINE')}
            >
              <u>U</u>
            </Button>
            <Button
              type={inlineStyle.has('STRIKETHROUGH') ? 'primary' : 'default'}
              onClick={() => onInlineStyleClick('STRIKETHROUGH')}
            >
              <s>S</s>
            </Button>
            <Button
              type={inlineStyle.has('CODE') ? 'primary' : 'default'}
              onClick={() => onInlineStyleClick('CODE')}
            >
              <code>M</code>
            </Button>

            <Button
              type={isLinkSelected ? 'primary' : 'default'}
              icon={<LinkOutlined />}
              onClick={onLinkClick}
            >
              <code></code>
            </Button>
          </div>

          <div>
            <Dropdown overlay={headersMenu}>
              <Button
                type={
                  [
                    'header-one',
                    'header-two',
                    'header-three',
                    'header-four',
                    'header-five',
                  ].includes(blockStyle)
                    ? 'primary'
                    : 'default'
                }
              >
                <Space>
                  Header
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
          <div>
            <Button
              type={
                blockStyle === 'unordered-list-item' ? 'primary' : 'default'
              }
              onClick={() => onBlockStyleClick('unordered-list-item')}
              icon={<UnorderedListOutlined />}
            />
            <Button
              type={blockStyle === 'ordered-list-item' ? 'primary' : 'default'}
              onClick={() => onBlockStyleClick('ordered-list-item')}
              icon={<OrderedListOutlined />}
            />
            <Button
              type={blockStyle === 'code-block' ? 'primary' : 'default'}
              onClick={() => onBlockStyleClick('code-block')}
            >
              &#123; &#125;
            </Button>
            <Button
              type={blockStyle === 'blockquote' ? 'primary' : 'default'}
              onClick={() => onBlockStyleClick('blockquote')}
            >
              &quot;
            </Button>
          </div>
        </div>

        <div
          className={
            classes.editorCard +
            (isFocused ? ' ' + classes.editorCardFocus : '')
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

      <RichEditorLinkModal
        ref={linkModalRef}
        onOkCallback={(e) => onLinkSet(e.href)}
      />
    </>
  );
};

export default RichEditor;
