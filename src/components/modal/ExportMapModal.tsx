import React, { useState } from 'react';
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
    const [copied, setCopied] = useState(false);

    const handleExportAndClose = () => {
        onExportToFile();
        onClose();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(currentTTSString).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className="modal-title">Export Map</h3>
            <div className="form-group">
                <label className="form-label">TTS map string</label>
                <textarea
                    className="form-textarea form-textarea-export"
                    value={currentTTSString}
                    readOnly
                />
            </div>
            <div className="form-actions">
                <button className="import-button" onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy to clipboard'}
                </button>
                <button className="import-button" onClick={handleExportAndClose}>Export to file</button>
                <button className="import-button secondary-button" onClick={onClose}>Cancel</button>
            </div>
        </Modal>
    );
};

