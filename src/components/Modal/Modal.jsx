
import { createPortal } from 'react-dom';
import { Overlay } from './Modal.styled';
import { useEffect } from 'react';
const modalRoot = document.querySelector('#modal-root');

export const Modal =({children, onCloseModal })=> {
  
  useEffect(() => {
    //закриття модалки при натисканні ескейр
    const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onCloseModal();
    }
  };
  //вішаємо слуач
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      // прибираємо слухач
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCloseModal]);

  
//закриття модалки при натисканні на бекдроп
  const closeModal = e => {
    if (e.currentTarget === e.target) {
      onCloseModal();
    }
  };
//відображення модалки в порталі
    return createPortal(
        <Overlay className="overlay" onClick={closeModal}>
          <div className="modal">
            {children}
          </div>
        </Overlay>,
        modalRoot,
      );
  
}
