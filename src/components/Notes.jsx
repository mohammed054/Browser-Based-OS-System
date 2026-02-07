import './Notes.css';

const Notes = () => {
  const placeholderNotes = [
    'Note 1',
    'Note 2',
    'Note 3',
    'Note 4'
  ];

  return (
    <div className="notes-app">
      <div className="notes-layout">
        <div className="notes-sidebar">
          <div className="notes-list">
            {placeholderNotes.map((note, index) => (
              <div key={index} className="note-item">
                {note}
              </div>
            ))}
          </div>
        </div>
        <div className="notes-main">
          <div className="notes-editor">
            Select a note to edit
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
