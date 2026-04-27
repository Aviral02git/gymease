import { useState } from "react";
import api from "../services/api";

const STATUS_LABELS = {
  confirmed: { label: "Confirmed", cls: "badge--green" },
  pending: { label: "Pending", cls: "badge--amber" },
  cancelled: { label: "Cancelled", cls: "badge--red" },
};

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function daysUntil(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Math.ceil((d - Date.now()) / 86400000);
  return diff;
}

export default function UpcomingBookings({ bookings }) {
  const [cancelling, setCancelling] = useState(null);

  async function handleCancel(bookingId) {
    if (!window.confirm("Cancel this trial booking?")) return;
    setCancelling(bookingId);
    try {
      const { data } = await api.post("/dashboard/cancel-booking", { bookingId });
      if (!data?.success) throw new Error("Failed");
      // optimistic UI — parent should refetch or use real-time listener
      window.location.reload();
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Could not cancel booking. Please try again.");
    } finally {
      setCancelling(null);
    }
  }

  return (
    <>
      <div className="card-header">
        <h2 className="card-title">Upcoming trials</h2>
        {bookings.length > 0 && (
          <span className="card-count">{bookings.length}</span>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🏋️</div>
          <p>No upcoming trial bookings.</p>
          <a href="/gyms" className="link-cta">
            Discover gyms →
          </a>
        </div>
      ) : (
        <ul className="booking-list">
          {bookings.map((b) => {
            const days = daysUntil(b.visitDate || b.createdAt);
            const status = STATUS_LABELS[b.status] || STATUS_LABELS.pending;
            return (
              <li key={b.id} className="booking-item">
                <div className="booking-item__left">
                  <div className="booking-item__gym">{b.gymName}</div>
                  <div className="booking-item__meta">
                    <span>{formatDate(b.visitDate || b.createdAt)}</span>
                    <span className="sep">·</span>
                    <span>{b.slot || "TBD"}</span>
                  </div>
                  {b.trainerName && (
                    <div className="booking-item__trainer">
                      👤 {b.trainerName}
                    </div>
                  )}
                </div>
                <div className="booking-item__right">
                  <span className={`badge ${status.cls}`}>{status.label}</span>
                  {days !== null && days <= 3 && days >= 0 && (
                    <span className="countdown">
                      {days === 0 ? "Today!" : `${days}d away`}
                    </span>
                  )}
                  {b.status !== "cancelled" && (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(b.id)}
                      disabled={cancelling === b.id}
                    >
                      {cancelling === b.id ? "…" : "Cancel"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
