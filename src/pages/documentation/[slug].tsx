import { GetServerSideProps } from 'next';
import prisma from '../../../lib/prisma';
import styles from './styles.module.scss';
import { BiEdit } from 'react-icons/bi';
import Link from 'next/link';
import createImagePlugin from '@draft-js-plugins/image';
import Editor from '@draft-js-plugins/editor';
import React from 'react';
import { convertFromRaw, EditorState } from 'draft-js';
import { getBlockStyle } from '../../components/Editor/EditorStyles/BlockStyles';
import createLinkDecorator from '../../components/Editor/LinkDecorator';
import Head from 'next/head';

type Macro = {
  id: string;
  title: string;
  slug: string;
};

type Documentation = {
  id: string;
  title: string;
  content: string;
  slug: string;
  macro: Macro;
};

interface DocumentationProps {
  documentation: Documentation;
}

export default function View({ documentation }: DocumentationProps) {
  const [editorState, setEditorContent] = React.useState<EditorState>(
    EditorState.createEmpty(),
  );
  const [init, setInit] = React.useState(false);
  const editor = React.useRef(null);
  const imagePlugin = createImagePlugin();
  const plugins = [imagePlugin];

  React.useEffect(() => {
    const decorator = createLinkDecorator();
    const markup = convertFromRaw(JSON.parse(documentation.content));
    setEditorContent(EditorState.createWithContent(markup, decorator));
    setInit(true);
  }, [documentation]);

  return (
    <main className={styles.container}>
      <header>
        <Head>
          <title>{documentation.title}</title>
        </Head>
        <span>{documentation.macro.title}</span>
        <h1>{documentation.title}</h1>
      </header>
      <article>
        {init && (
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={() => ({})}
            plugins={plugins}
            blockStyleFn={getBlockStyle}
            readOnly={true}
            editorKey="editor"
          />
        )}
      </article>
      <footer>
        <Link href={`/editor/${documentation.macro.slug}/${documentation.id}`}>
          <a>
            <BiEdit color="#181A1B" size={24} />
          </a>
        </Link>
      </footer>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const documentation = await prisma.documentation.findUnique({
      where: { slug: String(params.slug) },
      include: {
        macro: true,
      },
    });
    const formattedDocumentation: Documentation = {
      id: documentation.id,
      title: documentation.title,
      content: documentation.content,
      slug: documentation.slug,
      macro: {
        id: documentation.macro.id,
        title: documentation.macro.title,
        slug: documentation.macro.slug,
      },
    };
    return { props: { documentation: formattedDocumentation } };
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return { props: { documentation: {} as Documentation } };
};
