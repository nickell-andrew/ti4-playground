import React from 'react';
import { Modal } from './Modal';
import './ImportMapModal.css';

interface ExportMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTTSString: string;
    onExportToFile: () => void;
}

export const ExportMapModal: React.FC<ExportMapModalProps> = ({
    isOpen,
    onClose,
    currentTTSString,
    onExportToFile,
}) => {
    const handleExportAndClose = () => {
        onExportToFile();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className="modal-title">Export Map</h3>
            <div className="form-group">
                <textarea
                    className="form-textarea form-textarea-export"
                    value={currentTTSString}
                    readOnly
                />
            </div>
            <div className="form-actions">
                <button className="import-button" onClick={handleExportAndClose}>Export to file</button>
                <button className="import-button secondary-button" onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
};

