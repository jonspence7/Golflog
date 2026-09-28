import { useEffect, useState } from "react";
import { api } from "./api";
import CourseRow from "./components/CourseRow.jsx";
import CourseFormModal from "./components/CourseFormModal.jsx";

export default function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [mode, setMode] = useState(null); // null | "add" | "edit"
  const [editingCourse, setEditingCourse] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [moving, setMoving] = useState(false);

  const refresh = () =>
    api
      .list()
      .then(setCourses)
      .catch((err) => setLoadError(err.message));

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const closeAll = () => {
    setMode(null);
    setEditingCourse(null);
  };

  const handleAddSubmit = async (form) => {
    await api.insertAt({ ...form, rank: courses.length + 1 });
    await refresh();
    closeAll();
  };

  const handleMove = async (courseId, targetRank) => {
    if (moving) return;
    setMoving(true);
    try {
      const updatedCourses = await api.move(courseId, targetRank);
      setCourses(updatedCourses);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setDraggedId(null);
      setDragOverId(null);
      setMoving(false);
    }
  };

  const handleEditSubmit = async (form) => {
    await api.update(editingCourse.id, form);
    await refresh();
    closeAll();
  };

  const handleDelete = async (course) => {
    if (!confirm(`Remove ${course.name} from your rankings?`)) return;
    await api.remove(course.id);
    await refresh();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Course Rankings</h1>
          <p>{courses.length} course{courses.length === 1 ? "" : "s"} played</p>
        </div>
        <button className="add-button" onClick={() => setMode("add")}>
          + Log a round
        </button>
      </header>

      {loading && <p style={{ color: "var(--ink-soft)" }}>Loading…</p>}
      {loadError && <p className="error-text">{loadError}</p>}

      {!loading && !loadError && courses.length === 0 && (
        <div className="empty-state">
          <div className="glyph">⛳</div>
          <p>No rounds logged yet. Add your first course to start the leaderboard.</p>
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="leaderboard">
          {courses.map((c) => (
            <CourseRow
              key={c.id}
              course={c}
              isDragging={draggedId === c.id}
              isDragOver={dragOverId === c.id}
              dragDisabled={moving}
              onDragStart={() => setDraggedId(c.id)}
              onDragEnd={() => {
                setDraggedId(null);
                setDragOverId(null);
              }}
              onDragOver={() => setDragOverId(c.id)}
              onDrop={() => {
                if (draggedId && draggedId !== c.id) handleMove(draggedId, c.rank);
              }}
              onEdit={(course) => {
                setEditingCourse(course);
                setMode("edit");
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {mode === "add" && (
        <CourseFormModal
          title="Log a round"
          subtitle="Add the details, then drag it into place on your leaderboard."
          onCancel={closeAll}
          onSubmit={handleAddSubmit}
        />
      )}

      {mode === "edit" && editingCourse && (
        <CourseFormModal
          title="Edit round"
          subtitle="Update the details without changing its rank."
          initial={{
            name: editingCourse.name,
            location: editingCourse.location || "",
            date_played: editingCourse.date_played || "",
            score: editingCourse.score ?? "",
            notes: editingCourse.notes || "",
          }}
          onCancel={closeAll}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
