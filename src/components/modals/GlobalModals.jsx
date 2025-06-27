import React from 'react';
import { useModal } from '../../context/ModalContext';
// Example modals
import ProjectModal from '../projects/ProjectModal';
import NotificationModal from '../notifications/NotificationModal';

const GlobalModals = () => {
  const { modalType, modalProps, closeModal } = useModal();

  if (!modalType) return null;

  // Add your custom modals here
  switch (modalType) {
    case 'project':
      return <ProjectModal {...modalProps} onClose={closeModal} />;
    case 'notification':
      return <NotificationModal {...modalProps} onClose={closeModal} />;
    // ... add more modal cases as needed
    default:
      return null;
  }
};

export default GlobalModals;
