import React from 'react';
import { Modal } from 'antd';

interface ImportModalProps {
  visible: boolean;
  onStepChange: (step: number) => void;
  onVisibleChange: (visible: boolean) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ visible, onStepChange, onVisibleChange }) => {
  return (
    <Modal title='导入数据' open={visible} onCancel={() => onVisibleChange(false)} footer={null} width={800}>
      {/* Add your import modal content here */}
    </Modal>
  );
};

export default ImportModal;
