import Image from 'next/image';
import React from 'react';
import Expand from 'react-expand-animated';
import { MdFolder, MdFolderOpen } from 'react-icons/md';
import { RiArchiveDrawerFill } from 'react-icons/ri';
import { IoMdDocument } from 'react-icons/io';
import { HiOutlineDocumentText } from 'react-icons/hi';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Macro, useSidebar } from '../../hooks/sidebar';
import styles from './styles.module.scss';

export function Sidebar() {
  const [visible, setVisible] = React.useState('');
  const transitions: Array<keyof React.CSSProperties> = [
    'height',
    'opacity',
    'background',
  ];
  const { macros, updateSidebar } = useSidebar();
  const { asPath } = useRouter();

  const handleVisibility = React.useCallback(
    (macro: string) => {
      macros.length <= 0
        ? setVisible('macros')
        : macro === visible
        ? setVisible('')
        : setVisible(macro);
    },
    [macros.length, visible],
  );
  function goToHome() {
    setVisible('');
    Router.push('/');
  }

  React.useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/macro', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const formattedMacros: Macro[] = data.map(
          (macro: { id: string; title: string; documentation: string }) => ({
            id: macro.id,
            title: macro.title,
            documentations: macro.documentation,
          }),
        );
        updateSidebar(formattedMacros);
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    })();
  }, [updateSidebar]);

  return (
    <aside className={styles.navContainer}>
      <nav>
        <div onClick={goToHome} className={styles.CursorPointer}>
          <Image
            src="/images/logo.svg"
            alt="UDOC logo"
            height={40}
            width={40}
          />
        </div>
        <ul>
          <li className={visible === 'macros' ? styles.selected : ''}>
            <h3
              onClick={() => handleVisibility('macros')}
              className={styles.Macros}
            >
              <Link href="/macro">
                <a>
                  <RiArchiveDrawerFill color="#FFF" size={16} />
                  <span> Macros</span>
                </a>
              </Link>
            </h3>
          </li>
          <li className={styles.Divider}></li>
          {macros.map((macro) => (
            <li
              key={macro.id}
              className={visible === macro.id ? styles.selected : ''}
            >
              <h3 onClick={() => handleVisibility(macro.id)}>
                {visible === macro.id ? (
                  <MdFolderOpen color="#FFF" size={18} />
                ) : (
                  <MdFolder color="#FFF" size={18} />
                )}
                {macro.title}
              </h3>
              <Expand
                open={visible === macro.id}
                duration={200}
                styles={styles}
                transitions={transitions}
              >
                <ul>
                  {macro.documentations.map((documentation) => (
                    <li key={documentation.id}>
                      <Link href={`/documentation/${documentation.slug}`}>
                        <a>
                          {asPath === `/documentation/${documentation.slug}` ? (
                            <HiOutlineDocumentText color="#FFF" size={16} />
                          ) : (
                            <IoMdDocument color="#FFF" size={16} />
                          )}
                          {' ' + documentation.title}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Expand>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
