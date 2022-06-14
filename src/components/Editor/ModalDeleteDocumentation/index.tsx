import React from 'react';
import { Button } from '../../Button';
import Modal from '../../Modal';
import styles from '../styles.module.scss';
import Toast from '../../Toast';
import Router from 'next/router';
import { useSidebar } from '../../../hooks/sidebar';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  title: string;
  id: string;
}

export default function ModalDeleteDocumentation({
  isOpen,
  setIsOpen,
  title,
  id,
}: ModalProps) {
  const [deleteTitle, setDeleteTitle] = React.useState('');
  const { removeDocumentation } = useSidebar();
  const handleSubmit = React.useCallback(async () => {
    if (deleteTitle !== title) {
      Toast({
        type: 'error',
        message: 'The title is incorrect.',
      });
      return;
    }
    try {
      const response = await fetch(`/api/documentation/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setIsOpen();
        removeDocumentation(id);
        Toast({
          type: 'success',
          message: 'Documentation successfully deleted.',
        });
        await Router.push('/macro');
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      Toast({
        type: 'error',
        message: '😞 An error occurred, sorry about that.',
      });
      console.error(error);
    }
  }, [deleteTitle, title, id, removeDocumentation, setIsOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.DeleteModalContainer}>
        <h1>Delete documentation</h1>
        <p>
          If you are sure you want to delete this documentation, enter the title
          <i> {title} </i>
          in the field below and then confirm.
        </p>
        <input
          type="text"
          value={deleteTitle}
          onChange={(e) => setDeleteTitle(e.target.value)}
          placeholder="Type the title"
        />
        <div>
          <Button onClick={setIsOpen} className={styles.AbordButton}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className={styles.ConfirmButton}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
