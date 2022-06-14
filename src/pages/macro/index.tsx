import styles from './styles.module.scss';
import { Button } from '../../components/Button';
import React from 'react';
import { GetServerSideProps } from 'next';
import prisma from '../../../lib/prisma';
import Link from 'next/link';
import Expand from 'react-expand-animated';
import ModalDeleteMacro from '../../components/Macro/ModalDeleteMacro';
import Head from 'next/head';

type IMacro = {
  id: string;
  title: string;
  slug: string;
};

interface MacrosProps {
  macros: IMacro[];
}
type Visible = Omit<IMacro, 'slug'>;

export default function Macro({ macros }: MacrosProps) {
  const [title, setTitle] = React.useState('');
  const [currentMacros, setCurrentMacros] = React.useState<IMacro[]>(macros);
  const [visible, setVisible] = React.useState<Visible>({} as Visible);
  const [modalDeleteMacroOpen, setModalDeleteMacroOpen] = React.useState(false);
  const transitions: Array<keyof React.CSSProperties> = [
    'height',
    'opacity',
    'background',
  ];

  const handleSubmit = React.useCallback(async () => {
    const slug = title.replaceAll(' ', '-').toLowerCase();
    const body = {
      title,
      slug,
    };
    try {
      const response = await fetch('/api/macro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const macro: IMacro = await response.json();
      setTitle('');
      setCurrentMacros([...currentMacros, macro]);
      if (response.ok) {
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }, [title, currentMacros]);
  const handleVisibility = React.useCallback(
    (id: string, title: string) => {
      id === visible.id
        ? setVisible({} as Visible)
        : setVisible({
            id,
            title,
          });
    },
    [visible],
  );
  function toggleModalDeleteMacro(): void {
    setModalDeleteMacroOpen(!modalDeleteMacroOpen);
  }
  function removeMacroFromView(id: string): void {
    const tempMacros = macros;
    tempMacros.forEach((macro, macroIndex) => {
      macro.id === id && tempMacros.splice(macroIndex, 1);
    });
    setCurrentMacros([...tempMacros]);
  }

  return (
    <main className={styles.container}>
      <Head>
        <title>Macros</title>
      </Head>
      <header>
        <h2>Macros</h2>
        <span>
          Select an existing macro or create one to get started to document.
        </span>
      </header>
      <section>
        <article className={styles.createNew}>
          <input
            type="text"
            placeholder="New macro"
            value={title}
            maxLength={20}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button disabled={title.length < 3} onClick={handleSubmit}>
            Create a new one
          </Button>
        </article>
        <article className={styles.listAll}>
          <ul>
            {currentMacros.map((macro) => (
              <li key={macro.id}>
                <span onClick={() => handleVisibility(macro.id, macro.title)}>
                  {macro.title}
                </span>
                <Expand
                  open={visible.id === macro.id}
                  duration={200}
                  styles={styles}
                  transitions={transitions}
                >
                  <div>
                    <Link href={`/editor/${macro.slug}`}>
                      <a>Start new documentation</a>
                    </Link>
                    <button onClick={() => setModalDeleteMacroOpen(true)}>
                      Delete macro
                    </button>
                  </div>
                </Expand>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <ModalDeleteMacro
        id={visible.id}
        title={visible.title}
        isOpen={modalDeleteMacroOpen}
        setIsOpen={toggleModalDeleteMacro}
        removeMacroFromView={removeMacroFromView}
      />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const macros = await prisma.macro.findMany();
    const formattedMacros = macros.map((macro) => ({
      id: macro.id,
      title: macro.title,
      slug: macro.slug,
    }));
    return { props: { macros: formattedMacros } };
  } catch (error) {
    console.error(`Error: ${error}`);
  }
  return { props: { macros: [] } };
};
