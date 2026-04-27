import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const WORKOUT_TYPES = [
  "Strength training",
  "Cardio",
  "HIIT",
  "Yoga",
  "Zumba",
  "Swimming",
  "CrossFit",
  "Other",
];

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function WorkoutHistory({ history }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    type: "Strength training",
    duration: "",
    notes: "",
    gymName: "",
  });

  async function handleLogWorkout(e) {
    e.preventDefault();
    if (!form.duration) return;
    setSaving(true);
    try {
      if (!user) throw new Error("Not authenticated");
      const { data } = await api.post("/dashboard/log-workout", {
        email: user.email,
        type: form.type,
        duration: Number(form.duration),
        notes: form.notes,
        gymName: form.gymName,
      });
      
      if (!data?.success) throw new Error("Failed");
      setShowModal(false);
      setForm({ type: "Strength training", duration: "", notes: "", gymName: "" });
      window.location.reload();
    } catch (err) {
      console.error("Log workout error:", err);
      alert("Could not save workout. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const totalMinutes = history.reduce((s, w) => s + (w.duration || 0), 0);

  return (
    <>
      <div className="card-header">
        <h2 className="card-title">Workout history</h2>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => setShowModal(true)}
        >
          + Log workout
        </button>
      </div>

      {history.length > 0 && (
        <div className="wh-stats">
          <div className="wh-stat">
            <span className="wh-stat__val">{history.length}</span>
            <span className="wh-stat__label">Sessions</span>
          </div>
          <div className="wh-stat">
            <span className="wh-stat__val">{totalMinutes}</span>
            <span className="wh-stat__label">Total mins</span>
          </div>
          <div className="wh-stat">
            <span className="wh-stat__val">
              {Math.round(totalMinutes / (history.length || 1))}
            </span>
            <span className="wh-stat__label">Avg mins</span>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📓</div>
          <p>No workouts logged yet.</p>
          <button
            className="link-cta"
            onClick={() => setShowModal(true)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            Log your first session →
          </button>
        </div>
      ) : (
        <ul className="wh-list">
          {history.slice(0, 8).map((w) => (
            <li key={w.id} className="wh-item">
              <div className="wh-item__type">{w.type}</div>
              <div className="wh-item__meta">
                <span>{formatDate(w.date)}</span>
                {w.gymName && (
                  <>
                    <span className="sep">·</span>
                    <span>{w.gymName}</span>
                  </>
                )}
              </div>
              <div className="wh-item__duration">{w.duration}m</div>
            </li>
          ))}
          {history.length > 8 && (
            <li className="wh-item wh-item--more">
              +{history.length - 8} more sessions
            </li>
          )}
        </ul>
      )}

      {/* Log Workout Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>Log workout</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleLogWorkout} className="modal__form">
              <label className="form-label">
                Type
                <select
                  className="form-input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {WORKOUT_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="form-label">
                Duration (minutes)
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  max="300"
                  placeholder="e.g. 45"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  required
                />
              </label>

              <label className="form-label">
                Gym name (optional)
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. FitZone Sonipat"
                  value={form.gymName}
                  onChange={(e) => setForm({ ...form, gymName: e.target.value })}
                />
              </label>

              <label className="form-label">
                Notes (optional)
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="e.g. Leg day – squats, lunges…"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </label>

              <div className="modal__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? "Saving…" : "Save session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
