import { useState } from "react";

const emptyForm = { name: "", location: "", date_played: "", score: "", notes: "" };

export default function CourseFormModal({ initial, title, subtitle, onCancel, onSubmit }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Give the course a name.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setSubmitting(false);
    }
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p className="subtitle">{subtitle}</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Course name</label>
            <input
              id="name"
              autoFocus
              value={form.name}
              onChange={update("name")}
              placeholder="Royal County Down"
            />
          </div>
          <div className="field">
            <label htmlFor="location">Location (optional)</label>
            <input
              id="location"
              value={form.location}
              onChange={update("location")}
              placeholder="Newcastle, Co. Down"
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="date_played">Date played</label>
              <input id="date_played" type="date" value={form.date_played} onChange={update("date_played")} />
            </div>
            <div className="field">
              <label htmlFor="score">Score (optional)</label>
              <input
                id="score"
                type="number"
                value={form.score}
                onChange={update("score")}
                placeholder="84"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              id="notes"
              rows={2}
              value={form.notes}
              onChange={update("notes")}
              placeholder="Windy, back nine played with a crosswind"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Saving…" : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
