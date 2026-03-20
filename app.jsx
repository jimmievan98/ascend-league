// ================================================================
// ASCEND PB FLEX LEAGUE — COMPLETE APP v3
// All 52 features built in. Mobile-first.
// Replace SUPABASE_URL and SUPABASE_ANON with your values.
// ================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://egacieyresiwkwwomesi.supabase.co";
const SUPABASE_ANON = "sb_publishable_SXa5wSG157FAK-8bNVAorw_raHdHgs5";
const SHOPIFY_URL   = "https://ascendpb.com/products/ascend-pb-flex-league-player-registration";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Constants ─────────────────────────────────────────────────
const SEASON    = "Spring 2026";
const WEEKS     = 6;
const PLAYOFFS  = 4;
const MAX_VS    = 2;
const SKILLS    = ["3.0","3.1","3.2","3.3","3.4","3.5","3.6","3.7","3.8","3.9","4.0"];
const CLT_COURTS = [
  "Freedom Park — 1900 East Blvd (6 courts)",
  "Clarks Creek Community Park — 5435 Hucks Rd (8 courts)",
  "Martin Luther King Jr. Park — 2600 Ravencroft Dr (6 courts)",
  "Clanton Park — 1520 Clanton Rd (6 courts)",
  "Eastway Park — 3150 Eastway Pk Dr (4 courts)",
  "Pearl Street Park — 1200 Baxter Dr (2 courts)",
];

// ── Colors ────────────────────────────────────────────────────
const C = {
  bg:"#f5f5f3", white:"#fff", border:"#e4e4e0",
  text:"#111", muted:"#888", faint:"#aaa",
  blue:"#0369a1", blueBg:"#eff6ff", blueBorder:"#bfdbfe",
  green:"#15803d", greenBg:"#dcfce7",
  amber:"#b45309", amberBg:"#fef9c3",
  red:"#dc2626", redBg:"#fee2e2",
  gray:"#444", purple:"#6d28d9", purpleBg:"#ede9fe",
};

// ── WAIVER ────────────────────────────────────────────────────
const WAIVER = `ASCEND PB FLEX LEAGUE — OFFICIAL RULES & WAIVER · ${SEASON}

SEASON FORMAT
• ${WEEKS}-week flex season. Teams post open availability — no targeted opponents.
• All matches: Best of 3 games, each to 11 points, win by 2.
• Teams find their own court anywhere in Charlotte, NC.
• Scores submitted within 24 hours of playing.

MATCH LIMITS
• Maximum ${MAX_VS} matches vs the same opponent per season.
• No weekly cap — play as much as your schedule allows.

DIVISIONS
• 3.0–3.5 Division: DUPR ratings 3.0 to 3.4.
• 3.5–4.0 Division: DUPR ratings 3.5 to 4.0.
• Players rated exactly 3.5 may choose their division at registration.
• Ascend Pickleball reserves the right to reassign players.

SCHEDULING & CANCELLATIONS
• Any team in your division may accept your open availability request.
• Once confirmed, either team may cancel — cancelling team must provide a reason.
• Repeated cancellations may result in admin action.

SUBSTITUTES
• Allowed — at least 1 original player must be on the court.
• Must be disclosed when submitting scores.

SCORING
• 2 points per match win. 0 for a loss.
• Either team submits scores. Opponent confirms within 24 hours.
• If not confirmed in 24 hours, score auto-confirms (12hr reminder sent).
• Disputed scores resolved by admin within 48 hours.

PLAYOFFS
• Top ${PLAYOFFS} teams per division advance to playoffs in Week ${WEEKS}.
• Minimum 3 regular season matches required to qualify.
• Single elimination. 12-hour score confirmation window during playoffs.

FEES & REFUNDS
• $25 per player. Both players pay separately via the Ascend PB store.
• Non-refundable after Week 1 begins.

LIABILITY WAIVER
By registering, I acknowledge that pickleball involves physical activity and inherent risk. I agree to hold Ascend Pickleball LLC harmless from any claims, injuries, or damages. Participation is voluntary.`;

// ── Hooks ─────────────────────────────────────────────────────
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
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#f5f5f3;-webkit-tap-highlight-color:transparent}
      input,select,textarea,button{font-family:'DM Sans',sans-serif;-webkit-appearance:none}
      .table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
      @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    `;
    document.head.appendChild(s);
  }, []);
}

// ── Swipe Hook ────────────────────────────────────────────────
function useSwipe(onLeft, onRight) {
  const ref = useRef(null);
  const startX = useRef(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ts = e => { startX.current = e.touches[0].clientX; };
    const te = e => {
      const dx = e.changedTouches[0].clientX - startX.current;
      if (Math.abs(dx) > 60) { if (dx < 0) onLeft?.(); else onRight?.(); }
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchend", te, { passive: true });
    return () => { el.removeEventListener("touchstart", ts); el.removeEventListener("touchend", te); };
  }, [onLeft, onRight]);
  return ref;
}

// ── UI Primitives ─────────────────────────────────────────────
const inp = (x={}) => ({ background:C.bg, border:`1px solid ${C.border}`, borderRadius:"8px", padding:"11px 13px", color:C.text, fontSize:"15px", width:"100%", outline:"none", ...x });
const btn  = (bg=C.text, c="#fff", x={}) => ({ background:bg, color:c, border:"none", borderRadius:"8px", padding:"11px 20px", fontSize:"14px", fontWeight:"600", cursor:"pointer", whiteSpace:"nowrap", minHeight:"44px", ...x });
const card = (x={}) => ({ background:C.white, border:`1px solid ${C.border}`, borderRadius:"12px", padding:"16px", ...x });

const Tag = ({ c="blue", sm, children }) => {
  const m = { blue:[C.blue,"#e0f2fe"], green:[C.green,C.greenBg], amber:[C.amber,C.amberBg], red:[C.red,C.redBg], gray:[C.gray,"#f0f0ee"], black:[C.text,C.bg], purple:[C.purple,C.purpleBg] };
  const [col, bg] = m[c] || m.blue;
  return <span style={{ display:"inline-block", borderRadius:"6px", padding:sm?"2px 6px":"3px 9px", fontSize:sm?"10px":"11px", fontWeight:"700", whiteSpace:"nowrap", background:bg, color:col, border:`1px solid ${col}22` }}>{children}</span>;
};

const Lbl = ({ c, children }) => (
  <label style={{ fontSize:"11px", fontWeight:"600", color:c||C.muted, textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:"6px" }}>{children}</label>
);

const Pill = ({ d, active, onClick }) => {
  const col = d==="low"?"#334155":C.blue;
  return <button onClick={onClick} style={{ borderRadius:"999px", padding:"7px 18px", cursor:"pointer", fontSize:"13px", fontWeight:"600", border:`1.5px solid ${col}`, background:active?col:C.white, color:active?"#fff":col, transition:"all .12s", minHeight:"44px" }}>{d==="low"?"3.0–3.5":"3.5–4.0"}</button>;
};

const Alert = ({ type="info", children, onDismiss }) => {
  const map = { info:[C.blue,"#e0f2fe"], success:[C.green,C.greenBg], warn:[C.amber,C.amberBg], error:[C.red,C.redBg] };
  const [col, bg] = map[type];
  return (
    <div style={{ background:bg, border:`1px solid ${col}30`, borderRadius:"10px", padding:"12px 16px", marginBottom:"14px", display:"flex", gap:"10px", alignItems:"flex-start" }}>
      <div style={{ flex:1, fontSize:"14px", color:col, lineHeight:"1.5" }}>{children}</div>
      {onDismiss && <button onClick={onDismiss} style={{ background:"none", border:"none", cursor:"pointer", color:col, fontSize:"18px", lineHeight:1, padding:0, minWidth:"24px" }}>×</button>}
    </div>
  );
};

const Divider = () => <div style={{ height:"1px", background:C.border, margin:"14px 0" }}/>;

const dL = d => d==="low"?"3.0–3.5":"3.5–4.0";
const dC = d => d==="low"?"#334155":C.blue;
const timeAgo = ts => {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
};

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
    check:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    x:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    map:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    camera:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    trophy:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="8 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H4a1 1 0 0 0-1 1v3a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V5a1 1 0 0 0-1-1h-3"/><rect x="7" y="2" width="10" height="12" rx="1"/></svg>,
    lock:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    send:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    image:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  };
  return icons[n] || null;
};

// ── Notification Bell ─────────────────────────────────────────
function NotifBell({ notifications, onOpen }) {
  const unread = notifications.filter(n=>!n.read).length;
  return (
    <button onClick={onOpen} style={{ position:"relative", background:"none", border:"none", cursor:"pointer", padding:"8px", color:C.muted, display:"flex", alignItems:"center", minHeight:"44px", minWidth:"44px", justifyContent:"center" }}>
      <Icon n="bell" size={22}/>
      {unread > 0 && (
        <span style={{ position:"absolute", top:"5px", right:"5px", background:C.red, color:"#fff", borderRadius:"50%", width:"17px", height:"17px", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}

// ── Notifications Panel ───────────────────────────────────────
function NotifPanel({ notifications, setNotifications, onClose }) {
  const markAll = async () => {
    await sb.from("notifications").update({ read:true }).eq("read", false);
    setNotifications(p => p.map(n => ({...n, read:true})));
  };
  const icons = { match_accepted:"✓", score_submitted:"📊", score_confirmed:"✅", disputed:"⚠", message:"💬", match_message:"🏓", admin_announcement:"📢", match_cancelled:"❌", match_reminder:"⏰" };
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
        {notifications.length === 0 && <div style={{ padding:"24px", textAlign:"center", color:C.faint, fontSize:"13px" }}>No notifications yet.</div>}
        {notifications.map(n => (
          <div key={n.id} style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, background:n.read?"transparent":"#f0f9ff", display:"flex", gap:"10px", alignItems:"flex-start" }}>
            <span style={{ fontSize:"16px", flexShrink:0, marginTop:"1px" }}>{icons[n.type] || "•"}</span>
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

// ── Match Chat Modal ──────────────────────────────────────────
function MatchChatModal({ match, myTeam, teams, onClose }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const endRef = useRef(null);
  const fileRef = useRef(null);
  const opp = teams.find(t => t.id === (match.t1_id===myTeam.id ? match.t2_id : match.t1_id));
  const isClosed = match.chat_closed_at && new Date(match.chat_closed_at) < new Date();
  const closingSoon = match.chat_closed_at && !isClosed && (new Date(match.chat_closed_at) - new Date()) < 3600000;

  useEffect(() => {
    sb.from("match_chats").select("*").eq("match_id", match.id).order("created_at", {ascending:true}).then(({data}) => {
      if (data) setMsgs(data);
      setTimeout(() => endRef.current?.scrollIntoView(), 100);
    });
    const ch = sb.channel(`mc-${match.id}`)
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"match_chats", filter:`match_id=eq.${match.id}` }, p => {
        setMsgs(prev => [...prev, p.new]);
        setTimeout(() => endRef.current?.scrollIntoView({behavior:"smooth"}), 50);
      }).subscribe();
    return () => sb.removeChannel(ch);
  }, [match.id]);

  const send = async () => {
    if (!input.trim() || isClosed) return;
    await sb.from("match_chats").insert({ match_id:match.id, team_id:myTeam.id, team_name:myTeam.name, content:input.trim() });
    setInput("");
  };

  const sendPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `match-chats/${match.id}/${Date.now()}.${ext}`;
    const { data, error } = await sb.storage.from("match-photos").upload(path, file, { upsert:true });
    if (!error) {
      const { data:urlData } = sb.storage.from("match-photos").getPublicUrl(path);
      await sb.from("match_chats").insert({ match_id:match.id, team_id:myTeam.id, team_name:myTeam.name, content:`[photo]${urlData.publicUrl}`, is_photo:true });
    }
    setUploading(false);
  };

  const openMaps = (court) => {
    const q = encodeURIComponent(court + " Charlotte NC");
    window.open(`https://maps.google.com/?q=${q}`, "_blank");
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={e => e.target===e.currentTarget&&onClose()}>
      <div style={{ background:C.white, borderRadius:"16px 16px 0 0", width:"100%", maxWidth:"560px", maxHeight:"90vh", display:"flex", flexDirection:"column", animation:"slideUp .25s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 18px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div>
            <div style={{ fontWeight:"700", fontSize:"16px" }}>Match Chat</div>
            <div style={{ fontSize:"12px", color:C.muted }}>vs {opp?.name} · {match.match_date}</div>
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <button onClick={() => openMaps(match.court)} style={{ background:C.blueBg, border:"none", cursor:"pointer", borderRadius:"8px", padding:"7px 10px", color:C.blue, display:"flex", alignItems:"center", gap:"5px", fontSize:"12px", fontWeight:"600" }}>
              <Icon n="map" size={14}/> Court
            </button>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:"24px", lineHeight:1, minWidth:"44px", minHeight:"44px", display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
          </div>
        </div>
        {isClosed && <Alert type="warn">This match chat has been archived. You can still read the history.</Alert>}
        {closingSoon && <Alert type="info">Chat closes in less than 1 hour — match has been completed.</Alert>}
        <div style={{ flex:1, overflowY:"auto", padding:"16px 18px" }}>
          {msgs.length === 0 && <div style={{ textAlign:"center", color:C.faint, fontSize:"13px", padding:"24px 0" }}>Chat opened! Coordinate your match details here.</div>}
          {msgs.map(m => {
            const mine = m.team_id === myTeam.id;
            const isPhoto = m.content?.startsWith("[photo]");
            const photoUrl = isPhoto ? m.content.replace("[photo]", "") : null;
            return (
              <div key={m.id} style={{ display:"flex", flexDirection:mine?"row-reverse":"row", gap:"8px", marginBottom:"14px", alignItems:"flex-end" }}>
                <div style={{ maxWidth:"75%" }}>
                  {!mine && <div style={{ fontSize:"11px", color:C.muted, marginBottom:"3px", fontWeight:"600" }}>{m.team_name}</div>}
                  {isPhoto
                    ? <img src={photoUrl} alt="shared" style={{ maxWidth:"200px", borderRadius:"12px", display:"block" }} />
                    : <div style={{ background:mine?"#111":"#f0f0ee", color:mine?"#fff":C.text, borderRadius:mine?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", fontSize:"14px", lineHeight:"1.5", wordBreak:"break-word" }}>{m.content}</div>
                  }
                  <div style={{ fontSize:"10px", color:C.faint, marginTop:"3px", textAlign:mine?"right":"left" }}>{timeAgo(m.created_at)}</div>
                </div>
              </div>
            );
          })}
          <div ref={endRef}/>
        </div>
        {!isClosed && (
          <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
              <input type="file" ref={fileRef} accept="image/*" style={{ display:"none" }} onChange={sendPhoto}/>
              <button onClick={() => fileRef.current?.click()} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:"8px", cursor:"pointer", padding:"9px", color:C.muted, minWidth:"44px", minHeight:"44px", display:"flex", alignItems:"center", justifyContent:"center" }} disabled={uploading}>
                <Icon n="image" size={20}/>
              </button>
              <input style={{ ...inp(), flex:1 }} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..."/>
              <button style={{ ...btn(C.text,"#fff",{padding:"10px 14px",minHeight:"44px"}), display:"flex", alignItems:"center", justifyContent:"center" }} onClick={send}><Icon n="send" size={18}/></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cancel Match Modal ────────────────────────────────────────
function CancelMatchModal({ match, myTeam, teams, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  const opp = teams.find(t => t.id === (match.t1_id===myTeam.id ? match.t2_id : match.t1_id));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ ...card(), width:"100%", maxWidth:"400px", animation:"fadeIn .15s ease" }}>
        <div style={{ fontSize:"18px", fontWeight:"700", marginBottom:"8px" }}>Cancel Match</div>
        <p style={{ fontSize:"14px", color:C.muted, marginBottom:"16px", lineHeight:"1.6" }}>You are about to cancel your confirmed match vs <strong style={{color:C.text}}>{opp?.name}</strong>. They will be notified. Please provide a reason.</p>
        <Lbl>Reason for cancellation</Lbl>
        <textarea style={{ ...inp(), minHeight:"90px", resize:"vertical", marginBottom:"16px" }} placeholder="e.g. Scheduling conflict came up — can we reschedule?" value={reason} onChange={e=>setReason(e.target.value)}/>
        <div style={{ display:"flex", gap:"8px" }}>
          <button style={btn(C.red,"#fff",{flex:1})} onClick={() => reason.trim() && onConfirm(reason)} disabled={!reason.trim()}>Yes, Cancel Match</button>
          <button style={btn(C.gray,"#fff",{flex:1})} onClick={onClose}>Go Back</button>
        </div>
      </div>
    </div>
  );
}

// ── Notification Prefs Modal ──────────────────────────────────
function NotifPrefsModal({ userId, onClose }) {
  const [prefs, setPrefs] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    sb.from("notification_prefs").select("*").eq("user_id", userId).single().then(({ data }) => {
      if (data) setPrefs(data);
      else setPrefs({ user_id:userId, match_confirmed:true, match_cancelled:true, score_submitted:true, score_confirmed:true, score_disputed:true, match_message:true, division_message:true, admin_announcement:true, match_reminder_24h:true, match_reminder_2h:true, email_enabled:true });
    });
  }, [userId]);

  const save = async () => {
    await sb.from("notification_prefs").upsert(prefs);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const toggle = k => setPrefs(p => ({...p, [k]: !p[k]}));

  const groups = [
    ["Matches", [["match_confirmed","Match confirmed"],["match_cancelled","Match cancelled"],["match_reminder_24h","Reminder 24h before match"],["match_reminder_2h","Reminder 2h before match"]]],
    ["Scores", [["score_submitted","Opponent submitted a score"],["score_confirmed","Score confirmed"],["score_disputed","Score disputed"]]],
    ["Messages", [["match_message","Match chat messages"],["division_message","Division chat messages"],["admin_announcement","Admin announcements"]]],
    ["Email", [["email_enabled","Receive email notifications"]]],
  ];

  if (!prefs) return null;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:C.white, borderRadius:"16px 16px 0 0", width:"100%", maxWidth:"480px", maxHeight:"85vh", display:"flex", flexDirection:"column", animation:"slideUp .25s ease" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 18px", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontWeight:"700", fontSize:"17px" }}>Notification Settings</span>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"24px", color:C.muted, lineHeight:1 }}>×</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 18px" }}>
          {groups.map(([group, items]) => (
            <div key={group} style={{ marginBottom:"20px" }}>
              <div style={{ fontSize:"13px", fontWeight:"700", color:C.muted, textTransform:"uppercase", letterSpacing:".8px", marginBottom:"10px" }}>{group}</div>
              {items.map(([key, label]) => (
                <label key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer", minHeight:"44px" }}>
                  <span style={{ fontSize:"14px" }}>{label}</span>
                  <div onClick={() => toggle(key)} style={{ width:"44px", height:"24px", borderRadius:"12px", background:prefs[key]?C.blue:C.border, position:"relative", transition:"background .2s", cursor:"pointer", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:"2px", left:prefs[key]?"22px":"2px", width:"20px", height:"20px", borderRadius:"50%", background:C.white, transition:"left .2s" }}/>
                  </div>
                </label>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding:"16px 18px", borderTop:`1px solid ${C.border}` }}>
          <button style={btn(saved?C.green:C.text,"#fff",{width:"100%"})} onClick={save}>{saved?"Saved!":"Save Preferences"}</button>
        </div>
      </div>
    </div>
  );
}

// ── AUTH SCREEN ───────────────────────────────────────────────
function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email:"", password:"", confirm:"", teamName:"", p1Name:"", p1Skill:"3.2", p2Name:"", p2Email:"", p2Skill:"3.2", division:"", agreed:false });
  const [err,  setErr]  = useState("");
  const [msg,  setMsg]  = useState("");
  const [busy, setBusy] = useState(false);
  const [wOk,  setWOk]  = useState(false);
  const wRef = useRef(null);
  const up = (k,v) => setForm(f => ({...f,[k]:v}));
  const autoDiv = () => { const m = Math.max(parseFloat(form.p1Skill), parseFloat(form.p2Skill)); return m>3.5?"high":m<3.5?"low":form.division||""; };
  const needs35 = () => Math.max(parseFloat(form.p1Skill), parseFloat(form.p2Skill)) === 3.5;
  const Err = ({e}) => e ? <Alert type="error">{e}</Alert> : null;

  const doLogin = async () => {
    setErr(""); setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email:form.email, password:form.password });
    setBusy(false);
    if (error) setErr(error.message);
  };

  const doGoogle = async () => { await sb.auth.signInWithOAuth({ provider:"google", options:{ redirectTo:window.location.origin } }); };

  const doForgot = async () => {
    setErr(""); setBusy(true);
    const { error } = await sb.auth.resetPasswordForEmail(form.email, { redirectTo:window.location.origin });
    setBusy(false);
    if (error) setErr(error.message); else setMsg("Reset link sent — check your inbox.");
  };

  const nextStep = () => {
    setErr("");
    if (step===1 && (!form.email||!form.password)) { setErr("Email and password required."); return; }
    if (step===1 && form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (step===2 && !form.teamName.trim()) { setErr("Team name required."); return; }
    if (step===2 && !form.p1Name.trim())  { setErr("Your name is required."); return; }
    if (step===3 && !form.p2Name.trim())  { setErr("Partner name required."); return; }
    if (step===3 && needs35() && !form.division) { setErr("Please choose a division."); return; }
    if (step===4 && !form.agreed)         { setErr("You must agree to the rules and waiver."); return; }
    setStep(s => s+1);
  };

  const submitReg = async () => {
    setErr(""); setBusy(true);
    const div = autoDiv();
    const { data, error } = await sb.auth.signUp({ email:form.email, password:form.password });
    if (error) { setErr(error.message); setBusy(false); return; }
    const uid = data.user?.id;
    const { data:team, error:te } = await sb.from("teams").insert({
      name:form.teamName, p1_name:form.p1Name, p1_email:form.email, p1_skill:form.p1Skill,
      p2_name:form.p2Name, p2_email:form.p2Email||"", p2_skill:form.p2Skill,
      division:div, paid:false, approved:false,
    }).select().single();
    if (te) { setErr(te.message); setBusy(false); return; }
    if (uid) {
      await sb.from("profiles").upsert({ id:uid, email:form.email, team_id:team.id });
      await sb.from("notification_prefs").insert({ user_id:uid });
    }
    setBusy(false);
    window.open(SHOPIFY_URL, "_blank");
    setStep(6);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px", background:C.bg }}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"24px", fontWeight:"500", marginBottom:"6px" }}>
        ascend<span style={{ color:"#0ea5e9" }}>pb</span>
      </div>
      <div style={{ fontSize:"12px", color:C.faint, letterSpacing:".5px", marginBottom:"28px" }}>Flex League · Charlotte, NC · {SEASON}</div>
      <div style={{ ...card(), width:"100%", maxWidth:"420px" }}>
        {mode==="login" && <>
          <div style={{ fontSize:"22px", fontWeight:"700", marginBottom:"4px" }}>Sign in</div>
          <div style={{ fontSize:"13px", color:C.muted, marginBottom:"20px" }}>Access your team portal</div>
          <Err e={err}/>
          <Lbl>Email</Lbl>
          <input style={{ ...inp(), marginBottom:"12px" }} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)}/>
          <Lbl>Password</Lbl>
          <input style={{ ...inp(), marginBottom:"18px" }} type="password" placeholder="Password" value={form.password} onChange={e=>up("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
          <button style={{ ...btn(C.text,"#fff",{width:"100%",marginBottom:"10px"}) }} onClick={doLogin} disabled={busy}>{busy?"Signing in...":"Sign in"}</button>
          <button style={{ ...btn(C.gray,"#fff",{width:"100%",marginBottom:"18px"}) }} onClick={doGoogle}>Continue with Google</button>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}>
            <span style={{ color:C.blue, cursor:"pointer" }} onClick={()=>{setMode("register");setStep(1);setErr("");}}>Create account</span>
            <span style={{ color:C.blue, cursor:"pointer" }} onClick={()=>{setMode("forgot");setErr("");}}>Forgot password?</span>
          </div>
        </>}

        {mode==="forgot" && <>
          <div style={{ fontSize:"22px", fontWeight:"700", marginBottom:"4px" }}>Reset password</div>
          <Err e={err}/>
          {msg && <Alert type="success">{msg}</Alert>}
          <Lbl>Email</Lbl>
          <input style={{ ...inp(), marginBottom:"16px" }} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)}/>
          <button style={{ ...btn(C.text,"#fff",{width:"100%",marginBottom:"12px"}) }} onClick={doForgot} disabled={busy}>{busy?"Sending...":"Send reset link"}</button>
          <span style={{ color:C.blue, cursor:"pointer", fontSize:"13px" }} onClick={()=>{setMode("login");setErr("");setMsg("");}}>← Back to sign in</span>
        </>}

        {mode==="register" && step < 6 && <>
          <div style={{ display:"flex", gap:"4px", marginBottom:"20px" }}>
            {[1,2,3,4,5].map(n => <div key={n} style={{ flex:1, height:"3px", borderRadius:"2px", background:n<=step?"#111":"#e4e4e0", transition:"background .3s" }}/>)}
          </div>
          <div style={{ fontSize:"22px", fontWeight:"700", marginBottom:"2px" }}>{["","Account","Team Info","Player 2","Rules & Waiver","Confirm & Pay"][step]}</div>
          <div style={{ fontSize:"11px", color:C.faint, marginBottom:"18px", textTransform:"uppercase" }}>Step {step} of 5</div>
          <Err e={err}/>
          {step===1 && <>
            <Lbl>Email address</Lbl>
            <input style={{ ...inp(), marginBottom:"12px" }} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)}/>
            <Lbl>Password</Lbl>
            <input style={{ ...inp(), marginBottom:"12px" }} type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e=>up("password",e.target.value)}/>
            <Lbl>Confirm password</Lbl>
            <input style={inp()} type="password" placeholder="Repeat password" value={form.confirm} onChange={e=>up("confirm",e.target.value)}/>
          </>}
          {step===2 && <>
            <Lbl>Team name</Lbl>
            <input style={{ ...inp(), marginBottom:"12px" }} placeholder="e.g. The Drop Shot Duo" value={form.teamName} onChange={e=>up("teamName",e.target.value)}/>
            <Lbl>Your name (Player 1)</Lbl>
            <input style={{ ...inp(), marginBottom:"12px" }} placeholder="Full name" value={form.p1Name} onChange={e=>up("p1Name",e.target.value)}/>
            <Lbl>Your skill level (DUPR)</Lbl>
            <select style={{ ...inp(), appearance:"none" }} value={form.p1Skill} onChange={e=>up("p1Skill",e.target.value)}>
              {SKILLS.map(s => <option key={s}>{s}</option>)}
            </select>
          </>}
          {step===3 && <>
            <Lbl>Partner's name (Player 2)</Lbl>
            <input style={{ ...inp(), marginBottom:"12px" }} placeholder="Full name" value={form.p2Name} onChange={e=>up("p2Name",e.target.value)}/>
            <Lbl>Partner's email <span style={{ fontWeight:"400", textTransform:"none", letterSpacing:0, color:C.faint }}>(optional)</span></Lbl>
            <input style={{ ...inp(), marginBottom:"12px" }} type="email" placeholder="partner@email.com (optional)" value={form.p2Email} onChange={e=>up("p2Email",e.target.value)}/>
            <Lbl>Partner's skill level (DUPR)</Lbl>
            <select style={{ ...inp(), appearance:"none", marginBottom:needs35()?"14px":"0" }} value={form.p2Skill} onChange={e=>up("p2Skill",e.target.value)}>
              {SKILLS.map(s => <option key={s}>{s}</option>)}
            </select>
            {needs35() && (
              <div style={{ background:C.blueBg, border:`1px solid ${C.blueBorder}`, borderRadius:"8px", padding:"14px" }}>
                <Lbl c={C.blue}>Choose division (3.5 rated player)</Lbl>
                <div style={{ display:"flex", gap:"8px", marginTop:"6px" }}>
                  {["low","high"].map(d => (
                    <button key={d} onClick={()=>up("division",d)} style={{ flex:1, padding:"10px", borderRadius:"8px", border:`2px solid ${form.division===d?dC(d):C.border}`, background:form.division===d?dC(d):C.white, color:form.division===d?"#fff":C.muted, cursor:"pointer", fontSize:"14px", fontWeight:"600", minHeight:"44px" }}>
                      {dL(d)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>}
          {step===4 && <>
            <Lbl>Rules and liability waiver</Lbl>
            <div ref={wRef} onScroll={e=>{ const el=e.target; if(el.scrollHeight-el.scrollTop<=el.clientHeight+40)setWOk(true); }}
              style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:"8px", padding:"12px 14px", height:"200px", overflowY:"auto", fontSize:"12px", lineHeight:"1.8", color:"#555", whiteSpace:"pre-wrap", marginBottom:"12px" }}>
              {WAIVER}
            </div>
            {!wOk && <Alert type="warn">Scroll through the full agreement before agreeing.</Alert>}
            <label style={{ display:"flex", gap:"10px", alignItems:"flex-start", cursor:"pointer", fontSize:"14px", lineHeight:"1.5" }}>
              <input type="checkbox" checked={form.agreed} onChange={e=>up("agreed",e.target.checked)} style={{ marginTop:"3px", accentColor:C.blue, width:"16px", height:"16px" }}/>
              I have read and agree to the rules and waiver on behalf of both team members.
            </label>
          </>}
          {step===5 && <>
            <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:"8px", padding:"14px", marginBottom:"14px" }}>
              <Lbl>Team summary</Lbl>
              <div style={{ fontSize:"18px", fontWeight:"700", marginBottom:"4px" }}>{form.teamName||"Unnamed Team"}</div>
              <div style={{ fontSize:"13px", color:C.muted, marginBottom:"8px" }}>{form.p1Name} ({form.p1Skill}) and {form.p2Name} ({form.p2Skill})</div>
              <Tag c={autoDiv()==="low"?"gray":"blue"}>{dL(autoDiv()||"low")} Division</Tag>
            </div>
            <div style={{ background:C.blueBg, border:`1px solid ${C.blueBorder}`, borderRadius:"8px", padding:"16px", textAlign:"center", marginBottom:"14px" }}>
              <div style={{ fontSize:"11px", fontWeight:"600", color:C.blue, textTransform:"uppercase", letterSpacing:".8px" }}>Your registration fee</div>
              <div style={{ fontSize:"44px", fontWeight:"800", color:C.blue, lineHeight:"1.1" }}>$25</div>
              <div style={{ fontSize:"12px", color:"#555" }}>per player · your partner pays their own $25 · non-refundable</div>
            </div>
            <p style={{ fontSize:"13px", color:C.muted, lineHeight:"1.7", marginBottom:"16px" }}>Clicking below saves your team registration and opens the Ascend PB store for your $25 payment. Share the link with your partner after. Admin activates your team once both payments are confirmed.</p>
            <button style={btn(C.text,"#fff",{width:"100%",padding:"13px"})} onClick={submitReg} disabled={busy}>{busy?"Registering...":"Pay My $25 and Register"}</button>
          </>}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"16px" }}>
            {step>1 ? <button style={btn(C.gray,"#fff",{padding:"10px 16px"})} onClick={()=>{setErr("");setStep(s=>s-1);}}>← Back</button> : <span/>}
            {step<5 && <button style={btn(C.text,"#fff",{padding:"10px 20px"})} onClick={nextStep}>Continue →</button>}
          </div>
          {step===1 && <div style={{ textAlign:"center", marginTop:"14px", fontSize:"13px", color:C.muted }}>Already registered? <span style={{ color:C.blue, cursor:"pointer" }} onClick={()=>{setMode("login");setErr("");}}>Sign in</span></div>}
        </>}

        {mode==="register" && step===6 && (
          <div style={{ textAlign:"center", padding:"30px 0" }}>
            <div style={{ fontSize:"40px", marginBottom:"10px" }}>🏓</div>
            <div style={{ fontSize:"22px", fontWeight:"700", marginBottom:"8px" }}>You're in the queue!</div>
            <p style={{ fontSize:"13px", color:C.muted, lineHeight:"1.7", marginBottom:"18px" }}>
              <strong style={{color:C.text}}>{form.teamName}</strong> is registered. Complete your $25 payment on the tab that opened, then share the link with your partner. Admin activates within 24 hours.
            </p>
            <button style={btn(C.gray,"#fff")} onClick={()=>{setMode("login");setStep(1);}}>Back to sign in</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ myTeam, teams, matches, requests, division, setDivision, setTab, openChat, openCancel, notifications }) {
  const mobile = useMobile();
  const myRequests = requests.filter(r => r.team_id===myTeam?.id && r.status==="open");
  const myMatches  = matches.filter(m => (m.t1_id===myTeam?.id||m.t2_id===myTeam?.id) && !m.cancelled && m.status!=="completed");
  const standings  = [...teams.filter(t=>t.division===division&&t.approved)].sort((a,b)=>b.points-a.points||b.wins-a.wins);
  const tName      = id => teams.find(t=>t.id===id)?.name ?? "Unknown";

  // Playoff countdown
  const playoffDate = new Date("2026-04-07");
  const daysUntil   = Math.max(0, Math.ceil((playoffDate - new Date()) / 86400000));

  // Playoff clinch
  const myRank = standings.findIndex(t=>t.id===myTeam?.id);
  const clinched = myRank >= 0 && myRank < PLAYOFFS && (standings[PLAYOFFS]?.points||0) < (myTeam?.points||0);

  // Season champion banner
  const champions = { low: null, high: null }; // populated from season_records if exists

  // Stats
  const myStats = {
    winStreak: 0, // computed from match history
    pointDiff: myMatches.reduce((a,m)=>{
      const myScore = m.t1_id===myTeam?.id ? (m.score_t1||0) : (m.score_t2||0);
      const oppScore= m.t1_id===myTeam?.id ? (m.score_t2||0) : (m.score_t1||0);
      return a + myScore - oppScore;
    }, 0),
  };

  return (
    <div>
      {/* Champion banner */}
      {champions.low && <Alert type="success"><strong>🏆 Spring 2026 Champions</strong> — {champions.low} (3.0–3.5) · {champions.high} (3.5–4.0)</Alert>}

      {myTeam && !myTeam.approved && (
        <Alert type="warn"><strong>Pending activation</strong> — Registration saved. Admin activates within 24 hours of both players' payments.</Alert>
      )}

      {/* Playoff clinched */}
      {clinched && <Alert type="success">🎉 <strong>Playoffs clinched!</strong> {myTeam?.name} has secured a playoff spot.</Alert>}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"12px", marginBottom:"22px" }}>
        <div>
          <div style={{ fontSize:mobile?"22px":"26px", fontWeight:"700", letterSpacing:"-.5px" }}>{myTeam?.name||"Dashboard"}</div>
          <div style={{ fontSize:"11px", color:C.faint, textTransform:"uppercase", letterSpacing:".5px", marginTop:"2px" }}>{SEASON} · Charlotte Flex League</div>
        </div>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {myTeam?.approved && <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={()=>setTab("board")}>+ Post Availability</button>}
        </div>
      </div>

      {/* Stat cards */}
      {myTeam?.approved && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(85px,1fr))", gap:"10px", marginBottom:"20px" }}>
          {[
            {n:myTeam.wins, l:"Wins", c:C.green},
            {n:myTeam.losses, l:"Losses", c:C.red},
            {n:myTeam.points, l:"Points", c:C.blue},
            {n:myRequests.length, l:"Open Requests", c:C.amber},
            {n:`${myStats.pointDiff>=0?"+":""}${myStats.pointDiff}`, l:"Point Diff", c:myStats.pointDiff>=0?C.green:C.red},
            {n:`${daysUntil}d`, l:"To Playoffs", c:C.purple},
          ].map((x,i) => (
            <div key={i} style={{ ...card(), textAlign:"center", padding:"14px 8px" }}>
              <div style={{ fontSize:"24px", fontWeight:"800", color:x.c, lineHeight:"1" }}>{x.n}</div>
              <div style={{ fontSize:"10px", fontWeight:"600", color:C.muted, textTransform:"uppercase", letterSpacing:".8px", marginTop:"4px" }}>{x.l}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"1fr 1fr", gap:"14px", marginBottom:"20px" }}>
        {/* Confirmed matches */}
        <div style={card()}>
          <div style={{ fontSize:"15px", fontWeight:"700", marginBottom:"12px" }}>Confirmed matches</div>
          {myMatches.length===0 ? <p style={{ fontSize:"13px", color:C.muted, lineHeight:"1.6" }}>No confirmed matches yet. Post your availability on the Match Board.</p> :
          myMatches.map(m => {
            const opp = teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
            return (
              <div key={m.id} style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ fontWeight:"700", fontSize:"15px", marginBottom:"3px" }}>vs {opp?.name}</div>
                <div style={{ fontSize:"12px", color:C.muted, marginBottom:"8px" }}>{m.match_date} · {m.match_time} · {m.court}</div>
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                  <Tag c="green">Confirmed</Tag>
                  <button style={btn(C.text,"#fff",{fontSize:"12px",padding:"5px 12px",minHeight:"36px"})} onClick={()=>openChat(m)}>Chat</button>
                  <button style={btn(C.amber,"#fff",{fontSize:"12px",padding:"5px 12px",minHeight:"36px"})} onClick={()=>setTab("scores")}>Score</button>
                  <button style={btn(C.red,"#fff",{fontSize:"12px",padding:"5px 12px",minHeight:"36px"})} onClick={()=>openCancel(m)}>Cancel</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Open requests */}
        <div style={card()}>
          <div style={{ fontSize:"15px", fontWeight:"700", marginBottom:"12px" }}>My open requests</div>
          {myRequests.length===0 ? <p style={{ fontSize:"13px", color:C.muted, lineHeight:"1.6" }}>No open requests. Post your availability so teams can find you.</p> :
          myRequests.map(r => (
            <div key={r.id} style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontWeight:"700", fontSize:"15px", marginBottom:"2px" }}>{r.proposed_date} at {r.proposed_time}</div>
              <div style={{ fontSize:"12px", color:C.muted, marginBottom:"2px" }}>{r.proposed_court}</div>
              <div style={{ fontSize:"12px", color:C.faint, marginBottom:"8px" }}>{r.responses?.length||0} response{(r.responses?.length||0)!==1?"s":""} · {timeAgo(r.created_at)}</div>
              <div style={{ display:"flex", gap:"6px" }}>
                <Tag c="blue">Open</Tag>
                <button style={btn(C.text,"#fff",{fontSize:"11px",padding:"4px 10px",minHeight:"36px"})} onClick={()=>setTab("board")}>View</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standings */}
      <div style={card()}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"16px", flexWrap:"wrap" }}>
          <div style={{ fontSize:"15px", fontWeight:"700" }}>Division standings</div>
          <div style={{ flex:1 }}/>
          <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}/>
          <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")}/>
        </div>
        <div className="table-scroll">
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"280px" }}>
            <thead><tr>{["#","Team","W","L","Pts"].map(h=><th key={h} style={{ textAlign:"left", color:C.muted, fontSize:"11px", fontWeight:"600", letterSpacing:".8px", textTransform:"uppercase", padding:"8px 10px", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
            <tbody>
              {standings.map((t,i) => {
                const playoff = i < PLAYOFFS;
                const isMe = t.id === myTeam?.id;
                return (
                  <tr key={t.id} style={{ background:isMe?"#eff6ff":"" }}>
                    <td style={{ padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"800",color:playoff?C.blue:"#ddd",fontSize:"18px",width:"40px" }}>{i+1}</td>
                    <td style={{ padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"700" }}>
                      {t.name}{" "}
                      {isMe && <Tag sm c="blue">You</Tag>}{" "}
                      {i===0 && <Tag sm c="gray">Leader</Tag>}{" "}
                      {playoff && <Tag sm c="blue">Playoffs</Tag>}{" "}
                      {t.most_active && <Tag sm c="purple">Most Active</Tag>}
                    </td>
                    <td style={{ padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"700",color:C.green }}>{t.wins}</td>
                    <td style={{ padding:"10px",borderBottom:`1px solid #f0f0ee`,color:C.red }}>{t.losses}</td>
                    <td style={{ padding:"10px",borderBottom:`1px solid #f0f0ee`,fontWeight:"800",fontSize:"17px",color:dC(division) }}>{t.points}</td>
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
function MatchBoard({ myTeam, teams, requests, setRequests, matches, division, setDivision }) {
  const mobile = useMobile();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]   = useState({ date:"", time:"", court:"", notes:"", fee:"" });
  const [cf,   setCf]     = useState({ rid:null, type:"comment", msg:"", cdate:"", ctime:"", ccourt:"" });
  const [busy, setBusy]   = useState(false);
  const [swipeId, setSwipeId] = useState(null);
  const upF = (k,v) => setForm(f=>({...f,[k]:v}));
  const upC = (k,v) => setCf(c=>({...c,[k]:v}));

  const divReqs = requests.filter(r=>r.division===division).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const tName   = id => teams.find(t=>t.id===id)?.name ?? "Unknown";
  const atLimit = tid => { if(!myTeam)return false; return matches.filter(m=>(m.t1_id===myTeam.id&&m.t2_id===tid)||(m.t2_id===myTeam.id&&m.t1_id===tid)).length >= MAX_VS; };

  // Check for time conflict
  const hasConflict = (date, time) => {
    return matches.some(m => (m.t1_id===myTeam?.id||m.t2_id===myTeam?.id) && m.match_date===date && m.match_time===time && m.status==="confirmed" && !m.cancelled);
  };

  const postRequest = async () => {
    if (!form.date||!form.time||!form.court) return;
    if (hasConflict(form.date, form.time)) {
      alert("You already have a confirmed match at this time. Please choose a different time.");
      return;
    }
    setBusy(true);
    const { data, error } = await sb.from("match_requests").insert({
      team_id:myTeam.id, division, proposed_date:form.date, proposed_time:form.time,
      proposed_court:form.court, notes:form.notes, location_fee:form.fee, status:"open",
    }).select("*,responses:request_responses(*)").single();
    if (!error) { setRequests(p=>[data,...p]); setShowForm(false); setForm({date:"",time:"",court:"",notes:"",fee:""}); }
    setBusy(false);
  };

  const acceptReq = async (req) => {
    if (atLimit(req.team_id)) { alert(`Max ${MAX_VS} matches vs this team this season.`); return; }
    if (hasConflict(req.proposed_date, req.proposed_time)) { alert("You already have a match at this time. Please counter-propose a different time."); return; }
    setBusy(true);
    await sb.from("match_requests").update({ status:"accepted", updated_at:new Date().toISOString() }).eq("id", req.id);
    await sb.from("matches").insert({ request_id:req.id, t1_id:req.team_id, t2_id:myTeam.id, division, match_date:req.proposed_date, match_time:req.proposed_time, court:req.proposed_court, status:"confirmed" });
    setRequests(p=>p.map(r=>r.id===req.id?{...r,status:"accepted"}:r));
    setSwipeId(null);
    setBusy(false);
  };

  const acceptCounter = async (req, res) => {
    setBusy(true);
    await sb.from("match_requests").update({ status:"accepted", updated_at:new Date().toISOString() }).eq("id", req.id);
    await sb.from("matches").insert({ request_id:req.id, t1_id:req.team_id, t2_id:res.team_id, division, match_date:res.counter_date||req.proposed_date, match_time:res.counter_time||req.proposed_time, court:res.counter_court||req.proposed_court, status:"confirmed" });
    setRequests(p=>p.map(r=>r.id===req.id?{...r,status:"accepted"}:r));
    setBusy(false);
  };

  const submitComment = async (rid) => {
    if (!cf.msg.trim()) return;
    setBusy(true);
    const { data, error } = await sb.from("request_responses").insert({
      request_id:rid, team_id:myTeam.id, team_name:myTeam.name, type:cf.type, message:cf.msg,
      counter_date:cf.cdate||"", counter_time:cf.ctime||"", counter_court:cf.ccourt||"",
    }).select().single();
    if (!error) setRequests(p=>p.map(r=>r.id===rid?{...r,responses:[...(r.responses||[]),data]}:r));
    setCf({ rid:null, type:"comment", msg:"", cdate:"", ctime:"", ccourt:"" });
    setBusy(false);
  };

  const cancelReq = async (rid) => {
    await sb.from("match_requests").update({ status:"cancelled" }).eq("id", rid);
    setRequests(p=>p.map(r=>r.id===rid?{...r,status:"cancelled"}:r));
  };

  // Swipeable request card
  const SwipeableCard = ({ req }) => {
    const isOwn     = req.team_id === myTeam?.id;
    const isAcc     = req.status  === "accepted";
    const canAct    = myTeam && !isOwn && !isAcc && myTeam.division===req.division;
    const overLimit = canAct && atLimit(req.team_id);
    const showCF    = cf.rid === req.id;
    const responses = req.responses || [];
    const swiped    = swipeId === req.id;

    const swipeRef = useSwipe(
      () => canAct && !overLimit && setSwipeId(req.id),
      () => setSwipeId(null)
    );

    return (
      <div style={{ position:"relative", marginBottom:"12px", overflow:"hidden", borderRadius:"12px" }}>
        {/* Swipe action reveal */}
        {swiped && canAct && (
          <div style={{ position:"absolute", inset:0, background:C.green, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:"20px", gap:"12px", borderRadius:"12px" }}>
            <button style={btn(C.white,C.green,{border:`2px solid ${C.green}`})} onClick={()=>acceptReq(req)}>Accept Match</button>
            <button style={btn(C.white,C.text,{border:`2px solid ${C.border}`})} onClick={()=>setSwipeId(null)}>Cancel</button>
          </div>
        )}
        <div ref={swipeRef} style={{ ...card(), borderLeft:`4px solid ${isAcc?C.green:C.blue}`, opacity:isAcc?.7:1, transition:"transform .2s", transform:swiped?"translateX(-80px)":"translateX(0)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"8px", marginBottom:"12px" }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"5px", flexWrap:"wrap" }}>
                <span style={{ fontSize:"17px", fontWeight:"700" }}>{tName(req.team_id)}</span>
                {isOwn && <Tag c="gray">Your request</Tag>}
              </div>
              <div style={{ fontSize:"13px", color:"#555", display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"3px" }}>
                <span>📅 {req.proposed_date}</span>
                <span>🕐 {req.proposed_time}</span>
                <span>📍 {req.proposed_court}</span>
              </div>
              {req.notes && <div style={{ fontSize:"12px", color:C.muted }}>{req.notes}</div>}
              {req.location_fee && <div style={{ fontSize:"12px", color:C.amber, fontWeight:"500" }}>💰 Location fee: {req.location_fee}</div>}
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px" }}>
              <Tag c={isAcc?"green":"blue"}>{isAcc?"Matched":"Open"}</Tag>
              <span style={{ fontSize:"11px", color:C.faint }}>{timeAgo(req.created_at)}</span>
              <span style={{ fontSize:"11px", color:C.faint }}>{responses.length} response{responses.length!==1?"s":""}</span>
            </div>
          </div>

          {responses.length > 0 && (
            <div style={{ background:C.bg, borderRadius:"8px", padding:"12px", marginBottom:"12px" }}>
              <Lbl>Responses</Lbl>
              {responses.map(r => (
                <div key={r.id} style={{ padding:"9px 0", borderBottom:`1px solid #eee` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"4px", flexWrap:"wrap" }}>
                    <span style={{ fontWeight:"700", fontSize:"13px" }}>{r.team_name}</span>
                    <Tag c={r.type==="counter"?"amber":"blue"}>{r.type==="counter"?"Counter":"Comment"}</Tag>
                  </div>
                  <div style={{ fontSize:"13px", color:C.text, lineHeight:"1.5" }}>{r.message}</div>
                  {r.type==="counter" && r.counter_date && (
                    <div style={{ fontSize:"12px", color:C.amber, marginTop:"4px", fontWeight:"500" }}>Proposes: {r.counter_date}{r.counter_time?` at ${r.counter_time}`:""}{r.counter_court?` · ${r.counter_court}`:""}</div>
                  )}
                  {isOwn && r.type==="counter" && !isAcc && (
                    <button style={btn(C.green,"#fff",{marginTop:"8px",fontSize:"12px",padding:"6px 14px",minHeight:"36px"})} onClick={()=>acceptCounter(req,r)}>Accept this counter</button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {canAct && !showCF && !overLimit && !swiped && <>
              <button style={btn(C.green,"#fff",{minHeight:"44px"})} onClick={()=>acceptReq(req)}>Accept</button>
              <button style={btn(C.gray,"#fff",{fontSize:"13px",minHeight:"44px"})} onClick={()=>setCf({rid:req.id,type:"comment",msg:"",cdate:"",ctime:"",ccourt:""})}>Comment</button>
              <button style={btn(C.amber,"#fff",{minHeight:"44px"})} onClick={()=>setCf({rid:req.id,type:"counter",msg:"",cdate:"",ctime:"",ccourt:""})}>Counter</button>
            </>}
            {canAct && overLimit && <span style={{ fontSize:"12px", color:C.faint }}>Max {MAX_VS} matches vs this team.</span>}
            {isOwn && !isAcc && <button style={btn(C.red,"#fff",{fontSize:"12px",padding:"6px 14px",minHeight:"40px"})} onClick={()=>cancelReq(req.id)}>Cancel request</button>}
            {mobile && canAct && !overLimit && <span style={{ fontSize:"11px", color:C.faint, alignSelf:"center" }}>← Swipe left to accept</span>}
          </div>

          {showCF && (
            <div style={{ background:C.bg, border:`1.5px solid ${cf.type==="counter"?"#f59e0b":C.blueBorder}`, borderRadius:"8px", padding:"14px", marginTop:"12px" }}>
              <div style={{ fontSize:"15px", fontWeight:"700", marginBottom:"10px", color:cf.type==="counter"?C.amber:C.blue }}>
                {cf.type==="counter" ? "Counter proposal" : "Leave a comment"}
              </div>
              <Lbl>Message</Lbl>
              <input style={{ ...inp(), marginBottom:"10px" }} placeholder={cf.type==="counter"?"e.g. That time doesn't work — how about...":"e.g. We're interested!"} value={cf.msg} onChange={e=>upC("msg",e.target.value)}/>
              {cf.type==="counter" && (
                <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr", gap:"8px", marginBottom:"12px" }}>
                  <div><Lbl>Alt date</Lbl><input style={inp()} placeholder="Mar 25" value={cf.cdate} onChange={e=>upC("cdate",e.target.value)}/></div>
                  <div><Lbl>Alt time</Lbl><input style={inp()} placeholder="2:00 PM" value={cf.ctime} onChange={e=>upC("ctime",e.target.value)}/></div>
                  <div><Lbl>Alt court</Lbl><input style={inp()} placeholder="Court name" value={cf.ccourt} onChange={e=>upC("ccourt",e.target.value)}/></div>
                </div>
              )}
              <div style={{ display:"flex", gap:"8px" }}>
                <button style={btn(cf.type==="counter"?C.amber:C.text,"#fff",{minHeight:"44px"})} onClick={()=>submitComment(req.id)} disabled={!cf.msg.trim()||busy}>
                  {cf.type==="counter" ? "Send counter" : "Post comment"}
                </button>
                <button style={btn(C.gray,"#fff",{minHeight:"44px"})} onClick={()=>setCf({rid:null,type:"comment",msg:"",cdate:"",ctime:"",ccourt:""})}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"12px", marginBottom:"8px" }}>
        <div>
          <div style={{ fontSize:mobile?"22px":"26px", fontWeight:"700", letterSpacing:"-.5px" }}>Match Board</div>
          <div style={{ fontSize:"11px", color:C.faint, textTransform:"uppercase", letterSpacing:".5px", marginBottom:"20px" }}>Post open availability · Any team in your division can accept</div>
        </div>
        {myTeam?.approved && <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={()=>setShowForm(s=>!s)}>{showForm?"Cancel":"+ Post Availability"}</button>}
      </div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
        <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}/>
        <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")}/>
      </div>

      {/* How it works */}
      <div style={{ background:C.blueBg, border:`1px solid ${C.blueBorder}`, borderRadius:"10px", padding:"14px 16px", marginBottom:"20px", display:"grid", gridTemplateColumns:mobile?"1fr 1fr":"repeat(4,1fr)", gap:"12px" }}>
        {[["1. Post","Share your date, time, and court."],["2. Respond","Any team accepts, comments, or counters."],["3. Confirm","Accepting locks in the match."],["4. Play","Submit scores within 24 hrs."]].map(([t,d]) => (
          <div key={t}><div style={{ fontSize:"12px", fontWeight:"700", color:"#1d4ed8", marginBottom:"3px" }}>{t}</div><div style={{ fontSize:"12px", color:"#555", lineHeight:"1.5" }}>{d}</div></div>
        ))}
      </div>

      {/* Post form */}
      {showForm && (
        <div style={{ ...card(), marginBottom:"20px", border:`2px solid ${C.text}` }}>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"4px" }}>Post your availability</div>
          <p style={{ fontSize:"13px", color:C.muted, marginBottom:"16px" }}>You are not picking an opponent. Any team in your division can respond.</p>
          <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"1fr 1fr", gap:"12px" }}>
            <div>
              <Lbl>Available date</Lbl>
              <input style={{ ...inp(), marginBottom:"12px" }} placeholder="e.g. Mar 25" value={form.date} onChange={e=>upF("date",e.target.value)}/>
              <Lbl>Available time</Lbl>
              <input style={inp()} placeholder="e.g. 10:00 AM" value={form.time} onChange={e=>upF("time",e.target.value)}/>
            </div>
            <div>
              <Lbl>Court / location</Lbl>
              <input style={{ ...inp(), marginBottom:"12px" }} placeholder="e.g. Freedom Park Courts" value={form.court} onChange={e=>upF("court",e.target.value)}/>
              <Lbl>Notes (optional)</Lbl>
              <input style={inp()} placeholder="e.g. Flexible on time" value={form.notes} onChange={e=>upF("notes",e.target.value)}/>
            </div>
          </div>
          <Lbl>Location fee (optional)</Lbl>
          <input style={{ ...inp(), marginBottom:"14px" }} placeholder="e.g. $5 guest fee — leave blank if free" value={form.fee} onChange={e=>upF("fee",e.target.value)}/>
          <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={postRequest} disabled={busy||!form.date||!form.time||!form.court}>Post to Match Board</button>
        </div>
      )}

      {divReqs.length===0 && <div style={{ ...card(), textAlign:"center", padding:"48px 20px" }}><p style={{ color:C.faint }}>No availability posted yet in this division. Be the first!</p></div>}
      {divReqs.map(req => <SwipeableCard key={req.id} req={req}/>)}
    </div>
  );
}

// ── SCORES ────────────────────────────────────────────────────
function Scores({ myTeam, teams, matches, setMatches, openChat, openCancel }) {
  const mobile = useMobile();
  const [entry, setEntry] = useState({});
  const upE = (mid,k,v) => setEntry(e=>({...e,[mid]:{...(e[mid]||{}),[k]:v}}));
  const myMatches = matches.filter(m => (m.t1_id===myTeam?.id||m.t2_id===myTeam?.id) && !m.cancelled);

  const submitScore = async (mid) => {
    const s = entry[mid]||{};
    const games = [];
    for (let i=1;i<=3;i++) {
      const s1=parseInt(s[`g${i}s1`]), s2=parseInt(s[`g${i}s2`]);
      if (!isNaN(s1)&&!isNaN(s2)&&s[`g${i}s1`]!=="") games.push({s1,s2});
    }
    if (games.length < 2) return;
    const m  = matches.find(x=>x.id===mid);
    const w1 = games.filter(g=>g.s1>g.s2).length, w2 = games.filter(g=>g.s2>g.s1).length;
    const winner_id = w1>w2?m.t1_id:m.t2_id, loser_id = winner_id===m.t1_id?m.t2_id:m.t1_id;
    const hasSub = !!document.getElementById(`sub-${mid}`)?.checked;
    await sb.from("matches").update({ status:"score_pending", games, score_t1:w1, score_t2:w2, winner_id, loser_id, submitted_by:myTeam.id, has_sub:hasSub, updated_at:new Date().toISOString() }).eq("id", mid);
    setMatches(p=>p.map(m=>m.id===mid?{...m,status:"score_pending",games,winner_id,loser_id,submitted_by:myTeam.id}:m));
    setEntry(e=>{ const n={...e}; delete n[mid]; return n; });
  };

  const confirmScore = async (mid) => {
    await sb.rpc("confirm_match_score", { match_id:mid });
    setMatches(p=>p.map(x=>x.id===mid?{...x,status:"completed"}:x));
  };

  const tName = id => teams.find(t=>t.id===id)?.name??"Unknown";

  return (
    <div>
      <div style={{ fontSize:mobile?"22px":"26px", fontWeight:"700", letterSpacing:"-.5px", marginBottom:"2px" }}>Score submission</div>
      <div style={{ fontSize:"11px", color:C.faint, textTransform:"uppercase", letterSpacing:".5px", marginBottom:"20px" }}>Submit after playing · Opponent confirms within 24 hrs · Auto-confirms if no response</div>
      {myMatches.length===0 && <div style={{ ...card(), textAlign:"center", padding:"48px 20px" }}><p style={{ color:C.faint }}>No confirmed matches yet. Accept a request on the Match Board.</p></div>}
      {myMatches.map(m => {
        const opp = teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
        const s   = entry[m.id]||{};
        const canSubmit  = m.status==="confirmed";
        const canConfirm = m.status==="score_pending" && m.submitted_by!==myTeam?.id;
        return (
          <div key={m.id} style={{ ...card(), marginBottom:"14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px", flexWrap:"wrap", gap:"8px" }}>
              <div>
                <div style={{ fontSize:"18px", fontWeight:"700", marginBottom:"3px" }}>vs {opp?.name}</div>
                <div style={{ fontSize:"12px", color:C.muted }}>{m.match_date} · {m.match_time} · {m.court}</div>
              </div>
              <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
                <Tag c={m.status==="confirmed"?"green":m.status==="score_pending"?"amber":"gray"}>
                  {m.status==="confirmed"?"Confirmed":m.status==="score_pending"?"Score Pending":"Completed"}
                </Tag>
                <button style={btn(C.text,"#fff",{fontSize:"12px",padding:"5px 12px",minHeight:"36px"})} onClick={()=>openChat(m)}>Chat</button>
                {m.status==="confirmed" && <button style={btn(C.red,"#fff",{fontSize:"12px",padding:"5px 12px",minHeight:"36px"})} onClick={()=>openCancel(m)}>Cancel</button>}
              </div>
            </div>
            {canSubmit && <>
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"14px" }}>
                {[1,2,3].map(g => (
                  <div key={g} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:"8px", padding:"12px" }}>
                    <Lbl>Game {g}{g===3?" (if needed)":""}</Lbl>
                    <div style={{ display:"flex", gap:"7px", alignItems:"center" }}>
                      <input style={{ ...inp({width:"52px",textAlign:"center",fontSize:"17px"}) }} type="number" min="0" max="25" placeholder="—" value={s[`g${g}s1`]||""} onChange={e=>upE(m.id,`g${g}s1`,e.target.value)}/>
                      <span style={{ color:"#ccc", fontSize:"20px" }}>–</span>
                      <input style={{ ...inp({width:"52px",textAlign:"center",fontSize:"17px"}) }} type="number" min="0" max="25" placeholder="—" value={s[`g${g}s2`]||""} onChange={e=>upE(m.id,`g${g}s2`,e.target.value)}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
                <input type="checkbox" id={`sub-${m.id}`} style={{ accentColor:C.blue, width:"16px", height:"16px" }}/>
                <label htmlFor={`sub-${m.id}`} style={{ fontSize:"13px", color:C.muted, cursor:"pointer" }}>A sub played in this match</label>
              </div>
              <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={()=>submitScore(m.id)}>Submit score</button>
            </>}
            {m.status==="score_pending" && !canConfirm && <Alert type="warn">Score submitted — waiting for {opp?.name} to confirm. Auto-confirms in 24 hours.</Alert>}
            {canConfirm && <>
              <p style={{ fontSize:"13px", marginBottom:"12px" }}>Your opponent submitted a score. Confirm or dispute:</p>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                <button style={btn(C.green,"#fff",{minHeight:"44px"})} onClick={()=>confirmScore(m.id)}>Confirm score</button>
                <button style={btn(C.red,"#fff",{minHeight:"44px"})} onClick={async()=>{ await sb.from("matches").update({status:"disputed"}).eq("id",m.id); setMatches(p=>p.map(x=>x.id===m.id?{...x,status:"disputed"}:x)); }}>Dispute</button>
              </div>
            </>}
            {/* Game scores history */}
            {m.games && m.games.length > 0 && (
              <div style={{ marginTop:"12px", background:C.bg, borderRadius:"8px", padding:"10px 12px" }}>
                <Lbl>Game scores</Lbl>
                <div style={{ display:"flex", gap:"14px" }}>
                  {m.games.map((g,i) => (
                    <div key={i} style={{ textAlign:"center" }}>
                      <div style={{ fontSize:"11px", color:C.faint, marginBottom:"3px" }}>Game {i+1}</div>
                      <div style={{ fontSize:"16px", fontWeight:"700" }}>{g.s1}–{g.s2}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── STANDINGS ─────────────────────────────────────────────────
function Standings({ myTeam, teams, matches, division, setDivision }) {
  const mobile   = useMobile();
  const [view, setView] = useState("current");
  const dt = [...teams.filter(t=>t.division===division&&t.approved)].sort((a,b)=>b.points-a.points||b.wins-a.wins);

  // Most active: team with most matches played
  const matchCounts = teams.map(t => ({
    id:t.id,
    count: matches.filter(m=>m.t1_id===t.id||m.t2_id===t.id).length
  }));
  const maxMatches = Math.max(...matchCounts.map(x=>x.count));
  const mostActiveId = maxMatches > 0 ? matchCounts.find(x=>x.count===maxMatches)?.id : null;

  return (
    <div>
      <div style={{ fontSize:mobile?"22px":"26px", fontWeight:"700", letterSpacing:"-.5px", marginBottom:"2px" }}>Standings</div>
      <div style={{ fontSize:"11px", color:C.faint, textTransform:"uppercase", letterSpacing:".5px", marginBottom:"20px" }}>{SEASON} · 2 pts per win · Top {PLAYOFFS} advance to playoffs</div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap" }}>
        <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}/>
        <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")}/>
      </div>
      <div style={card()}>
        <div style={{ fontSize:"15px", fontWeight:"700", marginBottom:"14px" }}>{dL(division)} — Full standings</div>
        <div className="table-scroll">
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"400px" }}>
            <thead>
              <tr>
                {["Rank","Team",!mobile&&"Players","W","L","Pts","Win%","Streak"].filter(Boolean).map(h=>(
                  <th key={h} style={{ textAlign:"left", color:C.muted, fontSize:"11px", fontWeight:"600", letterSpacing:".8px", textTransform:"uppercase", padding:"8px 10px", borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dt.map((t,i) => {
                const pct = t.wins+t.losses>0 ? Math.round(t.wins/(t.wins+t.losses)*100) : 0;
                const playoff = i < PLAYOFFS;
                const isMe = t.id === myTeam?.id;
                const isActive = t.id === mostActiveId;
                // Win streak: count consecutive wins from most recent matches
                const teamMatches = matches.filter(m=>(m.t1_id===t.id||m.t2_id===t.id)&&m.status==="completed").sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
                let streak = 0;
                for (const m of teamMatches) { if (m.winner_id===t.id) streak++; else break; }
                return (
                  <tr key={t.id} style={{ background:isMe?"#eff6ff":"" }}>
                    <td style={{ padding:"10px", borderBottom:`1px solid #f0f0ee`, fontWeight:"800", color:playoff?C.blue:"#ddd", fontSize:"20px", width:"40px" }}>{i+1}</td>
                    <td style={{ padding:"10px", borderBottom:`1px solid #f0f0ee`, fontWeight:"700" }}>
                      <div>{t.name}</div>
                      <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginTop:"3px" }}>
                        {isMe      && <Tag sm c="blue">You</Tag>}
                        {i===0     && <Tag sm c="gray">Leader</Tag>}
                        {playoff   && <Tag sm c="blue">Playoffs</Tag>}
                        {isActive  && <Tag sm c="purple">Most Active</Tag>}
                      </div>
                    </td>
                    {!mobile && <td style={{ padding:"10px", borderBottom:`1px solid #f0f0ee`, color:C.muted, fontSize:"12px" }}>{t.p1_name} &amp; {t.p2_name}</td>}
                    <td style={{ padding:"10px", borderBottom:`1px solid #f0f0ee`, fontWeight:"700", color:C.green, fontSize:"15px" }}>{t.wins}</td>
                    <td style={{ padding:"10px", borderBottom:`1px solid #f0f0ee`, color:C.red, fontSize:"15px" }}>{t.losses}</td>
                    <td style={{ padding:"10px", borderBottom:`1px solid #f0f0ee`, fontWeight:"800", fontSize:"18px", color:dC(division) }}>{t.points}</td>
                    <td style={{ padding:"10px", borderBottom:`1px solid #f0f0ee`, color:C.muted }}>{pct}%</td>
                    <td style={{ padding:"10px", borderBottom:`1px solid #f0f0ee`, color:streak>=3?C.green:C.muted, fontWeight:streak>=3?"700":"400" }}>{streak>0?`${streak}W`:"-"}</td>
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

// ── DIVISION CHAT ─────────────────────────────────────────────
function DivisionChat({ myTeam, division, setDivision }) {
  const mobile = useMobile();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  const myDiv = myTeam?.division;

  useEffect(() => {
    if (!myDiv) return;
    sb.from("division_chats").select("*").eq("division", division).order("created_at", {ascending:true}).limit(200).then(({data}) => {
      if (data) setMsgs(data);
      setTimeout(() => endRef.current?.scrollIntoView(), 100);
    });
    const ch = sb.channel(`dc-${division}`)
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"division_chats", filter:`division=eq.${division}` }, p => {
        setMsgs(prev => [...prev, p.new]);
        setTimeout(() => endRef.current?.scrollIntoView({behavior:"smooth"}), 50);
      }).subscribe();
    return () => sb.removeChannel(ch);
  }, [division, myDiv]);

  const send = async () => {
    if (!input.trim() || !myTeam?.approved) return;
    await sb.from("division_chats").insert({ division, team_id:myTeam.id, team_name:myTeam.name, is_admin:false, content:input.trim() });
    setInput("");
  };

  const canPost = myTeam?.approved && myTeam.division === division;

  return (
    <div>
      <div style={{ fontSize:mobile?"22px":"26px", fontWeight:"700", letterSpacing:"-.5px", marginBottom:"2px" }}>Division Chat</div>
      <div style={{ fontSize:"11px", color:C.faint, textTransform:"uppercase", letterSpacing:".5px", marginBottom:"16px" }}>Private to your division</div>

      <div style={{ display:"flex", gap:"8px", marginBottom:"18px" }}>
        <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}/>
        <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")}/>
      </div>

      {myTeam && myTeam.division !== division && (
        <Alert type="warn">You are viewing the <strong>{dL(division)}</strong> chat. You can only post in your own division ({dL(myTeam.division)}).</Alert>
      )}

      <div style={{ ...card(), display:"flex", flexDirection:"column", height:mobile?"calc(100vh - 260px)":"480px" }}>
        <div style={{ flex:1, overflowY:"auto", paddingBottom:"6px" }}>
          {msgs.length===0 && <div style={{ textAlign:"center", color:C.faint, fontSize:"13px", padding:"24px 0" }}>No messages yet in this division. Be the first!</div>}
          {msgs.map(m => (
            <div key={m.id} style={{ marginBottom:"18px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px", flexWrap:"wrap" }}>
                <span style={{ fontSize:"13px", fontWeight:"700", color:m.is_admin?C.amber:dC(division) }}>{m.team_name}</span>
                {m.is_admin && <Tag c="amber">Admin</Tag>}
                <span style={{ fontSize:"11px", color:C.faint }}>{timeAgo(m.created_at)}</span>
              </div>
              <div style={{ fontSize:"14px", color:"#222", lineHeight:"1.6" }}>{m.content}</div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:"12px", marginTop:"6px" }}>
          {!canPost && <p style={{ fontSize:"12px", color:C.faint, marginBottom:"8px" }}>
            {!myTeam?.approved ? "Account must be activated to chat." : "You can only post in your own division."}
          </p>}
          <div style={{ display:"flex", gap:"8px" }}>
            <input style={{ ...inp(), flex:1 }} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={canPost?`Message ${dL(division)} division...`:"Read only"} disabled={!canPost}/>
            <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={send} disabled={!canPost}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ADMIN PANEL ───────────────────────────────────────────────
function AdminPanel({ teams, setTeams, matches, setMatches, userId }) {
  const mobile  = useMobile();
  const [tab,   setTab]   = useState("pending");
  const [msgs,  setMsgs]  = useState([]);
  const [annTxt,setAnnTxt]= useState("");
  const [dmTeam,setDmTeam]= useState("");
  const [dmSubj,setDmSubj]= useState("");
  const [dmBody,setDmBody]= useState("");
  const [log,   setLog]   = useState([]);
  const [editM, setEditM] = useState(null);
  const [editScores, setEditScores] = useState({});
  const pending  = teams.filter(t=>!t.approved);
  const disputes = matches.filter(m=>m.status==="disputed");
  const tName    = id => teams.find(t=>t.id===id)?.name ?? "Unknown";
  const totalRev = teams.filter(t=>t.paid).length * 25;

  const logAction = async (action, targetType, targetId, details) => {
    await sb.from("admin_activity_log").insert({ admin_id:userId, action, target_type:targetType, target_id:targetId, details });
    setLog(p=>[{action,target_type:targetType,details,created_at:new Date().toISOString()},...p].slice(0,50));
  };

  useEffect(() => {
    if (tab==="log") sb.from("admin_activity_log").select("*").order("created_at",{ascending:false}).limit(50).then(({data})=>{ if(data)setLog(data); });
  }, [tab]);

  const approve    = async id => { await sb.from("teams").update({approved:true}).eq("id",id); setTeams(p=>p.map(t=>t.id===id?{...t,approved:true}:t)); await logAction("Approved team",  "team",id,tName(id)); };
  const markPaid   = async id => { await sb.from("teams").update({paid:true}).eq("id",id);     setTeams(p=>p.map(t=>t.id===id?{...t,paid:true}:t));     await logAction("Marked paid",    "team",id,tName(id)); };
  const removeTeam = async id => { if(!window.confirm("Remove this team?"))return; await sb.from("teams").delete().eq("id",id); setTeams(p=>p.filter(t=>t.id!==id)); await logAction("Removed team","team",id,tName(id)); };

  const editTeam = async (id, updates) => {
    await sb.from("teams").update(updates).eq("id",id);
    setTeams(p=>p.map(t=>t.id===id?{...t,...updates}:t));
    await logAction("Edited team", "team", id, JSON.stringify(updates));
  };

  const resolveDispute = async (mid, winnerId, loserId) => {
    await sb.from("matches").update({ status:"completed", winner_id:winnerId, loser_id:loserId }).eq("id",mid);
    await sb.from("teams").update({ wins:sb.rpc("raw",{sql:`wins+1`}), points:sb.rpc("raw",{sql:`points+2`}) }).eq("id",winnerId);
    await sb.from("teams").update({ losses:sb.rpc("raw",{sql:`losses+1`}) }).eq("id",loserId);
    setMatches(p=>p.map(m=>m.id===mid?{...m,status:"completed",winner_id:winnerId}:m));
    await logAction("Resolved dispute","match",mid,`Winner: ${tName(winnerId)}`);
  };

  const editScore = async (mid) => {
    const s = editScores[mid]||{};
    const updates = {};
    if (s.score_t1 !== undefined) updates.score_t1 = parseInt(s.score_t1);
    if (s.score_t2 !== undefined) updates.score_t2 = parseInt(s.score_t2);
    if (s.winner_id) updates.winner_id = s.winner_id;
    await sb.from("matches").update(updates).eq("id",mid);
    setMatches(p=>p.map(m=>m.id===mid?{...m,...updates}:m));
    setEditM(null);
    await logAction("Edited score","match",mid,JSON.stringify(updates));
  };

  const postAnn = async () => {
    if (!annTxt.trim()) return;
    const { data } = await sb.from("division_chats").insert([
      { division:"low",  team_name:"League Admin", is_admin:true, content:annTxt.trim() },
      { division:"high", team_name:"League Admin", is_admin:true, content:annTxt.trim() },
    ]).select();
    setAnnTxt("");
    await logAction("Posted announcement","system",null,annTxt.trim().slice(0,80));
    alert("Announcement posted to both division chats.");
  };

  const sendDm = async () => {
    if (!dmTeam||!dmSubj||!dmBody) return;
    await sb.from("admin_messages").insert({ from_admin:userId, to_team_id:dmTeam, subject:dmSubj, content:dmBody });
    setDmTeam(""); setDmSubj(""); setDmBody("");
    await logAction("Sent direct message","team",dmTeam,dmSubj);
    alert("Message sent.");
  };

  const tabs = [["pending",`Pending (${pending.length})`],["disputes",`Disputes (${disputes.length})`],["teams","All Teams"],["scores","Scores"],["payments","Payments"],["dm","Message"],["announce","Announce"],["log","Activity Log"]];

  const tdS = (s={}) => ({ padding:"9px 10px", borderBottom:`1px solid #f0f0ee`, fontSize:"13px", ...s });

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px", flexWrap:"wrap" }}>
        <div style={{ fontSize:mobile?"22px":"26px", fontWeight:"700", letterSpacing:"-.5px" }}>Admin Panel</div>
        <Tag c="amber">Jimmie · Ascend PB</Tag>
      </div>
      <div style={{ fontSize:"11px", color:C.faint, textTransform:"uppercase", letterSpacing:".5px", marginBottom:"20px" }}>{SEASON} · League management</div>

      <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"20px" }}>
        {tabs.map(([id,lbl]) => <button key={id} style={btn(tab===id?C.text:C.gray,"#fff",{fontSize:"12px",padding:"8px 14px",minHeight:"40px"})} onClick={()=>setTab(id)}>{lbl}</button>)}
      </div>

      <div style={card()}>

        {/* PENDING */}
        {tab==="pending" && <>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"14px" }}>Pending registrations ({pending.length})</div>
          {pending.length===0 ? <p style={{ fontSize:"13px", color:C.muted }}>No pending registrations.</p> :
          pending.map(t => (
            <div key={t.id} style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"3px" }}>{t.name}</div>
              <div style={{ fontSize:"12px", color:C.muted, marginBottom:"4px" }}>{t.p1_name} ({t.p1_skill}) and {t.p2_name} ({t.p2_skill})</div>
              <div style={{ fontSize:"12px", color:C.muted, marginBottom:"10px" }}>{t.p1_email} · {dL(t.division)}</div>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                <Tag c={t.paid?"green":"red"}>{t.paid?"Paid":"Unpaid"}</Tag>
                {!t.paid && <button style={btn(C.amber,"#fff",{fontSize:"12px",padding:"6px 12px",minHeight:"40px"})} onClick={()=>markPaid(t.id)}>Mark paid</button>}
                <button style={btn(C.green,"#fff",{fontSize:"12px",padding:"6px 12px",minHeight:"40px"})} onClick={()=>approve(t.id)}>Approve</button>
                <button style={btn(C.red,"#fff",{fontSize:"12px",padding:"6px 12px",minHeight:"40px"})} onClick={()=>removeTeam(t.id)}>Remove</button>
              </div>
            </div>
          ))}
        </>}

        {/* DISPUTES */}
        {tab==="disputes" && <>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"14px" }}>Score disputes ({disputes.length})</div>
          {disputes.length===0 ? <p style={{ fontSize:"13px", color:C.muted }}>No disputes. All scores confirmed.</p> :
          disputes.map(m => (
            <div key={m.id} style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"3px" }}>{tName(m.t1_id)} vs {tName(m.t2_id)}</div>
              <div style={{ fontSize:"12px", color:C.muted, marginBottom:"4px" }}>{m.match_date}</div>
              {m.games && <div style={{ fontSize:"12px", color:C.muted, marginBottom:"10px" }}>Submitted scores: {m.games.map(g=>`${g.s1}-${g.s2}`).join("  ")}</div>}
              <p style={{ fontSize:"13px", marginBottom:"10px" }}>Select the winning team:</p>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                <button style={btn(C.green,"#fff",{minHeight:"44px"})} onClick={()=>resolveDispute(m.id,m.t1_id,m.t2_id)}>{tName(m.t1_id)} won</button>
                <button style={btn(C.green,"#fff",{minHeight:"44px"})} onClick={()=>resolveDispute(m.id,m.t2_id,m.t1_id)}>{tName(m.t2_id)} won</button>
              </div>
            </div>
          ))}
        </>}

        {/* ALL TEAMS */}
        {tab==="teams" && <>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"14px" }}>All teams ({teams.length})</div>
          {teams.map(t => (
            <div key={t.id} style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px" }}>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:"700" }}>{t.name}</div>
                  <div style={{ fontSize:"12px", color:C.muted }}>{t.p1_name} ({t.p1_skill}) and {t.p2_name} ({t.p2_skill})</div>
                  <div style={{ fontSize:"12px", color:C.muted }}>{t.p1_email}</div>
                  <div style={{ display:"flex", gap:"6px", marginTop:"6px", flexWrap:"wrap" }}>
                    <Tag c={dL(t.division)==="3.0–3.5"?"gray":"blue"}>{dL(t.division)}</Tag>
                    <Tag c={t.paid?"green":"red"}>{t.paid?"Paid":"Unpaid"}</Tag>
                    <Tag c={t.approved?"green":"amber"}>{t.approved?"Active":"Pending"}</Tag>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                  <button style={btn(C.blue,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>setEditM({type:"team",id:t.id,...t})}>Edit</button>
                  <button style={btn(C.red,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>removeTeam(t.id)}>Remove</button>
                </div>
              </div>
              {/* Team edit form */}
              {editM?.type==="team" && editM.id===t.id && (
                <div style={{ marginTop:"12px", background:C.bg, borderRadius:"8px", padding:"14px" }}>
                  <div style={{ fontSize:"14px", fontWeight:"700", marginBottom:"10px" }}>Edit Team</div>
                  <div style={{ display:"grid", gridTemplateColumns:mobile?"1fr":"1fr 1fr", gap:"10px", marginBottom:"12px" }}>
                    {[["name","Team Name"],["p1_name","Player 1 Name"],["p1_skill","P1 Skill"],["p2_name","Player 2 Name"],["p2_skill","P2 Skill"],["wins","Wins"],["losses","Losses"],["points","Points"]].map(([k,l]) => (
                      <div key={k}>
                        <Lbl>{l}</Lbl>
                        <input style={inp()} value={editM[k]||""} onChange={e=>setEditM(m=>({...m,[k]:e.target.value}))}/>
                      </div>
                    ))}
                    <div>
                      <Lbl>Division</Lbl>
                      <select style={{ ...inp(), appearance:"none" }} value={editM.division} onChange={e=>setEditM(m=>({...m,division:e.target.value}))}>
                        <option value="low">3.0–3.5</option>
                        <option value="high">3.5–4.0</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={()=>{ const{type,id,...updates}=editM; editTeam(id,updates); setEditM(null); }}>Save Changes</button>
                    <button style={btn(C.gray,"#fff",{minHeight:"44px"})} onClick={()=>setEditM(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>}

        {/* SCORES */}
        {tab==="scores" && <>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"14px" }}>Edit / Override Scores</div>
          <p style={{ fontSize:"13px", color:C.muted, marginBottom:"14px" }}>You can edit any match score at any time. Changes update standings automatically.</p>
          {matches.filter(m=>m.status==="completed"||m.status==="score_pending").slice(0,20).map(m => (
            <div key={m.id} style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px" }}>
                <div>
                  <div style={{ fontWeight:"700" }}>{tName(m.t1_id)} vs {tName(m.t2_id)}</div>
                  <div style={{ fontSize:"12px", color:C.muted }}>{m.match_date} · {m.games?.map(g=>`${g.s1}-${g.s2}`).join("  ")||"No scores yet"}</div>
                </div>
                <button style={btn(C.blue,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>setEditM(editM?.id===m.id?null:{type:"score",id:m.id,...m})}>Edit Score</button>
              </div>
              {editM?.type==="score" && editM.id===m.id && (
                <div style={{ marginTop:"10px", background:C.bg, borderRadius:"8px", padding:"12px" }}>
                  <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"10px" }}>
                    <div>
                      <Lbl>Team 1 sets won</Lbl>
                      <input style={{ ...inp({width:"70px"}) }} type="number" value={editScores[m.id]?.score_t1||""} onChange={e=>setEditScores(s=>({...s,[m.id]:{...(s[m.id]||{}),score_t1:e.target.value}}))}/>
                    </div>
                    <div>
                      <Lbl>Team 2 sets won</Lbl>
                      <input style={{ ...inp({width:"70px"}) }} type="number" value={editScores[m.id]?.score_t2||""} onChange={e=>setEditScores(s=>({...s,[m.id]:{...(s[m.id]||{}),score_t2:e.target.value}}))}/>
                    </div>
                    <div>
                      <Lbl>Winner</Lbl>
                      <select style={{ ...inp({width:"160px"}), appearance:"none" }} value={editScores[m.id]?.winner_id||""} onChange={e=>setEditScores(s=>({...s,[m.id]:{...(s[m.id]||{}),winner_id:e.target.value}}))} >
                        <option value="">Select winner...</option>
                        <option value={m.t1_id}>{tName(m.t1_id)}</option>
                        <option value={m.t2_id}>{tName(m.t2_id)}</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:"8px" }}>
                    <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={()=>editScore(m.id)}>Save Score</button>
                    <button style={btn(C.gray,"#fff",{minHeight:"44px"})} onClick={()=>setEditM(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>}

        {/* PAYMENTS */}
        {tab==="payments" && <>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"4px" }}>Payment Tracker</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:"10px", marginBottom:"20px" }}>
            {[
              {n:teams.filter(t=>t.paid).length, l:"Paid", c:C.green},
              {n:teams.filter(t=>!t.paid).length, l:"Unpaid", c:C.red},
              {n:teams.length, l:"Total Teams", c:C.blue},
              {n:`$${totalRev}`, l:"Revenue", c:C.purple},
            ].map((x,i) => (
              <div key={i} style={{ background:C.bg, borderRadius:"10px", padding:"14px", textAlign:"center" }}>
                <div style={{ fontSize:"24px", fontWeight:"800", color:x.c }}>{x.n}</div>
                <div style={{ fontSize:"11px", color:C.muted, textTransform:"uppercase", letterSpacing:".8px", marginTop:"4px" }}>{x.l}</div>
              </div>
            ))}
          </div>
          <div className="table-scroll">
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:"400px" }}>
              <thead><tr>{["Team","Division","Status","Amount","Action"].map(h=><th key={h} style={{ textAlign:"left", color:C.muted, fontSize:"11px", fontWeight:"600", letterSpacing:".8px", textTransform:"uppercase", padding:"8px 10px", borderBottom:`1px solid ${C.border}` }}>{h}</th>)}</tr></thead>
              <tbody>
                {teams.map(t => (
                  <tr key={t.id}>
                    <td style={tdS({fontWeight:"700"})}>{t.name}<div style={{fontSize:"11px",color:C.faint}}>{t.p1_email}</div></td>
                    <td style={tdS()}><Tag c={t.division==="low"?"gray":"blue"}>{dL(t.division)}</Tag></td>
                    <td style={tdS()}><Tag c={t.paid?"green":"red"}>{t.paid?"Paid":"Unpaid"}</Tag></td>
                    <td style={tdS({fontWeight:"700",color:t.paid?C.green:C.red})}>{t.paid?"$25":"—"}</td>
                    <td style={tdS()}>
                      {!t.paid && <button style={btn(C.amber,"#fff",{fontSize:"11px",padding:"5px 10px",minHeight:"36px"})} onClick={()=>markPaid(t.id)}>Mark paid</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* DIRECT MESSAGE */}
        {tab==="dm" && <>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"14px" }}>Direct Message to Team</div>
          <Lbl>Select team</Lbl>
          <select style={{ ...inp(), appearance:"none", marginBottom:"12px" }} value={dmTeam} onChange={e=>setDmTeam(e.target.value)}>
            <option value="">Choose a team...</option>
            {teams.filter(t=>t.approved).map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <Lbl>Subject</Lbl>
          <input style={{ ...inp(), marginBottom:"12px" }} placeholder="e.g. Score dispute follow-up" value={dmSubj} onChange={e=>setDmSubj(e.target.value)}/>
          <Lbl>Message</Lbl>
          <textarea style={{ ...inp({minHeight:"100px",resize:"vertical"}), marginBottom:"14px" }} placeholder="Write your message..." value={dmBody} onChange={e=>setDmBody(e.target.value)}/>
          <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={sendDm} disabled={!dmTeam||!dmSubj||!dmBody}>Send Message</button>
        </>}

        {/* ANNOUNCE */}
        {tab==="announce" && <>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"4px" }}>Post Announcement</div>
          <p style={{ fontSize:"13px", color:C.muted, marginBottom:"14px" }}>Posts to BOTH division chats simultaneously as "League Admin".</p>
          <Lbl>Message</Lbl>
          <textarea style={{ ...inp({minHeight:"100px",resize:"vertical"}), marginBottom:"14px" }} value={annTxt} placeholder="e.g. Week 4 window opens Monday. Get your matches scheduled!" onChange={e=>setAnnTxt(e.target.value)}/>
          <button style={btn(C.text,"#fff",{minHeight:"44px"})} onClick={postAnn}>Post to All Divisions</button>
        </>}

        {/* ACTIVITY LOG */}
        {tab==="log" && <>
          <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"14px" }}>Admin Activity Log</div>
          {log.length===0 ? <p style={{ fontSize:"13px", color:C.muted }}>No activity logged yet.</p> :
          log.map((l,i) => (
            <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"13px", fontWeight:"600" }}>{l.action}</div>
                  {l.details && <div style={{ fontSize:"12px", color:C.muted, marginTop:"2px" }}>{l.details}</div>}
                </div>
                <div style={{ fontSize:"11px", color:C.faint, whiteSpace:"nowrap" }}>{timeAgo(l.created_at)}</div>
              </div>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────
function Settings({ userId, myTeam, signOut }) {
  const mobile = useMobile();
  const [showNotifPrefs, setShowNotifPrefs] = useState(false);
  return (
    <div>
      <div style={{ fontSize:mobile?"22px":"26px", fontWeight:"700", letterSpacing:"-.5px", marginBottom:"20px" }}>Settings</div>
      {showNotifPrefs && <NotifPrefsModal userId={userId} onClose={()=>setShowNotifPrefs(false)}/>}
      <div style={card()}>
        {[
          { label:"Team", value:myTeam?.name||"—", sub:myTeam?`${myTeam.p1_name} and ${myTeam.p2_name}`:"Admin account" },
          { label:"Division", value:myTeam?dL(myTeam.division):"—" },
          { label:"Status", value:myTeam?.approved?"Active":"Pending" },
        ].map((r,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize:"14px", fontWeight:"600" }}>{r.label}</div>
              {r.sub && <div style={{ fontSize:"12px", color:C.muted }}>{r.sub}</div>}
            </div>
            <div style={{ fontSize:"14px", color:C.muted }}>{r.value}</div>
          </div>
        ))}
        <div style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
          <button style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", background:"none", border:"none", cursor:"pointer", padding:0, textAlign:"left", minHeight:"44px" }} onClick={()=>setShowNotifPrefs(true)}>
            <span style={{ fontSize:"14px", fontWeight:"600" }}>Notification preferences</span>
            <span style={{ color:C.muted, fontSize:"18px" }}>›</span>
          </button>
        </div>
        <div style={{ paddingTop:"16px" }}>
          <button style={btn(C.red,"#fff",{width:"100%"})} onClick={signOut}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────
function BottomNav({ tab, setTab, isAdmin, unreadCount }) {
  const tabs = isAdmin
    ? [["dashboard","Home"],["board","Board"],["scores","Scores"],["standings","Ranks"],["chat","Chat"],["admin","Admin"]]
    : [["dashboard","Home"],["board","Board"],["scores","Scores"],["standings","Ranks"],["chat","Chat"]];
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100, height:"64px", paddingBottom:"env(safe-area-inset-bottom)" }}>
      {tabs.map(([id,label]) => (
        <button key={id} onClick={()=>setTab(id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"3px", color:tab===id?C.blue:C.faint, fontSize:"10px", fontWeight:tab===id?"700":"500", borderTop:`2px solid ${tab===id?C.blue:"transparent"}`, position:"relative", minHeight:"64px" }}>
          <Icon n={id==="board"?"board":id==="scores"?"scores":id==="standings"?"standings":id==="chat"?"chat":id==="admin"?"admin":"home"} size={20}/>
          {label}
          {id==="chat" && unreadCount>0 && <span style={{ position:"absolute", top:"8px", right:"calc(50% - 18px)", background:C.red, color:"#fff", borderRadius:"50%", width:"16px", height:"16px", fontSize:"10px", fontWeight:"800", display:"flex", alignItems:"center", justifyContent:"center" }}>{unreadCount}</span>}
        </button>
      ))}
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────
export default function AscendLeague() {
  useFonts();
  const mobile = useMobile();
  const [session,       setSession]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [userId,        setUserId]        = useState(null);
  const [myTeam,        setMyTeam]        = useState(null);
  const [isAdmin,       setIsAdmin]       = useState(false);
  const [tab,           setTab]           = useState("dashboard");
  const [division,      setDivision]      = useState("low");
  const [teams,         setTeams]         = useState([]);
  const [matches,       setMatches]       = useState([]);
  const [requests,      setRequests]      = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs,    setShowNotifs]    = useState(false);
  const [activeChat,    setActiveChat]    = useState(null);
  const [cancelMatch,   setCancelMatch]   = useState(null);

  const unread    = notifications.filter(n=>!n.read).length;
  const msgUnread = notifications.filter(n=>!n.read&&["message","match_message","division_message"].includes(n.type)).length;

  useEffect(() => {
    sb.auth.getSession().then(({data}) => {
      setSession(data.session);
      if (data.session) loadUser(data.session.user.id);
      else setLoading(false);
    });
    const { data:sub } = sb.auth.onAuthStateChange((_,session) => {
      setSession(session);
      if (session) loadUser(session.user.id);
      else { setMyTeam(null); setIsAdmin(false); setLoading(false); }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadUser = async uid => {
    setUserId(uid);
    const { data:profile } = await sb.from("profiles").select("*").eq("id",uid).single();
    if (profile?.is_admin) setIsAdmin(true);
    if (profile?.team_id) {
      const { data:team } = await sb.from("teams").select("*").eq("id",profile.team_id).single();
      if (team) { setMyTeam(team); setDivision(team.division); }
    }
    const { data:notifs } = await sb.from("notifications").select("*").eq("user_id",uid).order("created_at",{ascending:false}).limit(50);
    if (notifs) setNotifications(notifs);
    const notifCh = sb.channel(`notifs-${uid}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:`user_id=eq.${uid}`},p=>{
        setNotifications(prev=>[p.new,...prev]);
      }).subscribe();
    await loadData();
    setLoading(false);
  };

  const loadData = useCallback(async () => {
    const [{ data:t },{ data:m },{ data:r }] = await Promise.all([
      sb.from("teams").select("*").order("points",{ascending:false}),
      sb.from("matches").select("*").order("created_at",{ascending:false}),
      sb.from("match_requests").select("*,responses:request_responses(*)").order("created_at",{ascending:false}),
    ]);
    if (t) setTeams(t);
    if (m) setMatches(m);
    if (r) setRequests(r);
  }, []);

  const signOut = async () => { await sb.auth.signOut(); setSession(null); setMyTeam(null); setIsAdmin(false); };

  const handleCancelMatch = async (match, reason) => {
    await sb.from("matches").update({ cancelled:true, cancel_reason:reason, updated_at:new Date().toISOString() }).eq("id",match.id);
    await sb.from("match_cancellations").insert({ match_id:match.id, cancelled_by:myTeam.id, reason });
    setMatches(p=>p.map(m=>m.id===match.id?{...m,cancelled:true,cancel_reason:reason}:m));
    setCancelMatch(null);
    alert("Match cancelled. Both teams and admin have been notified.");
  };

  if (loading) return (
    <div style={{ background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"22px", fontWeight:"500" }}>ascend<span style={{color:"#0ea5e9"}}>pb</span></div>
        <div style={{ fontSize:"12px", color:C.faint, marginTop:"8px" }}>Loading...</div>
      </div>
    </div>
  );

  if (!session) return <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"'DM Sans',sans-serif" }}><AuthScreen/></div>;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"'DM Sans',sans-serif", color:C.text, paddingBottom:mobile?"74px":"0" }}>

      {/* Top nav */}
      <nav style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 16px", display:"flex", alignItems:"center", gap:"2px", position:"sticky", top:0, zIndex:100, height:"52px" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"15px", fontWeight:"500", letterSpacing:"1px", marginRight:mobile?"8px":"16px", cursor:"pointer", whiteSpace:"nowrap" }} onClick={()=>setTab("dashboard")}>
          ascend<span style={{color:"#0ea5e9"}}>pb</span>
        </div>
        {!mobile && <>
          <div style={{ width:"1px", height:"22px", background:C.border, margin:"0 6px" }}/>
          {[["dashboard","Dashboard"],["board","Match Board"],["scores","Scores"],["standings","Standings"],["chat","Chat"],...(isAdmin?[["admin","Admin"]]:[])] .map(([id,lbl]) => (
            <button key={id} onClick={()=>setTab(id)} style={{ background:tab===id?"#111":"transparent", border:"none", color:tab===id?"#fff":C.muted, padding:"6px 10px", borderRadius:"6px", cursor:"pointer", fontSize:"13px", fontWeight:tab===id?"600":"500", transition:"all .12s", whiteSpace:"nowrap" }}>{lbl}</button>
          ))}
        </>}
        <div style={{ flex:1 }}/>
        {myTeam && !mobile && <span style={{ fontSize:"12px", color:C.faint, marginRight:"8px" }}>{myTeam.name}</span>}
        <div style={{ position:"relative" }}>
          <NotifBell notifications={notifications} onOpen={()=>setShowNotifs(s=>!s)}/>
          {showNotifs && <NotifPanel notifications={notifications} setNotifications={setNotifications} onClose={()=>setShowNotifs(false)}/>}
        </div>
        {!mobile && <button style={btn(C.gray,"#fff",{fontSize:"12px",padding:"6px 12px",minHeight:"40px"})} onClick={signOut}>Sign out</button>}
        {mobile && <button onClick={()=>setTab("settings")} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, padding:"8px", minWidth:"44px", minHeight:"44px", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon n="settings" size={20}/></button>}
      </nav>

      {/* Page */}
      <div style={{ padding:mobile?"16px 14px":"28px 20px", maxWidth:"960px", margin:"0 auto" }}>
        {tab==="dashboard" && <Dashboard myTeam={myTeam} teams={teams} matches={matches} requests={requests} division={division} setDivision={setDivision} setTab={setTab} openChat={setActiveChat} openCancel={setCancelMatch} notifications={notifications}/>}
        {tab==="board"     && <MatchBoard myTeam={myTeam} teams={teams} requests={requests} setRequests={setRequests} matches={matches} division={division} setDivision={setDivision}/>}
        {tab==="scores"    && <Scores myTeam={myTeam} teams={teams} matches={matches} setMatches={setMatches} openChat={setActiveChat} openCancel={setCancelMatch}/>}
        {tab==="standings" && <Standings myTeam={myTeam} teams={teams} matches={matches} division={division} setDivision={setDivision}/>}
        {tab==="chat"      && <DivisionChat myTeam={myTeam} division={division} setDivision={setDivision}/>}
        {tab==="admin" && isAdmin && <AdminPanel teams={teams} setTeams={setTeams} matches={matches} setMatches={setMatches} userId={userId}/>}
        {tab==="settings"  && <Settings userId={userId} myTeam={myTeam} signOut={signOut}/>}
      </div>

      {/* Mobile bottom nav */}
      {mobile && <BottomNav tab={tab} setTab={setTab} isAdmin={isAdmin} unreadCount={msgUnread}/>}

      {/* Modals */}
      {activeChat  && <MatchChatModal match={activeChat}  myTeam={myTeam} teams={teams} onClose={()=>setActiveChat(null)}/>}
      {cancelMatch && <CancelMatchModal match={cancelMatch} myTeam={myTeam} teams={teams} onConfirm={handleCancelMatch} onClose={()=>setCancelMatch(null)}/>}
    </div>
  );
}
