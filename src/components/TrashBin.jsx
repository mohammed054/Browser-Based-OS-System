import { useState } from 'react';
import './TrashBin.css';

const TrashBin = ({ onRestore, onDeletePermanently, deletedIcons }) => {
  const items = deletedIcons || [];

  const [selectedItems, setSelectedItems] = useState(new Set());
  const [restoringItems, setRestoringItems] = useState(new Set());
  const [deletingItems, setDeletingItems] = useState(new Set());

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const restoreItems = () => {
    const restoredIds = Array.from(selectedItems);
    setRestoringItems(new Set(restoredIds));
    setTimeout(() => {
      const restoredItems = items.filter(item => restoredIds.includes(item.id));
      restoredItems.forEach(item => onRestore && onRestore(item));
      setSelectedItems(new Set());
      setRestoringItems(new Set());
    }, 500);
  };

  const deletePermanently = () => {
    const deletedIds = Array.from(selectedItems);
    setDeletingItems(new Set(deletedIds));
    setTimeout(() => {
      const deletedItems = items.filter(item => deletedIds.includes(item.id));
      deletedItems.forEach(item => onDeletePermanently && onDeletePermanently(item));
      setSelectedItems(new Set());
      setDeletingItems(new Set());
    }, 500);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'document': return '📄';
      case 'image': return '🖼️';
      case 'spreadsheet': return '📊';
      case 'video': return '🎥';
      case 'archive': return '📦';
      default: return '📄';
    }
  };

  return (
    <div className="trash-bin">
      <div className="trash-toolbar">
        <div className="toolbar-left">
          <button
            className="toolbar-button"
            onClick={selectAll}
            disabled={items.length === 0}
          >
            {selectedItems.size === items.length && items.length > 0 ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="toolbar-right">
          <button
            className="toolbar-button restore"
            onClick={restoreItems}
            disabled={selectedItems.size === 0}
          >
            Restore
          </button>
          <button
            className="toolbar-button delete"
            onClick={deletePermanently}
            disabled={selectedItems.size === 0}
          >
            Delete Permanently
          </button>
        </div>
      </div>

      <div className="trash-content">
        {items.length === 0 ? (
          <div className="empty-trash">
            <div className="empty-icon">🗑️</div>
            <div className="empty-text">Trash Bin is empty</div>
          </div>
        ) : (
          <div className="trash-items">
            {items.map(item => (
              <div
                key={item.id}
                className={`trash-item ${selectedItems.has(item.id) ? 'selected' : ''} ${restoringItems.has(item.id) ? 'restoring' : ''} ${deletingItems.has(item.id) ? 'deleting' : ''}`}
                onClick={() => toggleSelection(item.id)}
              >
                <div className="item-icon">
                  {item.src ? (
                    <img src={item.src} alt={item.label || item.name} />
                  ) : (
                    getIcon(item.type)
                  )}
                </div>
                <div className="item-details">
                  <div className="item-name">{item.label || item.name}</div>
                  <div className="item-date">Deleted: {item.deletedDate}</div>
                </div>
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashBin;
