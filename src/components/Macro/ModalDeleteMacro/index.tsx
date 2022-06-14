import React from 'react';
import { Button } from '../../Button';
import Modal from '../../Modal';
import styles from '../styles.module.scss';
import Toast from '../../Toast';
import { useSidebar } from '../../../hooks/sidebar';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  title: string;
  id: string;
  removeMacroFromView: (id: string) => void;
}

export default function ModalDeleteMacro({
  isOpen,
  setIsOpen,
  title,
  id,
  removeMacroFromView,
}: ModalProps) {
  const [deleteTitle, setDeleteTitle] = React.useState('');
  const { removeMacro } = useSidebar();
  const handleSubmit = React.useCallback(async () => {
    if (deleteTitle !== title) {
      Toast({
        type: 'error',
        message: 'The name is incorrect.',
      });
      return;
    }
    try {
      const response = await fetch(`/api/macro/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setIsOpen();
        setDeleteTitle('');
        removeMacro(id);
        removeMacroFromView(id);
        Toast({
          type: 'success',
          message: 'Macro deleted successfully.',
        });
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
  }, [deleteTitle, title, id, setIsOpen, removeMacro, removeMacroFromView]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.DeleteModalContainer}>
        <h1>Excluir macro</h1>
        <p>
          If you are sure you want to delete this macro, enter the title
          <i> {title} </i>
          in the field below and then confirm, but be careful, all documentation
          linked to this macro will also be removed!
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
