import { EditorState } from 'draft-js';
import React from 'react';
import styles from '../styles.module.scss';
import Modal from '../../Modal';
import { Button } from '../../Button';
import storage from '../../../../lib/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import Toast from '../../Toast';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  editorState: EditorState;
  addImage: (newEditorState: EditorState, entityKey: string) => void;
}

export default function ModalAddImage({
  isOpen,
  setIsOpen,
  addImage,
  editorState,
}: ModalProps) {
  const [imageUpload, setImageUpload] = React.useState<File>(null);
  const [uploadPercent, setUploadPercent] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);
  const handleSubmit = React.useCallback(() => {
    if (imageUpload === null) {
      Toast({
        type: 'warning',
        message: 'No image selected.',
      });
      return;
    }
    setUploading(true);
    const id = uuid();
    const imageRef = ref(storage, `images/${imageUpload.name + id}`);
    const uploadTask = uploadBytesResumable(imageRef, imageUpload);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setUploadPercent(percent);
      },
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const contentState = editorState.getCurrentContent();
          const contentStateWithEntity = contentState.createEntity(
            'IMAGE',
            'IMMUTABLE',
            {
              src: url,
            },
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
          const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
          });
          addImage(newEditorState, entityKey);
          setUploadPercent(0);
          setUploading(false);
          setImageUpload(null);
          Toast({
            type: 'success',
            message: 'Image successfully added.',
          });
          setIsOpen();
        });
      },
    );
  }, [imageUpload, editorState, addImage, setIsOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.ModalContainer}>
        <h2>Adicionar imagem</h2>
        <div className={styles.ImageUploadButton}>
          <input
            type="file"
            id="image"
            multiple={false}
            onChange={(e) => setImageUpload(e.target.files[0])}
            accept="image/*"
          />
          <label htmlFor="image">
            <strong>{imageUpload?.name || 'Choose a image'}</strong>
          </label>
        </div>
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
        {uploading && (
          <progress id="percent" value={uploadPercent} max="100">
            {uploadPercent}%
          </progress>
        )}
      </div>
    </Modal>
  );
}
