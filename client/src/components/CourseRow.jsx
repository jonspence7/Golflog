export default function CourseRow({
  course,
  isDragging,
  isDragOver,
  dragDisabled,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
}) {
  const played = course.date_played
    ? new Date(course.date_played + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      className={`course-row${isDragging ? " is-dragging" : ""}${isDragOver ? " is-drag-over" : ""}`}
      draggable={!dragDisabled}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver();
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDrop();
      }}
    >
      <div className="drag-handle" aria-hidden="true">≡</div>
      <div className="rank">{course.rank}</div>
      <div className="details">
        <h3>{course.name}</h3>
        <div className="meta">
          {course.location && <span>{course.location}</span>}
          {played && <span>{played}</span>}
          {course.notes && <span>{course.notes}</span>}
        </div>
      </div>
      <div className="row-actions">
        {course.score != null && <span className="score-pill">{course.score}</span>}
        <button className="icon-btn" onClick={() => onEdit(course)} aria-label="Edit">
          Edit
        </button>
        <button className="icon-btn" onClick={() => onDelete(course)} aria-label="Delete">
          Delete
        </button>
      </div>
    </div>
  );
}
