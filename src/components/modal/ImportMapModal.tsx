import React, { RefObject } from 'react';
import { Modal } from './Modal';
import './ImportMapModal.css';

interface ImportMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    importString: string;
    setImportString: (value: string) => void;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onImportMap: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImportTTSString: () => void;
}

export const ImportMapModal: React.FC<ImportMapModalProps> = ({
    isOpen,
    onClose,
    importString,
    setImportString,
    fileInputRef,
    onImportMap,
    onImportTTSString,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3 className="modal-title">Import Map</h3>
            <div className="form-group">
                <label htmlFor="import-string" className="form-label">Paste map string</label>
                <textarea
                    id="import-string"
                    className="form-textarea"
                    value={importString}
                    onChange={(e) => setImportString(e.target.value)}
                    placeholder="Paste a map string here..."
                />
            </div>
            <div className="form-actions">
                <button className="import-button" onClick={() => fileInputRef.current?.click()}>Import From JSON</button>
                <button className="import-button" onClick={onImportTTSString}>Import TTS String</button>
                <button className="import-button secondary-button" onClick={onClose}>Cancel</button>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={onImportMap}
                className="hidden-input"
            />
        </Modal>
    );
};

