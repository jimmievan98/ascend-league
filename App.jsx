// ================================================================
// ASCEND PB FLEX LEAGUE — COMPLETE APP v4
// All confirmed features. Mobile-first. Production ready.
// ================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://egacieyresiwkwwomesi.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnYWNpZXlyZXNpd2t3d29tZXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5NDc1NjgsImV4cCI6MjA4OTUyMzU2OH0.j7CWOFK34ANLQiZdT80j-v0x9xhGZ9dJ-QHjLiucNrw";
const SHOPIFY_URL   = "https://ascendpb.com/products/ascend-pb-flex-league-player-registration";
const LOGO_URL      = "https://egacieyresiwkwwomesi.supabase.co/storage/v1/object/public/assets/Black%20Modern%20Initials%20AP%20Logo%20(7).png";
const LOGO_BLUE_URL = "https://egacieyresiwkwwomesi.supabase.co/storage/v1/object/public/logo/Black%20Modern%20Initials%20AP%20Logo%20(10).png";
const FUNCTIONS_URL = "https://egacieyresiwkwwomesi.supabase.co/functions/v1";
const CONTACT_EMAIL = "league@ascendpb.com";
const APP_VERSION   = "v2.5.5";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// Helper — send email via Resend edge function (dormant until API key added)
const sendEmail = async(type, payload) => {
  try {
    await fetch(`${FUNCTIONS_URL}/send-email`, {
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":SUPABASE_ANON},
      body: JSON.stringify({ type, ...payload })
    });
  } catch(e) { /* silent — email is non-blocking */ }
};

// ── Constants ─────────────────────────────────────────────────
const SEASON   = "Spring 2026";
const WEEKS    = 6;
const PLAYOFFS = 4;
const MAX_VS   = 2;
const SKILLS   = ["3.0","3.1","3.2","3.3","3.4","3.5","3.6","3.7","3.8","3.9","4.0"];
const CLT_COURTS = [
  "Freedom Park — 1900 East Blvd (6 courts)",
  "Clarks Creek Community Park — 5435 Hucks Rd (8 courts)",
  "Martin Luther King Jr. Park — 2600 Ravencroft Dr (6 courts)",
  "Clanton Park — 1520 Clanton Rd (6 courts)",
  "Eastway Park — 3150 Eastway Pk Dr (4 courts)",
  "Pearl Street Park — 1200 Baxter Dr (2 courts)",
];
const WEEK_DATES = [
  { week:1, label:"Week 1", dates:"Mar 3–9",   deadline:"Sun Mar 9 · 11:59 PM" },
  { week:2, label:"Week 2", dates:"Mar 10–16",  deadline:"Sun Mar 16 · 11:59 PM" },
  { week:3, label:"Week 3", dates:"Mar 17–23",  deadline:"Sun Mar 23 · 11:59 PM" },
  { week:4, label:"Week 4", dates:"Mar 24–30",  deadline:"Sun Mar 30 · 11:59 PM" },
  { week:5, label:"Week 5", dates:"Mar 31–Apr 6",deadline:"Sun Apr 6 · 11:59 PM" },
  { week:6, label:"Week 6 — Playoffs", dates:"Apr 7–13", deadline:"Sun Apr 13 · 11:59 PM" },
];
const CURRENT_WEEK = 3;

// ── Colors ────────────────────────────────────────────────────
const C = {
  bg:"#f5f5f3", white:"#fff", border:"#e4e4e0",
  text:"#111", muted:"#888", faint:"#aaa",
  blue:"#0369a1", blueBg:"#eff6ff", blueBorder:"#bfdbfe",
  green:"#15803d", greenBg:"#dcfce7",
  amber:"#b45309", amberBg:"#fef9c3",
  red:"#dc2626", redBg:"#fee2e2",
  gray:"#444", purple:"#6d28d9", purpleBg:"#ede9fe",
  orange:"#ea580c", orangeBg:"#fff7ed",
};

const WAIVER = `ASCEND PB FLEX LEAGUE — OFFICIAL RULES & WAIVER · ${SEASON}

SEASON FORMAT
• ${WEEKS}-week flex season. Teams post open match requests — no targeted opponents.
• All matches: Best of 3 games, each to 11 points, win by 2.
• Teams find their own court anywhere in Charlotte, NC.
• Scores submitted within 24 hours of playing.

MATCH LIMITS
• Maximum ${MAX_VS} matches vs the same opponent per season.
• No weekly cap — play as much as your schedule allows.

DIVISIONS
• 3.0–3.5 Division: beginner to intermediate skill level.
• 3.5–4.0 Division: intermediate to advanced skill level.
• Players rated exactly 3.5 may choose their division at registration.
• Ascend Pickleball reserves the right to reassign players.

SCHEDULING & CANCELLATIONS
• Post a match request — any team in your division may accept, comment, or counter.
• Once confirmed, either team may cancel with a reason. Repeat cancellations may result in admin action.

SUBSTITUTES
• Allowed — at least 1 original player must be on the court.
• Must be disclosed when submitting scores.

SCORING
• 2 points per match win. 0 for a loss.
• Either team submits scores. Opponent confirms within 24 hours or score auto-confirms.
• Disputed scores resolved by admin within 48 hours.

PLAYOFFS
• Top ${PLAYOFFS} teams per division advance to playoffs in Week ${WEEKS}.
• Minimum 3 regular season matches required to qualify.
• Single elimination. 12-hour score confirmation window.

FEES & REFUNDS
• $25 per player. Both players pay separately via the Ascend PB store.
• Non-refundable after Week 1 begins.

LIABILITY WAIVER
By registering, I acknowledge that pickleball involves physical activity and inherent risk. I agree to hold Ascend Pickleball LLC harmless from any claims, injuries, or damages. Participation is voluntary.`;

// ── Date/time formatters ──────────────────────────────────────
// Converts "2026-03-20" → "March 20, 2026"
const fmtDate = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d + "T12:00:00"); // noon avoids timezone shift
    return dt.toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
  } catch { return d; }
};
// Converts "19:44" (24h) or "10:00 AM" → "7:44 PM" (12h)
const fmtTime = (t) => {
  if (!t) return "";
  try {
    if (t.includes(":")) {
      const [raw, meridiem] = t.split(" ");
      let [h, m] = raw.split(":").map(Number);
      if (meridiem === "PM" && h !== 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      const d = new Date(); d.setHours(h, m || 0, 0, 0);
      return d.toLocaleTimeString("en-US", { hour:"numeric", minute:"2-digit", hour12:true });
    }
  } catch {}
  return t;
};
// Combined: "March 20, 2026 at 7:44 PM"
const fmtDateTime = (d, t) => { const fd=fmtDate(d); const ft=fmtTime(t); return fd&&ft?`${fd} at ${ft}`:fd||ft||""; };
function useMobile() {
  const [m, setM] = useState(typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const h = () => setM(window.innerWidth < 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}

function useFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      html,body{height:100%;overflow-x:hidden;overscroll-behavior:none;-webkit-overflow-scrolling:touch}
      body{background:#f5f5f3;-webkit-tap-highlight-color:transparent;position:relative;overflow-y:auto}
      input[type="date"],input[type="time"]{
        background:#fff;
        border:1.5px solid #d1d5db;
        border-radius:10px;
        padding:12px 14px;
        font-size:15px;
        color:#111;
        width:100%;
        outline:none;
        font-family:'DM Sans',sans-serif;
        -webkit-appearance:none;
        cursor:pointer;
        box-shadow:0 1px 3px rgba(0,0,0,.06);
        transition:border .15s,box-shadow .15s;
      }
      input[type="date"]:focus,input[type="time"]:focus{
        border-color:#0369a1;
        box-shadow:0 0 0 3px rgba(3,105,161,.12);
      }
      input[type="time"]::-webkit-calendar-picker-indicator,
      input[type="date"]::-webkit-calendar-picker-indicator{
        opacity:0.7;
        cursor:pointer;
        filter:invert(0.3);
        width:20px;
        height:20px;
      }
      .tscroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
      @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
    `;
    document.head.appendChild(s);
  }, []);
}

function useSwipe(onLeft, onRight) {
  const ref = useRef(null);
  const sx  = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ts = e => { sx.current = e.touches[0].clientX; };
    const te = e => {
      const dx = e.changedTouches[0].clientX - sx.current;
      if (Math.abs(dx) > 60) { dx < 0 ? onLeft?.() : onRight?.(); }
    };
    el.addEventListener("touchstart", ts, { passive:true });
    el.addEventListener("touchend",   te, { passive:true });
    return () => { el.removeEventListener("touchstart", ts); el.removeEventListener("touchend", te); };
  }, [onLeft, onRight]);
  return ref;
}

// ── Design helpers ────────────────────────────────────────────
const inp  = (x={}) => ({ background:C.bg, border:`1px solid ${C.border}`, borderRadius:"8px", padding:"11px 13px", color:C.text, fontSize:"15px", width:"100%", outline:"none", ...x });
const btn  = (bg=C.text, c="#fff", x={}) => ({ background:bg, color:c, border:"none", borderRadius:"8px", padding:"11px 20px", fontSize:"14px", fontWeight:"600", cursor:"pointer", whiteSpace:"nowrap", minHeight:"44px", ...x });
const card = (x={}) => ({ background:C.white, border:`1px solid ${C.border}`, borderRadius:"12px", padding:"16px", ...x });

const Tag = ({ c="blue", sm, children }) => {
  const m = { blue:[C.blue,"#e0f2fe"], green:[C.green,C.greenBg], amber:[C.amber,C.amberBg], red:[C.red,C.redBg], gray:[C.gray,"#f0f0ee"], black:[C.text,C.bg], purple:[C.purple,C.purpleBg], orange:[C.orange,C.orangeBg] };
  const [col, bg] = m[c] || m.blue;
  return <span style={{ display:"inline-block", borderRadius:"6px", padding:sm?"2px 6px":"3px 9px", fontSize:sm?"10px":"11px", fontWeight:"700", whiteSpace:"nowrap", background:bg, color:col }}>{children}</span>;
};
const Lbl   = ({ c, children }) => <label style={{ fontSize:"11px", fontWeight:"600", color:c||C.muted, textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:"6px" }}>{children}</label>;
const Alert = ({ type="info", children, onDismiss }) => {
  const map = { info:[C.blue,"#e0f2fe"], success:[C.green,C.greenBg], warn:[C.amber,C.amberBg], error:[C.red,C.redBg] };
  const [col, bg] = map[type];
  return <div style={{ background:bg, border:`1px solid ${col}30`, borderRadius:"10px", padding:"12px 16px", marginBottom:"14px", display:"flex", gap:"10px", alignItems:"flex-start" }}>
    <div style={{ flex:1, fontSize:"14px", color:col, lineHeight:"1.5" }}>{children}</div>
    {onDismiss && <button onClick={onDismiss} style={{ background:"none", border:"none", cursor:"pointer", color:col, fontSize:"20px", lineHeight:1, padding:0 }}>×</button>}
  </div>;
};
const Pill = ({ d, active, onClick }) => {
  const col = d==="low"?"#334155":C.blue;
  return <button onClick={onClick} style={{ borderRadius:"999px", padding:"7px 18px", cursor:"pointer", fontSize:"13px", fontWeight:"600", border:`1.5px solid ${col}`, background:active?col:C.white, color:active?"#fff":col, transition:"all .12s", minHeight:"44px" }}>{d==="low"?"3.0–3.5":"3.5–4.0"}</button>;
};
const dL = d => d==="low"?"3.0–3.5":"3.5–4.0";
const dC = d => d==="low"?"#334155":C.blue;
const timeAgo = ts => {
  const s = Math.floor((Date.now()-new Date(ts))/1000);
  if (s<60) return "just now";
  if (s<3600) return `${Math.floor(s/60)}m ago`;
  if (s<86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};
const parseMatchDateTime = (date, time) => {
  if (!date || !time) return null;
  try {
    // Handle "10:00 AM" / "2:30 PM" formats
    const [timePart, meridiem] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    const d = new Date(date);
    d.setHours(hours, minutes || 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  } catch { return null; }
};

const countdown = (date, time) => {
  const dt = parseMatchDateTime(date, time);
  if (!dt) return null;
  const diff = dt - Date.now();
  if (diff <= 0) return "Now";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};
const isToday = ts => {
  const d = new Date(ts);
  const n = new Date();
  return d.getDate()===n.getDate() && d.getMonth()===n.getMonth() && d.getFullYear()===n.getFullYear();
};

// ── Logo ──────────────────────────────────────────────────────
const AscendLogo = ({ height=60 }) => <img src={LOGO_URL} alt="Ascend Pickleball" style={{ height, width:"auto", display:"block", mixBlendMode:"multiply" }}/>;
const AscendMark = ({ height=30 }) => <img src={LOGO_URL} alt="Ascend Pickleball" style={{ height, width:"auto", display:"block", mixBlendMode:"multiply" }}/>;

// ── Icons ─────────────────────────────────────────────────────
const Icon = ({ n, size=20 }) => {
  const icons = {
    home:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    board:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    scores:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    standings:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    chat:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    admin:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    bell:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    send:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    map:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    image:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    flag:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    pin:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    trash:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    pause:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    check:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    trophy:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="8 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V5a1 1 0 0 0-1-1h-3"/><rect x="7" y="2" width="10" height="12" rx="1"/></svg>,
  };
  return icons[n] || null;
};

// ── Notification Bell ─────────────────────────────────────────
function NotifBell({ notifications, onOpen }) {
  const unread = notifications.filter(n=>!n.read).length;
  return (
    <button onClick={onOpen} style={{ position:"relative", background:"none", border:"none", cursor:"pointer", padding:"8px", color:C.muted, display:"flex", alignItems:"center", minHeight:"44px", minWidth:"44px", justifyContent:"center" }}>
      <Icon n="bell" size={22}/>
      {unread>0 && <span style={{ position:"absolute", top:"5px", right:"5px", background:C.red, color:"#fff", borderRadius:"50%", width:"17px", height:"17px", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>{unread>9?"9+":unread}</span>}
    </button>
  );
}

function NotifPanel({ notifications, setNotifications, onClose }) {
  const markAll = async () => {
    await sb.from("notifications").update({read:true}).eq("read",false);
    setNotifications(p=>p.map(n=>({...n,read:true})));
  };
  const icons = { match_accepted:"✓", score_submitted:"📊", score_confirmed:"✅", disputed:"⚠", message:"💬", match_message:"🏓", admin_announcement:"📢", match_cancelled:"❌", match_reminder:"⏰", match_today:"🏓" };
  return (
    <div style={{ position:"absolute", top:"52px", right:"8px", width:"320px", maxWidth:"calc(100vw - 16px)", background:C.white, border:`1px solid ${C.border}`, borderRadius:"12px", boxShadow:"0 8px 30px rgba(0,0,0,.12)", zIndex:200, animation:"fadeIn .15s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", borderBottom:`1px solid ${C.border}` }}>
        <span style={{ fontWeight:"700", fontSize:"15px" }}>Notifications</span>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          <button onClick={markAll} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"12px", color:C.blue }}>Mark all read</button>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"22px", color:C.muted, lineHeight:1 }}>×</button>
        </div>
      </div>
      <div style={{ maxHeight:"380px", overflowY:"auto" }}>
        {notifications.length===0 && <div style={{ padding:"24px", textAlign:"center", color:C.faint, fontSize:"13px" }}>No notifications yet.</div>}
        {notifications.map(n=>(
          <div key={n.id} style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, background:n.read?"transparent":"#f0f9ff", display:"flex", gap:"10px", alignItems:"flex-start" }}>
            <span style={{ fontSize:"16px", flexShrink:0, marginTop:"1px" }}>{icons[n.type]||"•"}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:n.read?"500":"700", fontSize:"13px", marginBottom:"2px" }}>{n.title}</div>
              <div style={{ fontSize:"12px", color:C.muted, lineHeight:"1.4" }}>{n.body}</div>
              <div style={{ fontSize:"11px", color:C.faint, marginTop:"3px" }}>{timeAgo(n.created_at)}</div>
            </div>
            {!n.read && <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:C.blue, flexShrink:0, marginTop:"5px" }}/>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Match Confirm Modal ───────────────────────────────────────
function MatchConfirmModal({ req, respondingAs, teams, onConfirm, onClose, isCounter, counterData }) {
  const poster = teams.find(t=>t.id===req.team_id);
  const date   = isCounter ? counterData?.counter_date||req.proposed_date : req.proposed_date;
  const time   = isCounter ? counterData?.counter_time||req.proposed_time : req.proposed_time;
  const court  = isCounter ? counterData?.counter_court||req.proposed_court : req.proposed_court;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ ...card(), width:"100%", maxWidth:"380px", animation:"fadeIn .15s ease" }}>
        <div style={{ textAlign:"center", marginBottom:"16px" }}>
          <div style={{ fontSize:"36px", marginBottom:"8px" }}>🏓</div>
          <div style={{ fontSize:"20px", fontWeight:"700", marginBottom:"4px" }}>Confirm Match</div>
          <div style={{ fontSize:"13px", color:C.muted }}>This will lock in your match with {poster?.name}</div>
        </div>
        <div style={{ background:C.bg, borderRadius:"10px", padding:"14px", marginBottom:"16px" }}>
          {[["Opponent", poster?.name], ["Date", date], ["Time", time], ["Court", court], ["Division", dL(req.division)]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:"13px", color:C.muted }}>{l}</span>
              <span style={{ fontSize:"13px", fontWeight:"600" }}>{v}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize:"12px", color:C.muted, textAlign:"center", marginBottom:"16px", lineHeight:"1.6" }}>Once confirmed, the match is locked. Both teams will be notified and a private chat will open.</p>
        <div style={{ display:"flex", gap:"10px" }}>
          <button style={btn(C.green,"#fff",{flex:1})} onClick={onConfirm}>Yes, Confirm Match</button>
          <button style={btn(C.gray,"#fff",{flex:1})} onClick={onClose}>Go Back</button>
        </div>
      </div>
    </div>
  );
}

// ── Cancel Match Modal ────────────────────────────────────────
function CancelMatchModal({ match, myTeam, teams, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const opp = teams.find(t=>t.id===(match.t1_id===myTeam.id?match.t2_id:match.t1_id));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ ...card(), width:"100%", maxWidth:"400px", animation:"fadeIn .15s ease" }}>
        <div style={{ fontSize:"18px", fontWeight:"700", marginBottom:"8px" }}>Cancel Match</div>
        <p style={{ fontSize:"14px", color:C.muted, marginBottom:"16px", lineHeight:"1.6" }}>You are cancelling your match vs <strong style={{color:C.text}}>{opp?.name}</strong>. They will be notified immediately. Please provide a reason.</p>
        <Lbl>Reason for cancellation</Lbl>
        <textarea style={{ ...inp({minHeight:"90px",resize:"vertical"}), marginBottom:"16px" }} placeholder="e.g. Scheduling conflict — can we reschedule next week?" value={reason} onChange={e=>setReason(e.target.value)}/>
        <div style={{ display:"flex", gap:"8px" }}>
          <button style={btn(C.red,"#fff",{flex:1})} onClick={()=>reason.trim()&&onConfirm(match,reason)} disabled={!reason.trim()}>Cancel Match</button>
          <button style={btn(C.gray,"#fff",{flex:1})} onClick={onClose}>Go Back</button>
        </div>
      </div>
    </div>
  );
}

// ── Report Problem Modal ──────────────────────────────────────
function ReportModal({ myTeam, onClose }) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const submit = async () => {
    if (!msg.trim()) return;
    await sb.from("admin_activity_log").insert({ action:"Player report", target_type:"team", target_id:myTeam?.id, details:`${myTeam?.name}: ${msg}` });
    setSent(true);
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ ...card(), width:"100%", maxWidth:"380px", animation:"fadeIn .15s ease" }}>
        {sent ? (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:"36px", marginBottom:"10px" }}>✅</div>
            <div style={{ fontSize:"18px", fontWeight:"700", marginBottom:"8px" }}>Report Sent</div>
            <p style={{ fontSize:"13px", color:C.muted, marginBottom:"16px" }}>Admin will review your report shortly.</p>
            <button style={btn(C.gray,"#fff")} onClick={onClose}>Close</button>
          </div>
        ) : <>
          <div style={{ fontSize:"18px", fontWeight:"700", marginBottom:"4px" }}>Report a Problem</div>
          <p style={{ fontSize:"13px", color:C.muted, marginBottom:"14px" }}>Describe the issue and admin will review it promptly.</p>
          <Lbl>What's the issue?</Lbl>
          <textarea style={{ ...inp({minHeight:"100px",resize:"vertical"}), marginBottom:"14px" }} placeholder="e.g. Opponent no-showed, score entered incorrectly, inappropriate chat message..." value={msg} onChange={e=>setMsg(e.target.value)}/>
          <div style={{ display:"flex", gap:"8px" }}>
            <button style={btn(C.text,"#fff",{flex:1})} onClick={submit} disabled={!msg.trim()}>Send Report</button>
            <button style={btn(C.gray,"#fff",{flex:1})} onClick={onClose}>Cancel</button>
          </div>
        </>}
      </div>
    </div>
  );
}

// ── Match Chat Modal ──────────────────────────────────────────
// ── MESSENGER CHAT SYSTEM ─────────────────────────────────────
// Shared bubble renderer used by both division and match chats
function ChatBubbles({ msgs, myTeam, endRef, emptyMsg }) {
  return (
    <div style={{flex:1, overflowY:"auto", padding:"16px"}}>
      {msgs.length===0 && <div style={{textAlign:"center",color:C.faint,fontSize:"13px",padding:"24px 0"}}>{emptyMsg||"No messages yet."}</div>}
      {msgs.map(m=>{
        const mine = m.team_id===myTeam?.id || m.sent_by===myTeam?.id;
        const isAdmin = m.is_admin;
        const senderLabel = isAdmin ? "League Admin" : `${m.sender_name||""} (${m.team_name||"?"})`.trim().replace(/^\s*\(/,"(");
        return(
          <div key={m.id} style={{display:"flex", flexDirection:mine?"row-reverse":"row", marginBottom:"10px", alignItems:"flex-end"}}>
            <div style={{maxWidth:"72%"}}>
              {!mine && <div style={{fontSize:"11px",color:isAdmin?"#d97706":C.muted,marginBottom:"3px",fontWeight:"700",paddingLeft:"4px"}}>{senderLabel}</div>}
              <div style={{background:mine?"#0084ff":isAdmin?"#fef3c7":"#e9e9eb", color:mine?"#fff":isAdmin?"#78350f":"#000", borderRadius:mine?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 14px", fontSize:"14px", lineHeight:"1.5", wordBreak:"break-word"}}>
                {m.content}
              </div>
              <div style={{fontSize:"10px",color:C.faint,marginTop:"3px",textAlign:mine?"right":"left",paddingLeft:"4px"}}>{timeAgo(m.created_at)}</div>
            </div>
          </div>
        );
      })}
      <div ref={endRef}/>
    </div>
  );
}

// Single match chat pane
function MatchChatPane({ match, myTeam, teams, onBack, mobile }) {
  const [msgs,    setMsgs]  = useState([]);
  const [input,   setInput] = useState("");
  const endRef = useRef(null);
  const opp    = teams.find(t=>t.id===(match.t1_id===myTeam?.id?match.t2_id:match.t1_id));
  const isClosed = match.chat_closed_at && new Date(match.chat_closed_at)<new Date();

  useEffect(()=>{
    sb.from("match_chats").select("*").eq("match_id",match.id).order("created_at",{ascending:true}).then(({data})=>{
      if(data) setMsgs(data);
      setTimeout(()=>endRef.current?.scrollIntoView(),100);
    });
    const ch=sb.channel(`mcp-${match.id}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"match_chats",filter:`match_id=eq.${match.id}`},p=>{
        setMsgs(prev=>[...prev,p.new]);
        setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),50);
      }).subscribe();
    return()=>sb.removeChannel(ch);
  },[match.id]);

  const send=async()=>{
    if(!input.trim()||isClosed)return;
    await sb.from("match_chats").insert({match_id:match.id,team_id:myTeam.id,team_name:myTeam.name,sender_name:myTeam.p1_name||myTeam.name,content:input.trim()});
    setInput("");
  };

  // Normalise msgs for ChatBubbles — team_id is the key
  const normMsgs = msgs.map(m=>({...m, sent_by:m.team_id}));

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:C.white,flexShrink:0}}>
        {(mobile||onBack)&&<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:C.text,fontSize:"22px",lineHeight:1,minWidth:"40px",minHeight:"40px",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>vs {opp?.name}</div>
          <div style={{fontSize:"11px",color:C.muted}}>{fmtDateTime(match.match_date,match.match_time)}</div>
          <div style={{fontSize:"11px",color:"#555",marginTop:"1px"}}>📍 {match.court}</div>
        </div>
      </div>
      {isClosed&&<div style={{background:C.amberBg,padding:"7px 16px",fontSize:"12px",color:C.amber,textAlign:"center",flexShrink:0}}>This chat is archived.</div>}
      {/* Phone number tip */}
      <div style={{background:"#f0fdf4",borderBottom:`1px solid #bbf7d0`,padding:"8px 16px",fontSize:"12px",color:"#166534",textAlign:"center",flexShrink:0}}>
        💬 Pro tip — share your phone number so you can coordinate easily on match day!
      </div>
      <ChatBubbles msgs={normMsgs} myTeam={myTeam} endRef={endRef} emptyMsg="Chat opened! Coordinate your match here."/>
      {!isClosed&&<div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,background:C.white,flexShrink:0}}>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          <input style={{...inp(),flex:1}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message..."/>
          <button style={{...btn(C.text,"#fff",{padding:"10px 14px",minHeight:"44px"}),display:"flex",alignItems:"center",justifyContent:"center"}} onClick={send}><Icon n="send" size={18}/></button>
        </div>
      </div>}
    </div>
  );
}

// Division chat pane
function DivisionChatPane({ myTeam, isAdmin, division, setAdminDiv, adminPauseChat, setAdminPauseChat, onBack, mobile }) {
  const [msgs,  setMsgs]  = useState([]);
  const [input, setInput] = useState("");
  const [pinned,setPinned]= useState(null);
  const endRef = useRef(null);
  const canPost = myTeam?.approved && !adminPauseChat;

  useEffect(()=>{
    sb.from("division_chats").select("*").eq("division",division).order("created_at",{ascending:true}).limit(300).then(({data})=>{
      if(data) setMsgs(data);
      setTimeout(()=>endRef.current?.scrollIntoView(),100);
    });
    const ch=sb.channel(`dcp-${division}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"division_chats",filter:`division=eq.${division}`},p=>{
        setMsgs(prev=>[...prev,p.new]);
        setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),50);
      }).subscribe();
    return()=>sb.removeChannel(ch);
  },[division]);

  const send=async()=>{
    if(!input.trim()||!canPost)return;
    await sb.from("division_chats").insert({division,team_id:myTeam.id,team_name:myTeam.name,sender_name:myTeam.p1_name||myTeam.name,is_admin:isAdmin,content:input.trim()});
    setInput("");
  };

  const deleteMsg=async(id)=>{ if(!isAdmin)return; await sb.from("division_chats").delete().eq("id",id); setMsgs(p=>p.filter(m=>m.id!==id)); };

  const normMsgs = msgs.map(m=>({...m,sent_by:m.team_id}));

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"12px 16px",borderBottom:`1px solid ${C.border}`,background:"#1d1d1f",flexShrink:0}}>
        {(mobile||onBack)&&<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:"#fff",fontSize:"22px",lineHeight:1,minWidth:"40px",minHeight:"40px",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>}
        <div style={{width:"38px",height:"38px",borderRadius:"50%",background:"#00BFFF",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"14px",fontWeight:"800",color:"#fff"}}>AP</div>
        <div style={{flex:1}}>
          <div style={{fontSize:"14px",fontWeight:"700",color:"#fff"}}>{dL(division)} Division Chat</div>
          <div style={{fontSize:"11px",color:"rgba(255,255,255,.5)"}}>All teams in your division</div>
        </div>
        {isAdmin&&<>
          {["low","high"].map(d=>(
            <button key={d} onClick={()=>setAdminDiv(d)} style={{background:division===d?"#00BFFF":"rgba(255,255,255,.15)",border:"none",cursor:"pointer",borderRadius:"6px",padding:"5px 10px",fontSize:"11px",fontWeight:"700",color:"#fff"}}>{dL(d)}</button>
          ))}
          <button onClick={()=>setAdminPauseChat(p=>!p)} style={{background:adminPauseChat?"#22c55e":"rgba(255,255,255,.15)",border:"none",cursor:"pointer",borderRadius:"6px",padding:"5px 10px",fontSize:"11px",color:"#fff"}}>{adminPauseChat?"Resume":"Pause"}</button>
        </>}
      </div>
      {pinned&&<div style={{background:"#fef9c3",borderBottom:`1px solid #fde68a`,padding:"8px 16px",display:"flex",gap:"8px",alignItems:"center",flexShrink:0}}>
        <span>📌</span><div style={{flex:1,fontSize:"12px",color:"#78350f"}}><strong>{pinned.team_name}:</strong> {pinned.content}</div>
        {isAdmin&&<button onClick={()=>setPinned(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:"16px"}}>×</button>}
      </div>}
      {adminPauseChat&&<div style={{background:C.amberBg,padding:"7px 16px",fontSize:"12px",color:C.amber,textAlign:"center",flexShrink:0}}>Chat paused by admin.</div>}
      {/* Messages with admin delete/pin controls */}
      <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
        {normMsgs.length===0&&<div style={{textAlign:"center",color:C.faint,fontSize:"13px",padding:"24px 0"}}>No messages yet. Start the conversation!</div>}
        {normMsgs.map(m=>{
          const mine=m.team_id===myTeam?.id;
          const isAdminMsg=m.is_admin;
          const label=isAdminMsg?"League Admin":`${m.sender_name||""} (${m.team_name||"?"})`.trim().replace(/^\s*\(/,"(");
          return(
            <div key={m.id} style={{display:"flex",flexDirection:mine?"row-reverse":"row",gap:"8px",marginBottom:"14px",alignItems:"flex-end"}}>
              <div style={{maxWidth:"72%",position:"relative"}}>
                {!mine&&<div style={{fontSize:"11px",color:isAdminMsg?"#d97706":dC(division),marginBottom:"3px",fontWeight:"700"}}>{label}</div>}
                <div style={{background:mine?"#0084ff":isAdminMsg?"#fef3c7":"#e9e9eb",color:mine?"#fff":isAdminMsg?"#78350f":"#000",borderRadius:mine?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",fontSize:"14px",lineHeight:"1.5",wordBreak:"break-word"}}>
                  {m.content}
                </div>
                <div style={{fontSize:"10px",color:C.faint,marginTop:"3px",textAlign:mine?"right":"left"}}>{timeAgo(m.created_at)}</div>
                {isAdmin&&<div style={{position:"absolute",top:0,right:mine?undefined:"calc(100% + 4px)",left:mine?"calc(100% + 4px)":undefined,display:"flex",gap:"2px"}}>
                  <button onClick={()=>setPinned(p=>p?.id===m.id?null:m)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:"4px",cursor:"pointer",padding:"2px 5px",fontSize:"11px"}}>📌</button>
                  <button onClick={()=>deleteMsg(m.id)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:"4px",cursor:"pointer",padding:"2px 5px",fontSize:"11px",color:C.red}}>🗑</button>
                </div>}
              </div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>
      {!adminPauseChat&&<div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,background:C.white,flexShrink:0}}>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          <input style={{...inp(),flex:1}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={canPost?`Message ${dL(division)}...`:"Account must be activated to chat."} disabled={!canPost}/>
          <button style={{...btn(C.text,"#fff",{padding:"10px 14px",minHeight:"44px"}),display:"flex",alignItems:"center",justifyContent:"center"}} onClick={send} disabled={!canPost}><Icon n="send" size={18}/></button>
        </div>
      </div>}
    </div>
  );
}

// Main chat hub — Messenger layout
function DivisionChat({ myTeam, isAdmin, teams, matches, adminPauseChat, setAdminPauseChat }) {
  const mobile   = useMobile();
  const myDiv    = myTeam?.division || "low";
  const [adminDiv,    setAdminDiv]    = useState(myDiv);
  const [selected,    setSelected]    = useState(null); // null | {type:"division"} | {type:"match",match}
  const [lastSeen,    setLastSeen]    = useState({}); // {chatKey: timestamp}
  const [divMsgCounts,setDivMsgCounts]= useState({low:0,high:0});
  const [matchMsgCounts,setMatchMsgCounts]=useState({}); // {matchId: count}

  const division = isAdmin ? adminDiv : myDiv;

  // Active confirmed matches for this team — kept in state but match chats hidden for now
  const myMatches = matches.filter(m=>
    (m.t1_id===myTeam?.id||m.t2_id===myTeam?.id) && !m.cancelled
  ).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

  const activeMatches    = []; // MATCH CHATS HIDDEN — coordination moved to group text
  const completedMatches = []; // MATCH CHATS HIDDEN — coordination moved to group text

  const tName = id => teams.find(t=>t.id===id)?.name??"Unknown";

  // Load unread counts
  useEffect(()=>{
    // Division chat counts
    const divs = isAdmin?["low","high"]:[myDiv];
    divs.forEach(d=>{
      sb.from("division_chats").select("id,created_at").eq("division",d).order("created_at",{ascending:false}).limit(1).then(({data})=>{
        if(data?.[0]) setDivMsgCounts(c=>({...c,[d]:new Date(data[0].created_at).getTime()}));
      });
    });
    // Match chat counts
    myMatches.forEach(m=>{
      sb.from("match_chats").select("id,created_at").eq("match_id",m.id).order("created_at",{ascending:false}).limit(1).then(({data})=>{
        if(data?.[0]) setMatchMsgCounts(c=>({...c,[m.id]:new Date(data[0].created_at).getTime()}));
      });
    });
  },[matches]);

  const markSeen=(key)=>setLastSeen(p=>({...p,[key]:Date.now()}));

  const hasUnread=(key,latestTs)=>{
    if(!latestTs)return false;
    const seen=lastSeen[key]||0;
    return latestTs>seen;
  };

  const selectDiv=()=>{
    setSelected({type:"division"});
    markSeen(`div-${division}`);
  };

  const selectMatch=(m)=>{
    setSelected({type:"match",match:m});
    markSeen(`match-${m.id}`);
  };

  // On mobile, if nothing selected, show list. If selected show full screen pane.
  const showList = mobile ? !selected : true;
  const showPane = mobile ? !!selected : !!selected;

  if(!myTeam?.approved && !isAdmin) return(
    <div style={{...card(),textAlign:"center",padding:"48px 20px"}}>
      <div style={{fontSize:"36px",marginBottom:"12px"}}>🔒</div>
      <div style={{fontSize:"18px",fontWeight:"700",marginBottom:"8px"}}>Chat</div>
      <p style={{fontSize:"13px",color:C.muted,lineHeight:"1.6"}}>Chat is available to approved teams only.</p>
    </div>
  );

  // Sidebar list
  const Sidebar = () => { return (
    <div style={{width:mobile?"100%":"300px",flexShrink:0,borderRight:mobile?"none":`1px solid ${C.border}`,display:"flex",flexDirection:"column",background:C.white,height:"100%",overflowY:"auto"}}>
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{fontSize:"18px",fontWeight:"800",letterSpacing:"-.3px"}}>Division Chat</div>
        <div style={{fontSize:"11px",color:C.faint,marginTop:"2px"}}>Talk to everyone in your division</div>
      </div>

      {/* Division chat — always first, visually distinct */}
      <div onClick={selectDiv} style={{display:"flex",gap:"12px",alignItems:"center",padding:"13px 16px",cursor:"pointer",background:selected?.type==="division"?"#e7f3ff":"#f0fdf4",borderBottom:`2px solid ${C.border}`,transition:"background .1s"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:"14px",fontWeight:"700",marginBottom:"1px",color:"#1d1d1f"}}>{dL(division)} Division Chat</div>
          <div style={{fontSize:"12px",color:C.muted}}>All teams in your division</div>
        </div>
        {hasUnread(`div-${division}`,divMsgCounts[division])&&(
          <div style={{background:C.blue,color:"#fff",borderRadius:"50%",width:"20px",height:"20px",fontSize:"11px",fontWeight:"800",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>●</div>
        )}
      </div>

      {/* Admin div switcher */}
      {isAdmin&&<div style={{padding:"8px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:"6px"}}>
        {["low","high"].map(d=>(
          <button key={d} onClick={()=>{setAdminDiv(d);setSelected(null);}} style={{...btn(adminDiv===d?"#1d1d1f":C.gray,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"32px",flex:1})}}>
            {dL(d)}
          </button>
        ))}
      </div>}

      {/* Active matches */}
      {activeMatches.length>0&&<div style={{padding:"8px 16px 4px",fontSize:"10px",fontWeight:"700",color:C.muted,textTransform:"uppercase",letterSpacing:".8px"}}>Active Matches</div>}
      {activeMatches.map(m=>{
        const opp=teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
        const isSelected=selected?.type==="match"&&selected.match?.id===m.id;
        const unread=hasUnread(`match-${m.id}`,matchMsgCounts[m.id]);
        return(
          <div key={m.id} onClick={()=>selectMatch(m)} style={{display:"flex",gap:"12px",alignItems:"center",padding:"13px 16px",cursor:"pointer",background:isSelected?"#e7f3ff":"transparent",borderBottom:`1px solid #f0f0f0`,transition:"background .1s"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:"14px",fontWeight:unread?"800":"600",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>vs {opp?.name}</div>
              <div style={{fontSize:"12px",color:C.muted}}>{fmtDate(m.match_date)} · {fmtTime(m.match_time)}</div>
              <div style={{fontSize:"11px",color:"#555",marginTop:"1px"}}>📍 {m.court}</div>
            </div>
            {unread&&<div style={{background:C.blue,color:"#fff",borderRadius:"50%",width:"20px",height:"20px",fontSize:"11px",fontWeight:"800",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>●</div>}
          </div>
        );
      })}

      {/* Completed matches - greyed out */}
      {completedMatches.length>0&&<div style={{padding:"8px 16px 4px",fontSize:"10px",fontWeight:"700",color:C.faint,textTransform:"uppercase",letterSpacing:".8px"}}>Past Matches</div>}
      {completedMatches.map(m=>{
        const opp=teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
        const isSelected=selected?.type==="match"&&selected.match?.id===m.id;
        return(
          <div key={m.id} onClick={()=>selectMatch(m)} style={{display:"flex",gap:"12px",alignItems:"center",padding:"13px 16px",cursor:"pointer",background:isSelected?"#e7f3ff":"transparent",borderBottom:`1px solid #f0f0f0`,opacity:0.5,transition:"background .1s"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:"13px",fontWeight:"600",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>vs {opp?.name}</div>
              <div style={{fontSize:"11px",color:C.faint}}>{fmtDate(m.match_date)} · Completed</div>
            </div>
          </div>
        );
      })}

      {activeMatches.length===0&&completedMatches.length===0&&(
        <div style={{padding:"16px",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"8px",margin:"12px 12px 0",fontSize:"12px",color:"#78350f",lineHeight:"1.6"}}>
          <strong style={{display:"block",marginBottom:"3px"}}>📱 Match coordination moved to group text</strong>
          When a match is confirmed, all 4 players get added to an automatic group text from the Ascend PB number. Coordinate your match details there.
        </div>
      )}
    </div>
  );
  };

  // Empty state
  const EmptyPane = () => (
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"12px",color:C.faint}}>
      <div style={{fontSize:"48px"}}>💬</div>
      <div style={{fontSize:"16px",fontWeight:"600",color:C.muted}}>Select a chat</div>
      <div style={{fontSize:"13px"}}>Choose a division or match chat from the left</div>
    </div>
  );

  const height = mobile ? "calc(100vh - 120px)" : "calc(100vh - 120px)";

  return(
    <div>
      <div style={{fontSize:"22px",fontWeight:"700",letterSpacing:"-.3px",marginBottom:"12px"}}>Division Chat</div>
      <div style={{display:"flex",height,border:`1px solid ${C.border}`,borderRadius:"14px",overflow:"hidden",background:C.white}}>
        {showList&&Sidebar()}
        {!mobile&&(
          <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
            {!selected&&EmptyPane()}
            {selected?.type==="division"&&<DivisionChatPane myTeam={myTeam} isAdmin={isAdmin} division={division} setAdminDiv={setAdminDiv} adminPauseChat={adminPauseChat} setAdminPauseChat={setAdminPauseChat} mobile={false}/>}
            {selected?.type==="match"&&<MatchChatPane match={selected.match} myTeam={myTeam} teams={teams} mobile={false}/>}
          </div>
        )}
        {mobile&&selected&&(
          <div style={{position:"fixed",inset:0,zIndex:200,background:C.white,display:"flex",flexDirection:"column"}}>
            {selected.type==="division"&&<DivisionChatPane myTeam={myTeam} isAdmin={isAdmin} division={division} setAdminDiv={setAdminDiv} adminPauseChat={adminPauseChat} setAdminPauseChat={setAdminPauseChat} onBack={()=>setSelected(null)} mobile={true}/>}
            {selected.type==="match"&&<MatchChatPane match={selected.match} myTeam={myTeam} teams={teams} onBack={()=>setSelected(null)} mobile={true}/>}
          </div>
        )}
      </div>
    </div>
  );
}

// Legacy MatchChatWindow kept for dashboard/scores "Chat" button compatibility
function MatchChatWindow({ match, myTeam, teams, onClose }) {
  const mobile = useMobile();
  const [msgs,     setMsgs]     = useState([]);
  const [input,    setInput]    = useState("");
  const [minimized,setMinimized]= useState(false);
  const [unread,   setUnread]   = useState(0);
  const endRef = useRef(null);
  const opp    = teams.find(t=>t.id===(match.t1_id===myTeam.id?match.t2_id:match.t1_id));
  const isClosed= match.chat_closed_at && new Date(match.chat_closed_at)<new Date();

  useEffect(()=>{
    sb.from("match_chats").select("*").eq("match_id",match.id).order("created_at",{ascending:true}).then(({data})=>{
      if(data)setMsgs(data);
      setTimeout(()=>endRef.current?.scrollIntoView(),100);
    });
    const ch=sb.channel(`mcw-${match.id}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"match_chats",filter:`match_id=eq.${match.id}`},p=>{
        setMsgs(prev=>[...prev,p.new]);
        if(minimized)setUnread(u=>u+1);
        else setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),50);
      }).subscribe();
    return()=>sb.removeChannel(ch);
  },[match.id]);

  const open=()=>{setMinimized(false);setUnread(0);setTimeout(()=>endRef.current?.scrollIntoView(),100);};
  const send=async()=>{
    if(!input.trim()||isClosed)return;
    await sb.from("match_chats").insert({match_id:match.id,team_id:myTeam.id,team_name:myTeam.name,sender_name:myTeam.p1_name||myTeam.name,content:input.trim()});
    setInput("");
  };

  const Bubbles=()=>(
    <>
      <div style={{background:"#f0fdf4",borderRadius:"8px",padding:"8px 12px",marginBottom:"10px",textAlign:"center",fontSize:"11px",color:"#166534"}}>
        💬 Share your phone number for day-of coordination!
      </div>
      {msgs.length===0&&<div style={{textAlign:"center",color:C.faint,fontSize:"13px",padding:"16px 0"}}>Chat opened!</div>}
      {msgs.map(m=>{
        const mine=m.team_id===myTeam.id;
        return(
          <div key={m.id} style={{display:"flex",flexDirection:mine?"row-reverse":"row",gap:"6px",marginBottom:"10px",alignItems:"flex-end"}}>
            <div style={{maxWidth:"78%"}}>
              {!mine&&<div style={{fontSize:"10px",color:C.muted,marginBottom:"2px",fontWeight:"600"}}>{m.sender_name?`${m.sender_name} (${m.team_name})`:(m.team_name||"?")}</div>}
              <div style={{background:mine?"#0084ff":"#e9e9eb",color:mine?"#fff":"#000",borderRadius:mine?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"8px 12px",fontSize:"13px",lineHeight:"1.5",wordBreak:"break-word"}}>{m.content}</div>
              <div style={{fontSize:"10px",color:C.faint,marginTop:"2px",textAlign:mine?"right":"left"}}>{timeAgo(m.created_at)}</div>
            </div>
          </div>
        );
      })}
      <div ref={endRef}/>
    </>
  );

  if(mobile){
    return(
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
        <div style={{background:C.white,borderRadius:"16px 16px 0 0",width:"100%",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp .25s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
            <div><div style={{fontWeight:"700",fontSize:"15px"}}>vs {opp?.name}</div><div style={{fontSize:"11px",color:C.muted}}>{fmtDate(match.match_date)} · {fmtTime(match.match_time)}</div></div>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:"24px",lineHeight:1,minWidth:"44px",minHeight:"44px",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}><Bubbles/></div>
          {!isClosed&&<div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,flexShrink:0}}>
            <div style={{display:"flex",gap:"8px"}}>
              <input style={{...inp(),flex:1}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message..."/>
              <button style={{...btn(C.text,"#fff",{minHeight:"44px",padding:"10px 14px"}),display:"flex",alignItems:"center",justifyContent:"center"}} onClick={send}><Icon n="send" size={16}/></button>
            </div>
          </div>}
        </div>
      </div>
    );
  }

  // Desktop floating
  return(
    <div style={{position:"fixed",bottom:"20px",right:"20px",width:"320px",zIndex:300,display:"flex",flexDirection:"column",boxShadow:"0 4px 24px rgba(0,0,0,.18)",borderRadius:"12px",overflow:"hidden",animation:"fadeIn .2s ease"}}>
      <div onClick={minimized?open:undefined} style={{background:"#111",color:"#fff",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:minimized?"pointer":"default",userSelect:"none"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:"700",fontSize:"13px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>vs {opp?.name}</div>
          <div style={{fontSize:"11px",color:"rgba(255,255,255,.5)"}}>{fmtDate(match.match_date)} · {fmtTime(match.match_time)}</div>
        </div>
        <div style={{display:"flex",gap:"5px",alignItems:"center",flexShrink:0}}>
          {unread>0&&<span style={{background:C.red,color:"#fff",borderRadius:"50%",width:"18px",height:"18px",fontSize:"10px",fontWeight:"800",display:"flex",alignItems:"center",justifyContent:"center"}}>{unread}</span>}
          <button onClick={e=>{e.stopPropagation();minimized?open():setMinimized(true);}} style={{background:"rgba(255,255,255,.15)",border:"none",cursor:"pointer",borderRadius:"6px",width:"26px",height:"26px",color:"#fff",fontSize:"14px",display:"flex",alignItems:"center",justifyContent:"center"}}>{minimized?"▲":"▼"}</button>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",cursor:"pointer",borderRadius:"6px",width:"26px",height:"26px",color:"#fff",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
      </div>
      {!minimized&&<>
        <div style={{background:C.white,height:"300px",overflowY:"auto",padding:"12px 12px"}}><Bubbles/></div>
        {!isClosed&&<div style={{background:C.white,padding:"8px 10px",borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"flex",gap:"6px"}}>
            <input style={{...inp({padding:"7px 10px",fontSize:"13px"}),flex:1}} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message..."/>
            <button style={{...btn(C.text,"#fff",{padding:"7px 10px",minHeight:"34px"}),display:"flex",alignItems:"center",justifyContent:"center"}} onClick={send}><Icon n="send" size={14}/></button>
          </div>
        </div>}
      </>}
    </div>
  );
}

// ── Notification Prefs Modal ──────────────────────────────────
function NotifPrefsModal({ userId, onClose }) {
  const [prefs, setPrefs] = useState(null);
  const [saved, setSaved] = useState(false);
  useEffect(()=>{
    sb.from("notification_prefs").select("*").eq("user_id",userId).single().then(({data})=>{
      setPrefs(data||{user_id:userId,match_confirmed:true,match_cancelled:true,score_submitted:true,score_confirmed:true,score_disputed:true,match_message:true,division_message:true,admin_announcement:true,match_reminder_24h:true,match_reminder_2h:true,email_enabled:true});
    });
  },[userId]);
  const save=async()=>{ await sb.from("notification_prefs").upsert(prefs); setSaved(true); setTimeout(()=>{setSaved(false);onClose();},800); };
  const toggle=k=>setPrefs(p=>({...p,[k]:!p[k]}));
  const groups=[
    ["Matches",[["match_confirmed","Match confirmed"],["match_cancelled","Match cancelled"],["match_reminder_24h","Reminder 24h before"],["match_reminder_2h","Reminder 2h before"]]],
    ["Scores",[["score_submitted","Score submitted"],["score_confirmed","Score confirmed"],["score_disputed","Score disputed"]]],
    ["Messages",[["match_message","Match chat"],["division_message","Division chat"],["admin_announcement","Admin announcements"]]],
    ["Email",[["email_enabled","Email notifications"]]],
  ];
  if(!prefs)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.white,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:"480px",maxHeight:"85vh",display:"flex",flexDirection:"column",animation:"slideUp .25s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 18px",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontWeight:"700",fontSize:"17px"}}>Notification Settings</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:"24px",color:C.muted,lineHeight:1}}>×</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"16px 18px"}}>
          {groups.map(([group,items])=>(
            <div key={group} style={{marginBottom:"20px"}}>
              <div style={{fontSize:"12px",fontWeight:"700",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",marginBottom:"10px"}}>{group}</div>
              {items.map(([key,label])=>(
                <label key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer",minHeight:"44px"}}>
                  <span style={{fontSize:"14px"}}>{label}</span>
                  <div onClick={()=>toggle(key)} style={{width:"44px",height:"24px",borderRadius:"12px",background:prefs[key]?C.blue:C.border,position:"relative",transition:"background .2s",cursor:"pointer",flexShrink:0}}>
                    <div style={{position:"absolute",top:"2px",left:prefs[key]?"22px":"2px",width:"20px",height:"20px",borderRadius:"50%",background:C.white,transition:"left .2s"}}/>
                  </div>
                </label>
              ))}
            </div>
          ))}
        </div>
        <div style={{padding:"16px 18px",borderTop:`1px solid ${C.border}`}}>
          <button style={btn(saved?C.green:C.text,"#fff",{width:"100%"})} onClick={save}>{saved?"Saved!":"Save Preferences"}</button>
        </div>
      </div>
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────
const genCode = () => Math.random().toString(36).substring(2,8).toUpperCase();

// ── FRIENDLY ERROR MESSAGES ──────────────────────────────────
const friendlyError = (msg) => {
  if(!msg) return "Something went wrong. Please try again.";
  if(msg.includes("already registered")||msg.includes("already been registered")) return "An account with this email already exists. Try signing in instead.";
  if(msg.includes("duplicate key")||msg.includes("unique constraint")||msg.includes("already exists")) return "That team name is already taken. Please choose a different team name.";
  if(msg.includes("Invalid login credentials")||msg.includes("invalid_credentials")) return "Incorrect email or password. Please check and try again.";
  if(msg.includes("Email not confirmed")) return "Please check your email and click the confirmation link before signing in.";
  if(msg.includes("Password should be")||msg.includes("password")) return "Password must be at least 6 characters long.";
  if(msg.includes("Unable to validate email")||msg.includes("valid email")) return "Please enter a valid email address.";
  if(msg.includes("not-null constraint")) return "A required field is missing. Please go back and fill in all fields.";
  if(msg.includes("violates")) return "There was a problem saving your info. Please try again.";
  if(msg.includes("network")||msg.includes("fetch")||msg.includes("Failed to fetch")) return "Connection problem. Check your internet and try again.";
  if(msg.includes("JWT")||msg.includes("token")) return "Your session expired. Please sign in again.";
  return msg;
};

// Standalone Err — must be outside any component to prevent focus loss on re-render
const Err = ({e})=>e?<Alert type="error">{e}</Alert>:null;

// ── PHONE VERIFY UI — defined outside AuthScreen to prevent remount on keystroke ──
function PhoneVerifyUI({ phoneStep, setPhoneStep, phoneNum, setPhoneNum, phoneCode, setPhoneCode,
  phoneErr, setPhoneErr, phoneChannel, phoneBusy, resendTimer, sendPhoneCode, checkPhoneCode }) {
  return(
    <div>
      {phoneStep==="locked"
        ? <Alert type="error">Too many wrong attempts. Please wait 10 minutes then try again. Need help? Email <b>league@ascendpb.com</b></Alert>
        : <>
          {phoneStep==="enter"&&<>
            <div style={{fontSize:"22px",fontWeight:"700",marginBottom:"12px"}}>Verify your number</div>
            <div style={{background:"#f0f9ff",border:"1px solid #b3eeff",borderRadius:"10px",padding:"16px",marginBottom:"16px",fontSize:"13px",color:"#0369a1",lineHeight:"1.8"}}>
              <strong style={{display:"block",fontSize:"14px",marginBottom:"8px",color:"#005f8a"}}>This league runs on text messaging.</strong>
              We use your number to keep everything moving — from your verification code right now, to automatic group texts when a match is confirmed so all 4 players can coordinate together, plus match confirmations, score updates, and important league notifications throughout the season. No app required to stay in the loop.
              <div style={{marginTop:"12px",paddingTop:"10px",borderTop:"1px solid #b3eeff",fontSize:"10px",color:"#7cb9d4"}}>
                By entering your number you agree to receive SMS messages from Ascend PB. Msg &amp; data rates may apply. Reply STOP to opt out.
              </div>
            </div>
            <Lbl>Mobile number</Lbl>
            <input
              style={{...inp({fontSize:"18px",letterSpacing:"1px",textAlign:"center"}),marginBottom:"16px"}}
              type="tel" placeholder="(704) 555-0000"
              value={phoneNum}
              onChange={e=>setPhoneNum(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&sendPhoneCode("sms")}
              maxLength={14}
            />
            {phoneErr&&<Alert type="error">{phoneErr}</Alert>}
            <button style={btn("#00BFFF","#fff",{width:"100%",minHeight:"50px",fontSize:"15px",fontWeight:"800",marginBottom:"10px"})}
              onClick={()=>sendPhoneCode("sms")} disabled={phoneBusy}>
              {phoneBusy?"Sending code...":"Send me a code →"}
            </button>
            <div style={{textAlign:"center",fontSize:"12px",color:C.faint,marginTop:"8px"}}>
              Not receiving it? Email <b style={{color:C.blue}}>league@ascendpb.com</b>
            </div>
          </>}
          {phoneStep==="sent"&&<>
            <div style={{fontSize:"22px",fontWeight:"700",marginBottom:"4px"}}>
              {phoneChannel==="call"?"Answer your phone":"Check your texts"}
            </div>
            <p style={{fontSize:"13px",color:C.muted,marginBottom:"6px"}}>
              {phoneChannel==="call"
                ?`We're calling ${phoneNum} now and will read your 6-digit code out loud.`
                :`We sent a 6-digit code to ${phoneNum}.`}
            </p>
            {phoneErr&&<Alert type="error">{phoneErr}</Alert>}
            <div style={{margin:"20px 0"}}>
              <input
                id="otp-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={phoneCode}
                autoFocus
                style={{
                  width:"100%",height:"64px",textAlign:"center",
                  fontSize:"32px",fontWeight:"900",letterSpacing:"12px",
                  border:`2px solid ${phoneCode.length===6?C.blue:C.border}`,
                  borderRadius:"12px",fontFamily:"monospace",
                  background:phoneCode.length===6?"#f0f9ff":C.white,
                  outline:"none",boxSizing:"border-box"
                }}
                onChange={e=>{
                  const v=e.target.value.replace(/\D/g,"").slice(0,6);
                  setPhoneCode(v);
                  if(v.length===6) setTimeout(()=>checkPhoneCode(),120);
                }}
              />
              <div style={{fontSize:"11px",color:C.faint,textAlign:"center",marginTop:"8px"}}>
                Enter the 6-digit code — auto-submits when complete
              </div>
            </div>
            <button style={btn("#00BFFF","#fff",{width:"100%",minHeight:"50px",fontSize:"15px",fontWeight:"800",marginBottom:"12px"})}
              onClick={checkPhoneCode} disabled={phoneBusy||phoneCode.length<6}>
              {phoneBusy?"Checking...":"Verify code →"}
            </button>
            <div style={{textAlign:"center"}}>
              {resendTimer>0
                ?<span style={{fontSize:"12px",color:C.faint}}>Resend code in {resendTimer}s</span>
                :<div style={{display:"flex",flexDirection:"column",gap:"8px",alignItems:"center"}}>
                    <button style={btn(C.gray,"#555",{fontSize:"13px",padding:"8px 20px"})} onClick={()=>sendPhoneCode("sms")} disabled={phoneBusy}>Resend code by text</button>
                    <button style={btn(C.gray,"#555",{fontSize:"13px",padding:"8px 20px"})} onClick={()=>sendPhoneCode("call")} disabled={phoneBusy}>📞 Call me with the code instead</button>
                  </div>
              }
            </div>
            <div style={{textAlign:"center",fontSize:"12px",color:C.faint,marginTop:"12px"}}>
              Not receiving it? Email <b style={{color:C.blue}}>league@ascendpb.com</b>
            </div>
            <div style={{textAlign:"center",marginTop:"10px"}}>
              <span style={{color:C.blue,cursor:"pointer",fontSize:"13px"}} onClick={()=>{setPhoneStep("enter");setPhoneCode("");setPhoneErr("");}}>← Use a different number</span>
            </div>
          </>}
          {phoneStep==="verified"&&<>
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <div style={{fontSize:"40px",marginBottom:"12px"}}>✓</div>
              <div style={{fontSize:"18px",fontWeight:"800",color:C.blue,marginBottom:"6px"}}>Phone verified!</div>
              <div style={{fontSize:"13px",color:C.muted}}>Taking you to the next step...</div>
            </div>
          </>}
        </>
      }
    </div>
  );
}

function AuthScreen({ oauthUser=null, onRegistered=null, onRegistrationStart=null, onRegistrationDone=null }) {
  const [mode, setMode] = useState("login"); // login | register | forgot | join
  const [step, setStep] = useState(1);       // 1=account 1.5=phone 2=team 3=partner 4=waiver 5=review

  // Phone verification state
  const [phoneStep,    setPhoneStep]    = useState("enter");   // enter | sent | verified
  const [phoneNum,     setPhoneNum]     = useState("");
  const [phoneE164,    setPhoneE164]    = useState("");
  const [phoneCode,    setPhoneCode]    = useState("");
  const [phoneBusy,    setPhoneBusy]    = useState(false);
  const [phoneErr,     setPhoneErr]     = useState("");
  const [phoneChannel, setPhoneChannel] = useState("sms");     // sms | call
  const [resendTimer,  setResendTimer]  = useState(0);
  const timerRef = useRef(null);

  // Pre-fill form with Google/OAuth data if available
  const [form, setForm] = useState({
    email: oauthUser?.email || "",
    password:"", confirm:"",
    p1Name: oauthUser?.name || "",
    teamName:"", p2Name:"", p2Email:"",
    division:"", agreed:false
  });

  const [err,  setErr]  = useState("");
  const [msg,  setMsg]  = useState("");
  const [busy, setBusy] = useState(false);
  const [joinCode,  setJoinCode]  = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [joinPass,  setJoinPass]  = useState("");
  const [joinPassC, setJoinPassC] = useState("");
  const [joinTeam,  setJoinTeam]  = useState(null);
  const [joinErr,   setJoinErr]   = useState("");
  const [joinStep,  setJoinStep]  = useState(1);
  const wRef = useRef(null);
  const up = (k,v) => setForm(f=>({...f,[k]:v}));
  const isOAuth = !!oauthUser;

  // If OAuth user, jump straight to registration
  useEffect(()=>{
    if(oauthUser){
      setMode("register");
      setStep(1.5); // OAuth skips step 1 (account creation) but still needs phone verify
      setForm(f=>({...f, email:oauthUser.email||"", p1Name:oauthUser.name||""}));
    } else {
      setMode("login");
      setStep(1);
    }
  },[oauthUser]);

  // ── AUTH ACTIONS ─────────────────────────────────────────────
  const doLogin = async()=>{
    if(!form.email||!form.password){setErr("Please enter your email and password.");return;}
    setErr(""); setBusy(true);
    const{error}=await sb.auth.signInWithPassword({email:form.email,password:form.password});
    setBusy(false);
    if(error)setErr(friendlyError(error.message));
  };

  const doGoogle = async()=>{
    await sb.auth.signOut(); // clear any existing session first
    await sb.auth.signInWithOAuth({
      provider:"google",
      options:{
        redirectTo:window.location.origin,
        queryParams:{ prompt:"select_account" } // always show account picker
      }
    });
  };
  const doForgot = async()=>{
    if(!form.email){setErr("Please enter your email address first.");return;}
    setErr(""); setBusy(true);
    const{error}=await sb.auth.resetPasswordForEmail(form.email,{redirectTo:window.location.origin});
    setBusy(false);
    if(error)setErr(friendlyError(error.message));
    else setMsg("Password reset link sent — check your inbox.");
  };

  // ── PHONE VERIFICATION ───────────────────────────────────────
  const startResendTimer = () => {
    setResendTimer(60);
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>{
      setResendTimer(t => {
        if(t <= 1){ clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const sendPhoneCode = async(channel="sms") => {
    const digits = phoneNum.replace(/\D/g,"");
    if(digits.length < 10){ setPhoneErr("Please enter a valid 10-digit US phone number."); return; }
    setPhoneErr(""); setPhoneBusy(true); setPhoneChannel(channel);
    try{
      const res = await fetch(`${FUNCTIONS_URL}/send-verification`, {
        method:"POST",
        headers:{"Content-Type":"application/json", "apikey": SUPABASE_ANON},
        body: JSON.stringify({ phone: phoneNum, channel })
      });
      const data = await res.json();
      if(!res.ok || !data.success){ setPhoneErr(data.error || "Could not send the code. Please try again."); setPhoneBusy(false); return; }
      setPhoneE164(data.phone);
      setPhoneStep("sent");
      setPhoneCode("");
      startResendTimer();
    }catch(e){ setPhoneErr("Could not send the code. Please try again."); }
    setPhoneBusy(false);
  };

  const checkPhoneCode = async() => {
    if(phoneCode.length !== 6){ setPhoneErr("Please enter the full 6-digit code."); return; }
    setPhoneErr(""); setPhoneBusy(true);
    try{
      const{data:{user}} = await sb.auth.getUser();
      const uid = user?.id || oauthUser?.uid || null;
      const res = await fetch(`${FUNCTIONS_URL}/check-verification`, {
        method:"POST",
        headers:{"Content-Type":"application/json", "apikey": SUPABASE_ANON},
        body: JSON.stringify({ phone: phoneE164, code: phoneCode, userId: uid })
      });
      const data = await res.json();
      if(!res.ok || !data.success){
        setPhoneErr(data.error || "That code is incorrect. Please try again.");
        if(data.locked) setPhoneStep("locked");
        setPhoneBusy(false);
        return;
      }
      setPhoneStep("verified");
      // Advance to next registration step after a short moment
      setTimeout(()=>{ setStep(s=>s+1); }, 800);
    }catch(e){ setPhoneErr("Something went wrong. Please try again."); }
    setPhoneBusy(false);
  };

  // ── REGISTRATION STEPS ───────────────────────────────────────
  const PHONE_STEP = 1.5;
  const nextStep = ()=>{
    setErr("");
    if(step===1){
      if(!form.email.trim()){setErr("Please enter your email address.");return;}
      if(!/\S+@\S+\.\S+/.test(form.email)){setErr("That doesn't look like a valid email address.");return;}
      if(!form.password){setErr("Please create a password.");return;}
      if(form.password.length<6){setErr("Your password must be at least 6 characters.");return;}
      if(form.password!==form.confirm){setErr("The passwords you entered don't match.");return;}
      // Go to phone verification before team info
      setStep(PHONE_STEP);
      return;
    }
    if(step===PHONE_STEP){
      // Phone step is handled by sendPhoneCode/checkPhoneCode — not nextStep
      return;
    }
    if(step===2){
      if(!form.p1Name.trim()){setErr("Please enter your full name.");return;}
      if(!form.teamName.trim()){setErr("Please choose a team name.");return;}
      if(!form.division){setErr("Please select your division (3.0–3.5 or 3.5–4.0).");return;}
    }
    if(step===3){
      if(!form.p2Name.trim()){setErr("Please enter your partner's name.");return;}
      if(!form.p2Email.trim()){setErr("Please enter your partner's email address — they'll use it to join the team.");return;}
      if(!/\S+@\S+\.\S+/.test(form.p2Email)){setErr("That doesn't look like a valid email for your partner.");return;}
      if(form.p2Email.toLowerCase()===form.email.toLowerCase()){setErr("Your partner's email can't be the same as yours.");return;}
    }
    if(step===4){
      if(!form.agreed){setErr("You need to agree to the rules and waiver to continue.");return;}
    }
    setStep(s=>s+1);
  };

  const submitReg = async()=>{
    setErr(""); setBusy(true);
    if(onRegistrationStart) onRegistrationStart();

    // Helper to reset state and show error
    const fail = (msg) => {
      setBusy(false);
      setErr(msg || "Something went wrong. Please try again.");
      // Don't clear registering on fail — user is still on the form
    };

    try {
      const code  = genCode();
      const div   = form.division || "low";
      const skill = div==="low" ? "3.0-3.5" : "3.5-4.0";

      let uid       = isOAuth ? oauthUser.uid : null;
      const userEmail = isOAuth ? oauthUser.email : form.email;

      // Email signup
      if(!isOAuth){
        const{data:auth,error}=await sb.auth.signUp({email:form.email,password:form.password});
        if(error){ fail(friendlyError(error.message)); return; }
        uid = auth.user?.id || auth.session?.user?.id || null;
      }

      // Insert team
      const{data:team,error:teamErr}=await sb.from("teams").insert({
        name:form.teamName, p1_name:form.p1Name, p1_email:userEmail,
        p2_name:form.p2Name, p2_email:form.p2Email,
        p1_skill:skill, p2_skill:skill,
        division:div, paid:false, approved:false,
        join_code:code, p2_joined:false
      }).select().single();

      if(teamErr||!team){
        const raw = teamErr?.message||teamErr?.details||"";
        fail(friendlyError(raw || "Could not create your team. Please try again."));
        return;
      }

      // Link profile best-effort
      if(uid){
        try{await sb.from("profiles").upsert({id:uid,email:userEmail,team_id:team.id});}catch(e){}
        try{await sb.from("notification_prefs").insert({user_id:uid});}catch(e){}
      }
      try{await sb.from("admin_activity_log").insert({action:"New team registered",details:`${form.teamName} · Code: ${code}`});}catch(e){}

      // Send welcome email to P1 and invite to P2 (dormant until Resend key added)
      sendEmail("p1_welcome",{
        to: userEmail, name: form.p1Name, teamName: form.teamName,
        code, p2Name: form.p2Name, p2Email: form.p2Email
      });
      sendEmail("p2_invite",{
        to: form.p2Email, p2Name: form.p2Name, p1Name: form.p1Name,
        teamName: form.teamName, code, p2Phone: form.p2Phone||""
      });

      // ✅ Success — pass code up to root so modal survives AuthScreen unmount
      setBusy(false);
      if(!isOAuth){ try{ window.open(SHOPIFY_URL,"_blank"); }catch(e){} }
      if(onRegistrationDone) onRegistrationDone({
        code, teamName:form.teamName, p2Name:form.p2Name, p2Email:form.p2Email, uid
      });

    } catch(e){
      fail(friendlyError(e?.message));
    }
  };

  // ── JOIN WITH CODE ───────────────────────────────────────────
  const lookupCode = async()=>{
    if(!joinCode.trim()){setJoinErr("Please enter your 6-character team code.");return;}
    setBusy(true);
    const{data,error}=await sb.from("teams").select("*").eq("join_code",joinCode.trim().toUpperCase()).maybeSingle();
    setBusy(false);
    if(error||!data){setJoinErr("That team code wasn't found. Double-check with your partner and try again.");return;}
    if(data.p2_joined){setJoinErr("This team already has a Player 2 linked. Contact admin if there's a mistake.");return;}
    setJoinTeam(data);setJoinStep(2);setJoinErr("");
  };

  const joinTeamSubmit = async()=>{
    if(!joinEmail.trim()){setJoinErr("Please enter your email address.");return;}
    if(!joinPass){setJoinErr("Please create a password.");return;}
    if(joinPass.length<6){setJoinErr("Password must be at least 6 characters.");return;}
    if(joinPass!==joinPassC){setJoinErr("The passwords don't match.");return;}
    setBusy(true);
    const{data:auth,error}=await sb.auth.signUp({email:joinEmail,password:joinPass});
    if(error){setJoinErr(friendlyError(error.message));setBusy(false);return;}
    const uid=auth.user?.id;
    if(uid){
      await sb.from("profiles").upsert({id:uid,email:joinEmail,team_id:joinTeam.id});
      try{await sb.from("notification_prefs").insert({user_id:uid});}catch(e){}
      await sb.from("teams").update({p2_joined:true,p2_email:joinEmail}).eq("id",joinTeam.id);
      try{await sb.from("admin_activity_log").insert({action:"Player 2 joined",details:`${joinEmail} joined "${joinTeam.name}"`});}catch(e){}
    }
    setBusy(false);
    window.open(SHOPIFY_URL,"_blank");
    setJoinStep(4);
  };

  const stepLabels = ["","Create Account","Verify Phone","Your Info","Your Partner","Rules & Waiver","Review & Pay"];
  const totalSteps = isOAuth ? 5 : 6; // includes phone step for all paths
  const displayStep = isOAuth ? step : step; // phone step is always shown



  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",background:C.bg}}>

      <div style={{marginBottom:"24px",display:"flex",flexDirection:"column",alignItems:"center"}}>
        <AscendLogo height={76}/>
        <div style={{fontSize:"12px",color:C.faint,letterSpacing:".5px",marginTop:"10px"}}>Flex League · Charlotte, NC · {SEASON}</div>
      </div>
      <div style={{...card(),width:"100%",maxWidth:"420px"}}>

        {/* ── LOGIN ── */}
        {mode==="login"&&<>
          <div style={{fontSize:"22px",fontWeight:"700",marginBottom:"4px"}}>Welcome back</div>
          <div style={{fontSize:"13px",color:C.muted,marginBottom:"20px"}}>Sign in to your team portal</div>
          <Err e={err}/>
          <Lbl>Email</Lbl>
          <input style={{...inp(),marginBottom:"12px"}} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)} autoComplete="email"/>
          <Lbl>Password</Lbl>
          <input style={{...inp(),marginBottom:"6px"}} type="password" placeholder="Password" value={form.password} onChange={e=>up("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} autoComplete="current-password"/>
          <div style={{textAlign:"right",marginBottom:"16px"}}>
            <span style={{color:C.blue,cursor:"pointer",fontSize:"13px"}} onClick={()=>{setMode("forgot");setErr("");}}>Forgot password?</span>
          </div>
          <button style={btn(C.text,"#fff",{width:"100%",marginBottom:"10px",minHeight:"46px",fontSize:"15px"})} onClick={doLogin} disabled={busy}>{busy?"Signing in...":"Sign in"}</button>
          <button style={btn(C.gray,"#fff",{width:"100%",marginBottom:"18px",minHeight:"44px"})} onClick={doGoogle}>Continue with Google</button>
          <div style={{height:"1px",background:C.border,marginBottom:"18px",position:"relative"}}>
            <span style={{position:"absolute",top:"-9px",left:"50%",transform:"translateX(-50%)",background:C.white,padding:"0 10px",fontSize:"11px",color:C.faint}}>OR</span>
          </div>
          <button style={btn("#00BFFF","#fff",{width:"100%",marginBottom:"14px",minHeight:"50px",fontSize:"15px",fontWeight:"800"})} onClick={()=>{setMode("register");setStep(1);setErr("");}}>🏓 Register a New Team</button>
          <div style={{background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:"10px",padding:"14px",textAlign:"center",marginBottom:"16px"}}>
            <div style={{fontSize:"13px",fontWeight:"700",color:"#78350f",marginBottom:"6px"}}>📧 Got a team invite?</div>
            <div style={{fontSize:"12px",color:"#92400e",marginBottom:"10px"}}>Your partner registered the team and shared a 6-character code with you.</div>
            <button style={btn("#78350f","#fff",{width:"100%",minHeight:"44px"})} onClick={()=>{setMode("join");setJoinStep(1);setJoinErr("");}}>Join with team code →</button>
          </div>
          <div style={{textAlign:"center",fontSize:"11px",color:C.faint}}>{APP_VERSION}</div>
        </>}

        {/* ── FORGOT PASSWORD ── */}
        {mode==="forgot"&&<>
          <div style={{fontSize:"22px",fontWeight:"700",marginBottom:"4px"}}>Reset your password</div>
          <p style={{fontSize:"13px",color:C.muted,marginBottom:"18px"}}>Enter your email and we'll send you a link to reset your password.</p>
          <Err e={err}/>
          {msg&&<Alert type="success">{msg}</Alert>}
          <Lbl>Email</Lbl>
          <input style={{...inp(),marginBottom:"16px"}} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)}/>
          <button style={btn(C.text,"#fff",{width:"100%",marginBottom:"12px",minHeight:"46px"})} onClick={doForgot} disabled={busy}>{busy?"Sending...":"Send reset link"}</button>
          <span style={{color:C.blue,cursor:"pointer",fontSize:"13px"}} onClick={()=>{setMode("login");setErr("");setMsg("");}}>← Back to sign in</span>
        </>}

        {/* ── JOIN WITH CODE ── */}
        {mode==="join"&&<>
          {joinStep===1&&<>
            <div style={{fontSize:"22px",fontWeight:"700",marginBottom:"4px"}}>Join your team</div>
            <p style={{fontSize:"13px",color:C.muted,marginBottom:"18px"}}>Your partner shared a 6-character code with you. Enter it below to get started.</p>
            <Err e={joinErr}/>
            <Lbl>Team code</Lbl>
            <input style={{...inp({textAlign:"center",fontSize:"32px",fontWeight:"900",letterSpacing:"8px",padding:"16px"}),marginBottom:"16px",textTransform:"uppercase",fontFamily:"monospace"}}
              placeholder="ABC123" maxLength={6} value={joinCode}
              onChange={e=>setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={e=>e.key==="Enter"&&lookupCode()}/>
            <button style={btn(C.text,"#fff",{width:"100%",minHeight:"48px",fontSize:"16px",marginBottom:"12px"})} onClick={lookupCode} disabled={busy}>{busy?"Looking up...":"Find my team →"}</button>
            <span style={{color:C.blue,cursor:"pointer",fontSize:"13px"}} onClick={()=>{setMode("login");setJoinErr("");}}>← Back to sign in</span>
          </>}
          {joinStep===2&&joinTeam&&<>
            <div style={{fontSize:"22px",fontWeight:"700",marginBottom:"4px"}}>Is this your team?</div>
            <p style={{fontSize:"13px",color:C.muted,marginBottom:"16px"}}>Make sure this is correct before continuing.</p>
            <div style={{background:C.bg,borderRadius:"12px",padding:"16px",marginBottom:"18px"}}>
              <div style={{fontSize:"20px",fontWeight:"800",marginBottom:"4px"}}>{joinTeam.name}</div>
              <div style={{fontSize:"14px",color:C.muted,marginBottom:"3px"}}>Registered by: <strong style={{color:C.text}}>{joinTeam.p1_name}</strong></div>
              <div style={{fontSize:"13px",color:C.muted,marginBottom:"10px"}}>Your spot: <strong style={{color:C.text}}>{joinTeam.p2_name}</strong></div>
              <Tag c={joinTeam.division==="low"?"gray":"blue"}>{dL(joinTeam.division)}</Tag>
            </div>
            <div style={{display:"flex",gap:"8px"}}>
              <button style={btn(C.green,"#fff",{flex:1,minHeight:"48px",fontSize:"15px"})} onClick={()=>setJoinStep(3)}>✓ Yes, that's my team</button>
              <button style={btn(C.gray,"#fff",{flex:1,minHeight:"48px"})} onClick={()=>{setJoinStep(1);setJoinTeam(null);}}>Wrong team</button>
            </div>
          </>}
          {joinStep===3&&<>
            <div style={{fontSize:"22px",fontWeight:"700",marginBottom:"2px"}}>Create your account</div>
            <p style={{fontSize:"13px",color:C.muted,marginBottom:"16px"}}>Joining <strong>{joinTeam?.name}</strong> as Player 2.</p>
            <Err e={joinErr}/>
            <Lbl>Your email</Lbl>
            <input style={{...inp(),marginBottom:"12px"}} type="email" placeholder="your@email.com" value={joinEmail} onChange={e=>setJoinEmail(e.target.value)}/>
            <Lbl>Create password</Lbl>
            <input style={{...inp(),marginBottom:"12px"}} type="password" placeholder="At least 6 characters" value={joinPass} onChange={e=>setJoinPass(e.target.value)}/>
            <Lbl>Confirm password</Lbl>
            <input style={{...inp(),marginBottom:"18px"}} type="password" placeholder="Repeat your password" value={joinPassC} onChange={e=>setJoinPassC(e.target.value)}/>
            <button style={btn(C.text,"#fff",{width:"100%",minHeight:"48px",fontSize:"15px",marginBottom:"10px"})} onClick={joinTeamSubmit} disabled={busy}>{busy?"Creating account...":"Create account & Pay $25"}</button>
            <button style={btn(C.gray,"#fff",{width:"100%"})} onClick={()=>setJoinStep(2)}>← Back</button>
          </>}
          {joinStep===4&&<div style={{textAlign:"center",padding:"10px 0"}}>
            <div style={{fontSize:"40px",marginBottom:"12px"}}>🏓</div>
            <div style={{fontSize:"22px",fontWeight:"700",marginBottom:"8px"}}>You're on the team!</div>
            <p style={{fontSize:"13px",color:C.muted,lineHeight:"1.7",marginBottom:"18px"}}>
              You've joined <strong>{joinTeam?.name}</strong>. Complete your $25 payment in the tab that just opened. Admin will activate the team within 24 hours of both payments.
            </p>
            <button style={btn(C.gray,"#fff")} onClick={()=>{setMode("login");setJoinStep(1);}}>Go to sign in</button>
          </div>}
        </>}

        {/* ── REGISTER ── */}
        {mode==="register"&&<>
          {/* Progress bar */}
          <div style={{display:"flex",gap:"4px",marginBottom:"16px"}}>
            {Array.from({length:totalSteps}).map((_,i)=>(
              <div key={i} style={{flex:1,height:"3px",borderRadius:"2px",background:i<displayStep?"#111":"#e4e4e0",transition:"background .3s"}}/>
            ))}
          </div>
          <div style={{fontSize:"20px",fontWeight:"700",marginBottom:"2px"}}>{stepLabels[step]}</div>
          <div style={{fontSize:"11px",color:C.faint,marginBottom:"16px",textTransform:"uppercase"}}>Step {displayStep} of {totalSteps} · You are Player 1</div>
          {isOAuth&&<div style={{background:C.greenBg,border:`1px solid ${C.green}50`,borderRadius:"8px",padding:"8px 12px",marginBottom:"12px",fontSize:"12px",color:"#166534",display:"flex",alignItems:"center",gap:"6px"}}>✓ Signed in with Google · {oauthUser.email}</div>}
          <Err e={err}/>

          {/* Step 1 — Account (email users only) */}
          {step===1&&!isOAuth&&<>
            <Lbl>Your email</Lbl>
            <input style={{...inp(),marginBottom:"12px"}} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)} autoComplete="email"/>
            <Lbl>Create a password</Lbl>
            <input style={{...inp(),marginBottom:"12px"}} type="password" placeholder="At least 6 characters" value={form.password} onChange={e=>up("password",e.target.value)} autoComplete="new-password"/>
            <Lbl>Confirm your password</Lbl>
            <input style={inp()} type="password" placeholder="Repeat your password" value={form.confirm} onChange={e=>up("confirm",e.target.value)} autoComplete="new-password"/>
          </>}

          {/* Step 1.5 — Phone verification (all paths) */}
          {step===1.5&&<PhoneVerifyUI
  phoneStep={phoneStep} setPhoneStep={setPhoneStep}
  phoneNum={phoneNum} setPhoneNum={setPhoneNum}
  phoneCode={phoneCode} setPhoneCode={setPhoneCode}
  phoneErr={phoneErr} setPhoneErr={setPhoneErr}
  phoneChannel={phoneChannel} phoneBusy={phoneBusy}
  resendTimer={resendTimer}
  sendPhoneCode={sendPhoneCode}
  checkPhoneCode={checkPhoneCode}
/>}

          {/* Step 2 — Team info */}
          {step===2&&<>
            <Lbl>Your full name</Lbl>
            <input style={{...inp(),marginBottom:"12px"}} placeholder="First and last name" value={form.p1Name} onChange={e=>up("p1Name",e.target.value)}/>
            <Lbl>Team name</Lbl>
            <input style={{...inp(),marginBottom:"16px"}} placeholder="e.g. The Drop Shot Duo" value={form.teamName} onChange={e=>up("teamName",e.target.value)}/>
            <Lbl>Your division</Lbl>
            <p style={{fontSize:"12px",color:C.muted,marginBottom:"10px"}}>Pick the range that fits both players' skill level.</p>
            <div style={{display:"flex",gap:"10px"}}>
              {["low","high"].map(d=>{
                const sel=form.division===d;
                return(
                  <button key={d} onClick={()=>up("division",d)} style={{flex:1,padding:"16px 10px",borderRadius:"12px",border:`2px solid ${sel?dC(d):C.border}`,background:sel?dC(d):C.white,color:sel?"#fff":C.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all .15s",textAlign:"center"}}>
                    <div style={{fontSize:"18px",fontWeight:"800",marginBottom:"4px"}}>{dL(d)}</div>
                  </button>
                );
              })}
            </div>
          </>}

          {/* Step 3 — Partner info */}
          {step===3&&<>
            <p style={{fontSize:"13px",color:C.muted,marginBottom:"16px",lineHeight:"1.6"}}>
              After you register, you'll share a <strong>join code</strong> with your partner. We'll also auto-text them an invite once you're set up.
            </p>
            <Lbl>Partner's full name <span style={{color:C.red,fontWeight:"700"}}>*</span></Lbl>
            <input style={{...inp(),marginBottom:"12px"}} placeholder="Their first and last name" value={form.p2Name} onChange={e=>up("p2Name",e.target.value)}/>
            <Lbl>Partner's email <span style={{color:C.red,fontWeight:"700"}}>*</span></Lbl>
            <input style={{...inp(),marginBottom:"12px"}} type="email" placeholder="their@email.com" value={form.p2Email} onChange={e=>up("p2Email",e.target.value)}/>
            <Lbl>Partner's mobile number <span style={{color:C.red,fontWeight:"700"}}>*</span></Lbl>
            <input style={{...inp(),marginBottom:"6px"}} type="tel" placeholder="(704) 555-0000" value={form.p2Phone||""} onChange={e=>up("p2Phone",e.target.value)}/>
            <p style={{fontSize:"11px",color:C.muted,marginBottom:"0px",lineHeight:"1.5"}}>US numbers only. We'll text them their join code and invite link automatically.</p>
          </>}

          {/* Step 4 — Waiver */}
          {step===4&&<>
            <div ref={wRef} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"12px 14px",height:"200px",overflowY:"auto",fontSize:"12px",lineHeight:"1.8",color:"#555",whiteSpace:"pre-wrap",marginBottom:"14px"}}>{WAIVER}</div>
            <div onClick={()=>up("agreed",!form.agreed)} style={{display:"flex",gap:"14px",alignItems:"center",background:form.agreed?"#dcfce7":C.bg,border:`2px solid ${form.agreed?C.green:C.border}`,borderRadius:"12px",padding:"16px",cursor:"pointer",transition:"all .2s",minHeight:"60px",WebkitTapHighlightColor:"transparent"}}>
              <div style={{width:"28px",height:"28px",borderRadius:"50%",background:form.agreed?C.green:C.white,border:`2px solid ${form.agreed?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
                {form.agreed&&<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"14px",fontWeight:"600",color:form.agreed?C.green:C.text}}>{form.agreed?"Agreed ✓":"Tap to agree"}</div>
                <div style={{fontSize:"12px",color:C.muted,marginTop:"2px"}}>I agree to the rules and waiver on behalf of both team members.</div>
              </div>
            </div>
          </>}

          {/* Step 5 — Review */}
          {step===5&&<>
            <div style={{background:C.bg,borderRadius:"10px",padding:"14px",marginBottom:"14px"}}>
              <div style={{fontSize:"18px",fontWeight:"700",marginBottom:"4px"}}>{form.teamName}</div>
              <div style={{fontSize:"13px",color:C.muted,marginBottom:"8px"}}>{form.p1Name} &amp; {form.p2Name}</div>
              <Tag c={form.division==="low"?"gray":"blue"}>{dL(form.division||"low")} Division</Tag>
            </div>
            <div style={{background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:"10px",padding:"16px",textAlign:"center",marginBottom:"14px"}}>
              <div style={{fontSize:"11px",fontWeight:"600",color:C.blue,textTransform:"uppercase",letterSpacing:".8px",marginBottom:"4px"}}>Your registration fee</div>
              <div style={{fontSize:"44px",fontWeight:"800",color:C.blue,lineHeight:"1.1"}}>$25</div>
              <div style={{fontSize:"12px",color:"#555",marginTop:"4px"}}>{form.p2Name} pays their own $25 separately</div>
            </div>
            <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:"8px",padding:"12px 14px",marginBottom:"16px",fontSize:"12px",color:"#78350f",lineHeight:"1.6"}}>
              After registering you'll get a <strong>team join code</strong> to share with {form.p2Name}. Admin activates the team within 24 hours of both payments.
            </div>
            <button style={btn(C.text,"#fff",{width:"100%",padding:"14px",fontSize:"15px",fontWeight:"700"})} onClick={submitReg} disabled={busy}>{busy?"Registering...":"Pay My $25 & Get Team Code"}</button>
          </>}

          {/* Nav buttons — hidden on phone step (has its own buttons) and review step */}
          {step!==1.5&&<div style={{display:"flex",justifyContent:"space-between",marginTop:"16px"}}>
            {step>(isOAuth?2:1)
              ? <button style={btn(C.gray,"#fff",{padding:"10px 16px"})} onClick={()=>{setErr("");setStep(s=>{
                  // Skip back over phone step (1.5) since it auto-advances
                  const prev = s - 1;
                  return prev === 1.5 ? 1 : prev;
                });}}>← Back</button>
              : <span/>
            }
            {step<5&&step!==1.5&&<button style={btn(C.text,"#fff",{padding:"10px 22px"})} onClick={nextStep}>Continue →</button>}
          </div>}
          {step===(isOAuth?2:1)&&<div style={{textAlign:"center",marginTop:"14px",fontSize:"13px",color:C.muted}}>
            Already registered? <span style={{color:C.blue,cursor:"pointer"}} onClick={()=>{setMode("login");setErr("");}}>Sign in</span>
          </div>}
        </>}

      </div>
    </div>
  );
}
// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ myTeam, teams, matches, requests, division, setDivision, setTab, openChat, openCancel, notifications, adminBanner, isAdmin, userEmail }) {
  const mobile = useMobile();
  const myReqs    = requests.filter(r=>r.team_id===myTeam?.id&&r.status==="open");
  const myMatches = matches.filter(m=>(m.t1_id===myTeam?.id||m.t2_id===myTeam?.id)&&!m.cancelled&&m.status!=="completed");
  const activeDiv   = myTeam?.division || division;
  const standings   = [...teams.filter(t=>t.division===activeDiv&&t.approved)].sort((a,b)=>b.points-a.points||b.wins-a.wins);
  const tName     = id=>teams.find(t=>t.id===id)?.name??"Unknown";
  const playoffDate=new Date("2026-04-07");
  const daysUntil =Math.max(0,Math.ceil((playoffDate-new Date())/86400000));
  const myRank    = standings.findIndex(t=>t.id===myTeam?.id);
  const clinched  = myRank>=0&&myRank<PLAYOFFS&&(standings[PLAYOFFS]?.points||0)<(myTeam?.points||0);
  const totalMatchesPlayed = id => matches.filter(m=>(m.t1_id===id||m.t2_id===id)&&m.status==="completed"&&!m.cancelled).length;

  // Season countdown timer
  const [cdTime, setCdTime] = useState({d:0,h:0,m:0,s:0});
  const seasonStart = new Date("2026-04-15T00:00:00");
  const seasonStarted = new Date() >= seasonStart;
  useEffect(()=>{
    const tick=()=>{
      const diff=seasonStart-new Date();
      if(diff<=0){setCdTime({d:0,h:0,m:0,s:0});return;}
      setCdTime({
        d:Math.floor(diff/86400000),
        h:Math.floor((diff%86400000)/3600000),
        m:Math.floor((diff%3600000)/60000),
        s:Math.floor((diff%60000)/1000)
      });
    };
    tick();
    const t=setInterval(tick,1000);
    return()=>clearInterval(t);
  },[]);

  // Win streak
  const getStreak = id => {
    const tm=[...matches.filter(m=>(m.t1_id===id||m.t2_id===id)&&m.status==="completed"&&!m.cancelled)].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    let s=0; for(const m of tm){if(m.winner_id===id)s++;else break;} return s;
  };
  const myStreak = myTeam?getStreak(myTeam.id):0;

  const todayMatches = myMatches.filter(m=>{
    const dt = parseMatchDateTime(m.match_date, m.match_time);
    if (!dt) return false;
    const n = new Date();
    return dt.getDate()===n.getDate()&&dt.getMonth()===n.getMonth()&&dt.getFullYear()===n.getFullYear();
  });

  return(
    <div>
      {/* Admin pinned banner */}
      {adminBanner&&<div style={{background:"#111",color:"#fff",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",display:"flex",gap:"10px",alignItems:"center"}}>
        <Icon n="pin" size={16}/>
        <span style={{flex:1,fontSize:"14px",lineHeight:"1.5"}}>{adminBanner}</span>
      </div>}

      {/* Season countdown — only show if season hasn't started */}
      {!seasonStarted&&(
        <div style={{background:"#0f0f0f",borderRadius:"14px",padding:"16px",marginBottom:"16px",textAlign:"center"}}>
          <div style={{fontSize:"10px",fontWeight:"700",color:"#444",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"10px"}}>Season starts April 15, 2026</div>
          <div style={{display:"flex",justifyContent:"center",gap:"0"}}>
            {[{v:cdTime.d,l:"Days"},{v:cdTime.h,l:"Hrs"},{v:cdTime.m,l:"Min"},{v:cdTime.s,l:"Sec"}].map(({v,l},i)=>(
              <div key={l} style={{flex:1,borderRight:i<3?"1px solid #1e1e1e":"none",padding:"0 8px"}}>
                <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:"28px",fontWeight:"800",color:"#00BFFF",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
                <div style={{fontSize:"9px",color:"#333",textTransform:"uppercase",letterSpacing:"1px",marginTop:"3px"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Admin — new team registrations alert */}
      {isAdmin&&(()=>{
        const pending=teams.filter(t=>!t.approved);
        const unpaids=teams.filter(t=>!t.p1_paid||!t.p2_paid);
        if(!pending.length&&!unpaids.length)return null;
        return(
          <div style={{background:"#1e3a5f",color:"#fff",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:"18px"}}>🔔</span>
            <div style={{flex:1,fontSize:"13px",lineHeight:"1.6"}}>
              {pending.length>0&&<div><strong>{pending.length} team{pending.length>1?"s":""} pending approval</strong>{unpaids.length>0&&` · ${unpaids.length} with unpaid players`}</div>}
              {pending.length===0&&unpaids.length>0&&<div><strong>{unpaids.length} team{unpaids.length>1?"s":""} have unpaid players</strong></div>}
            </div>
            <button style={btn("#00BFFF","#fff",{fontSize:"12px",padding:"6px 12px",minHeight:"36px"})} onClick={()=>setTab("admin")}>View →</button>
          </div>
        );
      })()}

      {/* Match today banner */}
      {todayMatches.length>0&&<Alert type="success">
        🏓 <strong>Match day!</strong> You have {todayMatches.length} match{todayMatches.length>1?"es":""} today. Good luck out there!
      </Alert>}

      {clinched&&<Alert type="success">🎉 <strong>Playoffs clinched!</strong> {myTeam?.name} has secured a playoff spot.</Alert>}

      {/* Yellow notification — scores needing action */}
      {myTeam?.approved&&(()=>{
        const needsConfirm=matches.filter(m=>
          (m.t1_id===myTeam.id||m.t2_id===myTeam.id)&&
          m.status==="score_pending"&&
          m.submitted_by!==myTeam.id&&
          !m.cancelled
        );
        const tName=id=>teams.find(t=>t.id===id)?.name??"Unknown";
        if(needsConfirm.length===0)return null;
        return(
          <div style={{background:"#fef08a",border:"1.5px solid #ca8a04",borderRadius:"12px",padding:"14px 16px",marginBottom:"16px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
            <span style={{fontSize:"22px",flexShrink:0}}>⚠️</span>
            <div style={{flex:1}}>
              <div style={{fontSize:"15px",fontWeight:"700",color:"#78350f",marginBottom:"4px"}}>Score{needsConfirm.length>1?"s":""} waiting for your response!</div>
              {needsConfirm.map(m=>{
                const opp=tName(m.t1_id===myTeam.id?m.t2_id:m.t1_id);
                return<div key={m.id} style={{fontSize:"13px",color:"#92400e",marginBottom:"2px"}}>{opp} submitted a score — confirm or dispute</div>;
              })}
              <button style={{...btn("#78350f","#fff",{fontSize:"13px",padding:"7px 16px",minHeight:"36px",marginTop:"8px"})}} onClick={()=>setTab("scores")}>Go to My Matches →</button>
            </div>
          </div>
        );
      })()}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"12px",marginBottom:"22px"}}>
        <div>
          <div style={{fontSize:mobile?"22px":"26px",fontWeight:"700",letterSpacing:"-.5px"}}>{myTeam?.name||"Dashboard"}</div>
          <div style={{fontSize:"11px",color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginTop:"2px"}}>{SEASON} · Week {CURRENT_WEEK} of {WEEKS} · Charlotte</div>
        </div>
        {myTeam?.approved&&<button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={()=>setTab("board")}>Request Match</button>}
      </div>

      {/* Stat cards */}
      {myTeam?.approved&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(80px,1fr))",gap:"10px",marginBottom:"20px"}}>
        {[
          {n:myTeam.wins,l:"Wins",c:C.green},
          {n:myTeam.losses,l:"Losses",c:C.red},
          {n:myTeam.points,l:"Points",c:C.blue},
          {n:myReqs.length,l:"Open Requests",c:C.amber},
          {n:myStreak>0?`${myStreak}🔥`:0,l:"Win Streak",c:myStreak>=3?C.orange:C.muted},
          {n:`${daysUntil}d`,l:"To Playoffs",c:C.purple},
        ].map((x,i)=>(
          <div key={i} style={{...card(),textAlign:"center",padding:"14px 8px"}}>
            <div style={{fontSize:"22px",fontWeight:"800",color:x.c,lineHeight:"1"}}>{x.n}</div>
            <div style={{fontSize:"10px",fontWeight:"600",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",marginTop:"4px"}}>{x.l}</div>
          </div>
        ))}
      </div>}

      {/* Season progress bar */}
      <div style={{...card({padding:"12px 16px"}),marginBottom:"16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
          <span style={{fontSize:"13px",fontWeight:"600"}}>Season progress</span>
          <span style={{fontSize:"12px",color:C.muted}}>Week {CURRENT_WEEK} of {WEEKS}</span>
        </div>
        <div style={{background:C.bg,borderRadius:"999px",height:"8px",overflow:"hidden"}}>
          <div style={{background:`linear-gradient(90deg,${C.blue},${C.purple})`,height:"100%",width:`${Math.round((CURRENT_WEEK/WEEKS)*100)}%`,borderRadius:"999px",transition:"width .5s"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"6px"}}>
          {Array.from({length:WEEKS},(_,i)=>(
            <span key={i} style={{fontSize:"10px",color:i<CURRENT_WEEK?C.blue:C.faint,fontWeight:i+1===CURRENT_WEEK?"700":"400",whiteSpace:"nowrap"}}>
              {i+1===WEEKS?"Playoffs":`Week ${i+1}`}
            </span>
          ))}
        </div>
      </div>

      {/* Stale request nudge */}
      {myReqs.filter(r=>{
        const hrs=(Date.now()-new Date(r.created_at))/3600000;
        return hrs>48&&(r.responses?.length||0)===0;
      }).map(r=>(
        <Alert key={r.id} type="info" onDismiss={undefined}>
          <strong>No responses yet</strong> on your {fmtDate(r.proposed_date)} request. Try posting a different time or court — more teams may be available.
        </Alert>
      ))}

      {/* Confirmed matches — full width, always on top */}
      <div style={{...card(),marginBottom:"14px"}}>
        <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"12px"}}>Confirmed matches</div>
        {myMatches.length===0
          ? <p style={{fontSize:"13px",color:C.muted,lineHeight:"1.6"}}>No confirmed matches yet. Post a match request to get started.</p>
          : myMatches.map(m=>{
            const opp=teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
            const matchToday=isToday(m.match_date);
            return(
              <div key={m.id} style={{padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px",marginBottom:"8px"}}>
                  <div>
                    <div style={{fontWeight:"700",fontSize:"16px",marginBottom:"2px"}}>vs {opp?.name}{matchToday?" 🏓":""}</div>
                    <div style={{fontSize:"13px",color:C.muted,marginBottom:"2px"}}>{fmtDateTime(m.match_date,m.match_time)}</div>
                    <div style={{fontSize:"12px",color:C.muted}}>{m.court}</div>
                    {(()=>{const ct=countdown(m.match_date,m.match_time);return ct&&ct!=="Now"&&!matchToday?<div style={{fontSize:"12px",color:C.purple,fontWeight:"600",marginTop:"4px"}}>⏱ {ct} away</div>:null;})()}
                  </div>
                  <Tag c={matchToday?"blue":"green"}>{matchToday?"Today":"Confirmed"}</Tag>
                </div>
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                  <button style={btn(C.text,"#fff",{fontSize:"13px",padding:"8px 0",minHeight:"40px",flex:1,minWidth:"80px"})} onClick={()=>openChat(m)}>💬 Chat</button>
                  <button style={btn(C.amber,"#fff",{fontSize:"13px",padding:"8px 0",minHeight:"40px",flex:1,minWidth:"80px"})} onClick={()=>setTab("scores")}>📊 Score</button>
                  <button style={btn(C.red,"#fff",{fontSize:"13px",padding:"8px 0",minHeight:"40px",flex:1,minWidth:"80px"})} onClick={()=>openCancel(m)}>Cancel</button>
                </div>
              </div>
            );
          })
        }
      </div>

      {/* My open requests — full width below confirmed */}
      <div style={{...card(),marginBottom:"20px"}}>
        <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"12px"}}>My match requests</div>
        {myReqs.length===0
          ? <p style={{fontSize:"13px",color:C.muted,lineHeight:"1.6"}}>No open requests. Tap "Request Match" to post your availability.</p>
          : myReqs.map(r=>(
            <div key={r.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px",marginBottom:"6px"}}>
                <div>
                  <div style={{fontWeight:"700",fontSize:"15px",marginBottom:"2px"}}>{fmtDateTime(r.proposed_date,r.proposed_time)}</div>
                  <div style={{fontSize:"12px",color:C.muted,marginBottom:"2px"}}>{r.proposed_court}</div>
                  <div style={{fontSize:"11px",color:C.faint}}>{r.responses?.length||0} response{(r.responses?.length||0)!==1?"s":""} · {timeAgo(r.created_at)}</div>
                </div>
                <Tag c="blue">Open</Tag>
              </div>
              <button style={btn(C.text,"#fff",{fontSize:"12px",padding:"6px 14px",minHeight:"36px"})} onClick={()=>setTab("board")}>View thread</button>
            </div>
          ))
        }
      </div>

      {/* Standings — locked to user's own division, admin can switch */}
      <div style={card()}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px",flexWrap:"wrap"}}>
          <div style={{fontSize:"15px",fontWeight:"700"}}>Division standings — {dL(myTeam?.division||division)}</div>
          <div style={{flex:1}}/>
          {!myTeam&&<>
            <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}/>
            <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")}/>
          </>}
        </div>
        <div className="tscroll">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:"300px"}}>
            <thead><tr>{["#","Team","Win","Loss","Points","Played"].map(h=><th key={h} style={{textAlign:"left",color:C.muted,fontSize:"11px",fontWeight:"600",letterSpacing:".8px",textTransform:"uppercase",padding:"8px 10px",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>
              {standings.map((t,i)=>{
                const streak=getStreak(t.id);
                const playoff=i<PLAYOFFS;
                return(
                  <tr key={t.id} style={{background:t.id===myTeam?.id?"#eff6ff":""}}>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"800",color:playoff?C.blue:"#ddd",fontSize:"18px",width:"40px"}}>{i+1}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"700"}}>
                      {t.name}{streak>=3?` 🔥`:""}{" "}
                      {t.id===myTeam?.id&&<Tag sm c="blue">You</Tag>}{" "}
                      {i===0&&<Tag sm c="gray">Leader</Tag>}{" "}
                      {playoff&&<Tag sm c="blue">Playoffs</Tag>}
                    </td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"700",color:C.green}}>{t.wins}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,color:C.red}}>{t.losses}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"800",fontSize:"17px",color:dC(activeDiv)}}>{t.points}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,color:C.muted,fontSize:"12px"}}>{totalMatchesPlayed(t.id)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── MATCH BOARD ───────────────────────────────────────────────
// RequestCard — outside MatchBoard so it never remounts on parent re-render
function RequestCard({ req, myTeam, teams, atLimit, setConfirmReq }) {
  const isOwn       = req.team_id===myTeam?.id;
  const isAcc       = req.status==="accepted";
  const isCancelled = req.status==="cancelled";
  // Anyone approved in this division can interact — including the poster (for replies)
  const canInteract = myTeam&&myTeam.approved&&!isCancelled&&myTeam.division===req.division;
  const canAccept   = canInteract&&!isOwn&&!isAcc&&!atLimit(req.team_id);
  const canCounter  = canInteract&&!isOwn&&!isAcc; // own team cannot counter their own request
  const overLimit   = canInteract&&!isOwn&&atLimit(req.team_id);
  const responses   = req.responses||[];
  const poster      = teams.find(t=>t.id===req.team_id);
  const skillRange  = poster?`${poster.p1_skill}/${poster.p2_skill}`:"";

  // Local state — prevents parent re-render from stealing focus
  const [formType, setFormType] = useState(null); // null | "comment" | "counter"
  const [msg,  setMsg]  = useState("");
  const [cdate,setCdate]= useState("");
  const [ctime,setCtime]= useState("");
  const [ccourt,setCcourt]=useState("");
  const [submitting, setSubmitting]=useState(false);

  const openForm=(type)=>{ setFormType(f=>f===type?null:type); setMsg(""); setCdate(""); setCtime(""); setCcourt(""); };
  const closeForm=()=>{ setFormType(null); setMsg(""); setCdate(""); setCtime(""); setCcourt(""); };

  const submitComment=async()=>{
    if(!msg.trim()||submitting)return;
    setSubmitting(true);
    const{data,error}=await sb.from("request_responses").insert({
      request_id:req.id,team_id:myTeam.id,team_name:myTeam.name,
      type:formType,message:msg,
      counter_date:cdate||"",counter_time:ctime||"",counter_court:ccourt||""
    }).select().single();
    if(!error){
      setRequests(p=>p.map(r=>r.id===req.id?{...r,responses:[...(r.responses||[]),data]}:r));
      closeForm();
    }
    setSubmitting(false);
  };

  return(
    <div style={{...card(),marginBottom:"12px",borderLeft:`4px solid ${isCancelled?"#ccc":isAcc?C.green:C.blue}`,opacity:isCancelled?0.5:isAcc?0.75:1}}>

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px",marginBottom:"12px"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"5px",flexWrap:"wrap"}}>
            <span style={{fontSize:"17px",fontWeight:"700"}}>{tName(req.team_id)}</span>
            {skillRange&&<Tag sm c="gray">{skillRange}</Tag>}
            {isOwn&&<Tag c="gray">Your request</Tag>}
          </div>
          <div style={{fontSize:"13px",color:"#555",display:"flex",gap:"14px",flexWrap:"wrap",marginBottom:"3px"}}>
            <span>📅 {fmtDate(req.proposed_date)}</span>
            <span>🕐 {fmtTime(req.proposed_time)}</span>
            <span>📍 {req.proposed_court}</span>
          </div>
          {req.notes&&<div style={{fontSize:"12px",color:C.muted,marginTop:"2px"}}>{req.notes}</div>}
          {req.location_fee&&<div style={{fontSize:"12px",color:C.amber,fontWeight:"500",marginTop:"2px"}}>💰 Fee: {req.location_fee}</div>}
          <div style={{fontSize:"11px",color:C.faint,marginTop:"4px"}}>{timeAgo(req.created_at)} · {responses.length} response{responses.length!==1?"s":""}</div>
        </div>
        <Tag c={isCancelled?"gray":isAcc?"green":"blue"}>{isCancelled?"Cancelled":isAcc?"Matched":"Open"}</Tag>
      </div>

      {/* Responses thread — full transparency, everyone sees all */}
      {responses.length>0&&(
        <div style={{background:C.bg,borderRadius:"8px",padding:"12px",marginBottom:"12px"}}>
          <div style={{fontSize:"11px",fontWeight:"700",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",marginBottom:"8px"}}>Thread ({responses.length})</div>
          {responses.map(r=>(
            <div key={r.id} style={{padding:"9px 0",borderBottom:`1px solid #eee`}}>
              <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"4px",flexWrap:"wrap"}}>
                <span style={{fontWeight:"700",fontSize:"13px"}}>{r.team_name}</span>
                <Tag c={r.type==="counter"?"amber":"blue"}>{r.type==="counter"?"Counter":"Comment"}</Tag>
                <span style={{fontSize:"11px",color:C.faint}}>{timeAgo(r.created_at)}</span>
              </div>
              <div style={{fontSize:"13px",color:C.text,lineHeight:"1.5"}}>{r.message}</div>
              {r.type==="counter"&&r.counter_date&&(
                <div style={{fontSize:"12px",color:C.amber,marginTop:"4px",fontWeight:"500"}}>
                  Proposes: {fmtDateTime(r.counter_date, r.counter_time)}{r.counter_court?` · ${r.counter_court}`:""}
                </div>
              )}
              {/* Request owner can accept any counter */}
              {isOwn&&r.type==="counter"&&!isAcc&&(
                <button style={btn(C.green,"#fff",{marginTop:"8px",fontSize:"12px",padding:"6px 14px",minHeight:"36px"})} onClick={()=>setConfirmReq({req,isCounter:true,counterData:r})}>
                  Accept this counter
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Action buttons — all approved division members can interact */}
      {canInteract&&!isCancelled&&!isAcc&&(
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:formType?"12px":"0"}}>
          {canAccept&&(
            <button style={btn(C.green,"#fff",{minHeight:"44px",flex:"1",minWidth:"90px"})} onClick={()=>setConfirmReq({req,isCounter:false,counterData:null})}>
              ✓ Accept
            </button>
          )}
          {overLimit&&<span style={{fontSize:"12px",color:C.faint,alignSelf:"center"}}>Max {MAX_VS} matches vs this team.</span>}
          <button style={btn(formType==="comment"?C.blue:C.gray,"#fff",{minHeight:"44px",flex:"1",minWidth:"90px"})} onClick={()=>openForm("comment")}>
            💬 {formType==="comment"?"Close":"Comment"}
          </button>
          {canCounter&&(
            <button style={btn(formType==="counter"?C.amber:C.gray,"#fff",{minHeight:"44px",flex:"1",minWidth:"90px"})} onClick={()=>openForm("counter")}>
              ↩ {formType==="counter"?"Close":"Counter"}
            </button>
          )}
          {isOwn&&(
            <button style={btn(C.red,"#fff",{minHeight:"44px",flex:"1",minWidth:"90px"})} onClick={()=>cancelReq(req.id)}>
              Cancel
            </button>
          )}
        </div>
      )}
      {isOwn&&isAcc&&<p style={{fontSize:"12px",color:C.muted,marginBottom:"8px"}}>Match confirmed — open the match chat to coordinate details.</p>}

      {/* Comment / Counter inline form — local state keeps focus stable */}
      {formType&&(
        <div style={{background:formType==="counter"?"#fffbeb":"#eff6ff",border:`1.5px solid ${formType==="counter"?C.amber:C.blue}`,borderRadius:"10px",padding:"14px"}}>
          <div style={{fontSize:"14px",fontWeight:"700",marginBottom:"10px",color:formType==="counter"?C.amber:C.blue}}>
            {formType==="counter"?"Counter proposal — suggest a different time or court":"Add a comment"}
          </div>
          <textarea
            style={{...inp({minHeight:"80px",resize:"vertical"}),marginBottom:"10px",background:"#fff"}}
            placeholder={formType==="counter"?"e.g. That time doesn't work for us — can you do Saturday at 2pm at Freedom Park?":"e.g. We're interested! Is this an outdoor court? Let us check our schedule."}
            value={msg}
            onChange={e=>setMsg(e.target.value)}
            autoFocus
          />
          {formType==="counter"&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"12px"}}>
              <div><Lbl>Alt date</Lbl><input type="date" style={{...inp(),background:"#fff"}} value={cdate} onChange={e=>setCdate(e.target.value)}/></div>
              <div><Lbl>Alt time</Lbl><input type="time" style={{...inp(),background:"#fff"}} value={ctime} onChange={e=>setCtime(e.target.value)}/></div>
              <div><Lbl>Alt court</Lbl><input style={{...inp(),background:"#fff"}} placeholder="Court name" value={ccourt} onChange={e=>setCcourt(e.target.value)}/></div>
            </div>
          )}
          <div style={{display:"flex",gap:"8px"}}>
            <button style={btn(formType==="counter"?C.amber:C.text,"#fff",{minHeight:"44px",flex:1})} onClick={submitComment} disabled={!msg.trim()||submitting}>
              {submitting?"Sending...":(formType==="counter"?"Send counter":"Post comment")}
            </button>
            <button style={btn(C.gray,"#fff",{minHeight:"44px",padding:"10px 18px"})} onClick={closeForm}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchBoard({ myTeam, teams, requests, setRequests, matches, division, setDivision, isAdmin, globalSetTab }) {
  const mobile = useMobile();
  // Non-admins always see their own division
  const activeDivision = isAdmin ? division : (myTeam?.division || division);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState({date:"",time:"",court:"",notes:"",fee:""});
  const [confirmReq,setConfirmReq]= useState(null);
  const [busy,      setBusy]      = useState(false);
  const [filter,    setFilter]    = useState({date:"",timeOfDay:""});
  const [showCourts,setShowCourts]= useState(false);
  const upF=(k,v)=>setForm(f=>({...f,[k]:v}));

  const divReqs = requests.filter(r=>{
    if(r.division!==activeDivision)return false;
    if(r.status==="cancelled")return false; // hide cancelled requests
    if(filter.date&&!r.proposed_date.includes(filter.date))return false;
    if(filter.timeOfDay==="morning"&&!["6:","7:","8:","9:","10:","11:"].some(h=>r.proposed_time.includes(h)))return false;
    if(filter.timeOfDay==="afternoon"&&!["12:","1:","2:","3:","4:","5:"].some(h=>r.proposed_time.includes(h)))return false;
    if(filter.timeOfDay==="evening"&&!["6:","7:","8:","9:"].some(h=>r.proposed_time.includes(h)&&parseInt(r.proposed_time)>=6))return false;
    return true;
  }).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

  const tName=id=>teams.find(t=>t.id===id)?.name??"Unknown";
  const atLimit=tid=>{if(!myTeam)return false;return matches.filter(m=>((m.t1_id===myTeam.id&&m.t2_id===tid)||(m.t2_id===myTeam.id&&m.t1_id===tid))&&!m.cancelled).length>=MAX_VS;};
  const hasConflict=(date,time)=>matches.some(m=>(m.t1_id===myTeam?.id||m.t2_id===myTeam?.id)&&m.match_date===date&&m.match_time===time&&m.status==="confirmed"&&!m.cancelled);

  const postRequest=async()=>{
    if(!form.date||!form.time||!form.court)return;
    if(hasConflict(form.date,form.time)){alert("You already have a confirmed match at this time. Please choose a different time.");return;}
    setBusy(true);
    const{data,error}=await sb.from("match_requests").insert({team_id:myTeam.id,division:activeDivision,proposed_date:form.date,proposed_time:form.time,proposed_court:form.court,notes:form.notes,location_fee:form.fee,status:"open"}).select("*,responses:request_responses(*)").single();
    if(!error){setRequests(p=>[data,...p]);setShowForm(false);setForm({date:"",time:"",court:"",notes:"",fee:""});}
    setBusy(false);
  };

  const doAccept=async(req,isCounter=false,counterData=null)=>{
    if(atLimit(req.team_id)){alert(`Max ${MAX_VS} matches vs this team this season.`);return;}
    if(hasConflict(req.proposed_date,req.proposed_time)){alert("You already have a match at this time. Please counter-propose a different time.");return;}
    setBusy(true);
    const date=isCounter?counterData?.counter_date||req.proposed_date:req.proposed_date;
    const time=isCounter?counterData?.counter_time||req.proposed_time:req.proposed_time;
    const court=isCounter?counterData?.counter_court||req.proposed_court:req.proposed_court;
    await sb.from("match_requests").update({status:"accepted",updated_at:new Date().toISOString()}).eq("id",req.id);
    await sb.from("matches").insert({request_id:req.id,t1_id:req.team_id,t2_id:myTeam.id,division,match_date:date,match_time:time,court,status:"confirmed"});
    setRequests(p=>p.map(r=>r.id===req.id?{...r,status:"accepted"}:r));
    // Email both teams match confirmed
    const reqTeam=teams.find(t=>t.id===req.team_id);
    if(reqTeam&&myTeam){
      sendEmail("match_confirmed",{
        t1Name:reqTeam.name, t1Email:reqTeam.p1_email,
        t2Name:myTeam.name,  t2Email:myTeam.p1_email,
        matchDate:date, matchTime:time, court
      });
    }
    setConfirmReq(null);
    setBusy(false);
  };

  const cancelReq=async(rid)=>{
    if(!window.confirm("Cancel this match request? This cannot be undone."))return;
    const{error}=await sb.from("match_requests").update({status:"cancelled"}).eq("id",rid);
    if(error){alert("Could not cancel — check your connection and try again.");return;}
    setRequests(p=>p.map(r=>r.id===rid?{...r,status:"cancelled"}:r));
  };



  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"12px",marginBottom:"8px"}}>
        <div>
          <div style={{fontSize:mobile?"22px":"26px",fontWeight:"700",letterSpacing:"-.5px"}}>Match Board</div>
          <div style={{fontSize:"11px",color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginBottom:"20px"}}>Request a match · Any team in your division can accept</div>
        </div>
        {myTeam?.approved&&<button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={()=>setShowForm(s=>!s)}>{showForm?"Cancel":"Request Match"}</button>}
      </div>

      {isAdmin?(
        <div style={{display:"flex",gap:"8px",marginBottom:"14px",flexWrap:"wrap"}}>
          <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}/>
          <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")}/>
        </div>
      ):(
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
          <Pill d={activeDivision} active={true} onClick={()=>{}}/>
          <span style={{fontSize:"12px",color:C.faint}}>Your division</span>
        </div>
      )}

      {/* Filters */}
      <div style={{display:"flex",gap:"8px",marginBottom:"16px",flexWrap:"wrap"}}>
        <input style={{...inp({width:"auto",flex:"1",minWidth:"120px",fontSize:"13px",padding:"8px 12px"}),maxWidth:"160px"}} placeholder="Filter by date..." value={filter.date} onChange={e=>setFilter(f=>({...f,date:e.target.value}))}/>
        <select style={{...inp({width:"auto",fontSize:"13px",padding:"8px 12px"}),appearance:"none"}} value={filter.timeOfDay} onChange={e=>setFilter(f=>({...f,timeOfDay:e.target.value}))}>
          <option value="">All times</option>
          <option value="morning">Morning (6am–12pm)</option>
          <option value="afternoon">Afternoon (12pm–6pm)</option>
          <option value="evening">Evening (6pm+)</option>
        </select>
        {(filter.date||filter.timeOfDay)&&<button style={btn(C.gray,"#fff",{fontSize:"12px",padding:"8px 12px",minHeight:"40px"})} onClick={()=>setFilter({date:"",timeOfDay:""})}>Clear</button>}
      </div>

      {/* How it works */}
      <div style={{background:C.blueBg,border:`1px solid ${C.blueBorder}`,borderRadius:"10px",padding:"14px 16px",marginBottom:"20px",display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)",gap:"12px"}}>
        {[["1. Request","Post your date, time and court."],["2. Teams respond","Any team accepts, comments, or counters."],["3. Confirm","Accepting locks in the match."],["4. Play","Submit scores within 24 hrs."]].map(([t,d])=>(
          <div key={t}><div style={{fontSize:"12px",fontWeight:"700",color:"#1d4ed8",marginBottom:"3px"}}>{t}</div><div style={{fontSize:"12px",color:"#555",lineHeight:"1.5"}}>{d}</div></div>
        ))}
      </div>

      {/* Post form */}
      {showForm&&(
        <div style={{...card(),marginBottom:"20px",border:`2px solid ${C.text}`}}>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"4px"}}>Request a Match</div>
          <p style={{fontSize:"13px",color:C.muted,marginBottom:"16px"}}>Any team in your division can accept this request.</p>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:"12px"}}>
            <div>
              <Lbl>Available date</Lbl><input type="date" style={{...inp(),marginBottom:"12px"}} value={form.date} onChange={e=>upF("date",e.target.value)}/>
              <Lbl>Available time</Lbl><input type="time" style={inp()} value={form.time} onChange={e=>upF("time",e.target.value)}/>
            </div>
            <div>
              <Lbl>Court / location</Lbl>
              <input style={{...inp(),marginBottom:"6px"}} placeholder="e.g. Freedom Park Courts" value={form.court} onChange={e=>upF("court",e.target.value)}/>
              <button style={{fontSize:"11px",color:C.blue,background:"none",border:"none",cursor:"pointer",marginBottom:"10px",padding:0}} onClick={()=>setShowCourts(s=>!s)}>{showCourts?"Hide":"Show"} Charlotte courts list</button>
              {showCourts&&<div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"10px",marginBottom:"10px"}}>
                {CLT_COURTS.map(c=><div key={c} onClick={()=>{upF("court",c.split(" — ")[0]);setShowCourts(false);}} style={{fontSize:"12px",color:C.blue,cursor:"pointer",padding:"4px 0",borderBottom:`1px solid ${C.border}`}}>{c}</div>)}
              </div>}
              <Lbl>Notes (optional)</Lbl><input style={inp()} placeholder="e.g. Flexible on time" value={form.notes} onChange={e=>upF("notes",e.target.value)}/>
            </div>
          </div>
          <Lbl>Location fee (optional)</Lbl>
          <input style={{...inp(),marginBottom:"14px"}} placeholder="e.g. $5 guest fee — leave blank if free" value={form.fee} onChange={e=>upF("fee",e.target.value)}/>
          <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={postRequest} disabled={busy||!form.date||!form.time||!form.court}>Post Request</button>
        </div>
      )}

      {divReqs.length===0&&<div style={{...card(),textAlign:"center",padding:"48px 20px"}}><p style={{color:C.faint}}>No match requests yet in this division. Be the first!</p></div>}
      {divReqs.map(req=><RequestCard key={req.id} req={req} myTeam={myTeam} teams={teams} atLimit={atLimit} setConfirmReq={setConfirmReq}/>)}

      {/* Confirm modal */}
      {confirmReq&&<MatchConfirmModal req={confirmReq.req} respondingAs={myTeam} teams={teams} isCounter={confirmReq.isCounter} counterData={confirmReq.counterData} onConfirm={()=>doAccept(confirmReq.req,confirmReq.isCounter,confirmReq.counterData)} onClose={()=>setConfirmReq(null)}/>}
    </div>
  );
}

// ── SCORES ────────────────────────────────────────────────────
// ── SCORE CONFIRM FLOW ────────────────────────────────────────
// Step 1: Confirm or Dispute buttons (with accidental hit protection)
// Step 2a (Confirm): Second confirmation before locking
// Step 2b (Dispute): Enter counter score → notify opponent
// Step 3 (if counter disputed again): Auto-populate report → send to admin
function ScoreConfirmFlow({ match: m, myTeam, opp, setMatches, confirmScore }) {
  const [step, setStep]       = useState("idle"); // idle | confirm_check | dispute_check | counter_entry | counter_pending | report
  const [cEntry, setCEntry]   = useState({});
  const [submitting, setSub]  = useState(false);
  const upC = (k,v) => setCEntry(e=>({...e,[k]:v}));

  const doConfirm = async () => {
    setSub(true);
    await confirmScore(m.id);
    setSub(false);
  };

  const doDispute = async () => {
    setSub(true);
    await sb.from("matches").update({status:"disputed"}).eq("id",m.id);
    setMatches(p=>p.map(x=>x.id===m.id?{...x,status:"disputed"}:x));
    setSub(false);
    setStep("counter_entry");
  };

  const submitCounter = async () => {
    if (!cEntry.winner_id) { alert("Please select the winning team."); return; }
    const games=[];
    for(let i=1;i<=3;i++){
      const s1=parseInt(cEntry[`g${i}s1`]),s2=parseInt(cEntry[`g${i}s2`]);
      if(!isNaN(s1)&&!isNaN(s2)&&cEntry[`g${i}s1`]!==undefined&&cEntry[`g${i}s1`]!=="")games.push({s1,s2});
    }
    if(games.length<2){alert("Enter at least 2 game scores.");return;}
    setSub(true);
    const winner_id=cEntry.winner_id;
    const loser_id=winner_id===m.t1_id?m.t2_id:m.t1_id;
    const w1=games.filter(g=>g.s1>g.s2).length,w2=games.filter(g=>g.s2>g.s1).length;
    await sb.from("matches").update({status:"score_pending",games,score_t1:w1,score_t2:w2,winner_id,loser_id,submitted_by:myTeam.id,updated_at:new Date().toISOString()}).eq("id",m.id);
    setMatches(p=>p.map(x=>x.id===m.id?{...x,status:"score_pending",games,winner_id,loser_id,submitted_by:myTeam.id}:x));
    setSub(false);
    setStep("counter_pending");
  };

  const sendToAdmin = async () => {
    const details = `Match: ${opp?.name} vs ${myTeam.name} on ${m.match_date}. Both teams disputed the score. Submitted scores: ${m.games?.map(g=>`${g.s1}-${g.s2}`).join(" ")||"unknown"}. Counter scores by ${myTeam.name}: ${Object.values(cEntry).join(" ")}.`;
    await sb.from("admin_activity_log").insert({action:"Score dispute escalated",target_type:"match",target_id:m.id,details});
    await sb.from("matches").update({status:"disputed"}).eq("id",m.id);
    setMatches(p=>p.map(x=>x.id===m.id?{...x,status:"disputed"}:x));
    alert("Report sent to admin. They will review and resolve within 48 hours.");
    setStep("idle");
  };

  // Step: idle — show initial buttons (scores shown once, cleanly)
  if(step==="idle") return(
    <div style={{background:C.bg,borderRadius:"12px",padding:"14px"}}>
      <p style={{fontSize:"13px",color:C.muted,marginBottom:"12px",fontWeight:"500"}}>
        <strong style={{color:C.text}}>{opp?.name}</strong> submitted a score. Review and respond:
      </p>
      {m.games&&m.games.length>0&&(
        <div style={{display:"flex",gap:"12px",marginBottom:"14px",justifyContent:"center"}}>
          {m.games.map((g,i)=>(
            <div key={i} style={{textAlign:"center",background:C.white,borderRadius:"10px",padding:"10px 16px",flex:1}}>
              <div style={{fontSize:"10px",color:C.faint,fontWeight:"600",textTransform:"uppercase",marginBottom:"4px"}}>Game {i+1}</div>
              <div style={{fontSize:"22px",fontWeight:"800",letterSpacing:"2px"}}>{g.s1}<span style={{color:"#ccc",padding:"0 4px"}}>—</span>{g.s2}</div>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
        <button style={btn(C.green,"#fff",{minHeight:"46px",flex:1,fontSize:"14px",fontWeight:"700"})} onClick={()=>setStep("confirm_check")}>✓ Confirm</button>
        <button style={btn(C.red,"#fff",{minHeight:"46px",flex:1,fontSize:"14px",fontWeight:"700"})} onClick={()=>setStep("dispute_check")}>✗ Dispute</button>
      </div>
    </div>
  );

  // Step: confirm_check — accidental hit protection
  if(step==="confirm_check") return(
    <div style={{background:C.greenBg,border:`1px solid ${C.green}30`,borderRadius:"10px",padding:"14px"}}>
      <div style={{fontSize:"14px",fontWeight:"700",color:C.green,marginBottom:"8px"}}>Confirm this score?</div>
      <p style={{fontSize:"13px",color:"#166534",marginBottom:"12px",lineHeight:"1.5"}}>This will lock the result and update standings. This cannot be undone.</p>
      <div style={{display:"flex",gap:"8px"}}>
        <button style={btn(C.green,"#fff",{minHeight:"44px",flex:1})} onClick={doConfirm} disabled={submitting}>{submitting?"Confirming...":"Yes, confirm"}</button>
        <button style={btn(C.gray,"#fff",{minHeight:"44px",flex:1})} onClick={()=>setStep("idle")}>Cancel</button>
      </div>
    </div>
  );

  // Step: dispute_check — accidental hit protection
  if(step==="dispute_check") return(
    <div style={{background:C.redBg,border:`1px solid ${C.red}30`,borderRadius:"10px",padding:"14px"}}>
      <div style={{fontSize:"14px",fontWeight:"700",color:C.red,marginBottom:"8px"}}>Dispute this score?</div>
      <p style={{fontSize:"13px",color:"#991b1b",marginBottom:"12px",lineHeight:"1.5"}}>You'll be asked to enter the correct scores. Your opponent will then need to confirm or escalate to admin.</p>
      <div style={{display:"flex",gap:"8px"}}>
        <button style={btn(C.red,"#fff",{minHeight:"44px",flex:1})} onClick={doDispute} disabled={submitting}>{submitting?"Processing...":"Yes, dispute"}</button>
        <button style={btn(C.gray,"#fff",{minHeight:"44px",flex:1})} onClick={()=>setStep("idle")}>Cancel</button>
      </div>
    </div>
  );

  // Step: counter_entry — enter correct winner + game scores
  if(step==="counter_entry") return(
    <div style={{background:C.amberBg,border:`1px solid ${C.amber}30`,borderRadius:"10px",padding:"14px"}}>
      <div style={{fontSize:"14px",fontWeight:"700",color:C.amber,marginBottom:"4px"}}>Enter the correct scores</div>
      <p style={{fontSize:"12px",color:"#78350f",marginBottom:"12px",lineHeight:"1.5"}}>Select the winner and enter the score for each game. Your opponent will be notified.</p>

      <Lbl>Who won?</Lbl>
      <div style={{display:"flex",gap:"8px",marginBottom:"14px"}}>
        {[m.t1_id,m.t2_id].map(tid=>{
          const tname=tid===myTeam.id?myTeam.name:opp?.name;
          const selected=cEntry.winner_id===tid;
          return(
            <button key={tid} onClick={()=>setCEntry(e=>({...e,winner_id:tid}))} style={{flex:1,padding:"10px",borderRadius:"8px",border:`2px solid ${selected?C.green:C.border}`,background:selected?C.greenBg:C.white,color:selected?C.green:C.text,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"13px",fontWeight:"600",minHeight:"44px"}}>
              {tname}
            </button>
          );
        })}
      </div>

      <Lbl>Game scores (enter scores for your team first)</Lbl>
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginBottom:"14px"}}>
        {[1,2,3].map(g=>(
          <div key={g} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"10px"}}>
            <Lbl>Game {g}{g===3?" (if needed)":""}</Lbl>
            <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
              <input style={{...inp({width:"46px",textAlign:"center",fontSize:"16px"}),background:C.white}} type="number" min="0" max="25" placeholder="—" value={cEntry[`g${g}s1`]||""} onChange={e=>upC(`g${g}s1`,e.target.value)}/>
              <span style={{color:"#ccc",fontSize:"18px"}}>–</span>
              <input style={{...inp({width:"46px",textAlign:"center",fontSize:"16px"}),background:C.white}} type="number" min="0" max="25" placeholder="—" value={cEntry[`g${g}s2`]||""} onChange={e=>upC(`g${g}s2`,e.target.value)}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:"8px"}}>
        <button style={btn(C.amber,"#fff",{minHeight:"44px",flex:1})} onClick={submitCounter} disabled={submitting||!cEntry.winner_id}>{submitting?"Sending...":"Submit counter score"}</button>
        <button style={btn(C.gray,"#fff",{minHeight:"44px",flex:1})} onClick={()=>setStep("idle")}>Cancel</button>
      </div>
    </div>
  );

  // Step: counter_pending — waiting on opponent
  if(step==="counter_pending") return(
    <Alert type="warn">Counter score submitted — {opp?.name} has been notified and must confirm or escalate to admin.</Alert>
  );

  return null;
}

// ── SCORE ENTRY (hoisted outside Scores to prevent focus loss) ─
function ScoreEntry({ mid, myTeam, opp, entry, setEntry }) {
  const s = entry[mid] || {};
  const upE = (k,v) => setEntry(e=>({...e,[mid]:{...(e[mid]||{}),[k]:v}}));
  const games = [];
  for(let i=1;i<=3;i++){const s1=parseInt(s[`g${i}s1`]),s2=parseInt(s[`g${i}s2`]);if(!isNaN(s1)&&!isNaN(s2)&&s[`g${i}s1`]!=="")games.push({s1,s2});}
  const hasEnough = games.length >= 2;

  const inputStyle = (val) => ({
    width:"56px", textAlign:"center", fontSize:"20px", fontWeight:"800",
    background:C.white, border:`2px solid ${val?"#111":C.border}`,
    borderRadius:"10px", padding:"8px 4px", outline:"none",
    fontFamily:"'DM Sans',sans-serif", color:C.text,
    WebkitAppearance:"none", MozAppearance:"textfield", flexShrink:0,
  });

  return(
    <div style={{maxWidth:"480px"}}>
      {/* Team labels */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
        <span style={{fontSize:"13px",fontWeight:"700",color:C.text,flex:1}}>{myTeam?.name}</span>
        <span style={{fontSize:"11px",color:C.faint,padding:"0 8px"}}>vs</span>
        <span style={{fontSize:"13px",fontWeight:"700",color:C.text,flex:1,textAlign:"right"}}>{opp?.name}</span>
      </div>
      {/* Game rows — compact */}
      {[1,2,3].map(g=>(
        <div key={g} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px",background:C.bg,borderRadius:"10px",padding:"8px 12px"}}>
          <span style={{fontSize:"11px",color:C.muted,width:"54px",flexShrink:0,fontWeight:"600"}}>{g===3?"Game 3*":`Game ${g}`}</span>
          <div style={{display:"flex",alignItems:"center",gap:"8px",flex:1,justifyContent:"center"}}>
            <input type="number" min="0" max="25" inputMode="numeric" pattern="[0-9]*"
              placeholder="0" value={s[`g${g}s1`]||""}
              onChange={e=>upE(`g${g}s1`,e.target.value)} style={inputStyle(s[`g${g}s1`])}/>
            <span style={{fontSize:"16px",color:"#ccc",fontWeight:"300"}}>—</span>
            <input type="number" min="0" max="25" inputMode="numeric" pattern="[0-9]*"
              placeholder="0" value={s[`g${g}s2`]||""}
              onChange={e=>upE(`g${g}s2`,e.target.value)} style={inputStyle(s[`g${g}s2`])}/>
          </div>
        </div>
      ))}
      <p style={{fontSize:"11px",color:C.faint,marginBottom:"12px"}}>* Game 3 only if needed · Left = {myTeam?.name}</p>
      <button
        style={btn(hasEnough?C.text:"#ccc","#fff",{minHeight:"44px",fontSize:"14px",fontWeight:"700",cursor:hasEnough?"pointer":"default",width:"100%",maxWidth:"480px"})}
        disabled={!hasEnough}
        onClick={()=>hasEnough&&setEntry(e=>({...e,[`__confirm_${mid}`]:true}))}
      >Review &amp; Submit Score</button>
    </div>
  );
}

// ── SCORE CONFIRM MODAL (hoisted outside to prevent focus loss) ─
function ScoreConfirmModal({ mid, myTeam, teams, matches, entry, setEntry, setMatches, onClose }) {
  if(!mid)return null;
  const m = matches.find(x=>x.id===mid);
  if(!m)return null;
  const opp = teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
  const s = entry[mid]||{};
  const games=[];
  for(let i=1;i<=3;i++){const s1=parseInt(s[`g${i}s1`]),s2=parseInt(s[`g${i}s2`]);if(!isNaN(s1)&&!isNaN(s2)&&s[`g${i}s1`]!=="")games.push({s1,s2});}
  const w1=games.filter(g=>g.s1>g.s2).length,w2=games.filter(g=>g.s2>g.s1).length;
  const winner=w1>w2?myTeam?.name:opp?.name;
  const [submitting,setSub]=useState(false);

  const submit=async()=>{
    if(submitting)return;
    setSub(true);
    const winner_id=w1>w2?m.t1_id:m.t2_id,loser_id=winner_id===m.t1_id?m.t2_id:m.t1_id;
    await sb.from("matches").update({status:"score_pending",games,score_t1:w1,score_t2:w2,winner_id,loser_id,submitted_by:myTeam.id,updated_at:new Date().toISOString()}).eq("id",mid);
    setMatches(p=>p.map(x=>x.id===mid?{...x,status:"score_pending",games,winner_id,loser_id,submitted_by:myTeam.id}:x));
    setEntry(e=>{const n={...e};delete n[mid];delete n[`__confirm_${mid}`];return n;});
    // Email opposing team to confirm
    sendEmail("score_submitted",{
      submitterName: myTeam.name, oppName: opp?.name, oppEmail: opp?.p1_email,
      matchDate: m.match_date, court: m.court,
      games: games.map((g,i)=>`Game ${i+1}: ${g.s1}–${g.s2}`).join(", ")
    });
    onClose();
    setSub(false);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{...card(),width:"100%",maxWidth:"400px",animation:"fadeIn .15s ease"}}>
        <div style={{fontSize:"20px",fontWeight:"700",marginBottom:"4px"}}>Confirm score</div>
        <p style={{fontSize:"13px",color:C.muted,marginBottom:"16px"}}>Review before submitting. Your opponent has 24 hours to confirm or dispute.</p>
        <div style={{background:C.bg,borderRadius:"10px",padding:"14px",marginBottom:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"12px"}}>
            <span style={{fontSize:"15px",fontWeight:"800"}}>{myTeam?.name}</span>
            <span style={{fontSize:"15px",fontWeight:"800"}}>{opp?.name}</span>
          </div>
          {games.map((g,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:`1px solid ${C.border}`}}>
              <span style={{fontSize:"12px",color:C.muted}}>Game {i+1}</span>
              <span style={{fontSize:"22px",fontWeight:"800",letterSpacing:"2px"}}>{g.s1} — {g.s2}</span>
            </div>
          ))}
          <div style={{marginTop:"12px",paddingTop:"12px",borderTop:`2px solid ${C.border}`,textAlign:"center"}}>
            <span style={{fontSize:"13px",color:C.muted}}>Winner: </span>
            <span style={{fontSize:"16px",fontWeight:"800",color:C.green}}>{winner} 🏆</span>
          </div>
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button style={btn(C.green,"#fff",{flex:1,minHeight:"52px",fontSize:"16px",fontWeight:"700"})} onClick={submit} disabled={submitting}>{submitting?"Submitting...":"Submit"}</button>
          <button style={btn(C.gray,"#fff",{flex:1,minHeight:"52px",fontSize:"15px"})} onClick={onClose}>Edit</button>
        </div>
      </div>
    </div>
  );
}

function Scores({ myTeam, teams, setTeams, matches, setMatches, openChat, openCancel }) {
  const mobile = useMobile();
  const [entry, setEntry] = useState({});
  const [showCancelled, setShowCancelled] = useState(false);

  const confirmMid = Object.keys(entry).find(k=>k.startsWith("__confirm_"))?.replace("__confirm_","") || null;
  const closeConfirm = () => setEntry(e=>{const n={...e};Object.keys(n).filter(k=>k.startsWith("__confirm_")).forEach(k=>delete n[k]);return n;});

  const allMine = matches.filter(m=>(m.t1_id===myTeam?.id||m.t2_id===myTeam?.id));
  const active    = allMine.filter(m=>!m.cancelled&&m.status!=="completed");
  const completed = allMine.filter(m=>!m.cancelled&&m.status==="completed");
  const cancelled = allMine.filter(m=>m.cancelled);

  const confirmScore=async(mid)=>{
    const m=matches.find(x=>x.id===mid);
    if(!m)return;
    await sb.rpc("confirm_match_score",{match_id:mid});
    setMatches(p=>p.map(x=>x.id===mid?{...x,status:"completed"}:x));
    const{data:freshTeams}=await sb.from("teams").select("*").order("points",{ascending:false});
    if(freshTeams)setTeams(freshTeams);
    // Email both teams score confirmed
    const winner=freshTeams?.find(t=>t.id===m.winner_id);
    const loser=freshTeams?.find(t=>t.id===m.loser_id);
    if(winner&&loser){
      sendEmail("score_confirmed",{
        winnerName:winner.name, winnerEmail:winner.p1_email,
        loserName:loser.name, loserEmail:loser.p1_email,
        matchDate:m.match_date, court:m.court
      });
    }
  };

  return(
    <div>
      <div style={{fontSize:mobile?"22px":"26px",fontWeight:"700",letterSpacing:"-.5px",marginBottom:"2px"}}>My Matches</div>
      <div style={{fontSize:"11px",color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginBottom:"20px"}}>Submit scores · Confirm results · Full history</div>

      {active.length===0&&completed.length===0&&cancelled.length===0&&(
        <div style={{...card(),textAlign:"center",padding:"48px 20px"}}>
          <p style={{color:C.faint}}>No matches yet. Accept a request on the Match Board to get started.</p>
        </div>
      )}

      {/* Active matches */}
      {active.map(m=>{
        const opp=teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
        const canSubmit=m.status==="confirmed";
        const canConfirm=m.status==="score_pending"&&m.submitted_by!==myTeam?.id;
        const scoreSubmitted=m.status==="score_pending";
        return(
          <div key={m.id} style={{...card(),marginBottom:"14px",opacity:scoreSubmitted?0.85:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px",flexWrap:"wrap",gap:"8px"}}>
              <div>
                <div style={{fontSize:"20px",fontWeight:"800",marginBottom:"6px",letterSpacing:"-.3px"}}>vs {opp?.name}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"2px"}}>
                  <span style={{background:C.bg,borderRadius:"6px",padding:"3px 8px",fontSize:"12px",fontWeight:"600",color:C.text}}>📅 {fmtDate(m.match_date)}</span>
                  <span style={{background:C.bg,borderRadius:"6px",padding:"3px 8px",fontSize:"12px",fontWeight:"600",color:C.text}}>🕐 {fmtTime(m.match_time)}</span>
                  <span style={{background:C.bg,borderRadius:"6px",padding:"3px 8px",fontSize:"12px",fontWeight:"600",color:C.text}}>📍 {m.court}</span>
                </div>
              </div>
              <div style={{display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap"}}>
                <Tag c={canSubmit?"green":scoreSubmitted?"amber":m.status==="disputed"?"red":"gray"}>{canSubmit?"Confirmed":scoreSubmitted?"Score Pending":"Disputed"}</Tag>
                <button style={btn(C.text,"#fff",{fontSize:"12px",padding:"6px 14px",minHeight:"36px"})} onClick={()=>openChat(m)}>Chat</button>
                {canSubmit&&<button style={btn(C.red,"#fff",{fontSize:"12px",padding:"6px 14px",minHeight:"36px"})} onClick={()=>openCancel(m)}>Cancel</button>}
              </div>
            </div>
            {canSubmit&&<ScoreEntry mid={m.id} myTeam={myTeam} opp={opp} entry={entry} setEntry={setEntry}/>}
            {scoreSubmitted&&!canConfirm&&<Alert type="warn">Score submitted — waiting for {opp?.name} to confirm. Auto-confirms in 24 hours.</Alert>}
            {canConfirm&&<ScoreConfirmFlow match={m} myTeam={myTeam} opp={opp} setMatches={setMatches} confirmScore={confirmScore}/>}
          </div>
        );
      })}

      {/* Completed matches */}
      {completed.length>0&&(
        <>
          <div style={{fontSize:"12px",fontWeight:"700",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",margin:"24px 0 10px"}}>Completed</div>
          {completed.map(m=>{
            const opp=teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
            const won=m.winner_id===myTeam?.id;
            return(
              <div key={m.id} style={{...card(),marginBottom:"10px",opacity:0.5}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
                  <div>
                    <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"4px"}}>vs {opp?.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:"3px"}}>
                      <span style={{fontSize:"11px",color:C.muted}}>📅 {fmtDate(m.match_date)}</span>
                      <span style={{fontSize:"11px",color:C.faint}}>·</span>
                      <span style={{fontSize:"11px",color:C.muted}}>📍 {m.court}</span>
                    </div>
                    {m.games&&<div style={{fontSize:"12px",color:C.muted}}>{m.games.map(g=>`${g.s1}–${g.s2}`).join("  ")}</div>}
                  </div>
                  <Tag c={won?"green":"red"}>{won?"Win":"Loss"}</Tag>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Cancelled matches — collapsible section */}
      {cancelled.length>0&&(
        <>
          <button
            onClick={()=>setShowCancelled(s=>!s)}
            style={{...btn(C.gray,"#fff",{fontSize:"12px",padding:"6px 14px",minHeight:"36px",marginTop:"20px",marginBottom:"10px"})}}
          >
            {showCancelled?"Hide":"Show"} Cancelled ({cancelled.length})
          </button>
          {showCancelled&&cancelled.map(m=>{
            const opp=teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
            return(
              <div key={m.id} style={{...card(),marginBottom:"10px",opacity:0.4,borderLeft:`3px solid ${C.red}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
                  <div>
                    <div style={{fontSize:"14px",fontWeight:"700",marginBottom:"2px"}}>vs {opp?.name}</div>
                    <div style={{fontSize:"12px",color:C.muted}}>{fmtDate(m.match_date)}</div>
                    {m.cancel_reason&&<div style={{fontSize:"11px",color:C.faint,marginTop:"2px"}}>Reason: {m.cancel_reason}</div>}
                  </div>
                  <Tag c="red">Cancelled</Tag>
                </div>
              </div>
            );
          })}
        </>
      )}

      <ScoreConfirmModal mid={confirmMid} myTeam={myTeam} teams={teams} matches={matches} entry={entry} setEntry={setEntry} setMatches={setMatches} onClose={closeConfirm}/>
    </div>
  );
}

// ── STANDINGS ─────────────────────────────────────────────────
// ── TEAM PROFILE MODAL ───────────────────────────────────────
function TeamProfileModal({ team, teams, matches, myTeam, onClose }) {
  const mobile = useMobile();
  if (!team) return null;

  const teamMatches = [...matches.filter(m =>
    (m.t1_id===team.id||m.t2_id===team.id) && m.status==="completed" && !m.cancelled
  )].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

  const tName = id => teams.find(t=>t.id===id)?.name ?? "Unknown";

  const getStreak = () => {
    let s=0;
    for (const m of teamMatches) { if(m.winner_id===team.id)s++; else break; }
    return s;
  };

  const streak = getStreak();
  const pct = team.wins+team.losses>0 ? Math.round(team.wins/(team.wins+team.losses)*100) : 0;
  const totalGamesWon = teamMatches.reduce((acc,m)=>{
    if(!m.games)return acc;
    return acc + m.games.filter(g=>m.winner_id===team.id?g.s1>g.s2:g.s2>g.s1).length;
  },0);
  const totalGames = teamMatches.reduce((acc,m)=>acc+(m.games?.length||0),0);
  const pointDiff = teamMatches.reduce((acc,m)=>{
    if(!m.games)return acc;
    const mine = m.t1_id===team.id;
    return acc + m.games.reduce((a,g)=>a+(mine?g.s1-g.s2:g.s2-g.s1),0);
  },0);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.white,borderRadius:"16px 16px 0 0",width:"100%",maxWidth:"560px",maxHeight:"88vh",display:"flex",flexDirection:"column",animation:"slideUp .25s ease"}}>

        {/* Header */}
        <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:"22px",fontWeight:"800",marginBottom:"4px"}}>{team.name}{streak>=3?` 🔥`:""}</div>
              <div style={{fontSize:"13px",color:C.muted,marginBottom:"8px"}}>{team.p1_name} &amp; {team.p2_name}</div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                <Tag c={team.division==="low"?"gray":"blue"}>{dL(team.division)}</Tag>
                {team.id===myTeam?.id&&<Tag c="blue">Your team</Tag>}
                {streak>=3&&<Tag c="orange">{streak} win streak 🔥</Tag>}
              </div>
            </div>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:"26px",lineHeight:1,minWidth:"44px",minHeight:"44px",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>

          {/* Stat grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"20px"}}>
            {[
              {n:team.wins,  l:"Wins",      c:C.green},
              {n:team.losses,l:"Losses",    c:C.red},
              {n:team.points,l:"Points",    c:C.blue},
              {n:`${pct}%`,  l:"Win Rate",  c:pct>=50?C.green:C.muted},
              {n:teamMatches.length,l:"Matches",c:C.purple},
              {n:streak>0?`${streak}W`:"—",l:"Streak",c:streak>=3?C.orange:C.muted},
            ].map((x,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:"10px",padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:"22px",fontWeight:"800",color:x.c,lineHeight:"1"}}>{x.n}</div>
                <div style={{fontSize:"10px",fontWeight:"600",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",marginTop:"4px"}}>{x.l}</div>
              </div>
            ))}
          </div>

          {/* Extended stats */}
          <div style={{...card({padding:"14px"}),marginBottom:"16px"}}>
            <div style={{fontSize:"13px",fontWeight:"700",marginBottom:"10px"}}>Season stats</div>
            {[
              ["Games won",`${totalGamesWon} of ${totalGames}`],
              ["Point differential",`${pointDiff>=0?"+":""}${pointDiff}`],
              ["Skill ratings",`${team.p1_name}: ${team.p1_skill} · ${team.p2_name}: ${team.p2_skill}`],
            ].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:"13px",color:C.muted}}>{l}</span>
                <span style={{fontSize:"13px",fontWeight:"600"}}>{v}</span>
              </div>
            ))}
          </div>

          {/* Match history */}
          {teamMatches.length>0&&(
            <div style={card({padding:"14px"})}>
              <div style={{fontSize:"13px",fontWeight:"700",marginBottom:"10px"}}>Match history</div>
              {teamMatches.map(m=>{
                const opp = tName(m.t1_id===team.id?m.t2_id:m.t1_id);
                const won = m.winner_id===team.id;
                const scores = m.games?.map(g=>m.t1_id===team.id?`${g.s1}-${g.s2}`:`${g.s2}-${g.s1}`).join("  ") || "—";
                return(
                  <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap",gap:"8px"}}>
                    <div>
                      <div style={{fontSize:"13px",fontWeight:"600"}}>vs {opp}</div>
                      <div style={{fontSize:"11px",color:C.muted}}>{fmtDate(m.match_date)} · {scores}</div>
                    </div>
                    <Tag c={won?"green":"red"}>{won?"Win":"Loss"}</Tag>
                  </div>
                );
              })}
            </div>
          )}
          {teamMatches.length===0&&<p style={{fontSize:"13px",color:C.muted,textAlign:"center",padding:"20px 0"}}>No completed matches yet.</p>}
        </div>
      </div>
    </div>
  );
}

function Standings({ myTeam, teams, matches, division, setDivision, isAdmin }) {
  const mobile=useMobile();
  const [profileTeam, setProfileTeam] = useState(null);
  // Non-admins locked to their own division
  const activeDivision = isAdmin ? division : (myTeam?.division || division);
  const dt=[...teams.filter(t=>t.approved&&t.division===activeDivision)].sort((a,b)=>b.points-a.points||b.wins-a.wins);
  const getStreak=id=>{const tm=[...matches.filter(m=>(m.t1_id===id||m.t2_id===id)&&m.status==="completed"&&!m.cancelled)].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));let s=0;for(const m of tm){if(m.winner_id===id)s++;else break;}return s;};
  const totalPlayed=id=>matches.filter(m=>(m.t1_id===id||m.t2_id===id)&&m.status==="completed"&&!m.cancelled).length;
  const maxPlayed=Math.max(...teams.map(t=>totalPlayed(t.id)),0);
  const mostActiveId=maxPlayed>0?teams.find(t=>totalPlayed(t.id)===maxPlayed)?.id:null;

  return(
    <div>
      <div style={{fontSize:mobile?"22px":"26px",fontWeight:"700",letterSpacing:"-.5px",marginBottom:"2px"}}>Standings</div>
      <div style={{fontSize:"11px",color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginBottom:"20px"}}>{SEASON} · 2 pts per win · Top {PLAYOFFS} advance · Tap any team to view profile</div>
      {/* Only admins can switch divisions */}
      {isAdmin?(
        <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
          <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}/>
          <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")}/>
        </div>
      ):(
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"20px"}}>
          <Pill d={activeDivision} active={true} onClick={()=>{}}/>
          <span style={{fontSize:"12px",color:C.faint}}>Your division</span>
        </div>
      )}
      <div style={card()}>
        <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"14px"}}>{dL(activeDivision)} — Full standings</div>
        <div className="tscroll">
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:"400px"}}>
            <thead><tr>{["Rank","Team",!mobile&&"Players","Win","Loss","Points","Played","Win%","Streak"].filter(Boolean).map(h=><th key={h} style={{textAlign:"left",color:C.muted,fontSize:"11px",fontWeight:"600",letterSpacing:".8px",textTransform:"uppercase",padding:"8px 10px",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>
              {dt.map((t,i)=>{
                const pct=t.wins+t.losses>0?Math.round(t.wins/(t.wins+t.losses)*100):0;
                const streak=getStreak(t.id);
                const mp=totalPlayed(t.id);
                const playoff=i<PLAYOFFS;
                const isMe=t.id===myTeam?.id;
                const isActive=t.id===mostActiveId&&mp>0;
                return(
                  <tr key={t.id} style={{background:isMe?"#eff6ff":"",cursor:"pointer"}} onClick={()=>setProfileTeam(t)}>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"800",color:playoff?C.blue:"#ddd",fontSize:"20px",width:"40px"}}>{i+1}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"700"}}>
                      <div style={{color:C.blue,textDecoration:"underline",textDecorationStyle:"dotted",textUnderlineOffset:"3px"}}>{t.name}{streak>=3?` 🔥`:""}</div>
                      <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginTop:"3px"}}>
                        {isMe&&<Tag sm c="blue">You</Tag>}
                        {i===0&&<Tag sm c="gray">Leader</Tag>}
                        {playoff&&<Tag sm c="blue">Playoffs</Tag>}
                        {isActive&&<Tag sm c="purple">Most Active</Tag>}
                      </div>
                    </td>
                    {!mobile&&<td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,color:C.muted,fontSize:"12px"}}>{t.p1_name} &amp; {t.p2_name}</td>}
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"700",color:C.green,fontSize:"15px"}}>{t.wins}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,color:C.red,fontSize:"15px"}}>{t.losses}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"800",fontSize:"18px",color:dC(activeDivision)}}>{t.points}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,color:C.muted,fontSize:"13px"}}>{mp}</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,color:C.muted}}>{pct}%</td>
                    <td style={{padding:"10px",borderBottom:`1px solid #f0f0ee`,color:streak>=3?C.orange:C.muted,fontWeight:streak>=3?"700":"400"}}>{streak>0?`${streak}W`:"-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {profileTeam&&<TeamProfileModal team={profileTeam} teams={teams} matches={matches} myTeam={myTeam} onClose={()=>setProfileTeam(null)}/>}
    </div>
  );
}

// ── SEASON SCHEDULE ───────────────────────────────────────────
function SeasonSchedule({ matches, teams, division, setDivision, myTeam, isAdmin }) {
  const mobile=useMobile();
  const tName=id=>teams.find(t=>t.id===id)?.name??"Unknown";
  // Non-admins locked to their division
  const activeDivision = isAdmin ? division : (myTeam?.division || division);
  return(
    <div>
      <div style={{fontSize:mobile?"22px":"26px",fontWeight:"700",letterSpacing:"-.5px",marginBottom:"2px"}}>Season Schedule</div>
      <div style={{fontSize:"11px",color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginBottom:"20px"}}>{SEASON} · 6 weeks + playoffs</div>
      {isAdmin?(
        <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
          <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}/>
          <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")}/>
        </div>
      ):(
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"20px"}}>
          <Pill d={activeDivision} active={true} onClick={()=>{}}/>
          <span style={{fontSize:"12px",color:C.faint}}>Your division</span>
        </div>
      )}
      {WEEK_DATES.map(w=>{
        const wMatches=matches.filter(m=>m.division===activeDivision);
        const isCurrentWeek=w.week===CURRENT_WEEK;
        return(
          <div key={w.week} style={{...card(),marginBottom:"12px",borderLeft:`4px solid ${isCurrentWeek?C.blue:C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px",marginBottom:"10px"}}>
              <div>
                <div style={{fontSize:"16px",fontWeight:"700"}}>{w.label}</div>
                <div style={{fontSize:"13px",color:C.muted}}>{w.dates}</div>
              </div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                {isCurrentWeek&&<Tag c="blue">Current Week</Tag>}
                {w.week<CURRENT_WEEK&&<Tag c="gray">Completed</Tag>}
                {w.week>CURRENT_WEEK&&<Tag c="gray">Upcoming</Tag>}
              </div>
            </div>
            <div style={{fontSize:"12px",color:C.amber,fontWeight:"500",marginBottom:"8px"}}>⏰ Deadline: {w.deadline}</div>
            {w.week===6&&<div style={{background:C.purpleBg,border:`1px solid ${C.purple}30`,borderRadius:"8px",padding:"10px",fontSize:"13px",color:C.purple,fontWeight:"500"}}>🏆 Playoffs — Top {PLAYOFFS} teams per division. Single elimination.</div>}
          </div>
        );
      })}
    </div>
  );
}

// ── SETTINGS ─────────────────────────────────────────────────
function Settings({ userId, userEmail, myTeam, teams, matches, signOut, openReport, notifications, setNotifications }) {
  const mobile=useMobile();
  const [editReq,setEditReq]=useState(false);
  const [editMsg,setEditMsg]=useState("");
  const [sent,setSent]=useState(false);
  const [prefs,setPrefs]=useState(null);
  const [prefsSaved,setPrefsSaved]=useState(false);
  const [codeCopied,setCodeCopied]=useState(false);
  const [phoneData,setPhoneData]=useState({number:"",verified:false});
  const [editPhone,setEditPhone]=useState(false);
  const [newPhone,setNewPhone]=useState("");
  const [phoneSaving,setPhoneSaving]=useState(false);
  const [phoneSaved,setPhoneSaved]=useState(false);

  const myMatchHistory=matches.filter(m=>(m.t1_id===myTeam?.id||m.t2_id===myTeam?.id)&&m.status==="completed"&&!m.cancelled).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const tName=id=>teams.find(t=>t.id===id)?.name??"Unknown";
  const unread=notifications.filter(n=>!n.read).length;

  useEffect(()=>{
    if(!userId)return;
    sb.from("notification_prefs").select("*").eq("user_id",userId).single().then(({data})=>{
      setPrefs(data||{user_id:userId,match_confirmed:true,match_cancelled:true,score_submitted:true,score_confirmed:true,score_disputed:true,match_message:true,division_message:true,admin_announcement:true,match_reminder_24h:true,match_reminder_2h:true,email_enabled:true});
    });
    sb.from("profiles").select("phone_number,phone_verified").eq("id",userId).single().then(({data})=>{
      if(data) setPhoneData({number:data.phone_number||"",verified:data.phone_verified||false});
    });
  },[userId]);

  const savePrefs=async()=>{await sb.from("notification_prefs").upsert(prefs);setPrefsSaved(true);setTimeout(()=>setPrefsSaved(false),1500);};
  const togglePref=k=>setPrefs(p=>({...p,[k]:!p[k]}));

  const copyCode=()=>{
    navigator.clipboard.writeText(myTeam?.join_code||"").then(()=>{
      setCodeCopied(true);
      setTimeout(()=>setCodeCopied(false),2000);
    });
  };

  const savePhone=async()=>{
    if(!newPhone.trim()){return;}
    setPhoneSaving(true);
    try{
      await sb.from("profiles").update({phone_number:newPhone,phone_verified:false}).eq("id",userId);
      setPhoneData({number:newPhone,verified:false});
      setEditPhone(false);
      setPhoneSaved(true);
      setTimeout(()=>setPhoneSaved(false),2000);
    }catch(e){}
    setPhoneSaving(false);
  };

  const markAllRead=async()=>{
    await sb.from("notifications").update({read:true}).eq("read",false);
    setNotifications(p=>p.map(n=>({...n,read:true})));
  };

  const sendEditRequest=async()=>{
    if(!editMsg.trim())return;
    await sb.from("admin_activity_log").insert({action:"Team edit request",target_type:"team",target_id:myTeam?.id,details:`${myTeam?.name}: ${editMsg}`});
    setSent(true);setEditReq(false);setEditMsg("");
  };

  const notifGroups=[
    ["Matches",[["match_confirmed","Match confirmed"],["match_cancelled","Match cancelled"],["match_reminder_24h","Reminder 24h before"],["match_reminder_2h","Reminder 2h before"]]],
    ["Scores",[["score_submitted","Score submitted"],["score_confirmed","Score confirmed"],["score_disputed","Score disputed"]]],
    ["Messages",[["match_message","Match chat"],["division_message","Division chat"],["admin_announcement","Admin announcements"]]],
    ["Email",[["email_enabled","Receive email notifications"]]],
  ];

  const notifIcons={match_confirmed:"✓",score_submitted:"📊",score_confirmed:"✅",disputed:"⚠",message:"💬",match_message:"🏓",admin_announcement:"📢",match_cancelled:"❌",match_reminder:"⏰",match_today:"🏓"};

  return(
    <div>
      <div style={{fontSize:mobile?"22px":"26px",fontWeight:"700",letterSpacing:"-.5px",marginBottom:"20px"}}>Profile &amp; Settings</div>

      {/* Team info */}
      <div style={{...card(),marginBottom:"14px"}}>
        <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"14px"}}>Team information</div>
        {myTeam?<>
          {[
            ["Team name",myTeam.name],
            ["Your email",userEmail||"—"],
            ["Player 1",myTeam.p1_name],
            ["Player 2",myTeam.p2_name],
            ["Division",dL(myTeam.division)],
            ["Status",myTeam.approved?"✅ Active":"⏳ Pending activation"],
            ["Record",`${myTeam.wins}W / ${myTeam.losses}L / ${myTeam.points} pts`],
          ].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap",gap:"8px"}}>
              <span style={{fontSize:"13px",color:C.muted}}>{l}</span>
              <span style={{fontSize:"13px",fontWeight:"600",textAlign:"right"}}>{v}</span>
            </div>
          ))}
          {/* Per-player payment status — pay button only for the viewing user */}
          <div style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:"11px",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",fontWeight:"600",marginBottom:"8px"}}>Payment status</div>
            {[
              {name:myTeam.p1_name, email:myTeam.p1_email, paid:myTeam.p1_paid, label:"P1"},
              {name:myTeam.p2_name, email:myTeam.p2_email, paid:myTeam.p2_paid, label:"P2"},
            ].map(({name,email,paid,label})=>{
              const isMe = email?.toLowerCase()===userEmail?.toLowerCase();
              return(
                <div key={label} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                  <span style={{fontSize:"13px"}}>{paid?"✅":"⏳"}</span>
                  <span style={{fontSize:"13px",flex:1}}>{name}{isMe&&<span style={{fontSize:"11px",color:C.faint}}> (you)</span>}</span>
                  <Tag c={paid?"green":"red"}>{paid?"$25 paid":"Unpaid"}</Tag>
                  {!paid&&isMe&&<button style={btn(C.amber,"#fff",{fontSize:"11px",padding:"4px 10px",minHeight:"30px"})} onClick={()=>window.open(SHOPIFY_URL,"_blank")}>Pay now</button>}
                </div>
              );
            })}
          </div>
          {/* Phone number */}
          <div style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:"11px",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",fontWeight:"600",marginBottom:"8px"}}>Mobile number</div>
            {phoneSaved&&<Alert type="success">Phone number updated.</Alert>}
            {!editPhone
              ? <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                  <span style={{fontSize:"13px",flex:1}}>{phoneData.number||"Not set"}</span>
                  {phoneData.verified
                    ? <Tag c="green">✓ Verified</Tag>
                    : phoneData.number
                      ? <Tag c="amber">⏳ Not verified</Tag>
                      : null
                  }
                  <button style={btn(C.gray,"#555",{fontSize:"11px",padding:"5px 12px",minHeight:"30px"})} onClick={()=>{setNewPhone(phoneData.number);setEditPhone(true);}}>
                    {phoneData.number?"Update":"Add number"}
                  </button>
                </div>
              : <div>
                  <input style={{...inp(),marginBottom:"8px"}} type="tel" placeholder="(704) 555-0000" value={newPhone} onChange={e=>setNewPhone(e.target.value)}/>
                  <div style={{display:"flex",gap:"8px"}}>
                    <button style={btn(C.text,"#fff",{minHeight:"40px",flex:1,fontSize:"13px"})} onClick={savePhone} disabled={phoneSaving}>{phoneSaving?"Saving...":"Save"}</button>
                    <button style={btn(C.gray,"#fff",{minHeight:"40px",fontSize:"13px"})} onClick={()=>setEditPhone(false)}>Cancel</button>
                  </div>
                  <div style={{fontSize:"11px",color:C.faint,marginTop:"6px"}}>Updating your number will require re-verification. Contact <strong>league@ascendpb.com</strong> if you need help.</div>
                </div>
            }
          </div>
          {/* Join code — always visible so Player 1 can reshare */}
          {myTeam.join_code&&(
            <div style={{marginTop:"14px",background:"#1d1d1f",borderRadius:"12px",padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"6px"}}>Partner join code</div>
              <div style={{fontSize:"32px",fontWeight:"900",color:"#00BFFF",letterSpacing:"6px",fontFamily:"monospace",marginBottom:"8px"}}>{myTeam.join_code}</div>
              <div style={{display:"flex",gap:"8px",marginBottom:"8px"}}>
                <button style={{...btn("#333","#fff",{fontSize:"12px",padding:"7px 14px",minHeight:"36px"}),flex:1}} onClick={copyCode}>
                  {codeCopied?"✓ Copied!":"📋 Copy code"}
                </button>
                <button style={{...btn("#00BFFF","#fff",{fontSize:"12px",padding:"7px 14px",minHeight:"36px"}),flex:1}} onClick={()=>{
                  const text=`Hey ${myTeam.p2_name}! Join our pickleball team.\n\n1. Go to app.ascendpb.com\n2. Tap "Join with team code"\n3. Enter: ${myTeam.join_code}\n4. Create your account & pay $25 🏓`;
                  if(navigator.share)navigator.share({text});
                  else{navigator.clipboard.writeText(text);}
                }}>📤 Share with {myTeam.p2_name}</button>
              </div>
              <div style={{fontSize:"11px",color:"rgba(255,255,255,.3)"}}>Share with {myTeam.p2_name} → app.ascendpb.com → "Join with team code"</div>
            </div>
          )}
          <div style={{marginTop:"14px"}}>
            <div style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:"8px",padding:"10px 12px",marginBottom:"10px",fontSize:"12px",color:"#78350f"}}>
              <strong>Need to update your team info?</strong> Once the season starts, details cannot be self-edited. Submit a request and admin will review it.
            </div>
            {sent?<Alert type="success">Edit request sent to admin.</Alert>:
            editReq?<>
              <Lbl>What would you like changed?</Lbl>
              <textarea style={{...inp({minHeight:"80px",resize:"vertical"}),marginBottom:"10px"}} placeholder="e.g. Update team name, correct player name spelling, change division..." value={editMsg} onChange={e=>setEditMsg(e.target.value)}/>
              <div style={{display:"flex",gap:"8px"}}>
                <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={sendEditRequest} disabled={!editMsg.trim()}>Send Request</button>
                <button style={btn(C.gray,"#fff",{minHeight:"44px"})} onClick={()=>setEditReq(false)}>Cancel</button>
              </div>
            </>:
            <button style={btn(C.gray,"#fff",{fontSize:"13px",width:"100%",minHeight:"44px"})} onClick={()=>setEditReq(true)}>✏ Request a team info or rating edit</button>}
          </div>
        </>:<p style={{fontSize:"13px",color:C.muted}}>Admin account — no team assigned.</p>}
      </div>

      {/* Notifications */}
      <div style={{...card(),marginBottom:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
          <div style={{fontSize:"15px",fontWeight:"700"}}>Notifications {unread>0&&<Tag c="red">{unread} unread</Tag>}</div>
          {unread>0&&<button style={btn(C.gray,"#fff",{fontSize:"12px",padding:"6px 12px",minHeight:"36px"})} onClick={markAllRead}>Mark all read</button>}
        </div>
        {notifications.length===0?<p style={{fontSize:"13px",color:C.muted}}>No notifications yet.</p>:
        <div style={{maxHeight:"280px",overflowY:"auto",marginBottom:"14px"}}>
          {notifications.slice(0,20).map(n=>(
            <div key={n.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`,display:"flex",gap:"10px",alignItems:"flex-start",background:n.read?"transparent":"#f0f9ff",borderRadius:"4px",paddingLeft:n.read?"0":"8px"}}>
              <span style={{fontSize:"16px",flexShrink:0}}>{notifIcons[n.type]||"•"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:n.read?"500":"700",fontSize:"13px",marginBottom:"2px"}}>{n.title}</div>
                <div style={{fontSize:"12px",color:C.muted,lineHeight:"1.4"}}>{n.body}</div>
                <div style={{fontSize:"11px",color:C.faint,marginTop:"3px"}}>{timeAgo(n.created_at)}</div>
              </div>
              {!n.read&&<div style={{width:"8px",height:"8px",borderRadius:"50%",background:C.blue,flexShrink:0,marginTop:"5px"}}/>}
            </div>
          ))}
        </div>}

        {/* Notification preferences inline */}
        {prefs&&<>
          <div style={{fontSize:"13px",fontWeight:"700",color:C.text,marginBottom:"10px",marginTop:"4px",paddingTop:"14px",borderTop:`1px solid ${C.border}`}}>Notification preferences</div>
          {notifGroups.map(([group,items])=>(
            <div key={group} style={{marginBottom:"14px"}}>
              <div style={{fontSize:"11px",fontWeight:"700",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",marginBottom:"8px"}}>{group}</div>
              {items.map(([key,label])=>(
                <label key={key} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer",minHeight:"44px"}}>
                  <span style={{fontSize:"14px"}}>{label}</span>
                  <div onClick={()=>togglePref(key)} style={{width:"44px",height:"24px",borderRadius:"12px",background:prefs[key]?C.blue:C.border,position:"relative",transition:"background .2s",cursor:"pointer",flexShrink:0}}>
                    <div style={{position:"absolute",top:"2px",left:prefs[key]?"22px":"2px",width:"20px",height:"20px",borderRadius:"50%",background:C.white,transition:"left .2s"}}/>
                  </div>
                </label>
              ))}
            </div>
          ))}
          <button style={btn(prefsSaved?C.green:C.text,"#fff",{width:"100%",marginTop:"4px"})} onClick={savePrefs}>{prefsSaved?"Saved ✓":"Save notification preferences"}</button>
        </>}
      </div>

      {/* Match history */}
      {myMatchHistory.length>0&&(
        <div style={{...card(),marginBottom:"14px"}}>
          <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"14px"}}>Match history</div>
          <div className="tscroll">
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:"320px"}}>
              <thead><tr>{["Opponent","Date","Score","Result"].map(h=><th key={h} style={{textAlign:"left",color:C.muted,fontSize:"11px",fontWeight:"600",letterSpacing:".8px",textTransform:"uppercase",padding:"7px 10px",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>
                {myMatchHistory.map(m=>{
                  const opp=tName(m.t1_id===myTeam?.id?m.t2_id:m.t1_id);
                  const won=m.winner_id===myTeam?.id;
                  return(
                    <tr key={m.id}>
                      <td style={{padding:"9px 10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"600"}}>{opp}</td>
                      <td style={{padding:"9px 10px",borderBottom:`1px solid #f0f0ee`,fontSize:"12px",color:C.muted}}>{fmtDate(m.match_date)}</td>
                      <td style={{padding:"9px 10px",borderBottom:`1px solid #f0f0ee`,fontSize:"12px",color:C.muted}}>{m.games?.map(g=>`${g.s1}-${g.s2}`).join("  ")||"—"}</td>
                      <td style={{padding:"9px 10px",borderBottom:`1px solid #f0f0ee`}}><Tag c={won?"green":"red"}>{won?"Win":"Loss"}</Tag></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Account actions */}
      <div style={card()}>
        <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"14px"}}>Account</div>
        <button onClick={openReport} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",background:"none",border:"none",cursor:"pointer",padding:"12px 0",borderBottom:`1px solid ${C.border}`,textAlign:"left",minHeight:"44px"}}>
          <div><div style={{fontSize:"14px",fontWeight:"600",color:C.amber}}>Report a problem</div><div style={{fontSize:"12px",color:C.muted}}>Flag an issue to admin</div></div>
          <span style={{color:C.muted,fontSize:"20px"}}>›</span>
        </button>
        <button onClick={signOut} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",background:"none",border:"none",cursor:"pointer",padding:"12px 0",textAlign:"left",minHeight:"44px"}}>
          <div><div style={{fontSize:"14px",fontWeight:"600",color:C.red}}>Sign out</div><div style={{fontSize:"12px",color:C.muted}}>Log out of your account</div></div>
          <span style={{color:C.muted,fontSize:"20px"}}>›</span>
        </button>
        <div style={{paddingTop:"12px",textAlign:"center"}}>
          <span style={{fontSize:"11px",color:C.faint}}>Ascend PB Flex League · {APP_VERSION} · {SEASON}</span>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────
// ── ADMIN INBOX ───────────────────────────────────────────────
function AdminInbox({ userId, teams, matches }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const tName = id => teams.find(t=>t.id===id)?.name ?? "Unknown";

  useEffect(()=>{
    const load = async () => {
      const [{ data:reports },{ data:edits },{ data:cancels }] = await Promise.all([
        sb.from("admin_activity_log").select("*").in("action",["Player report","Score dispute escalated","Team edit request"]).order("created_at",{ascending:false}).limit(50),
        sb.from("admin_activity_log").select("*").eq("action","Team edit request").order("created_at",{ascending:false}).limit(20),
        sb.from("match_cancellations").select("*,matches(match_date,match_time,court,t1_id,t2_id)").order("created_at",{ascending:false}).limit(20),
      ]);
      const all = [
        ...(reports||[]).map(r=>({...r,_type:"report"})),
        ...(cancels||[]).map(c=>({...c,_type:"cancel",action:"Match cancelled",details:`${tName(c.cancelled_by)}: ${c.reason}`,created_at:c.created_at})),
      ].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
      setItems(all);
      setLoading(false);
    };
    load();
  },[]);

  const iconMap = {
    "Player report":"🚩",
    "Score dispute escalated":"⚠",
    "Team edit request":"✏",
    "Match cancelled":"❌",
  };

  const colorMap = {
    "Player report":C.red,
    "Score dispute escalated":C.amber,
    "Team edit request":C.blue,
    "Match cancelled":C.muted,
  };

  return(
    <div>
      <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"4px"}}>Admin Inbox</div>
      <p style={{fontSize:"13px",color:C.muted,marginBottom:"16px"}}>Player reports, edit requests, score disputes, and match cancellations — all in one place.</p>
      {loading&&<p style={{fontSize:"13px",color:C.muted}}>Loading...</p>}
      {!loading&&items.length===0&&<p style={{fontSize:"13px",color:C.muted}}>Inbox is empty. All clear!</p>}
      {items.map((item,i)=>(
        <div key={i} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
            <span style={{fontSize:"18px",flexShrink:0}}>{iconMap[item.action]||"•"}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"8px",flexWrap:"wrap"}}>
                <span style={{fontSize:"13px",fontWeight:"700",color:colorMap[item.action]||C.text}}>{item.action}</span>
                <span style={{fontSize:"11px",color:C.faint,whiteSpace:"nowrap"}}>{timeAgo(item.created_at)}</span>
              </div>
              {item.details&&<div style={{fontSize:"13px",color:C.text,marginTop:"4px",lineHeight:"1.5"}}>{item.details}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Small helper — fetches and shows phone number for a player by email (admin use)
function PhoneDisplay({ email }) {
  const [phone, setPhone] = useState(null);
  useEffect(()=>{
    if(!email)return;
    sb.from("profiles").select("phone_number,phone_verified").eq("email",email).maybeSingle().then(({data})=>{
      if(data?.phone_number) setPhone({number:data.phone_number, verified:data.phone_verified});
    });
  },[email]);
  if(!phone) return null;
  return(
    <div style={{fontSize:"11px",color:"#555",marginTop:"2px",display:"flex",alignItems:"center",gap:"4px"}}>
      📱 {phone.number}
      {phone.verified
        ? <span style={{color:"#16a34a",fontWeight:"700"}}>✓</span>
        : <span style={{color:"#d97706"}}>unverified</span>
      }
    </div>
  );
}

function AdminPanel({ teams, setTeams, matches, setMatches, userId, adminBanner, setAdminBanner, weekDeadline, setWeekDeadline }) {
  const mobile=useMobile();
  const [tab,setTab]=useState("summary");
  const [annTxt,setAnnTxt]=useState("");
  const [dmTeam,setDmTeam]=useState("");
  const [dmSubj,setDmSubj]=useState("");
  const [dmBody,setDmBody]=useState("");
  const [log,setLog]=useState([]);
  const [editM,setEditM]=useState(null);
  const [editScores,setEditScores]=useState({});
  const [newMatch,setNewMatch]=useState({t1:"",t2:"",div:"low",date:"",time:"",court:"",asCompleted:false,winner:"",g1s1:"",g1s2:"",g2s1:"",g2s2:"",g3s1:"",g3s2:""});
  const [bannerDraft,setBannerDraft]=useState(adminBanner||"");
  const [deadlineDraft,setDeadlineDraft]=useState(weekDeadline||"");

  const pending=teams.filter(t=>!t.approved);
  const disputes=matches.filter(m=>m.status==="disputed"&&!m.cancelled);
  const completed=matches.filter(m=>m.status==="completed"&&!m.cancelled);
  const tName=id=>teams.find(t=>t.id===id)?.name??"Unknown";
  const totalRev=teams.filter(t=>t.paid).length*25;

  const logAction=async(action,targetType,targetId,details)=>{
    await sb.from("admin_activity_log").insert({admin_id:userId,action,target_type:targetType,target_id:targetId,details});
    setLog(p=>[{action,target_type:targetType,details,created_at:new Date().toISOString()},...p].slice(0,50));
  };

  useEffect(()=>{ if(tab==="log")sb.from("admin_activity_log").select("*").order("created_at",{ascending:false}).limit(50).then(({data})=>{if(data)setLog(data);}); },[tab]);

  const approve = async id=>{
    await sb.from("teams").update({approved:true}).eq("id",id);
    setTeams(p=>p.map(t=>t.id===id?{...t,approved:true}:t));
    await logAction("Approved team","team",id,tName(id));
    const team = teams.find(t=>t.id===id);
    if(team){
      sendEmail("team_activated",{p1Name:team.p1_name,p1Email:team.p1_email,p2Name:team.p2_name,p2Email:team.p2_email,teamName:team.name,division:dL(team.division)});
    }
  };
  const markP1Paid = async id=>{
    const t=teams.find(x=>x.id===id);
    const updates={p1_paid:true,paid:true};
    // Auto-approve if P2 already paid
    if(t?.p2_paid) updates.approved=true;
    await sb.from("teams").update(updates).eq("id",id);
    setTeams(p=>p.map(x=>x.id===id?{...x,...updates}:x));
    await logAction(updates.approved?"Marked P1 paid + auto-approved":"Marked P1 paid","team",id,tName(id));
  };
  const markP2Paid = async id=>{
    const t=teams.find(x=>x.id===id);
    const updates={p2_paid:true};
    // Auto-approve if P1 already paid
    if(t?.p1_paid) updates.approved=true;
    await sb.from("teams").update(updates).eq("id",id);
    setTeams(p=>p.map(x=>x.id===id?{...x,...updates}:x));
    await logAction(updates.approved?"Marked P2 paid + auto-approved":"Marked P2 paid","team",id,tName(id));
  };
  const markPaid = async id=>{await sb.from("teams").update({p1_paid:true,p2_paid:true,paid:true,approved:true}).eq("id",id);setTeams(p=>p.map(t=>t.id===id?{...t,p1_paid:true,p2_paid:true,paid:true,approved:true}:t));await logAction("Marked both paid + approved","team",id,tName(id));};
  const removeTeam=async id=>{if(!window.confirm("Remove this team permanently?"))return;await sb.from("teams").delete().eq("id",id);setTeams(p=>p.filter(t=>t.id!==id));await logAction("Removed team","team",id,tName(id));};

  const saveTeamEdit=async()=>{
    if(!editM)return;
    const{type,id,...updates}=editM;
    // Convert numeric fields
    if(updates.wins!==undefined)updates.wins=parseInt(updates.wins)||0;
    if(updates.losses!==undefined)updates.losses=parseInt(updates.losses)||0;
    if(updates.points!==undefined)updates.points=parseInt(updates.points)||0;
    await sb.from("teams").update(updates).eq("id",id);
    setTeams(p=>p.map(t=>t.id===id?{...t,...updates}:t));
    await logAction("Edited team","team",id,JSON.stringify(updates));
    setEditM(null);
  };

  const resetRecord=async(id)=>{
    if(!window.confirm("Reset this team's record to 0-0-0?"))return;
    await sb.from("teams").update({wins:0,losses:0,points:0}).eq("id",id);
    setTeams(p=>p.map(t=>t.id===id?{...t,wins:0,losses:0,points:0}:t));
    await logAction("Reset team record","team",id,tName(id));
  };

  const resolveDispute=async(mid,winnerId,loserId)=>{
    await sb.from("matches").update({status:"completed",winner_id:winnerId,loser_id:loserId}).eq("id",mid);
    setMatches(p=>p.map(m=>m.id===mid?{...m,status:"completed",winner_id:winnerId}:m));
    await logAction("Resolved dispute","match",mid,`Winner: ${tName(winnerId)}`);
  };

  const saveScore=async(mid)=>{
    const s=editScores[mid]||{};
    if(!s.winner_id){alert("Please select the winning team.");return;}
    const games=[];
    for(let i=1;i<=3;i++){
      const s1=parseInt(s[`g${i}s1`]),s2=parseInt(s[`g${i}s2`]);
      if(!isNaN(s1)&&!isNaN(s2)&&s[`g${i}s1`])games.push({s1,s2});
    }
    const loser_id=s.winner_id===s.t1_id?s.t2_id:s.t1_id;
    const updates={status:"completed",winner_id:s.winner_id,loser_id};
    if(games.length>=2){updates.games=games;updates.score_t1=games.filter(g=>g.s1>g.s2).length;updates.score_t2=games.filter(g=>g.s2>g.s1).length;}
    await sb.from("matches").update(updates).eq("id",mid);
    // Update standings
    await sb.from("teams").update({wins:teams.find(t=>t.id===s.winner_id)?.wins+1||1,points:teams.find(t=>t.id===s.winner_id)?.points+2||2}).eq("id",s.winner_id);
    await sb.from("teams").update({losses:teams.find(t=>t.id===loser_id)?.losses+1||1}).eq("id",loser_id);
    setMatches(p=>p.map(m=>m.id===mid?{...m,...updates}:m));
    setTeams(p=>p.map(t=>{
      if(t.id===s.winner_id)return{...t,wins:t.wins+1,points:t.points+2};
      if(t.id===loser_id)return{...t,losses:t.losses+1};
      return t;
    }));
    setEditM(null);
    await logAction("Edited score","match",mid,`Winner: ${tName(s.winner_id)}`);
  };

  const deleteMatch=async(mid)=>{
    if(!window.confirm("Permanently delete this match? Standings will be updated if completed."))return;
    const m=matches.find(x=>x.id===mid);

    // Optimistic — remove immediately from all views
    if(window.__deletedMatchIds)window.__deletedMatchIds.add(mid);
    setMatches(p=>p.filter(x=>x.id!==mid));

    // Roll back standings locally if completed
    if(m?.status==="completed"&&m.winner_id&&m.loser_id){
      setTeams(p=>p.map(t=>{
        if(t.id===m.winner_id)return{...t,wins:Math.max(0,t.wins-1),points:Math.max(0,t.points-2)};
        if(t.id===m.loser_id)return{...t,losses:Math.max(0,t.losses-1)};
        return t;
      }));
      // Update DB standings
      const winner=teams.find(t=>t.id===m.winner_id);
      const loser=teams.find(t=>t.id===m.loser_id);
      if(winner)await sb.from("teams").update({wins:Math.max(0,winner.wins-1),points:Math.max(0,winner.points-2)}).eq("id",m.winner_id);
      if(loser)await sb.from("teams").update({losses:Math.max(0,loser.losses-1)}).eq("id",m.loser_id);
    }

    // Delete from DB
    const{error}=await sb.from("matches").delete().eq("id",mid);
    if(error){
      alert("Delete failed: "+error.message);
      // Revert
      if(window.__deletedMatchIds)window.__deletedMatchIds.delete(mid);
      await refreshMatchesAndTeams();
      return;
    }

    // Full refresh to guarantee all views sync
    await refreshMatchesAndTeams();
    await logAction("Deleted match","match",mid,`${tName(m?.t1_id)} vs ${tName(m?.t2_id)}`);
  };

  const createMatch=async()=>{
    if(!newMatch.t1||!newMatch.t2||newMatch.t1===newMatch.t2)return;
    const isCompleted=newMatch.asCompleted&&newMatch.winner;
    const games=[];
    for(let i=1;i<=3;i++){
      const s1=parseInt(newMatch[`g${i}s1`]),s2=parseInt(newMatch[`g${i}s2`]);
      if(!isNaN(s1)&&!isNaN(s2)&&newMatch[`g${i}s1`])games.push({s1,s2});
    }
    const insertData={
      t1_id:newMatch.t1,t2_id:newMatch.t2,division:newMatch.div,
      match_date:newMatch.date,match_time:newMatch.time,
      court:newMatch.court||"TBD — Charlotte area",
      status:isCompleted?"completed":"confirmed",
    };
    if(isCompleted&&newMatch.winner){
      insertData.winner_id=newMatch.winner;
      insertData.loser_id=newMatch.winner===newMatch.t1?newMatch.t2:newMatch.t1;
      if(games.length>=2){const w1=games.filter(g=>g.s1>g.s2).length,w2=games.filter(g=>g.s2>g.s1).length;insertData.games=games;insertData.score_t1=w1;insertData.score_t2=w2;}
    }
    const{data}=await sb.from("matches").insert(insertData).select().single();
    if(data){
      setMatches(p=>[data,...p]);
      // Update standings if completed
      if(isCompleted&&newMatch.winner){
        await sb.from("teams").update({wins:teams.find(t=>t.id===newMatch.winner)?.wins+1||1,points:teams.find(t=>t.id===newMatch.winner)?.points+2||2}).eq("id",newMatch.winner);
        const loserId=newMatch.winner===newMatch.t1?newMatch.t2:newMatch.t1;
        await sb.from("teams").update({losses:teams.find(t=>t.id===loserId)?.losses+1||1}).eq("id",loserId);
        setTeams(p=>p.map(t=>{
          if(t.id===newMatch.winner)return{...t,wins:t.wins+1,points:t.points+2};
          if(t.id===loserId)return{...t,losses:t.losses+1};
          return t;
        }));
      }
      setNewMatch({t1:"",t2:"",div:"low",date:"",time:"",court:"",asCompleted:false,winner:"",g1s1:"",g1s2:"",g2s1:"",g2s2:"",g3s1:"",g3s2:""});
      await logAction(isCompleted?"Created completed match":"Created match","match",data.id,`${tName(newMatch.t1)} vs ${tName(newMatch.t2)}`);
    }
  };

  const postAnn=async()=>{
    if(!annTxt.trim())return;
    await sb.from("division_chats").insert([
      {division:"low",team_name:"League Admin",is_admin:true,content:annTxt.trim()},
      {division:"high",team_name:"League Admin",is_admin:true,content:annTxt.trim()},
    ]);
    await logAction("Posted announcement","system",null,annTxt.trim().slice(0,80));
    setAnnTxt("");
    alert("Announcement posted to both division chats.");
  };

  const sendDm=async()=>{
    if(!dmTeam||!dmSubj||!dmBody)return;
    await sb.from("admin_messages").insert({from_admin:userId,to_team_id:dmTeam,subject:dmSubj,content:dmBody});
    await logAction("Sent DM","team",dmTeam,dmSubj);
    setDmTeam("");setDmSubj("");setDmBody("");
    alert("Message sent to team.");
  };

  const saveBanner=()=>{ setAdminBanner(bannerDraft||null); alert(bannerDraft?"Banner set — visible to all players on dashboard.":"Banner cleared."); };
  const saveDeadline=()=>{ setWeekDeadline(deadlineDraft||null); alert(deadlineDraft?"Deadline set.":"Deadline cleared."); };

  const tabs=[["summary","📊 Summary"],["pending",`📋 Pending (${pending.length})`],["disputes",`⚠ Disputes (${disputes.length})`],["inbox","📥 Inbox"],["teams","👥 Teams"],["matches","🏓 Matches"],["payments","💰 Payments"],["dm","✉ Message"],["announce","📢 Announce"],["controls","⚙ Controls"],["log","📝 Log"]];
  const tdS=(s={})=>({padding:"9px 10px",borderBottom:`1px solid #f0f0ee`,fontSize:"13px",...s});

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px",flexWrap:"wrap"}}>
        <div style={{fontSize:mobile?"22px":"26px",fontWeight:"700",letterSpacing:"-.5px"}}>Admin Panel</div>
        <Tag c="amber">Jimmie · Ascend PB</Tag>
      </div>
      <div style={{fontSize:"11px",color:C.faint,textTransform:"uppercase",letterSpacing:".5px",marginBottom:"20px"}}>{SEASON} · Full access</div>
      <div style={{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"20px"}}>
        {tabs.map(([id,lbl])=><button key={id} style={btn(tab===id?C.text:C.gray,"#fff",{fontSize:"12px",padding:"7px 13px",minHeight:"40px"})} onClick={()=>setTab(id)}>{lbl}</button>)}
      </div>

      <div style={card()}>
        {/* SUMMARY */}
        {tab==="summary"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"16px"}}>League overview</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"10px",marginBottom:"16px"}}>
            {[
              {n:teams.filter(t=>t.approved).length,l:"Active teams",c:C.green},
              {n:teams.filter(t=>!t.approved).length,l:"Pending",c:C.amber},
              {n:matches.filter(m=>m.status==="completed"&&!m.cancelled).length,l:"Matches played",c:C.blue},
              {n:matches.filter(m=>m.status==="confirmed"&&!m.cancelled).length,l:"Upcoming",c:C.purple},
              {n:disputes.length,l:"Disputes",c:C.red},
              {n:`$${totalRev}`,l:"Revenue",c:C.green},
            ].map((x,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:"10px",padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:"24px",fontWeight:"800",color:x.c}}>{x.n}</div>
                <div style={{fontSize:"10px",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",marginTop:"4px"}}>{x.l}</div>
              </div>
            ))}
          </div>
          {pending.length>0&&<Alert type="warn">{pending.length} team{pending.length>1?"s":""} waiting for approval.</Alert>}
          {disputes.length>0&&<Alert type="error">{disputes.length} score dispute{disputes.length>1?"s":""} need resolution.</Alert>}
        </>}

        {/* PENDING */}
        {tab==="pending"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"14px"}}>Pending registrations ({pending.length})</div>
          {pending.length===0?<p style={{fontSize:"13px",color:C.muted}}>No pending registrations.</p>:
          pending.map(t=>(
            <div key={t.id} style={{background:C.bg,borderRadius:"12px",padding:"14px",marginBottom:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"6px",marginBottom:"10px"}}>
                <div>
                  <div style={{fontSize:"15px",fontWeight:"800"}}>{t.name}</div>
                  <div style={{fontSize:"12px",color:C.muted}}>{dL(t.division)}</div>
                </div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button style={btn(C.green,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>approve(t.id)}>✓ Approve</button>
                  <button style={btn(C.red,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>removeTeam(t.id)}>Remove</button>
                </div>
              </div>
              {/* Per-player payment rows */}
              {[
                {name:t.p1_name, email:t.p1_email, paid:t.p1_paid, onMark:()=>markP1Paid(t.id), label:"Player 1"},
                {name:t.p2_name, email:t.p2_email, paid:t.p2_paid, onMark:()=>markP2Paid(t.id), label:"Player 2"},
              ].map(({name,email,paid,onMark,label})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px",background:C.white,borderRadius:"8px",marginBottom:"6px",flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"13px",fontWeight:"600"}}>{label}: {name||"—"}</div>
                    <div style={{fontSize:"11px",color:C.faint}}>{email||"—"}</div>
                    {/* Phone number from profiles */}
                    <PhoneDisplay email={email}/>
                  </div>
                  <Tag c={paid?"green":"red"}>{paid?"✓ Paid $25":"Unpaid"}</Tag>
                  {!paid&&<button style={btn(C.amber,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"34px"})} onClick={onMark}>Mark paid</button>}
                </div>
              ))}
              {t.join_code&&(
                <div style={{fontSize:"11px",color:C.faint,marginTop:"6px"}}>Join code: <span style={{fontFamily:"monospace",fontWeight:"700",color:C.blue,letterSpacing:"2px"}}>{t.join_code}</span></div>
              )}
            </div>
          ))}
        </>}

        {/* DISPUTES */}
        {tab==="disputes"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"14px"}}>Score disputes ({disputes.length})</div>
          {disputes.length===0?<p style={{fontSize:"13px",color:C.muted}}>No disputes.</p>:
          disputes.map(m=>(
            <div key={m.id} style={{padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"3px"}}>{tName(m.t1_id)} vs {tName(m.t2_id)}</div>
              <div style={{fontSize:"12px",color:C.muted,marginBottom:"4px"}}>{fmtDate(m.match_date)} · {m.games?.map(g=>`${g.s1}-${g.s2}`).join("  ")||"No scores"}</div>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                <button style={btn(C.green,"#fff",{minHeight:"44px"})} onClick={()=>resolveDispute(m.id,m.t1_id,m.t2_id)}>{tName(m.t1_id)} won</button>
                <button style={btn(C.green,"#fff",{minHeight:"44px"})} onClick={()=>resolveDispute(m.id,m.t2_id,m.t1_id)}>{tName(m.t2_id)} won</button>
              </div>
            </div>
          ))}
        </>}

        {/* INBOX */}
        {tab==="inbox"&&<AdminInbox userId={userId} teams={teams} matches={matches}/>}

        {/* ALL TEAMS */}
        {tab==="teams"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"14px"}}>All teams ({teams.length})</div>
          {teams.map(t=>(
            <div key={t.id} style={{padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"8px",marginBottom:"8px"}}>
                <div>
                  <div style={{fontSize:"15px",fontWeight:"700"}}>{t.name}</div>
                  <div style={{fontSize:"12px",color:C.muted}}>{t.p1_name} ({t.p1_skill}) &amp; {t.p2_name} ({t.p2_skill}) · {t.p1_email}</div>
                  <div style={{display:"flex",gap:"5px",marginTop:"5px",flexWrap:"wrap"}}>
                    <Tag c={t.division==="low"?"gray":"blue"}>{dL(t.division)}</Tag>
                    <Tag c={t.paid?"green":"red"}>{t.paid?"Paid":"Unpaid"}</Tag>
                    <Tag c={t.approved?"green":"amber"}>{t.approved?"Active":"Pending"}</Tag>
                  </div>
                </div>
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                  <button style={btn(C.blue,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>setEditM({type:"team",id:t.id,...t})}>Edit</button>
                  <button style={btn(C.amber,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>resetRecord(t.id)}>Reset Record</button>
                  <button style={btn(C.red,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>removeTeam(t.id)}>Remove</button>
                </div>
              </div>
              {editM?.type==="team"&&editM.id===t.id&&(
                <div style={{background:C.bg,borderRadius:"8px",padding:"14px",marginTop:"8px"}}>
                  <div style={{fontSize:"14px",fontWeight:"700",marginBottom:"12px"}}>Edit team</div>
                  <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
                    {[["name","Team name"],["p1_name","Player 1 name"],["p1_skill","P1 skill"],["p2_name","Player 2 name"],["p2_skill","P2 skill"],["wins","Wins"],["losses","Losses"],["points","Points"]].map(([k,l])=>(
                      <div key={k}><Lbl>{l}</Lbl><input style={inp()} value={editM[k]||""} onChange={e=>setEditM(m=>({...m,[k]:e.target.value}))}/></div>
                    ))}
                    <div><Lbl>Division</Lbl><select style={{...inp(),appearance:"none"}} value={editM.division} onChange={e=>setEditM(m=>({...m,division:e.target.value}))}><option value="low">3.0–3.5</option><option value="high">3.5–4.0</option></select></div>
                    <div><Lbl>Paid</Lbl><select style={{...inp(),appearance:"none"}} value={editM.paid?"true":"false"} onChange={e=>setEditM(m=>({...m,paid:e.target.value==="true"}))}><option value="true">Yes</option><option value="false">No</option></select></div>
                    <div><Lbl>Approved</Lbl><select style={{...inp(),appearance:"none"}} value={editM.approved?"true":"false"} onChange={e=>setEditM(m=>({...m,approved:e.target.value==="true"}))}><option value="true">Yes</option><option value="false">No</option></select></div>
                  </div>
                  <div style={{display:"flex",gap:"8px"}}>
                    <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={saveTeamEdit}>Save changes</button>
                    <button style={btn(C.gray,"#fff",{minHeight:"44px"})} onClick={()=>setEditM(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>}

        {/* MATCHES */}
        {tab==="matches"&&<>
          {/* CREATE MATCH */}
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"4px"}}>Create match</div>
          <p style={{fontSize:"13px",color:C.muted,marginBottom:"14px"}}>Assign two teams manually. Optionally mark as already completed with a score.</p>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:"10px",marginBottom:"12px"}}>
            <div><Lbl>Team 1</Lbl><select style={{...inp(),appearance:"none"}} value={newMatch.t1} onChange={e=>setNewMatch(m=>({...m,t1:e.target.value}))}><option value="">Select...</option>{teams.filter(t=>t.approved).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
            <div><Lbl>Team 2</Lbl><select style={{...inp(),appearance:"none"}} value={newMatch.t2} onChange={e=>setNewMatch(m=>({...m,t2:e.target.value}))}><option value="">Select...</option>{teams.filter(t=>t.approved).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
            <div><Lbl>Division</Lbl><select style={{...inp(),appearance:"none"}} value={newMatch.div} onChange={e=>setNewMatch(m=>({...m,div:e.target.value}))}><option value="low">3.0–3.5</option><option value="high">3.5–4.0</option></select></div>
            <div><Lbl>Date</Lbl><input type="date" style={inp()} value={newMatch.date} onChange={e=>setNewMatch(m=>({...m,date:e.target.value}))}/></div>
            <div><Lbl>Time</Lbl><input type="time" style={inp()} value={newMatch.time} onChange={e=>setNewMatch(m=>({...m,time:e.target.value}))}/></div>
            <div><Lbl>Court</Lbl><input style={inp()} placeholder="Court name" value={newMatch.court} onChange={e=>setNewMatch(m=>({...m,court:e.target.value}))}/></div>
          </div>

          {/* Mark as completed toggle */}
          <label style={{display:"flex",gap:"12px",alignItems:"center",padding:"12px 14px",background:newMatch.asCompleted?C.greenBg:C.bg,border:`1.5px solid ${newMatch.asCompleted?C.green:C.border}`,borderRadius:"10px",cursor:"pointer",marginBottom:"14px",minHeight:"48px"}}>
            <div onClick={()=>setNewMatch(m=>({...m,asCompleted:!m.asCompleted}))} style={{width:"44px",height:"24px",borderRadius:"12px",background:newMatch.asCompleted?C.green:C.border,position:"relative",flexShrink:0,cursor:"pointer",transition:"background .2s"}}>
              <div style={{position:"absolute",top:"2px",left:newMatch.asCompleted?"22px":"2px",width:"20px",height:"20px",borderRadius:"50%",background:C.white,transition:"left .2s"}}/>
            </div>
            <div>
              <div style={{fontSize:"14px",fontWeight:"600",color:newMatch.asCompleted?C.green:C.text}}>Mark as completed match</div>
              <div style={{fontSize:"12px",color:C.muted}}>Use when manually entering a result that already happened</div>
            </div>
          </label>

          {/* Completed fields */}
          {newMatch.asCompleted&&<div style={{background:C.greenBg,border:`1px solid ${C.green}30`,borderRadius:"10px",padding:"14px",marginBottom:"14px"}}>
            <Lbl>Winner</Lbl>
            <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
              {[newMatch.t1,newMatch.t2].filter(Boolean).map(tid=>{
                const sel=newMatch.winner===tid;
                return<button key={tid} onClick={()=>setNewMatch(m=>({...m,winner:tid}))} style={{flex:1,padding:"12px",borderRadius:"10px",border:`2px solid ${sel?C.green:C.border}`,background:sel?C.greenBg:C.white,color:sel?C.green:C.text,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"14px",fontWeight:"700",minHeight:"48px"}}>{tName(tid)||"Select team above"}</button>;
              })}
              {!newMatch.t1&&!newMatch.t2&&<p style={{fontSize:"12px",color:C.muted}}>Select both teams above first.</p>}
            </div>

            <Lbl>Game scores — {tName(newMatch.t1)||"Team 1"} vs {tName(newMatch.t2)||"Team 2"}</Lbl>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px",padding:"0 2px"}}>
              <span style={{fontSize:"13px",fontWeight:"700",color:C.text}}>{tName(newMatch.t1)||"Team 1"}</span>
              <span style={{fontSize:"13px",color:C.faint}}>vs</span>
              <span style={{fontSize:"13px",fontWeight:"700",color:C.text,textAlign:"right"}}>{tName(newMatch.t2)||"Team 2"}</span>
            </div>
            {[1,2,3].map(g=>(
              <div key={g} style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px",background:C.white,borderRadius:"12px",padding:"12px 14px",border:`1px solid ${C.border}`}}>
                <span style={{fontSize:"12px",color:C.muted,width:"64px",flexShrink:0,fontWeight:"600"}}>{g===3?"Game 3*":`Game ${g}`}</span>
                <div style={{display:"flex",alignItems:"center",gap:"10px",flex:1}}>
                  <input
                    type="number" min="0" max="25" inputMode="numeric"
                    placeholder="0"
                    value={newMatch[`g${g}s1`]||""}
                    onChange={e=>setNewMatch(m=>({...m,[`g${g}s1`]:e.target.value}))}
                    style={{width:"0",flex:1,textAlign:"center",fontSize:"26px",fontWeight:"800",background:"#f9f9f9",border:`2px solid ${newMatch[`g${g}s1`]?"#111":C.border}`,borderRadius:"12px",padding:"10px 4px",outline:"none",fontFamily:"'DM Sans',sans-serif",minWidth:"0",color:C.text,WebkitAppearance:"none",MozAppearance:"textfield"}}
                  />
                  <span style={{fontSize:"20px",color:"#ccc",flexShrink:0}}>—</span>
                  <input
                    type="number" min="0" max="25" inputMode="numeric"
                    placeholder="0"
                    value={newMatch[`g${g}s2`]||""}
                    onChange={e=>setNewMatch(m=>({...m,[`g${g}s2`]:e.target.value}))}
                    style={{width:"0",flex:1,textAlign:"center",fontSize:"26px",fontWeight:"800",background:"#f9f9f9",border:`2px solid ${newMatch[`g${g}s2`]?"#111":C.border}`,borderRadius:"12px",padding:"10px 4px",outline:"none",fontFamily:"'DM Sans',sans-serif",minWidth:"0",color:C.text,WebkitAppearance:"none",MozAppearance:"textfield"}}
                  />
                </div>
              </div>
            ))}
            <p style={{fontSize:"11px",color:C.faint,marginTop:"4px"}}>* Game 3 only if needed · Left = {tName(newMatch.t1)||"Team 1"} · Right = {tName(newMatch.t2)||"Team 2"}</p>
          </div>}

          <button style={btn(newMatch.asCompleted?C.green:C.text,"#fff",{minHeight:"44px",marginBottom:"24px",minWidth:"180px"})} onClick={createMatch} disabled={!newMatch.t1||!newMatch.t2||(newMatch.asCompleted&&!newMatch.winner)}>
            {newMatch.asCompleted?"Create & Record Result":"Create Match"}
          </button>

          <div style={{height:"1px",background:C.border,marginBottom:"20px"}}/>

          {/* ALL MATCHES — edit, delete */}
          <div style={{fontSize:"15px",fontWeight:"700",marginBottom:"4px"}}>All matches</div>
          <p style={{fontSize:"13px",color:C.muted,marginBottom:"14px"}}>Edit scores or delete any match. Deleting a completed match rolls back standings.</p>
          {matches.filter(m=>!m.cancelled).slice(0,40).map(m=>(
            <div key={m.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"8px"}}>
                <div>
                  <div style={{fontWeight:"700",fontSize:"14px"}}>{tName(m.t1_id)} vs {tName(m.t2_id)}</div>
                  <div style={{fontSize:"12px",color:C.muted}}>{fmtDate(m.match_date)}{m.games?.length>0?` · ${m.games.map(g=>`${g.s1}-${g.s2}`).join("  ")}`:""}</div>
                  <Tag c={m.status==="completed"?"gray":m.status==="confirmed"?"green":m.status==="disputed"?"red":"amber"}>{m.status}</Tag>
                </div>
                <div style={{display:"flex",gap:"6px"}}>
                  <button style={btn(C.blue,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>setEditM(editM?.id===m.id?null:{type:"score",id:m.id,...m})}>Edit</button>
                  <button style={btn(C.red,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>deleteMatch(m.id)}>Delete</button>
                </div>
              </div>
              {editM?.type==="score"&&editM.id===m.id&&(
                <div style={{background:C.bg,borderRadius:"10px",padding:"16px",marginTop:"10px"}}>
                  <div style={{fontSize:"13px",fontWeight:"700",marginBottom:"14px"}}>Override score for {tName(m.t1_id)} vs {tName(m.t2_id)}</div>
                  <Lbl>Winner</Lbl>
                  <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
                    {[m.t1_id,m.t2_id].map(tid=>{
                      const sel=(editScores[m.id]?.winner_id)===tid;
                      return <button key={tid} onClick={()=>setEditScores(s=>({...s,[m.id]:{...(s[m.id]||{t1_id:m.t1_id,t2_id:m.t2_id}),winner_id:tid}}))} style={{flex:1,padding:"12px",borderRadius:"8px",border:`2px solid ${sel?C.green:C.border}`,background:sel?C.greenBg:C.white,color:sel?C.green:C.text,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"14px",fontWeight:"700",minHeight:"48px"}}>{tName(tid)}</button>;
                    })}
                  </div>
                  <Lbl>Game scores</Lbl>
                  <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"14px"}}>
                    {[1,2,3].map(g=>(
                      <div key={g} style={{display:"flex",alignItems:"center",gap:"10px",background:C.white,border:`1px solid ${C.border}`,borderRadius:"10px",padding:"10px 14px"}}>
                        <span style={{fontSize:"12px",color:C.muted,width:"60px",flexShrink:0,fontWeight:"600"}}>{g===3?"Game 3*":`Game ${g}`}</span>
                        <div style={{display:"flex",alignItems:"center",gap:"10px",flex:1}}>
                          <input
                            type="number" min="0" max="25" inputMode="numeric"
                            placeholder="0"
                            value={(editScores[m.id]||{})[`g${g}s1`]||""}
                            onChange={e=>setEditScores(s=>({...s,[m.id]:{...(s[m.id]||{}),t1_id:m.t1_id,t2_id:m.t2_id,[`g${g}s1`]:e.target.value}}))}
                            style={{width:"0",flex:1,textAlign:"center",fontSize:"22px",fontWeight:"800",background:"#f9f9f9",border:`2px solid ${(editScores[m.id]||{})[`g${g}s1`]?"#111":C.border}`,borderRadius:"8px",padding:"8px 4px",outline:"none",fontFamily:"'DM Sans',sans-serif",minWidth:"0",color:C.text,WebkitAppearance:"none",MozAppearance:"textfield"}}
                          />
                          <span style={{fontSize:"18px",color:"#ccc",flexShrink:0}}>—</span>
                          <input
                            type="number" min="0" max="25" inputMode="numeric"
                            placeholder="0"
                            value={(editScores[m.id]||{})[`g${g}s2`]||""}
                            onChange={e=>setEditScores(s=>({...s,[m.id]:{...(s[m.id]||{}),t1_id:m.t1_id,t2_id:m.t2_id,[`g${g}s2`]:e.target.value}}))}
                            style={{width:"0",flex:1,textAlign:"center",fontSize:"22px",fontWeight:"800",background:"#f9f9f9",border:`2px solid ${(editScores[m.id]||{})[`g${g}s2`]?"#111":C.border}`,borderRadius:"8px",padding:"8px 4px",outline:"none",fontFamily:"'DM Sans',sans-serif",minWidth:"0",color:C.text,WebkitAppearance:"none",MozAppearance:"textfield"}}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:"8px"}}>
                    <button style={btn(C.text,"#fff",{minHeight:"44px",flex:1})} onClick={()=>saveScore(m.id)}>Save & Update Standings</button>
                    <button style={btn(C.gray,"#fff",{minHeight:"44px"})} onClick={()=>setEditM(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>}

        {/* PAYMENTS */}
        {tab==="payments"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"16px"}}>Payment tracker</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:"10px",marginBottom:"20px"}}>
            {[
              {n:teams.filter(t=>t.p1_paid).length,  l:"P1 Paid",    c:C.green},
              {n:teams.filter(t=>t.p2_paid).length,  l:"P2 Paid",    c:C.green},
              {n:teams.filter(t=>!t.p1_paid).length, l:"P1 Unpaid",  c:C.red},
              {n:teams.filter(t=>!t.p2_paid).length, l:"P2 Unpaid",  c:C.red},
              {n:teams.length,                        l:"Teams",      c:C.blue},
              {n:`$${(teams.filter(t=>t.p1_paid).length+teams.filter(t=>t.p2_paid).length)*25}`, l:"Revenue", c:C.purple},
            ].map((x,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:"10px",padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:"22px",fontWeight:"800",color:x.c}}>{x.n}</div>
                <div style={{fontSize:"10px",color:C.muted,textTransform:"uppercase",letterSpacing:".8px",marginTop:"4px"}}>{x.l}</div>
              </div>
            ))}
          </div>
          <div className="tscroll">
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:"480px"}}>
              <thead><tr>{["Team","Division","P1 Paid","P2 Paid","Actions"].map(h=><th key={h} style={{textAlign:"left",color:C.muted,fontSize:"11px",fontWeight:"600",letterSpacing:".8px",textTransform:"uppercase",padding:"8px 10px",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>{teams.map(t=>(
                <tr key={t.id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <td style={tdS({fontWeight:"700"})}>
                    {t.name}
                    <div style={{fontSize:"11px",color:C.faint}}>{t.p1_name} &amp; {t.p2_name}</div>
                  </td>
                  <td style={tdS()}><Tag c={t.division==="low"?"gray":"blue"}>{dL(t.division)}</Tag></td>
                  <td style={tdS()}>
                    <Tag c={t.p1_paid?"green":"red"}>{t.p1_paid?"✓ Paid":"Unpaid"}</Tag>
                    <div style={{fontSize:"10px",color:C.faint,marginTop:"2px"}}>{t.p1_name}</div>
                  </td>
                  <td style={tdS()}>
                    <Tag c={t.p2_paid?"green":"red"}>{t.p2_paid?"✓ Paid":"Unpaid"}</Tag>
                    <div style={{fontSize:"10px",color:C.faint,marginTop:"2px"}}>{t.p2_name||"P2 not joined"}</div>
                  </td>
                  <td style={tdS()}>
                    <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                      {!t.p1_paid&&<button style={btn(C.amber,"#fff",{fontSize:"10px",padding:"4px 8px",minHeight:"30px"})} onClick={()=>markP1Paid(t.id)}>P1 paid</button>}
                      {!t.p2_paid&&<button style={btn(C.amber,"#fff",{fontSize:"10px",padding:"4px 8px",minHeight:"30px"})} onClick={()=>markP2Paid(t.id)}>P2 paid</button>}
                      {!t.approved&&t.p1_paid&&t.p2_paid&&<button style={btn(C.green,"#fff",{fontSize:"10px",padding:"4px 8px",minHeight:"30px"})} onClick={()=>approve(t.id)}>Approve</button>}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>}

        {/* DIRECT MESSAGE */}
        {tab==="dm"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"14px"}}>Direct message to team</div>
          <Lbl>Select team</Lbl><select style={{...inp(),appearance:"none",marginBottom:"12px"}} value={dmTeam} onChange={e=>setDmTeam(e.target.value)}><option value="">Choose a team...</option>{teams.filter(t=>t.approved).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <Lbl>Subject</Lbl><input style={{...inp(),marginBottom:"12px"}} placeholder="e.g. Score dispute follow-up" value={dmSubj} onChange={e=>setDmSubj(e.target.value)}/>
          <Lbl>Message</Lbl><textarea style={{...inp({minHeight:"100px",resize:"vertical"}),marginBottom:"14px"}} placeholder="Write your message..." value={dmBody} onChange={e=>setDmBody(e.target.value)}/>
          <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={sendDm} disabled={!dmTeam||!dmSubj||!dmBody}>Send Message</button>
        </>}

        {/* ANNOUNCE */}
        {tab==="announce"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"4px"}}>Post announcement</div>
          <p style={{fontSize:"13px",color:C.muted,marginBottom:"14px"}}>Posts to BOTH division chats simultaneously as "League Admin".</p>
          <Lbl>Message</Lbl><textarea style={{...inp({minHeight:"100px",resize:"vertical"}),marginBottom:"14px"}} value={annTxt} placeholder="e.g. Week 4 window opens Monday. Get your matches scheduled!" onChange={e=>setAnnTxt(e.target.value)}/>
          <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={postAnn}>Post to all divisions</button>
        </>}

        {/* CONTROLS */}
        {tab==="controls"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"16px"}}>League controls</div>
          <div style={{marginBottom:"20px"}}>
            <Lbl>Pinned banner (shows on all dashboards)</Lbl>
            <input style={{...inp(),marginBottom:"10px"}} placeholder="e.g. Week 4 closes Sunday midnight — get your matches in!" value={bannerDraft} onChange={e=>setBannerDraft(e.target.value)}/>
            <div style={{display:"flex",gap:"8px"}}>
              <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={saveBanner}>Set Banner</button>
              {adminBanner&&<button style={btn(C.red,"#fff",{minHeight:"44px"})} onClick={()=>{setBannerDraft("");setAdminBanner(null);}}>Clear Banner</button>}
            </div>
          </div>
          <div style={{marginBottom:"20px"}}>
            <Lbl>Current week deadline (shown in schedule)</Lbl>
            <input style={{...inp(),marginBottom:"10px"}} placeholder="e.g. Week 3 closes Sunday Mar 23 at 11:59 PM" value={deadlineDraft} onChange={e=>setDeadlineDraft(e.target.value)}/>
            <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={saveDeadline}>Set Deadline</button>
          </div>
        </>}

        {/* ACTIVITY LOG */}
        {tab==="log"&&<>
          <div style={{fontSize:"16px",fontWeight:"700",marginBottom:"14px"}}>Admin activity log</div>
          {log.length===0?<p style={{fontSize:"13px",color:C.muted}}>No activity logged yet.</p>:
          log.map((l,i)=>(
            <div key={i} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",gap:"10px",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"13px",fontWeight:"600"}}>{l.action}</div>
                  {l.details&&<div style={{fontSize:"12px",color:C.muted,marginTop:"2px"}}>{l.details}</div>}
                </div>
                <div style={{fontSize:"11px",color:C.faint,whiteSpace:"nowrap"}}>{timeAgo(l.created_at)}</div>
              </div>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────
function BottomNav({ tab, setTab, isAdmin, unreadCount, openRequestCount }) {
  const navTabs=isAdmin
    ?[["dashboard","Home"],["board","Board"],["scores","Scores"],["standings","Ranks"],["chat","Chat"],["admin","Admin"]]
    :[["dashboard","Home"],["board","Board"],["scores","Scores"],["standings","Ranks"],["chat","Chat"]];
  const iconMap={dashboard:"home",board:"board",scores:"scores",standings:"standings",chat:"chat",admin:"admin"};
  return(
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:100,height:"64px",paddingBottom:"env(safe-area-inset-bottom)"}}>
      {navTabs.map(([id,label])=>(
        <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"3px",color:tab===id?C.blue:C.faint,fontSize:"10px",fontWeight:tab===id?"700":"500",borderTop:`2px solid ${tab===id?C.blue:"transparent"}`,position:"relative",minHeight:"64px"}}>
          <Icon n={iconMap[id]} size={20}/>
          {label}
          {id==="chat"&&unreadCount>0&&<span style={{position:"absolute",top:"6px",right:"calc(50% - 20px)",background:C.red,color:"#fff",borderRadius:"10px",minWidth:"18px",height:"18px",fontSize:"10px",fontWeight:"800",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{unreadCount>99?"99+":unreadCount}</span>}
        </button>
      ))}
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────
export default function App() {
  useFonts();
  const mobile=useMobile();
  const [session,       setSession]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [userId,        setUserId]        = useState(null);
  const [userEmail,     setUserEmail]     = useState("");
  const [myTeam,        setMyTeam]        = useState(null);
  const [isAdmin,       setIsAdmin]       = useState(false);
  const [tab,           setTab]           = useState("dashboard");
  const [division,      setDivision]      = useState("low");
  const [teams,         setTeams]         = useState([]);
  const [matches,       setMatches]       = useState([]);
  const [requests,      setRequests]      = useState([]);
  const [needsRegistration, setNeedsRegistration] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [pendingCode, setPendingCode] = useState(null); // {code, teamName, p2Name, p2Email, uid}
  const [notifications, setNotifications] = useState([]);
  const [showNotifs,    setShowNotifs]    = useState(false);
  const [activeChat,    setActiveChat]    = useState(null);
  const [cancelMatch,   setCancelMatch]   = useState(null);
  const [showReport,    setShowReport]    = useState(false);
  const [showNotifPrefs,setShowNotifPrefs]= useState(false);
  const [adminBanner,   setAdminBanner]   = useState(null);
  const [weekDeadline,  setWeekDeadline]  = useState(null);
  const [adminPauseChat,setAdminPauseChat]= useState(false);

  const unread   =notifications.filter(n=>!n.read).length;
  const msgUnread=notifications.filter(n=>!n.read&&["message","match_message","division_message"].includes(n.type)).length;
  const openRequestCount=requests.filter(r=>r.status==="open"&&r.division===(myTeam?.division||"low")).length;

  // Ref shadow of registering state — lets onAuthStateChange read it without stale closure
  const registeringRef = useRef(false);
  const setRegisteringSync = (v) => { registeringRef.current = v; setRegistering(v); };
  // Only true when user actively clicked Google sign-in — prevents stale sessions from routing to registration
  const freshOAuthRef = useRef(false);

  useEffect(()=>{
    let initialLoad = true;
    sb.auth.getSession().then(({data})=>{
      setSession(data.session);
      if(data.session) loadUser(data.session.user.id, false); // page load — NOT a fresh OAuth
      else setLoading(false);
      // Mark initial load done after a tick so onAuthStateChange can detect new vs existing
      setTimeout(()=>{ initialLoad = false; }, 500);
    });
    const{data:sub}=sb.auth.onAuthStateChange((_,session)=>{
      setSession(session);
      if(session){
        if(!registeringRef.current){
          const isFresh = !initialLoad; // true only for new sign-ins, not page load
          freshOAuthRef.current = isFresh;
          loadUser(session.user.id, isFresh);
        }
      } else {
        freshOAuthRef.current = false;
        setMyTeam(null);setIsAdmin(false);setLoading(false);
        setRegisteringSync(false);setPendingCode(null);
        setNeedsRegistration(null);setUserEmail("");setUserId(null);
      }
    });
    return()=>sub.subscription.unsubscribe();
  },[]);

  const loadUser=async(uid, isFresh=false)=>{
    setUserId(uid);
    const{data:{user:authUser}}=await sb.auth.getUser();
    const email=authUser?.email||"";
    setUserEmail(email);
    const{data:profile}=await sb.from("profiles").select("*").eq("id",uid).single();

    // No profile — brand new user
    if(!profile){
      const name=authUser?.user_metadata?.full_name||authUser?.user_metadata?.name||"";
      try{await sb.from("profiles").upsert({id:uid,email});}catch(e){}
      const[{data:teamAsP1},{data:teamAsP2}]=await Promise.all([
        sb.from("teams").select("*").eq("p1_email",email).maybeSingle(),
        sb.from("teams").select("*").eq("p2_email",email).maybeSingle(),
      ]);
      const foundTeam = teamAsP1 || teamAsP2;
      if(foundTeam){
        try{await sb.from("profiles").update({team_id:foundTeam.id}).eq("id",uid);}catch(e){}
        setMyTeam(foundTeam);setDivision(foundTeam.division);
      } else if(isFresh){
        // Only route to registration if user just signed in (not a stale page load)
        setNeedsRegistration({uid,email,name});
        setLoading(false);
        return;
      } else {
        // Stale session with no team — sign out cleanly, show login
        await sb.auth.signOut();
        setLoading(false);
        return;
      }
    } else if(!profile.team_id && !profile.is_admin){
      const[{data:teamAsP1},{data:teamAsP2}]=await Promise.all([
        sb.from("teams").select("*").eq("p1_email",email).maybeSingle(),
        sb.from("teams").select("*").eq("p2_email",email).maybeSingle(),
      ]);
      const foundTeam = teamAsP1 || teamAsP2;
      if(foundTeam){
        try{await sb.from("profiles").update({team_id:foundTeam.id}).eq("id",uid);}catch(e){}
        if(teamAsP2&&!teamAsP2.p2_joined){
          try{await sb.from("teams").update({p2_joined:true,p2_email:email}).eq("id",foundTeam.id);}catch(e){}
        }
        setMyTeam(foundTeam);setDivision(foundTeam.division);
      } else if(isFresh){
        // Fresh OAuth with no team — route to registration
        const name=authUser?.user_metadata?.full_name||authUser?.user_metadata?.name||"";
        setNeedsRegistration({uid, email, name});
        setLoading(false);
        return;
      } else {
        // Stale session, profile exists but no team — sign out cleanly
        await sb.auth.signOut();
        setLoading(false);
        return;
      }
    } else {
      if(profile.is_admin)setIsAdmin(true);
      if(profile.team_id){
        const{data:team}=await sb.from("teams").select("*").eq("id",profile.team_id).single();
        if(team){setMyTeam(team);setDivision(team.division);}
      } else {
        // No team_id — try to find team by email (covers admin users who also have a team)
        const email=profile.email||"";
        const[{data:asP1},{data:asP2}]=await Promise.all([
          sb.from("teams").select("*").eq("p1_email",email).maybeSingle(),
          sb.from("teams").select("*").eq("p2_email",email).maybeSingle(),
        ]);
        const found=asP1||asP2;
        if(found){
          try{await sb.from("profiles").update({team_id:found.id}).eq("id",uid);}catch(e){}
          setMyTeam(found);setDivision(found.division);
        }
      }
    }
    const{data:notifs}=await sb.from("notifications").select("*").eq("user_id",uid).order("created_at",{ascending:false}).limit(50);
    if(notifs)setNotifications(notifs);
    const notifCh=sb.channel(`notifs-${uid}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:`user_id=eq.${uid}`},p=>{
        setNotifications(prev=>[p.new,...prev]);
      }).subscribe();
    await loadData();
    setLoading(false);
  };

  const loadData=useCallback(async()=>{
    const[{data:t},{data:m},{data:r}]=await Promise.all([
      sb.from("teams").select("*").order("points",{ascending:false}),
      sb.from("matches").select("*").order("created_at",{ascending:false}),
      sb.from("match_requests").select("*,responses:request_responses(*)").order("created_at",{ascending:false}),
    ]);
    if(t)setTeams(t);if(m)setMatches(m);if(r)setRequests(r);
  },[]);

  // Real-time subscriptions — auto-update without refresh
  useEffect(()=>{
    if(!session)return;
    const teamsCh=sb.channel("rt-teams")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"teams"},p=>{
        setTeams(prev=>[...prev,p.new].sort((a,b)=>b.points-a.points||b.wins-a.wins));
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"teams"},p=>{
        setTeams(prev=>prev.map(x=>x.id===p.new.id?p.new:x).sort((a,b)=>b.points-a.points||b.wins-a.wins));
        if(p.new?.id===myTeam?.id)setMyTeam(p.new);
      })
      .on("postgres_changes",{event:"DELETE",schema:"public",table:"teams"},p=>{
        if(p.old?.id){
          setTeams(prev=>prev.filter(x=>x.id!==p.old.id));
        } else {
          sb.from("teams").select("*").order("points",{ascending:false}).then(({data})=>{if(data)setTeams(data);});
        }
      })
      .subscribe();
    // Track deleted/cancelled IDs to protect during realtime race window
    const deletedMatchIds = new Set();
    const cancelledMatchIds = new Set();

    const matchesCh=sb.channel("rt-matches")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"matches"},p=>{
        if(deletedMatchIds.has(p.new.id))return;
        setMatches(prev=>{
          if(prev.find(x=>x.id===p.new.id))return prev;
          return [p.new,...prev];
        });
      })
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"matches"},p=>{
        if(deletedMatchIds.has(p.new.id))return;
        if(cancelledMatchIds.has(p.new.id)){
          setMatches(prev=>prev.map(x=>x.id===p.new.id?{...p.new,cancelled:true}:x));
          return;
        }
        setMatches(prev=>prev.map(x=>x.id===p.new.id?p.new:x));
      })
      .on("postgres_changes",{event:"DELETE",schema:"public",table:"matches"},p=>{
        const id=p.old?.id;
        if(id){
          deletedMatchIds.add(id);
          setMatches(prev=>prev.filter(x=>x.id!==id));
        }
      })
      .subscribe();

    window.__deletedMatchIds   = deletedMatchIds;
    window.__cancelledMatchIds = cancelledMatchIds;
    const requestsCh=sb.channel("rt-requests")
      .on("postgres_changes",{event:"*",schema:"public",table:"match_requests"},()=>{
        sb.from("match_requests").select("*,responses:request_responses(*)").order("created_at",{ascending:false}).then(({data})=>{if(data)setRequests(data);});
      }).subscribe();
    const responsesCh=sb.channel("rt-responses")
      .on("postgres_changes",{event:"*",schema:"public",table:"request_responses"},()=>{
        sb.from("match_requests").select("*,responses:request_responses(*)").order("created_at",{ascending:false}).then(({data})=>{if(data)setRequests(data);});
      }).subscribe();
    return()=>{
      sb.removeChannel(teamsCh);
      sb.removeChannel(matchesCh);
      sb.removeChannel(requestsCh);
      sb.removeChannel(responsesCh);
    };
  },[session]);

  const signOut=async()=>{
    // Full hard reset — clears Supabase session, localStorage tokens, and all app state
    await sb.auth.signOut({scope:"global"});
    // Clear any lingering Supabase tokens from localStorage
    Object.keys(localStorage).forEach(k=>{
      if(k.startsWith("sb-")||k.includes("supabase"))localStorage.removeItem(k);
    });
    setSession(null);
    setMyTeam(null);
    setIsAdmin(false);
    setUserId(null);
    setUserEmail("");
    setNeedsRegistration(null);
    setRegistering(false);
    setPendingCode(null);
    setTeams([]);
    setMatches([]);
    setRequests([]);
    setNotifications([]);
  };

  // Shared helper — fetch fresh matches and teams from DB
  const refreshMatchesAndTeams=async()=>{
    const[{data:m},{data:t}]=await Promise.all([
      sb.from("matches").select("*").order("created_at",{ascending:false}),
      sb.from("teams").select("*").order("points",{ascending:false}),
    ]);
    if(m)setMatches(m);
    if(t)setTeams(t);
  };

  const handleCancelMatch=async(match,reason)=>{
    setCancelMatch(null);
    // Optimistic — remove from active view immediately
    setMatches(p=>p.map(m=>m.id===match.id?{...m,cancelled:true,cancel_reason:reason}:m));
    // Write to DB
    const{error}=await sb.from("matches").update({
      cancelled:true,
      cancel_reason:reason,
      updated_at:new Date().toISOString()
    }).eq("id",match.id);
    if(error){
      alert("Error cancelling match: "+error.message+"\n\nPlease ask admin to cancel.");
      // Revert optimistic update
      setMatches(p=>p.map(m=>m.id===match.id?{...m,cancelled:false,cancel_reason:null}:m));
      return;
    }
    // Also log to cancellations table
    try{await sb.from("match_cancellations").insert({match_id:match.id,cancelled_by:myTeam.id,reason});}catch(e){}
    // Full refresh so all views are in sync
    await refreshMatchesAndTeams();
  };

  if(loading)return(
    <div style={{background:"#0a0a0a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",gap:"0px"}}>
      <style>{`
        @keyframes ascend-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.15; transform:scale(0.78); }
        }
        .ascend-loader { animation: ascend-pulse 2s ease-in-out infinite; }
      `}</style>
      <img
        className="ascend-loader"
        src={LOGO_BLUE_URL}
        alt="Ascend Pickleball"
        style={{width:"96px",height:"96px",objectFit:"contain",mixBlendMode:"screen"}}
        onError={e=>{
          // Fallback to black logo with multiply blend if blue version not yet uploaded
          e.target.src=LOGO_URL;
          e.target.style.mixBlendMode="screen";
          e.target.style.filter="invert(1) sepia(1) saturate(5) hue-rotate(175deg)";
        }}
      />
      <div style={{fontSize:"12px",color:"#333",letterSpacing:"1.5px",textTransform:"uppercase",marginTop:"32px"}}>Loading...</div>
    </div>
  );

  // Code modal renderer — used at every render gate
  const CodeModal = pendingCode ? (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{...card(),width:"100%",maxWidth:"420px",textAlign:"center",animation:"fadeIn .2s ease"}}>
        <div style={{fontSize:"36px",marginBottom:"8px"}}>🏓</div>
        <div style={{fontSize:"22px",fontWeight:"800",marginBottom:"4px"}}>You're registered!</div>
        <p style={{fontSize:"13px",color:C.muted,marginBottom:"18px",lineHeight:"1.6"}}>
          Share this code with <strong>{pendingCode.p2Name}</strong> so they can create their account and join the team.
        </p>
        <div style={{background:"#1d1d1f",borderRadius:"14px",padding:"20px",marginBottom:"14px"}}>
          <div style={{fontSize:"11px",fontWeight:"700",color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"10px"}}>Team join code</div>
          <div style={{fontSize:"48px",fontWeight:"900",color:"#00BFFF",letterSpacing:"10px",fontFamily:"monospace",lineHeight:"1"}}>{pendingCode.code}</div>
          <div style={{fontSize:"12px",color:"rgba(255,255,255,.4)",marginTop:"10px"}}>app.ascendpb.com → "Join with team code"</div>
        </div>
        <div style={{background:C.bg,borderRadius:"10px",padding:"12px 14px",marginBottom:"12px",textAlign:"left",fontSize:"13px",color:C.text,lineHeight:"1.8"}}>
          <strong>Send {pendingCode.p2Name} these steps:</strong><br/>
          1. Go to app.ascendpb.com<br/>
          2. Tap <strong>"Join with team code"</strong><br/>
          3. Enter: <strong style={{color:"#00BFFF",fontFamily:"monospace",letterSpacing:"2px"}}>{pendingCode.code}</strong><br/>
          4. Create their account &amp; pay $25
        </div>
        <div style={{background:"#eff6ff",borderRadius:"8px",padding:"10px 12px",marginBottom:"16px",fontSize:"12px",color:C.blue,textAlign:"left"}}>
          💡 You can always find this code in <strong>Settings</strong> if you need to reshare it later.
        </div>
        <button style={btn(C.blue,"#fff",{width:"100%",marginBottom:"10px",minHeight:"46px",fontWeight:"700"})} onClick={()=>{
          const text=`Hey ${pendingCode.p2Name}! I registered us for the Ascend PB Flex League 🏓\n\n1. Go to app.ascendpb.com\n2. Tap "Join with team code"\n3. Enter: ${pendingCode.code}\n4. Create your account & pay $25\n\nSee you on the courts!`;
          if(navigator.share)navigator.share({text});
          else{navigator.clipboard.writeText(text);alert("Copied to clipboard!");}
        }}>📤 Share with {pendingCode.p2Name}</button>
        <button style={btn(C.text,"#fff",{width:"100%",minHeight:"44px"})} onClick={async()=>{
          const uid=pendingCode.uid;
          setPendingCode(null);
          setRegisteringSync(false);
          if(uid) await loadUser(uid);
          else{const{data:{session:s}}=await sb.auth.getSession();if(s)await loadUser(s.user.id);}
        }}>Go to my dashboard →</button>
      </div>
    </div>
  ) : null;

  if(!session||registering)return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif"}}>
      {CodeModal}
      <AuthScreen
        onRegistrationStart={()=>setRegisteringSync(true)}
        onRegistrationDone={(result)=>{
          setPendingCode(result);
        }}
      />
    </div>
  );
  if(needsRegistration)return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif"}}>
      {CodeModal}
      <AuthScreen
        oauthUser={needsRegistration}
        onRegistrationStart={()=>setRegisteringSync(true)}
        onRegistrationDone={(result)=>{
          setPendingCode(result);
          setNeedsRegistration(null);
        }}
        onRegistered={(team)=>{setMyTeam(team);setDivision(team.division);setNeedsRegistration(null);setRegisteringSync(false);}}
      />
    </div>
  );

  const navTabs=isAdmin
    ?[["dashboard","Dashboard"],["board","Match Board"],["scores","My Matches"],["standings","Standings"],["chat","Chat"],["schedule","Schedule"],["admin","Admin"],["settings","Settings"]]
    :[["dashboard","Dashboard"],["board","Match Board"],["scores","My Matches"],["standings","Standings"],["chat","Chat"],["schedule","Schedule"],["settings","Settings"]];

  return(
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",color:C.text,paddingBottom:mobile?"74px":"0"}}>

      {/* ROOT-LEVEL CODE MODAL */}
      {CodeModal}

      {/* Week deadline banner */}
      {weekDeadline&&<div style={{background:C.amber,color:"#fff",textAlign:"center",padding:"8px 16px",fontSize:"13px",fontWeight:"600"}}>⏰ {weekDeadline}</div>}

      {/* Top nav */}
      <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"0 16px",display:"flex",alignItems:"center",gap:"2px",position:"sticky",top:0,zIndex:100,height:"52px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px",marginRight:mobile?"8px":"16px",cursor:"pointer"}} onClick={()=>setTab("dashboard")}>
          <AscendMark height={30}/>
        </div>
        {!mobile&&<>
          <div style={{width:"1px",height:"22px",background:C.border,margin:"0 6px"}}/>
          {navTabs.map(([id,lbl])=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:tab===id?"#111":"transparent",border:"none",color:tab===id?"#fff":C.muted,padding:"6px 10px",borderRadius:"6px",cursor:"pointer",fontSize:"13px",fontWeight:tab===id?"600":"500",transition:"all .12s",whiteSpace:"nowrap",position:"relative"}}>
              {lbl}
              {id==="chat"&&msgUnread>0&&<span style={{position:"absolute",top:"2px",right:"2px",background:C.red,color:"#fff",borderRadius:"10px",minWidth:"16px",height:"16px",fontSize:"9px",fontWeight:"800",display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"0 3px"}}>{msgUnread>99?"99+":msgUnread}</span>}
            </button>
          ))}
        </>}
        <div style={{flex:1}}/>
        {/* Version badge */}
        <span style={{fontSize:"11px",color:"#bbb",fontWeight:"500",marginRight:"10px",letterSpacing:".3px",userSelect:"none"}}>{APP_VERSION}</span>
        {myTeam&&!mobile&&<span style={{fontSize:"12px",color:C.faint,marginRight:"8px"}}>{myTeam.name}</span>}
        {!mobile&&<button style={btn(C.gray,"#fff",{fontSize:"12px",padding:"6px 12px",minHeight:"40px"})} onClick={signOut}>Sign out</button>}
        {mobile&&<button onClick={()=>setTab("settings")} style={{background:"none",border:"none",cursor:"pointer",color:tab==="settings"?C.blue:C.muted,padding:"8px",minWidth:"44px",minHeight:"44px",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon n="settings" size={20}/>{unread>0&&<span style={{position:"absolute",top:"8px",right:"8px",background:C.red,color:"#fff",borderRadius:"50%",width:"14px",height:"14px",fontSize:"9px",fontWeight:"800",display:"flex",alignItems:"center",justifyContent:"center"}}>{unread>9?"9+":unread}</span>}</button>}
      </nav>

      {/* Page */}
      <div style={{padding:mobile?"16px 14px":"28px 20px",maxWidth:"960px",margin:"0 auto"}}>

        {/* PAYMENT PENDING — shows on every tab until team is approved */}
        {myTeam&&!myTeam.approved&&(()=>{
          const p1Paid=myTeam.p1_paid;
          const p2Paid=myTeam.p2_paid;
          const bothPaid=p1Paid&&p2Paid;
          const iAmP1=myTeam.p1_email?.toLowerCase()===userEmail?.toLowerCase();
          const iAmP2=myTeam.p2_email?.toLowerCase()===userEmail?.toLowerCase();
          const myPaid=iAmP1?p1Paid:iAmP2?p2Paid:false;
          return(
            <div style={{background:"#fffbeb",border:"1.5px solid #fde68a",borderRadius:"12px",padding:"16px",marginBottom:"18px"}}>
              <div style={{fontSize:"14px",fontWeight:"700",color:"#78350f",marginBottom:"10px"}}>⏳ Team pending activation</div>
              <div style={{display:"flex",flexDirection:"column",gap:"6px",marginBottom:"12px"}}>
                {[
                  {name:myTeam.p1_name,paid:p1Paid,label:"Player 1"},
                  {name:myTeam.p2_name,paid:p2Paid,label:"Player 2"},
                ].map(({name,paid,label})=>(
                  <div key={label} style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(0,0,0,.04)",borderRadius:"8px",padding:"8px 10px"}}>
                    <span style={{fontSize:"14px"}}>{paid?"✅":"⏳"}</span>
                    <span style={{fontSize:"13px",flex:1,color:"#78350f"}}><strong>{label}:</strong> {name} — {paid?"$25 paid":"payment pending"}</span>
                  </div>
                ))}
              </div>
              {bothPaid
                ?<p style={{fontSize:"12px",color:"#78350f",marginBottom:"0",lineHeight:"1.6"}}>Both payments received. Admin will activate your team within 24 hours.</p>
                :<>
                  <p style={{fontSize:"12px",color:"#78350f",marginBottom:myPaid?"0":"10px",lineHeight:"1.6"}}>
                    {myPaid
                      ?"Your payment is confirmed — waiting on your partner's payment."
                      :"Your team won't be active until both players have paid $25 and admin has approved."}
                  </p>
                  {!myPaid&&<button style={btn("#78350f","#fff",{width:"100%",minHeight:"42px",fontSize:"13px",fontWeight:"700"})} onClick={()=>window.open(SHOPIFY_URL,"_blank")}>💳 Pay my $25 now →</button>}
                </>
              }
            </div>
          );
        })()}
        {tab==="dashboard"&&<Dashboard myTeam={myTeam} teams={teams} matches={matches} requests={requests} division={division} setDivision={setDivision} setTab={setTab} openChat={setActiveChat} openCancel={setCancelMatch} notifications={notifications} adminBanner={adminBanner} isAdmin={isAdmin} userEmail={userEmail}/>}
        {tab==="board"    &&<MatchBoard myTeam={myTeam} teams={teams} requests={requests} setRequests={setRequests} matches={matches} division={division} setDivision={setDivision} isAdmin={isAdmin}/>}
        {tab==="scores"   &&<Scores myTeam={myTeam} teams={teams} setTeams={setTeams} matches={matches} setMatches={setMatches} openChat={setActiveChat} openCancel={setCancelMatch}/>}
        {tab==="standings"&&<Standings myTeam={myTeam} teams={teams} matches={matches} division={division} setDivision={setDivision} isAdmin={isAdmin}/>}
        {tab==="chat"     &&<DivisionChat myTeam={myTeam} isAdmin={isAdmin} teams={teams} matches={matches} adminPauseChat={adminPauseChat} setAdminPauseChat={setAdminPauseChat}/>}
        {tab==="schedule" &&<SeasonSchedule matches={matches} teams={teams} division={division} setDivision={setDivision} myTeam={myTeam} isAdmin={isAdmin}/>}
        {tab==="admin"&&isAdmin&&<AdminPanel teams={teams} setTeams={setTeams} matches={matches} setMatches={setMatches} userId={userId} adminBanner={adminBanner} setAdminBanner={setAdminBanner} weekDeadline={weekDeadline} setWeekDeadline={setWeekDeadline}/>}
        {tab==="settings" &&<Settings userId={userId} userEmail={userEmail} myTeam={myTeam} teams={teams} matches={matches} signOut={signOut} openReport={()=>setShowReport(true)} notifications={notifications} setNotifications={setNotifications}/>}
      </div>

      {/* Mobile bottom nav */}
      {mobile&&<BottomNav tab={tab} setTab={setTab} isAdmin={isAdmin} unreadCount={msgUnread} openRequestCount={openRequestCount}/>}

      {/* Modals */}
      {activeChat  &&<MatchChatWindow   match={activeChat}  myTeam={myTeam} teams={teams} onClose={()=>setActiveChat(null)}/>}
      {cancelMatch &&<CancelMatchModal  match={cancelMatch} myTeam={myTeam} teams={teams} onConfirm={(reason)=>handleCancelMatch(cancelMatch,reason)} onClose={()=>setCancelMatch(null)}/>}
      {showReport  &&<ReportModal       myTeam={myTeam} onClose={()=>setShowReport(false)}/>}
      {showNotifPrefs&&<NotifPrefsModal userId={userId} onClose={()=>setShowNotifPrefs(false)}/>}
    </div>
  );
}
