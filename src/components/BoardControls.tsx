import React from 'react';
import classNames from 'classnames';

interface BoardControlsProps {
    locked: boolean;
    onToggleLock: () => void;
    onClearBoard: () => void;
    onSaveMap: () => void;
    onExportClick: () => void;
    onImportClick: () => void;
}

export const BoardControls: React.FC<BoardControlsProps> = ({
    locked,
    onToggleLock,
    onClearBoard,
    onSaveMap,
    onExportClick,
    onImportClick,
}) => {
    return (
        <div className="board-controls">
            <div className="control-group">
                <button onClick={onToggleLock}>{locked ? "Unlock Map" : "Lock Map"}</button>
                <button disabled={locked} onClick={onClearBoard}>Clear Board</button>
                <button onClick={onSaveMap}>Save Map</button>
                <button onClick={onExportClick}>Export Map</button>
                <button
                    className={classNames("import-button", locked && "disabled")}
                    disabled={locked}
                    onClick={onImportClick}
                >
                    Import Map
                </button>
            </div>
        </div>
    );
};

