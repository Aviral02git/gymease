const PLAN_META = {
  Lite: {
    color: "#4A90D9",
    perks: ["1 gym/month", "Basic AI guidance", "Email support"],
    emoji: "🥈",
  },
  Prime: {
    color: "#F5A623",
    perks: ["3 gyms/month", "Full AI workout plans", "Priority support", "Diet guidance"],
    emoji: "🥇",
  },
  Platinum: {
    color: "#9B59B6",
    perks: [
      "Unlimited gyms",
      "Advanced AI coach",
      "24/7 support",
      "Diet + supplement plans",
      "Personal trainer matching",
    ],
    emoji: "💎",
  },
};

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return Math.max(0, Math.ceil((d - Date.now()) / 86400000));
}

export default function ActivePlan({ plan }) {
  if (!plan) {
    return (
      <>
        <div className="card-header">
          <h2 className="card-title">Membership plan</h2>
        </div>
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <p>No active plan found.</p>
          <a href="/plans" className="link-cta">
            View plans →
          </a>
        </div>
      </>
    );
  }

  const meta = PLAN_META[plan.tier] || PLAN_META.Lite;
  const remaining = daysLeft(plan.expiresAt);
  const urgency = remaining !== null && remaining <= 7;

  return (
    <>
      <div className="card-header">
        <h2 className="card-title">Membership plan</h2>
      </div>

      <div className="plan-badge" style={{ "--plan-color": meta.color }}>
        <span className="plan-badge__emoji">{meta.emoji}</span>
        <div>
          <div className="plan-badge__tier">{plan.tier}</div>
          <div className="plan-badge__since">
            Active since {formatDate(plan.startedAt)}
          </div>
        </div>
      </div>

      {remaining !== null && (
        <div className={`plan-expiry ${urgency ? "plan-expiry--urgent" : ""}`}>
          <span className="plan-expiry__icon">{urgency ? "⚠️" : "🗓️"}</span>
          <span>
            {remaining === 0
              ? "Expires today!"
              : `${remaining} day${remaining === 1 ? "" : "s"} remaining`}
          </span>
          <span className="plan-expiry__date">
            (expires {formatDate(plan.expiresAt)})
          </span>
        </div>
      )}

      {/* Perks */}
      <ul className="plan-perks">
        {meta.perks.map((p) => (
          <li key={p} className="plan-perk">
            <span className="plan-perk__check" style={{ color: meta.color }}>
              ✓
            </span>
            {p}
          </li>
        ))}
      </ul>

      <div className="plan-actions">
        {plan.tier !== "Platinum" && (
          <a href="/plans" className="btn btn--primary">
            Upgrade plan
          </a>
        )}
        <a href="/plans" className="btn btn--ghost">
          Manage plan
        </a>
      </div>
    </>
  );
}
