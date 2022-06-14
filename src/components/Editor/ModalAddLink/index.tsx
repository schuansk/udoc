import { EditorState, Modifier } from 'draft-js';
import React from 'react';
import { getCurrentTextSelection } from '../../../helpers/getCurrentTextSelecion';
import { Button } from '../../Button';
import Modal from '../../Modal';
import createLinkDecorator from '../LinkDecorator';
import styles from '../styles.module.scss';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  editorState: EditorState;
  addLink: (newEditorState: EditorState) => void;
}

export default function ModalAddLink({
  isOpen,
  setIsOpen,
  addLink,
  editorState,
}: ModalProps) {
  const [url, setUrl] = React.useState('');
  const [selectedText, setSelectedText] = React.useState('');

  const handleSubmit = React.useCallback(() => {
    const decorator = createLinkDecorator();

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {
        url,
      },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const selectionState = editorState.getSelection();
    const selectionText = selectedText;

    const textWithEntity = Modifier.replaceText(
      contentState,
      selectionState,
      selectionText,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );
    const newEditorState = EditorState.createWithContent(
      textWithEntity,
      decorator,
    );
    addLink(newEditorState);
    setUrl('');
    setIsOpen();
  }, [editorState, url, selectedText, addLink, setIsOpen]);

  React.useEffect(() => {
    setSelectedText(getCurrentTextSelection(editorState));
  }, [editorState]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.ModalContainer}>
        <h1>Inserir link</h1>
        <input
          type="text"
          value={selectedText}
          onChange={(e) => setSelectedText(e.target.value)}
          placeholder="Enter the link title"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter the URL"
        />
        <div>
          <button
            className={styles.AbordButton}
            style={{ marginRight: '1rem' }}
            onClick={setIsOpen}
          >
            Voltar
          </button>
          <Button onClick={handleSubmit}>Add</Button>
        </div>
      </div>
    </Modal>
  );
}
