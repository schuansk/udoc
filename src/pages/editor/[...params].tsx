import React from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import {
  BsBlockquoteLeft,
  BsListOl,
  BsListUl,
  BsFillImageFill,
  BsCodeSlash,
  BsTypeBold,
  BsTypeItalic,
  BsLink45Deg,
} from 'react-icons/bs';
import {
  DraftInlineStyleType,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createImagePlugin from '@draft-js-plugins/image';
import toast from '../../components/Toast';
import { Button } from '../../components/Button';
import styles from './styles.module.scss';
import prisma from '../../../lib/prisma';
import {
  Header,
  HeaderStyles,
} from '../../components/Editor/EditorStyles/HeaderStyles';
import {
  Block,
  BlockStyles,
  getBlockStyle,
} from '../../components/Editor/EditorStyles/BlockStyles';
import ModalAddImage from '../../components/Editor/ModalAddImage';
import ModalAddLink from '../../components/Editor/ModalAddLink';
import { useSidebar } from '../../hooks/sidebar';
import ModalDeleteDocumentation from '../../components/Editor/ModalDeleteDocumentation';
import createLinkDecorator from '../../components/Editor/LinkDecorator';
import Head from 'next/head';

type JSONResponse = {
  slug?: string;
  title: string;
  id: string;
};

type Macro = {
  id: string;
  slug: string;
  title: string;
  documentationId?: string;
};

interface MacroProps {
  macro: Macro;
}

export default function MyEditor({ macro }: MacroProps) {
  const [title, setTitle] = React.useState('');
  const [editorState, setEditorState] = React.useState<EditorState>(
    EditorState.createEmpty(),
  );
  const [modalAddImageOpen, setModalAddImageOpen] = React.useState(false);
  const [modalAddLinkOpen, setModalAddLinkOpen] = React.useState(false);
  const [modalDeleteDocumentationOpen, setModalDeleteDocumentationOpen] =
    React.useState(false);
  const [init, setInit] = React.useState(false);
  const { addDocumentation } = useSidebar();
  const editor = React.useRef(null);
  const imagePlugin = createImagePlugin();
  const plugins = [imagePlugin];

  function focusEditor(): void {
    editor.current.focus();
  }
  const handleSubmit = React.useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();
      const content = convertToRaw(editorState.getCurrentContent());
      if (!title) {
        toast({
          type: 'warning',
          message: 'This documentation needs a name.',
        });
        return;
      }
      try {
        const newSlug = `${macro.slug}-${title
          .replaceAll(' ', '-')
          .toLowerCase()}`
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const body = {
          slug: newSlug,
          title,
          content: JSON.stringify(content),
          documentationId: macro.documentationId || '',
        };
        const response = await fetch(`/api/documentation/${macro.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });
        const { id }: JSONResponse = await response.json();
        if (response.ok) {
          addDocumentation(macro.id, {
            id,
            title,
            slug: newSlug,
          });
          await Router.push(
            `/documentation/[slug]`,
            `/documentation/${newSlug}`,
          );
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        toast({
          type: 'error',
          message: '😞 An error occurred, sorry about that.',
        });
        console.error(error);
      }
    },
    [editorState, macro, title, addDocumentation],
  );
  function handleKeyCommand(command: string, editorState: EditorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  function headerStyle(style: keyof Header): void {
    const newState = RichUtils.toggleBlockType(
      editorState,
      HeaderStyles[style],
    );
    setEditorState(newState);
    setTimeout(focusEditor, 0);
  }
  function blockStyle(style: keyof Block): void {
    const newState = RichUtils.toggleBlockType(editorState, BlockStyles[style]);
    setEditorState(newState);
    setTimeout(focusEditor, 0);
  }
  function inlineStyle(style: DraftInlineStyleType): void {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    setTimeout(focusEditor, 0);
  }
  function addImage(newEditorState: EditorState, entityKey: string): void {
    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '),
    );
    setTimeout(focusEditor, 0);
  }
  function toggleModalAddImage(): void {
    setModalAddImageOpen(!modalAddImageOpen);
  }
  function addLink(newEditorState: EditorState): void {
    setEditorState(newEditorState);
    setTimeout(focusEditor, 0);
  }
  function toggleModalAddLink(): void {
    setModalAddLinkOpen(!modalAddLinkOpen);
  }
  function toggleModalDeleteDocumentaion(): void {
    setModalDeleteDocumentationOpen(!modalDeleteDocumentationOpen);
  }
  React.useEffect(() => {
    init && focusEditor();
  }, [init]);
  React.useEffect(() => {
    if (!!macro.documentationId) {
      (async () => {
        const response = await fetch(
          `/api/documentation/${macro.documentationId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        const content = convertFromRaw(JSON.parse(data.content));
        const decorator = createLinkDecorator();
        setTitle(data.title);
        setEditorState(EditorState.createWithContent(content, decorator));
      })();
    }
    setInit(true);
  }, [macro]);

  return (
    <main className={styles.container}>
      <Head>
        <title>{macro.title}</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <h2>{macro.title}</h2>
        <input
          type="text"
          className="documentationName"
          placeholder="Documentation name"
          value={title}
          maxLength={32}
          onChange={(e) => setTitle(e.target.value)}
        />
        <header>
          <ul>
            <li
              onClick={() => headerStyle('h1')}
              onMouseDown={(e) => e.preventDefault()}
            >
              H1
            </li>
            <li
              onClick={() => headerStyle('h2')}
              onMouseDown={(e) => e.preventDefault()}
            >
              H2
            </li>
            <li
              onClick={() => headerStyle('h3')}
              onMouseDown={(e) => e.preventDefault()}
            >
              H3
            </li>
            <li
              onClick={() => inlineStyle('BOLD')}
              onMouseDown={(e) => e.preventDefault()}
            >
              <BsTypeBold color="#FFF" size={16} />
            </li>
            <li
              onClick={() => inlineStyle('ITALIC')}
              onMouseDown={(e) => e.preventDefault()}
            >
              <BsTypeItalic color="#FFF" size={16} />
            </li>
            <li
              onClick={() => blockStyle('unordered')}
              onMouseDown={(e) => e.preventDefault()}
            >
              <BsListUl color="#FFF" size={16} />
            </li>
            <li
              onClick={() => blockStyle('ordered')}
              onMouseDown={(e) => e.preventDefault()}
            >
              <BsListOl color="#FFF" size={16} />
            </li>
            <li
              onClick={() => blockStyle('blockquote')}
              onMouseDown={(e) => e.preventDefault()}
            >
              <BsBlockquoteLeft color="#FFF" size={16} />
            </li>
            <li
              onClick={() => blockStyle('code')}
              onMouseDown={(e) => e.preventDefault()}
            >
              <BsCodeSlash color="#FFF" size={16} />
            </li>
            <li onClick={() => setModalAddImageOpen(true)}>
              <BsFillImageFill color="#FFF" size={16} />
            </li>
            <li onClick={() => setModalAddLinkOpen(true)}>
              <BsLink45Deg color="#FFF" size={16} />
            </li>
          </ul>
        </header>
        <div onClick={focusEditor}>
          {init && (
            <Editor
              ref={editor}
              editorState={editorState}
              handleKeyCommand={handleKeyCommand}
              onChange={(editorState) => setEditorState(editorState)}
              plugins={plugins}
              blockStyleFn={getBlockStyle}
              editorKey="editor"
            />
          )}
        </div>
        <ModalAddImage
          editorState={editorState}
          isOpen={modalAddImageOpen}
          setIsOpen={toggleModalAddImage}
          addImage={addImage}
        />
        <ModalAddLink
          editorState={editorState}
          isOpen={modalAddLinkOpen}
          setIsOpen={toggleModalAddLink}
          addLink={addLink}
        />
        <ModalDeleteDocumentation
          id={macro.documentationId}
          title={title}
          isOpen={modalDeleteDocumentationOpen}
          setIsOpen={toggleModalDeleteDocumentaion}
        />
        <footer>
          {macro.documentationId && (
            <button
              type="button"
              onClick={() => setModalDeleteDocumentationOpen(true)}
              className={styles.DeleteButton}
            >
              Delete documentation
            </button>
          )}
          <Button type="submit">Save</Button>
        </footer>
      </form>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const [slug, id] = params.params as Array<string>;
  try {
    const macro = await prisma.macro.findUnique({
      where: {
        slug,
      },
    });
    const formattedMacro: Macro = {
      id: macro.id,
      slug: macro.slug,
      title: macro.title,
      documentationId: id || null,
    };
    return { props: { macro: formattedMacro } };
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return { props: { macros: [] } };
};
