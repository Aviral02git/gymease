import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase/supabaseClient";
import UpcomingBookings from "./UpcomingBookings";
import ActivePlan from "./ActivePlan";
import WorkoutHistory from "./WorkoutHistory";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [plan, setPlan] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        setLoading(false);
        return;
      }
      fetchDashboardData(user.id);
    }
  }, [user, authLoading]);

  async function fetchDashboardData(uid) {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchBookings(uid),
        fetchActivePlan(uid),
        fetchWorkoutHistory(uid),
      ]);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchBookings(uid) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("userId", uid)
      .gte("slotDate", now)
      .order("slotDate", { ascending: true });
    
    if (error) console.error(error);
    setBookings(data || []);
  }

  async function fetchActivePlan(uid) {
    const { data, error } = await supabase
      .from("userPlans")
      .select("*")
      .eq("id", uid)
      .single();
    
    if (data) {
      setPlan(data);
    }
  }

  async function fetchWorkoutHistory(uid) {
    const { data, error } = await supabase
      .from("workoutLogs")
      .select("*")
      .eq("userId", uid)
      .order("date", { ascending: false });
      
    if (error) console.error(error);
    setWorkoutHistory(data || []);
  }

  if (loading || authLoading) {
    return (
      <div className="dash-loader">
        <div className="dash-loader__ring" />
        <span>Loading your dashboard…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dash-empty">
        <p>Please sign in to view your dashboard.</p>
      </div>
    );
  }

  const displayName = user.user_metadata?.display_name || user.user_metadata?.full_name || user.email;
  const firstName = displayName?.split(" ")[0] || "Athlete";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    
  const photoURL = user.user_metadata?.avatar_url;

  return (
    <div className="dash">
      {/* Header */}
      <header className="dash__header">
        <div className="dash__greeting">
          <span className="dash__greeting-time">{greeting},</span>
          <h1 className="dash__greeting-name">{firstName} 💪</h1>
        </div>
        <div className="dash__avatar">
          {photoURL ? (
            <img src={photoURL} alt={displayName} />
          ) : (
            <span>{firstName[0]?.toUpperCase()}</span>
          )}
        </div>
      </header>

      {error && <div className="dash__error">{error}</div>}

      {/* Stats bar */}
      <div className="dash__stats">
        <div className="dash__stat">
          <span className="dash__stat-value">{bookings.length}</span>
          <span className="dash__stat-label">Upcoming trials</span>
        </div>
        <div className="dash__stat-divider" />
        <div className="dash__stat">
          <span className="dash__stat-value">
            {plan ? plan.tier : "—"}
          </span>
          <span className="dash__stat-label">Current plan</span>
        </div>
        <div className="dash__stat-divider" />
        <div className="dash__stat">
          <span className="dash__stat-value">{workoutHistory.length}</span>
          <span className="dash__stat-label">Sessions logged</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash__grid">
        <section className="dash__card dash__card--bookings">
          <UpcomingBookings bookings={bookings} />
        </section>

        <section className="dash__card dash__card--plan">
          <ActivePlan plan={plan} />
        </section>

        <section className="dash__card dash__card--history">
          <WorkoutHistory history={workoutHistory} />
        </section>
      </div>
    </div>
  );
}
