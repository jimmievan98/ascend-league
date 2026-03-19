// ================================================================
// ASCEND PB FLEX LEAGUE — FINAL PRODUCTION APP
// Stack: React + Supabase
// Deploy to: app.ascendpb.com via Vercel
// ================================================================
// SETUP: Replace the two lines below with your Supabase values
// Found at: Supabase > Project Settings > API
// ================================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = "https://egacieyresiwkwwomesi.supabase.co";
const SUPABASE_ANON = "sb_publishable_SXa5wSG157FAK-8bNVAorw_raHdHgs5";
const SHOPIFY_URL   = "https://ascendpb.com/products/flex-league-registration";

const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── League constants ──────────────────────────────────────────
const SEASON_NAME   = "Spring 2026";
const TOTAL_WEEKS   = 6;
const PLAYOFF_TEAMS = 4; // top 4 per division
const MAX_VS_SAME   = 2; // max matches vs same opponent
const SKILLS        = ["3.0","3.1","3.2","3.3","3.4","3.5","3.6","3.7","3.8","3.9","4.0"];
const CLT_COURTS    = [
  "Freedom Park — 1900 East Blvd (6 courts)",
  "Clarks Creek Community Park — 5435 Hucks Rd (8 courts)",
  "Martin Luther King Jr. Park — 2600 Ravencroft Dr (6 courts)",
  "Clanton Park — 1520 Clanton Rd (6 courts)",
  "Eastway Park — 3150 Eastway Pk Dr (4 courts)",
  "Pearl Street Park — 1200 Baxter Dr (2 courts)",
];

const WAIVER = `ASCEND PB FLEX LEAGUE — OFFICIAL RULES & WAIVER · ${SEASON_NAME}

SEASON FORMAT
• ${TOTAL_WEEKS}-week flex season. Teams post open availability; any team in your division can accept.
• All matches: Best of 3 games, each to 11 points, win by 2.
• Teams are responsible for finding a court anywhere in the Charlotte, NC area.
• Scores must be submitted within 24 hours of playing.

MATCH LIMITS
• Maximum of ${MAX_VS_SAME} matches against the same opponent per season.
• No weekly cap — play as much as your schedule allows.

DIVISIONS
• 3.0–3.5 Division: DUPR ratings 3.0 to 3.4.
• 3.5–4.0 Division: DUPR ratings 3.5 to 4.0.
• Players rated exactly 3.5 may choose their division at registration.
• Ascend Pickleball reserves the right to reassign players to the appropriate division.

SCHEDULING
• Post your availability on the Match Board with your proposed date, time, and court.
• Any team in your division may accept, comment, or propose a counter.
• Once both teams agree and the request is accepted, the match is confirmed and locked.
• Confirmed matches appear on both teams' dashboards.

SUBSTITUTES
• Substitutes are allowed provided at least 1 original registered player is on the court.
• Subs must be disclosed when submitting match scores.

SCORING & STANDINGS
• 2 points awarded per match win. 0 for a loss.
• Either team submits scores. The opposing team must confirm within 24 hours.
• Disputed scores are resolved by the league admin within 48 hours.
• Standings: rank by points, tiebreaker (1) head-to-head, (2) game point differential.

PLAYOFFS
• Top ${PLAYOFF_TEAMS} teams per division advance to playoffs in Week ${TOTAL_WEEKS}.
• Teams must have played at least 3 regular season matches to qualify.
• Single elimination. Same match format as regular season.

COURTS
• Recommended public courts in Charlotte (free, first-come or reserve online):
${CLT_COURTS.map(c => `  - ${c}`).join("\n")}
• Private clubs allowed. Guest fees must be disclosed before opponent accepts.

FEES & REFUNDS
• Registration: $50 per team (both players). Paid via the Ascend PB Shopify store.
• Non-refundable after Week 1 begins.
• Unpaid teams will not appear in standings or on the Match Board.

LIABILITY WAIVER
By registering, both team members acknowledge that pickleball involves physical activity and inherent risk of injury. Each registrant agrees to hold Ascend Pickleball LLC, its owners, staff, and affiliates harmless from any claims, injuries, or damages arising from participation. All participation is voluntary and at each player's own risk.`;

// ── Design tokens ─────────────────────────────────────────────
const T = {
  page:   { fontFamily: "'DM Sans', sans-serif", background: "#f5f5f3", color: "#111", minHeight: "100vh", fontSize: "14px" },
  nav:    { background: "#fff", borderBottom: "1px solid #e4e4e0", padding: "0 20px", display: "flex", alignItems: "center", gap: "2px", position: "sticky", top: 0, zIndex: 100, height: "52px" },
  logo:   { fontFamily: "'DM Mono', monospace", fontSize: "15px", fontWeight: "500", color: "#111", letterSpacing: "1px", marginRight: "16px", cursor: "pointer", whiteSpace: "nowrap" },
  pg:     { padding: "28px 20px", maxWidth: "960px", margin: "0 auto" },
  h1:     { fontSize: "26px", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: "1.1", marginBottom: "2px", color: "#111" },
  h2:     { fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#111" },
  sub:    { fontSize: "11px", color: "#aaa", letterSpacing: ".5px", marginBottom: "20px", textTransform: "uppercase", fontWeight: "500" },
  card:   { background: "#fff", border: "1px solid #e4e4e0", borderRadius: "12px", padding: "18px" },
  flat:   { background: "#efefed", borderRadius: "10px", padding: "16px" },
  g2:     { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px" },
  g4:     { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: "10px" },
  inp:    { background: "#f5f5f3", border: "1px solid #ddd", borderRadius: "8px", padding: "9px 12px", color: "#111", fontFamily: "'DM Sans',sans-serif", fontSize: "14px", width: "100%", boxSizing: "border-box", outline: "none" },
  btn:    { background: "#111", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
  btnGray:{ background: "#444", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontFamily: "'DM Sans',sans-serif", fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
  btnGrn: { background: "#15803d", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
  btnAmb: { background: "#b45309", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
  btnRed: { background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 14px", fontFamily: "'DM Sans',sans-serif", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
  btnSm:  { background: "#111", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 12px", fontFamily: "'DM Sans',sans-serif", fontSize: "11px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap" },
  lbl:    { fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", letterSpacing: ".8px", display: "block", marginBottom: "5px" },
  mb:     n => ({ marginBottom: n }),
  row:    { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" },
  th:     { textAlign: "left", color: "#aaa", fontSize: "11px", fontWeight: "600", letterSpacing: ".8px", textTransform: "uppercase", padding: "8px 12px", borderBottom: "1px solid #e8e8e4" },
  td:     { padding: "10px 12px", borderBottom: "1px solid #f0f0ee", fontSize: "13px", color: "#111" },
};

// ── Helpers ───────────────────────────────────────────────────
const Tag = ({ c, children }) => {
  const colors = { blue:"#0369a1", green:"#15803d", amber:"#b45309", red:"#dc2626", gray:"#444", black:"#111" };
  return <span style={{ display:"inline-block", borderRadius:"6px", padding:"3px 8px", fontSize:"11px", fontWeight:"600", whiteSpace:"nowrap", background: colors[c]||colors.blue, color:"#fff" }}>{children}</span>;
};
const Lbl = ({ children }) => <label style={T.lbl}>{children}</label>;
const dL  = d => d === "low" ? "3.0–3.5" : "3.5–4.0";
const dC  = d => d === "low" ? "#334155" : "#0369a1";
const Pill = ({ d, active, onClick }) => (
  <button onClick={onClick} style={{ borderRadius:"999px", padding:"6px 18px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"12px", fontWeight:"600", border:"1.5px solid", background: active?(d==="low"?"#334155":"#0369a1"):"#fff", color: active?"#fff":(d==="low"?"#334155":"#0369a1"), borderColor: d==="low"?"#334155":"#0369a1", transition:"all .12s" }}>
    {dL(d)}
  </button>
);
const NavBtn = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{ background: active?"#111":"transparent", border:"none", color: active?"#fff":"#888", padding:"6px 10px", borderRadius:"6px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight: active?"600":"500", transition:"all .12s", whiteSpace:"nowrap" }}>
    {children}
  </button>
);
const DivBar = () => <div style={{ width:"1px", height:"22px", background:"#e4e4e0", margin:"0 8px" }} />;

// ── Font loader ───────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(l);
  }, []);
}

// ================================================================
// AUTH SCREEN
// ================================================================
function AuthScreen() {
  const [mode, setMode]   = useState("login");
  const [step, setStep]   = useState(1);
  const [err, setErr]     = useState("");
  const [msg, setMsg]     = useState("");
  const [loading, setLoading] = useState(false);
  const [wScrolled, setWScrolled] = useState(false);
  const wRef = useRef(null);
  const [form, setForm]   = useState({
    email:"", password:"", confirm:"",
    teamName:"", p1Name:"", p1Skill:"3.2",
    p2Name:"", p2Email:"", p2Skill:"3.2",
    division:"", agreed:false,
  });
  const up = (k,v) => setForm(f => ({...f,[k]:v}));

  const autoDiv = () => {
    const m = Math.max(parseFloat(form.p1Skill), parseFloat(form.p2Skill));
    if (m > 3.5) return "high";
    if (m < 3.5) return "low";
    return form.division || "";
  };
  const needs35 = () => Math.max(parseFloat(form.p1Skill), parseFloat(form.p2Skill)) === 3.5;

  const handleLogin = async () => {
    setErr(""); setLoading(true);
    const { error } = await sb.auth.signInWithPassword({ email:form.email, password:form.password });
    setLoading(false);
    if (error) setErr(error.message);
  };

  const handleGoogle = async () => {
    await sb.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: window.location.origin } });
  };

  const handleForgot = async () => {
    setErr(""); setLoading(true);
    const { error } = await sb.auth.resetPasswordForEmail(form.email, { redirectTo: window.location.origin });
    setLoading(false);
    if (error) setErr(error.message);
    else setMsg("Reset link sent — check your inbox.");
  };

  const nextStep = () => {
    setErr("");
    if (step===1 && (!form.email||!form.password)) { setErr("Email and password required."); return; }
    if (step===1 && form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (step===2 && !form.teamName.trim()) { setErr("Team name required."); return; }
    if (step===2 && !form.p1Name.trim())  { setErr("Player 1 name required."); return; }
    if (step===3 && !form.p2Name.trim())  { setErr("Player 2 name required."); return; }
    if (step===3 && needs35() && !form.division) { setErr("Please choose a division."); return; }
    if (step===4 && !form.agreed) { setErr("You must agree to the rules and waiver."); return; }
    setStep(s => s+1);
  };

  const submitReg = async () => {
    setErr(""); setLoading(true);
    const div = autoDiv();
    const { data, error } = await sb.auth.signUp({ email:form.email, password:form.password });
    if (error) { setErr(error.message); setLoading(false); return; }
    const uid = data.user?.id;
    const { data:team, error:te } = await sb.from("teams").insert({
      name:form.teamName, p1_name:form.p1Name, p1_email:form.email, p1_skill:form.p1Skill,
      p2_name:form.p2Name, p2_email:form.p2Email, p2_skill:form.p2Skill,
      division:div, paid:false, approved:false,
    }).select().single();
    if (te) { setErr(te.message); setLoading(false); return; }
    await sb.from("profiles").upsert({ id:uid, email:form.email, team_id:team.id });
    setLoading(false);
    window.open(SHOPIFY_URL, "_blank");
    setStep(6);
  };

  const errBox = e => e ? <div style={{ background:"#fee2e2", border:"1px solid #fca5a5", borderRadius:"8px", padding:"10px 14px", color:"#991b1b", marginBottom:"14px", fontSize:"13px", fontWeight:"500" }}>{e}</div> : null;

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px", background:"#f5f5f3" }}>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"22px", fontWeight:"500", marginBottom:"6px" }}>
        ascend<span style={{ color:"#0ea5e9" }}>pb</span>
      </div>
      <div style={{ fontSize:"12px", color:"#aaa", letterSpacing:".5px", marginBottom:"28px" }}>Flex League · Charlotte, NC · {SEASON_NAME}</div>
      <div style={{ ...T.card, width:"100%", maxWidth:"420px" }}>

        {mode === "login" && <>
          <div style={{ ...T.h1, marginBottom:"4px" }}>Sign in</div>
          <div style={{ ...T.sub, marginBottom:"20px" }}>Access your team portal</div>
          {errBox(err)}
          <Lbl>Email</Lbl>
          <input style={{ ...T.inp, ...T.mb("12px") }} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)} />
          <Lbl>Password</Lbl>
          <input style={{ ...T.inp, ...T.mb("18px") }} type="password" placeholder="Password" value={form.password} onChange={e=>up("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
          <button style={{ ...T.btn, width:"100%", padding:"12px", ...T.mb("10px") }} onClick={handleLogin} disabled={loading}>{loading?"Signing in...":"Sign in"}</button>
          <button style={{ ...T.btnGray, width:"100%", padding:"12px", ...T.mb("18px") }} onClick={handleGoogle}>Continue with Google</button>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}>
            <span style={{ color:"#0369a1", cursor:"pointer" }} onClick={()=>{setMode("register");setStep(1);setErr("");}}>Create account</span>
            <span style={{ color:"#0369a1", cursor:"pointer" }} onClick={()=>{setMode("forgot");setErr("");}}>Forgot password?</span>
          </div>
        </>}

        {mode === "forgot" && <>
          <div style={{ ...T.h1, marginBottom:"4px" }}>Reset password</div>
          <div style={{ ...T.sub, marginBottom:"20px" }}>We'll send a reset link to your email</div>
          {errBox(err)}
          {msg && <div style={{ background:"#dcfce7", border:"1px solid #86efac", borderRadius:"8px", padding:"10px 14px", color:"#166534", marginBottom:"14px", fontSize:"13px" }}>{msg}</div>}
          <Lbl>Email</Lbl>
          <input style={{ ...T.inp, ...T.mb("16px") }} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)} />
          <button style={{ ...T.btn, width:"100%", ...T.mb("12px") }} onClick={handleForgot} disabled={loading}>{loading?"Sending...":"Send reset link"}</button>
          <span style={{ color:"#0369a1", cursor:"pointer", fontSize:"13px" }} onClick={()=>{setMode("login");setErr("");setMsg("");}}>← Back to sign in</span>
        </>}

        {mode === "register" && step < 6 && <>
          <div style={{ display:"flex", gap:"4px", marginBottom:"20px" }}>
            {[1,2,3,4,5].map(n=><div key={n} style={{ flex:1, height:"3px", borderRadius:"2px", background:n<=step?"#111":"#e4e4e0", transition:"background .3s" }}/>)}
          </div>
          <div style={{ ...T.h1, marginBottom:"2px" }}>{["","Account","Team info","Player 2","Rules & waiver","Confirm & pay"][step]}</div>
          <div style={{ ...T.sub, marginBottom:"18px" }}>Step {step} of 5</div>
          {errBox(err)}

          {step===1 && <>
            <Lbl>Email address</Lbl>
            <input style={{ ...T.inp, ...T.mb("12px") }} type="email" placeholder="your@email.com" value={form.email} onChange={e=>up("email",e.target.value)} />
            <Lbl>Password</Lbl>
            <input style={{ ...T.inp, ...T.mb("12px") }} type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e=>up("password",e.target.value)} />
            <Lbl>Confirm password</Lbl>
            <input style={T.inp} type="password" placeholder="Repeat password" value={form.confirm} onChange={e=>up("confirm",e.target.value)} />
          </>}

          {step===2 && <>
            <Lbl>Team name</Lbl>
            <input style={{ ...T.inp, ...T.mb("14px") }} placeholder="e.g. The Drop Shot Duo" value={form.teamName} onChange={e=>up("teamName",e.target.value)} />
            <Lbl>Your name (Player 1)</Lbl>
            <input style={{ ...T.inp, ...T.mb("12px") }} placeholder="Full name" value={form.p1Name} onChange={e=>up("p1Name",e.target.value)} />
            <Lbl>Your skill level (DUPR)</Lbl>
            <select style={{ ...T.inp, appearance:"none" }} value={form.p1Skill} onChange={e=>up("p1Skill",e.target.value)}>
              {SKILLS.map(s=><option key={s}>{s}</option>)}
            </select>
          </>}

          {step===3 && <>
            <Lbl>Partner's name (Player 2)</Lbl>
            <input style={{ ...T.inp, ...T.mb("12px") }} placeholder="Full name" value={form.p2Name} onChange={e=>up("p2Name",e.target.value)} />
            <Lbl>Partner's email</Lbl>
            <input style={{ ...T.inp, ...T.mb("12px") }} type="email" placeholder="partner@email.com" value={form.p2Email} onChange={e=>up("p2Email",e.target.value)} />
            <Lbl>Partner's skill level (DUPR)</Lbl>
            <select style={{ ...T.inp, appearance:"none", marginBottom: needs35()?"14px":"0" }} value={form.p2Skill} onChange={e=>up("p2Skill",e.target.value)}>
              {SKILLS.map(s=><option key={s}>{s}</option>)}
            </select>
            {needs35() && (
              <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:"8px", padding:"14px", marginTop:"4px" }}>
                <Lbl>Choose division (you have a 3.5 rated player)</Lbl>
                <div style={{ display:"flex", gap:"8px", marginTop:"6px" }}>
                  {["low","high"].map(d=>(
                    <button key={d} onClick={()=>up("division",d)} style={{ flex:1, padding:"9px", borderRadius:"8px", border:`2px solid ${form.division===d?dC(d):"#ddd"}`, background:form.division===d?dC(d):"#fff", color:form.division===d?"#fff":"#666", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontSize:"13px", fontWeight:"600" }}>
                      {dL(d)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>}

          {step===4 && <>
            <Lbl>Rules & liability waiver</Lbl>
            <div ref={wRef} onScroll={e=>{const el=e.target;if(el.scrollHeight-el.scrollTop<=el.clientHeight+40)setWScrolled(true);}}
              style={{ background:"#f5f5f3", border:"1px solid #e4e4e0", borderRadius:"8px", padding:"12px 14px", height:"200px", overflowY:"auto", fontSize:"11.5px", lineHeight:"1.8", color:"#555", whiteSpace:"pre-wrap", marginBottom:"12px" }}>
              {WAIVER}
            </div>
            {!wScrolled && <p style={{ color:"#b45309", fontSize:"11px", marginBottom:"8px", fontWeight:"500" }}>Scroll through the full agreement before agreeing.</p>}
            <label style={{ display:"flex", gap:"10px", alignItems:"flex-start", cursor:"pointer", fontSize:"13px", lineHeight:"1.5", color:"#333" }}>
              <input type="checkbox" checked={form.agreed} onChange={e=>up("agreed",e.target.checked)} style={{ marginTop:"3px", accentColor:"#0ea5e9", width:"15px", height:"15px" }} />
              I have read and agree to the rules and liability waiver on behalf of both team members.
            </label>
          </>}

          {step===5 && <>
            <div style={{ background:"#f5f5f3", border:"1px solid #e4e4e0", borderRadius:"8px", padding:"14px", marginBottom:"14px" }}>
              <Lbl>Team summary</Lbl>
              <div style={{ fontSize:"18px", fontWeight:"700", marginBottom:"4px" }}>{form.teamName||"Unnamed Team"}</div>
              <div style={{ fontSize:"13px", color:"#888", marginBottom:"8px" }}>{form.p1Name} ({form.p1Skill}) and {form.p2Name} ({form.p2Skill})</div>
              <Tag c={autoDiv()==="low"?"gray":"blue"}>{dL(autoDiv()||"low")} Division</Tag>
            </div>
            <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:"8px", padding:"16px", textAlign:"center", marginBottom:"14px" }}>
              <div style={{ fontSize:"11px", fontWeight:"600", color:"#0369a1", textTransform:"uppercase", letterSpacing:".8px" }}>Registration fee</div>
              <div style={{ fontSize:"44px", fontWeight:"800", color:"#0369a1", lineHeight:"1.1" }}>$50</div>
              <div style={{ fontSize:"12px", color:"#666" }}>per team · one-time · non-refundable</div>
            </div>
            <p style={{ fontSize:"12px", color:"#888", lineHeight:"1.7", marginBottom:"16px" }}>Clicking below saves your registration and opens the Ascend PB store to complete your $50 payment. Admin will activate your team within 24 hours of payment confirmation.</p>
            <button style={{ ...T.btn, width:"100%", padding:"12px" }} onClick={submitReg} disabled={loading}>{loading?"Registering...":"Pay $50 and register"}</button>
          </>}

          <div style={{ display:"flex", justifyContent:"space-between", marginTop:"16px" }}>
            {step>1 ? <button style={T.btnGray} onClick={()=>{setErr("");setStep(s=>s-1);}}>← Back</button> : <span/>}
            {step<5 && <button style={T.btn} onClick={nextStep}>Continue →</button>}
          </div>
          {step===1 && <div style={{ textAlign:"center", marginTop:"14px", fontSize:"13px", color:"#888" }}>Already registered? <span style={{ color:"#0369a1", cursor:"pointer" }} onClick={()=>{setMode("login");setErr("");}}>Sign in</span></div>}
        </>}

        {mode === "register" && step === 6 && (
          <div style={{ textAlign:"center", padding:"30px 0" }}>
            <div style={{ fontSize:"40px", marginBottom:"10px" }}>🏓</div>
            <div style={{ fontSize:"22px", fontWeight:"700", marginBottom:"8px" }}>You're in the queue!</div>
            <p style={{ fontSize:"13px", color:"#888", lineHeight:"1.7", marginBottom:"18px" }}>
              <strong style={{ color:"#111" }}>{form.teamName}</strong> is registered. Complete your $50 payment on the tab that just opened. Admin will activate your team within 24 hours.
            </p>
            <button style={T.btnGray} onClick={()=>{setMode("login");setStep(1);}}>Back to sign in</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ================================================================
// DASHBOARD
// ================================================================
function Dashboard({ myTeam, teams, matches, requests, division, setDivision, setTab }) {
  const myRequests = requests.filter(r => r.team_id === myTeam?.id && r.status === "open");
  const myMatches  = matches.filter(m => (m.t1_id===myTeam?.id||m.t2_id===myTeam?.id) && m.status !== "completed");
  const standings  = [...teams.filter(t=>t.division===division&&t.approved)].sort((a,b)=>b.points-a.points||b.wins-a.wins);
  const tName      = id => teams.find(t=>t.id===id)?.name ?? "Unknown";

  return (
    <div>
      {myTeam && !myTeam.approved && (
        <div style={{ background:"#fef9c3", border:"1px solid #fde68a", borderRadius:"10px", padding:"14px 16px", marginBottom:"20px" }}>
          <strong style={{ color:"#854d0e" }}>Pending activation</strong>
          <p style={{ color:"#78350f", fontSize:"13px", marginTop:"4px", lineHeight:"1.6" }}>Your registration is saved. Once your $50 payment is confirmed, admin will activate your team within 24 hours.</p>
        </div>
      )}
      <div style={{ ...T.row, justifyContent:"space-between", marginBottom:"22px" }}>
        <div>
          <div style={T.h1}>{myTeam?.name || "Dashboard"}</div>
          <div style={T.sub}>{SEASON_NAME} · Charlotte Flex League</div>
        </div>
        {myTeam?.approved && <button style={{ ...T.btn, padding:"10px 22px" }} onClick={()=>setTab("board")}>+ Post Availability</button>}
      </div>

      {myTeam?.approved && (
        <div style={{ ...T.g4, marginBottom:"22px" }}>
          {[{n:myTeam.wins,l:"Wins",c:"#15803d"},{n:myTeam.losses,l:"Losses",c:"#dc2626"},{n:myTeam.points,l:"Points",c:"#0369a1"},{n:myRequests.length,l:"Open Requests",c:"#b45309"}].map((x,i)=>(
            <div key={i} style={{ ...T.flat, textAlign:"center", padding:"18px" }}>
              <div style={{ fontSize:"30px", fontWeight:"800", color:x.c, lineHeight:"1" }}>{x.n}</div>
              <div style={{ fontSize:"11px", fontWeight:"600", color:"#888", textTransform:"uppercase", letterSpacing:".8px", marginTop:"5px" }}>{x.l}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...T.g2, marginBottom:"22px" }}>
        <div style={T.card}>
          <div style={T.h2}>Confirmed matches</div>
          {myMatches.length===0 ? <p style={{ fontSize:"13px", color:"#999", lineHeight:"1.6" }}>No confirmed matches yet. Post your availability on the Match Board to get started.</p> :
            myMatches.map(m => {
              const opp = teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
              return (
                <div key={m.id} style={{ padding:"12px 0", borderBottom:"1px solid #f0f0ee" }}>
                  <div style={{ fontWeight:"700", fontSize:"15px", marginBottom:"3px" }}>vs {opp?.name}</div>
                  <div style={{ fontSize:"12px", color:"#888", marginBottom:"8px" }}>{m.match_date} · {m.match_time} · {m.court}</div>
                  <div style={{ ...T.row }}>
                    <Tag c="green">Confirmed</Tag>
                    {m.status==="score_pending" && <button style={{ ...T.btnAmb, fontSize:"11px", padding:"4px 10px" }} onClick={()=>setTab("scores")}>Submit score</button>}
                    {m.status==="confirmed" && <button style={{ ...T.btnSm, fontSize:"11px", padding:"4px 10px" }} onClick={()=>setTab("scores")}>Enter score</button>}
                  </div>
                </div>
              );
            })}
        </div>
        <div style={T.card}>
          <div style={T.h2}>My open requests</div>
          {myRequests.length===0 ? <p style={{ fontSize:"13px", color:"#999", lineHeight:"1.6" }}>No open requests. Post your availability so other teams can find you.</p> :
            myRequests.map(r => (
              <div key={r.id} style={{ padding:"12px 0", borderBottom:"1px solid #f0f0ee" }}>
                <div style={{ fontWeight:"700", fontSize:"15px", marginBottom:"2px" }}>{r.proposed_date} at {r.proposed_time}</div>
                <div style={{ fontSize:"12px", color:"#888", marginBottom:"2px" }}>{r.proposed_court}</div>
                <div style={{ fontSize:"12px", color:"#aaa", marginBottom:"8px" }}>{r.responses?.length||0} response{(r.responses?.length||0)!==1?"s":""}</div>
                <div style={T.row}>
                  <Tag c="blue">Open</Tag>
                  <button style={{ ...T.btnSm, fontSize:"11px", padding:"3px 10px" }} onClick={()=>setTab("board")}>View thread</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div style={T.card}>
        <div style={{ ...T.row, marginBottom:"16px", justifyContent:"space-between" }}>
          <div style={{ ...T.h2, margin:0 }}>Division standings</div>
          <div style={T.row}>
            <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}  />
            <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")} />
          </div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["#","Team","W","L","Pts"].map(h=><th key={h} style={T.th}>{h}</th>)}</tr></thead>
          <tbody>
            {standings.map((t,i)=>(
              <tr key={t.id} style={{ background:t.id===myTeam?.id?"#eff6ff":"" }}>
                <td style={{ ...T.td, fontWeight:"800", color:"#ddd", fontSize:"20px", width:"44px" }}>{i+1}</td>
                <td style={T.td}><span style={{ fontWeight:"700" }}>{t.name}</span>{" "}{t.id===myTeam?.id&&<Tag c="blue">You</Tag>}{" "}{i===0&&<Tag c="gray">Leader</Tag>}</td>
                <td style={{ ...T.td, fontWeight:"700", color:"#15803d", fontSize:"15px" }}>{t.wins}</td>
                <td style={{ ...T.td, color:"#dc2626", fontSize:"15px" }}>{t.losses}</td>
                <td style={{ ...T.td, fontWeight:"800", fontSize:"18px", color:dC(division) }}>{t.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================================================================
// MATCH BOARD
// ================================================================
function MatchBoard({ myTeam, teams, requests, setRequests, matches, division, setDivision }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ date:"", time:"", court:"", notes:"", fee:"" });
  const [commenting, setCommenting] = useState({ rid:null, type:"comment", msg:"", cdate:"", ctime:"", ccourt:"" });
  const [loading, setLoading]   = useState(false);
  const upF = (k,v) => setForm(f=>({...f,[k]:v}));
  const upC = (k,v) => setCommenting(c=>({...c,[k]:v}));

  const divReqs = requests.filter(r=>r.division===division).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const tName   = id => teams.find(t=>t.id===id)?.name ?? "Unknown";

  // Check if posting team has already played this requester max times
  const atLimit = (requestTeamId) => {
    if (!myTeam) return false;
    const count = matches.filter(m =>
      (m.t1_id===myTeam.id&&m.t2_id===requestTeamId)||(m.t2_id===myTeam.id&&m.t1_id===requestTeamId)
    ).length;
    return count >= MAX_VS_SAME;
  };

  const postRequest = async () => {
    if (!form.date||!form.time||!form.court) return;
    setLoading(true);
    const { data, error } = await sb.from("match_requests").insert({
      team_id:myTeam.id, division, proposed_date:form.date, proposed_time:form.time,
      proposed_court:form.court, notes:form.notes, location_fee:form.fee, status:"open",
    }).select("*, responses:request_responses(*)").single();
    if (!error) { setRequests(prev=>[data,...prev]); setShowForm(false); setForm({date:"",time:"",court:"",notes:"",fee:""}); }
    setLoading(false);
  };

  const acceptRequest = async (req) => {
    if (atLimit(req.team_id)) { alert(`You've already played ${tName(req.team_id)} ${MAX_VS_SAME} times this season.`); return; }
    setLoading(true);
    await sb.from("match_requests").update({ status:"accepted", updated_at:new Date().toISOString() }).eq("id", req.id);
    await sb.from("matches").insert({ request_id:req.id, t1_id:req.team_id, t2_id:myTeam.id, division, match_date:req.proposed_date, match_time:req.proposed_time, court:req.proposed_court, status:"confirmed" });
    setRequests(prev=>prev.map(r=>r.id===req.id?{...r,status:"accepted"}:r));
    setLoading(false);
  };

  const acceptCounter = async (req, response) => {
    setLoading(true);
    await sb.from("match_requests").update({ status:"accepted", updated_at:new Date().toISOString() }).eq("id", req.id);
    await sb.from("matches").insert({ request_id:req.id, t1_id:req.team_id, t2_id:response.team_id, division, match_date:response.counter_date||req.proposed_date, match_time:response.counter_time||req.proposed_time, court:response.counter_court||req.proposed_court, status:"confirmed" });
    setRequests(prev=>prev.map(r=>r.id===req.id?{...r,status:"accepted"}:r));
    setLoading(false);
  };

  const submitComment = async (rid) => {
    if (!commenting.msg.trim()) return;
    setLoading(true);
    const { data, error } = await sb.from("request_responses").insert({
      request_id:rid, team_id:myTeam.id, team_name:myTeam.name,
      type:commenting.type, message:commenting.msg,
      counter_date:commenting.cdate||"", counter_time:commenting.ctime||"", counter_court:commenting.ccourt||"",
    }).select().single();
    if (!error) {
      setRequests(prev=>prev.map(r=>r.id===rid?{...r,responses:[...(r.responses||[]),data]}:r));
    }
    setCommenting({rid:null,type:"comment",msg:"",cdate:"",ctime:"",ccourt:""});
    setLoading(false);
  };

  const cancelRequest = async (rid) => {
    await sb.from("match_requests").update({ status:"cancelled" }).eq("id", rid);
    setRequests(prev=>prev.map(r=>r.id===rid?{...r,status:"cancelled"}:r));
  };

  return (
    <div>
      <div style={{ ...T.row, justifyContent:"space-between", marginBottom:"8px" }}>
        <div>
          <div style={T.h1}>Match Board</div>
          <div style={T.sub}>Post open availability · Any team in your division can accept</div>
        </div>
        {myTeam?.approved && <button style={{ ...T.btn, padding:"10px 22px" }} onClick={()=>setShowForm(s=>!s)}>{showForm?"Cancel":"+ Post Availability"}</button>}
      </div>
      <div style={{ ...T.row, marginBottom:"20px" }}>
        <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}  />
        <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")} />
      </div>

      {/* How it works */}
      <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:"10px", padding:"16px", marginBottom:"22px", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:"14px" }}>
        {[["1. Post","Share date, time and court — no opponent needed."],["2. Respond","Any team in your division can accept, comment, or counter."],["3. Confirm","Accepting any response locks in the match."],["4. Play","Submit scores within 24 hrs of playing."]].map(([t,d])=>(
          <div key={t}>
            <div style={{ fontSize:"12px", fontWeight:"700", color:"#1d4ed8", marginBottom:"3px" }}>{t}</div>
            <div style={{ fontSize:"12px", color:"#555", lineHeight:"1.5" }}>{d}</div>
          </div>
        ))}
      </div>

      {/* Post form */}
      {showForm && (
        <div style={{ ...T.card, marginBottom:"22px", border:"2px solid #111" }}>
          <div style={T.h2}>Post your availability</div>
          <p style={{ fontSize:"13px", color:"#888", marginBottom:"16px" }}>You are not picking an opponent. Any team in your division can respond to this post.</p>
          <div style={T.g2}>
            <div>
              <Lbl>Available date</Lbl>
              <input style={{ ...T.inp, ...T.mb("12px") }} placeholder="e.g. Mar 25" value={form.date} onChange={e=>upF("date",e.target.value)} />
              <Lbl>Available time</Lbl>
              <input style={T.inp} placeholder="e.g. 10:00 AM" value={form.time} onChange={e=>upF("time",e.target.value)} />
            </div>
            <div>
              <Lbl>Court / location</Lbl>
              <input style={{ ...T.inp, ...T.mb("12px") }} placeholder="e.g. Freedom Park Courts" value={form.court} onChange={e=>upF("court",e.target.value)} />
              <Lbl>Notes (optional)</Lbl>
              <input style={T.inp} placeholder="e.g. Flexible on time, prefer south Charlotte" value={form.notes} onChange={e=>upF("notes",e.target.value)} />
            </div>
          </div>
          <Lbl>Location fee (optional — if private club)</Lbl>
          <input style={{ ...T.inp, marginBottom:"14px" }} placeholder="e.g. $5 guest fee — leave blank if free" value={form.fee} onChange={e=>upF("fee",e.target.value)} />
          <button style={{ ...T.btn, padding:"10px 24px" }} onClick={postRequest} disabled={loading || !form.date||!form.time||!form.court}>Post to Match Board</button>
        </div>
      )}

      {divReqs.length===0 && <div style={{ ...T.card, textAlign:"center", padding:"48px 20px" }}><p style={{ color:"#aaa", fontSize:"14px" }}>No availability posted yet in this division. Be the first!</p></div>}

      {divReqs.map(req => {
        const isOwn     = req.team_id === myTeam?.id;
        const isAccepted= req.status  === "accepted";
        const canAct    = myTeam && !isOwn && !isAccepted && myTeam.division===req.division;
        const overLimit = canAct && atLimit(req.team_id);
        const showCF    = commenting.rid === req.id;
        const responses = req.responses || [];

        return (
          <div key={req.id} style={{ ...T.card, marginBottom:"12px", borderLeft:`4px solid ${isAccepted?"#15803d":"#0369a1"}`, opacity:isAccepted?0.7:1 }}>
            <div style={{ ...T.row, justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
              <div>
                <div style={{ ...T.row, marginBottom:"5px" }}>
                  <span style={{ fontSize:"17px", fontWeight:"700" }}>{tName(req.team_id)}</span>
                  <span style={{ fontSize:"12px", color:"#aaa" }}>is looking for a match</span>
                  {isOwn && <Tag c="gray">Your request</Tag>}
                </div>
                <div style={{ fontSize:"13px", color:"#555", display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"3px" }}>
                  <span>📅 {req.proposed_date}</span>
                  <span>🕐 {req.proposed_time}</span>
                  <span>📍 {req.proposed_court}</span>
                </div>
                {req.notes && <div style={{ fontSize:"12px", color:"#888" }}>{req.notes}</div>}
                {req.location_fee && <div style={{ fontSize:"12px", color:"#b45309", fontWeight:"500" }}>💰 Location fee: {req.location_fee}</div>}
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"4px" }}>
                <Tag c={isAccepted?"green":"blue"}>{isAccepted?"Matched":"Open"}</Tag>
                <span style={{ fontSize:"11px", color:"#bbb" }}>{responses.length} response{responses.length!==1?"s":""}</span>
              </div>
            </div>

            {responses.length > 0 && (
              <div style={{ background:"#f8f8f6", borderRadius:"8px", padding:"12px", marginBottom:"12px" }}>
                <div style={{ ...T.lbl, marginBottom:"8px" }}>Responses</div>
                {responses.map(r=>(
                  <div key={r.id} style={{ padding:"9px 0", borderBottom:"1px solid #eee" }}>
                    <div style={{ ...T.row, marginBottom:"4px" }}>
                      <span style={{ fontWeight:"700", fontSize:"13px" }}>{r.team_name}</span>
                      <Tag c={r.type==="counter"?"amber":"blue"}>{r.type==="counter"?"Counter":"Comment"}</Tag>
                    </div>
                    <div style={{ fontSize:"13px", color:"#333", lineHeight:"1.5" }}>{r.message}</div>
                    {r.type==="counter"&&r.counter_date && <div style={{ fontSize:"12px", color:"#b45309", marginTop:"4px", fontWeight:"500" }}>Proposes: {r.counter_date}{r.counter_time?` at ${r.counter_time}`:""}{r.counter_court?` · ${r.counter_court}`:""}</div>}
                    {isOwn && r.type==="counter" && !isAccepted && <button style={{ ...T.btnGrn, marginTop:"8px", fontSize:"11px", padding:"5px 12px" }} onClick={()=>acceptCounter(req,r)}>Accept this counter</button>}
                  </div>
                ))}
              </div>
            )}

            <div style={T.row}>
              {canAct && !showCF && !overLimit && <>
                <button style={T.btnGrn} onClick={()=>acceptRequest(req)}>Accept — I'll play</button>
                <button style={T.btnGray} onClick={()=>setCommenting({rid:req.id,type:"comment",msg:"",cdate:"",ctime:"",ccourt:""})}>Comment</button>
                <button style={T.btnAmb} onClick={()=>setCommenting({rid:req.id,type:"counter",msg:"",cdate:"",ctime:"",ccourt:""})}>Counter propose</button>
              </>}
              {canAct && overLimit && <span style={{ fontSize:"12px", color:"#aaa" }}>Max {MAX_VS_SAME} matches vs this team reached.</span>}
              {isOwn && !isAccepted && <button style={{ ...T.btnRed, fontSize:"11px", padding:"5px 12px" }} onClick={()=>cancelRequest(req.id)}>Cancel request</button>}
            </div>

            {showCF && (
              <div style={{ background:"#f5f5f3", border:`1.5px solid ${commenting.type==="counter"?"#f59e0b":"#93c5fd"}`, borderRadius:"8px", padding:"14px", marginTop:"12px" }}>
                <div style={{ fontSize:"14px", fontWeight:"700", marginBottom:"10px", color:commenting.type==="counter"?"#b45309":"#0369a1" }}>
                  {commenting.type==="counter"?"Counter proposal":"Leave a comment"}
                </div>
                <Lbl>Message</Lbl>
                <input style={{ ...T.inp, ...T.mb("10px") }} placeholder={commenting.type==="counter"?"e.g. That time doesn't work — how about...":"e.g. We're interested! Let us confirm our schedule."} value={commenting.msg} onChange={e=>upC("msg",e.target.value)} />
                {commenting.type==="counter" && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px", marginBottom:"12px" }}>
                    <div><Lbl>Alt date</Lbl><input style={T.inp} placeholder="Mar 25" value={commenting.cdate} onChange={e=>upC("cdate",e.target.value)} /></div>
                    <div><Lbl>Alt time</Lbl><input style={T.inp} placeholder="2:00 PM" value={commenting.ctime} onChange={e=>upC("ctime",e.target.value)} /></div>
                    <div><Lbl>Alt court</Lbl><input style={T.inp} placeholder="Court name" value={commenting.ccourt} onChange={e=>upC("ccourt",e.target.value)} /></div>
                  </div>
                )}
                <div style={T.row}>
                  <button style={commenting.type==="counter"?T.btnAmb:T.btn} onClick={()=>submitComment(req.id)} disabled={!commenting.msg.trim()||loading}>
                    {commenting.type==="counter"?"Send counter":"Post comment"}
                  </button>
                  <button style={T.btnGray} onClick={()=>setCommenting({rid:null,type:"comment",msg:"",cdate:"",ctime:"",ccourt:""})}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ================================================================
// SCORE SUBMISSION
// ================================================================
function Scores({ myTeam, teams, matches, setMatches }) {
  const [entry, setEntry] = useState({});
  const upE = (mid,k,v) => setEntry(e=>({...e,[mid]:{...(e[mid]||{}),[k]:v}}));
  const myMatches = matches.filter(m=>(m.t1_id===myTeam?.id||m.t2_id===myTeam?.id));

  const submitScore = async (mid) => {
    const s  = entry[mid]||{};
    const games = [];
    for (let i=1;i<=3;i++) {
      const s1=parseInt(s[`g${i}s1`]),s2=parseInt(s[`g${i}s2`]);
      if (!isNaN(s1)&&!isNaN(s2)&&s[`g${i}s1`]!=="") games.push({s1,s2});
    }
    if (games.length<2) return;
    const m = matches.find(x=>x.id===mid);
    const w1=games.filter(g=>g.s1>g.s2).length, w2=games.filter(g=>g.s2>g.s1).length;
    const winner_id = w1>w2?m.t1_id:m.t2_id;
    const loser_id  = winner_id===m.t1_id?m.t2_id:m.t1_id;
    const hasSub = !!document.getElementById(`sub-${mid}`)?.checked;
    await sb.from("matches").update({ status:"score_pending", games, score_t1:w1, score_t2:w2, winner_id, loser_id, submitted_by:myTeam.id, has_sub:hasSub, updated_at:new Date().toISOString() }).eq("id",mid);
    setMatches(prev=>prev.map(m=>m.id===mid?{...m,status:"score_pending",games,winner_id,loser_id,submitted_by:myTeam.id}:m));
    setEntry(e=>{const n={...e};delete n[mid];return n;});
  };

  const confirmScore = async (mid) => {
    const m = matches.find(x=>x.id===mid);
    await sb.rpc("confirm_match_score", { match_id: mid });
    setMatches(prev=>prev.map(x=>x.id===mid?{...x,status:"completed"}:x));
  };

  const tName = id => teams.find(t=>t.id===id)?.name??"Unknown";

  return (
    <div>
      <div style={T.h1}>Score submission</div>
      <div style={T.sub}>Submit after playing · Opponent confirms within 24 hrs · Admin resolves disputes</div>
      {myMatches.length===0 && <div style={{ ...T.card, textAlign:"center", padding:"48px 20px" }}><p style={{ color:"#aaa", fontSize:"14px" }}>No confirmed matches yet.</p></div>}
      {myMatches.map(m=>{
        const opp   = teams.find(t=>t.id===(m.t1_id===myTeam?.id?m.t2_id:m.t1_id));
        const s     = entry[m.id]||{};
        const canSubmit  = m.status==="confirmed";
        const canConfirm = m.status==="score_pending"&&m.submitted_by!==myTeam?.id;
        return (
          <div key={m.id} style={{ ...T.card, marginBottom:"14px" }}>
            <div style={{ ...T.row, justifyContent:"space-between", marginBottom:"16px" }}>
              <div>
                <div style={{ fontSize:"18px", fontWeight:"700", marginBottom:"3px" }}>vs {opp?.name}</div>
                <div style={{ fontSize:"12px", color:"#888" }}>{m.match_date} · {m.match_time} · {m.court}</div>
              </div>
              <Tag c={m.status==="confirmed"?"green":m.status==="score_pending"?"amber":"gray"}>{m.status==="confirmed"?"Confirmed":m.status==="score_pending"?"Score pending":"Completed"}</Tag>
            </div>
            {canSubmit && <>
              <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"14px" }}>
                {[1,2,3].map(g=>(
                  <div key={g} style={{ background:"#f5f5f3", border:"1px solid #e4e4e0", borderRadius:"8px", padding:"12px" }}>
                    <div style={T.lbl}>Game {g}{g===3?" (if needed)":""}</div>
                    <div style={{ display:"flex", gap:"7px", alignItems:"center" }}>
                      <input style={{ ...T.inp, width:"52px", textAlign:"center" }} type="number" min="0" max="25" placeholder="—" value={s[`g${g}s1`]||""} onChange={e=>upE(m.id,`g${g}s1`,e.target.value)} />
                      <span style={{ color:"#ccc", fontWeight:"300", fontSize:"18px" }}>–</span>
                      <input style={{ ...T.inp, width:"52px", textAlign:"center" }} type="number" min="0" max="25" placeholder="—" value={s[`g${g}s2`]||""} onChange={e=>upE(m.id,`g${g}s2`,e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...T.row, marginBottom:"14px" }}>
                <input type="checkbox" id={`sub-${m.id}`} style={{ accentColor:"#0ea5e9", width:"15px", height:"15px" }} />
                <label htmlFor={`sub-${m.id}`} style={{ fontSize:"13px", color:"#777", cursor:"pointer" }}>A sub played in this match</label>
              </div>
              <button style={{ ...T.btn, padding:"10px 24px" }} onClick={()=>submitScore(m.id)}>Submit score</button>
            </>}
            {m.status==="score_pending"&&!canConfirm && <p style={{ fontSize:"13px", color:"#b45309", fontWeight:"500" }}>Score submitted — waiting for {opp?.name} to confirm.</p>}
            {canConfirm && <>
              <p style={{ fontSize:"13px", marginBottom:"12px", color:"#333" }}>Your opponent submitted a score. Please confirm or dispute:</p>
              <div style={T.row}>
                <button style={T.btnGrn} onClick={()=>confirmScore(m.id)}>Confirm score</button>
                <button style={T.btnRed} onClick={async()=>{await sb.from("matches").update({status:"disputed"}).eq("id",m.id);setMatches(prev=>prev.map(x=>x.id===m.id?{...x,status:"disputed"}:x));}}>Dispute</button>
              </div>
            </>}
          </div>
        );
      })}
    </div>
  );
}

// ================================================================
// STANDINGS
// ================================================================
function Standings({ myTeam, teams, division, setDivision }) {
  const dt = [...teams.filter(t=>t.approved&&t.division===division)].sort((a,b)=>b.points-a.points||b.wins-a.wins);
  return (
    <div>
      <div style={T.h1}>Standings</div>
      <div style={T.sub}>{SEASON_NAME} · 2 pts per win · Live on score confirmation · Top {PLAYOFF_TEAMS} advance to playoffs</div>
      <div style={{ ...T.row, marginBottom:"22px" }}>
        <Pill d="low"  active={division==="low"}  onClick={()=>setDivision("low")}  />
        <Pill d="high" active={division==="high"} onClick={()=>setDivision("high")} />
      </div>
      <div style={T.card}>
        <div style={T.h2}>{dL(division)} — Full standings</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr>{["Rank","Team","Players","W","L","Pts","Win%"].map(h=><th key={h} style={T.th}>{h}</th>)}</tr></thead>
          <tbody>
            {dt.map((t,i)=>{
              const pct = t.wins+t.losses>0?Math.round(t.wins/(t.wins+t.losses)*100):0;
              const playoff = i < PLAYOFF_TEAMS;
              return (
                <tr key={t.id} style={{ background:t.id===myTeam?.id?"#eff6ff":"" }}>
                  <td style={{ ...T.td, fontWeight:"800", color:playoff?"#0369a1":"#ddd", fontSize:"20px", width:"44px" }}>{i+1}</td>
                  <td style={T.td}>
                    <span style={{ fontWeight:"700" }}>{t.name}</span>{" "}
                    {t.id===myTeam?.id&&<Tag c="blue">You</Tag>}{" "}
                    {i===0&&<Tag c="gray">Leader</Tag>}{" "}
                    {playoff&&<Tag c="blue">Playoffs</Tag>}
                  </td>
                  <td style={{ ...T.td, color:"#999", fontSize:"12px" }}>{t.p1_name} &amp; {t.p2_name}</td>
                  <td style={{ ...T.td, fontWeight:"700", color:"#15803d", fontSize:"15px" }}>{t.wins}</td>
                  <td style={{ ...T.td, color:"#dc2626", fontSize:"15px" }}>{t.losses}</td>
                  <td style={{ ...T.td, fontWeight:"800", fontSize:"18px", color:dC(division) }}>{t.points}</td>
                  <td style={{ ...T.td, color:"#aaa", fontSize:"13px" }}>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ================================================================
// LEAGUE CHAT
// ================================================================
function Chat({ myTeam, messages, setMessages }) {
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView(),[messages]);

  const send = async () => {
    if (!input.trim()||!myTeam?.approved) return;
    const { data } = await sb.from("messages").insert({ team_id:myTeam.id, team_name:myTeam.name, is_admin:false, content:input.trim() }).select().single();
    if (data) { setMessages(prev=>[...prev,data]); setInput(""); setTimeout(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),50); }
  };

  return (
    <div>
      <div style={T.h1}>League chat</div>
      <div style={T.sub}>General · All teams · Use the Match Board to coordinate scheduling</div>
      <div style={{ ...T.card, display:"flex", flexDirection:"column", height:"460px" }}>
        <div style={{ flex:1, overflowY:"auto", paddingBottom:"6px" }}>
          {messages.map(m=>(
            <div key={m.id} style={{ marginBottom:"18px" }}>
              <div style={{ ...T.row, marginBottom:"4px" }}>
                <span style={{ fontSize:"13px", fontWeight:"700", color:m.is_admin?"#b45309":"#0369a1" }}>{m.team_name}</span>
                {m.is_admin && <Tag c="amber">Admin</Tag>}
                <span style={{ fontSize:"11px", color:"#ccc" }}>{new Date(m.created_at).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</span>
              </div>
              <div style={{ fontSize:"14px", color:"#222", lineHeight:"1.6" }}>{m.content}</div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>
        <div style={{ borderTop:"1px solid #f0f0ee", paddingTop:"12px", marginTop:"6px" }}>
          {!myTeam?.approved && <p style={{ fontSize:"12px", color:"#aaa", marginBottom:"8px" }}>Account must be activated to chat.</p>}
          <div style={T.row}>
            <input style={{ ...T.inp, flex:1 }} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={myTeam?.approved?"Type a message and press Enter...":"Not yet activated"} disabled={!myTeam?.approved} />
            <button style={T.btn} onClick={send} disabled={!myTeam?.approved}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// ADMIN PANEL
// ================================================================
function AdminPanel({ teams, setTeams, matches, setMatches, messages, setMessages }) {
  const [tab,    setTab]    = useState("pending");
  const [annText,setAnnText]= useState("");
  const pending   = teams.filter(t=>!t.approved);
  const disputes  = matches.filter(m=>m.status==="disputed");
  const tName     = id => teams.find(t=>t.id===id)?.name??"Unknown";

  const approve    = async id => { await sb.from("teams").update({approved:true}).eq("id",id); setTeams(p=>p.map(t=>t.id===id?{...t,approved:true}:t)); };
  const markPaid   = async id => { await sb.from("teams").update({paid:true}).eq("id",id); setTeams(p=>p.map(t=>t.id===id?{...t,paid:true}:t)); };
  const removeTeam = async id => { if(!window.confirm("Remove this team?"))return; await sb.from("teams").delete().eq("id",id); setTeams(p=>p.filter(t=>t.id!==id)); };
  const resolveDispute = async (mid,winnerId,loserId) => {
    await sb.from("matches").update({status:"completed",winner_id:winnerId,loser_id:loserId}).eq("id",mid);
    await sb.from("teams").update({wins:sb.rpc("wins+1"),points:sb.rpc("points+2")}).eq("id",winnerId);
    await sb.from("teams").update({losses:sb.rpc("losses+1")}).eq("id",loserId);
    setMatches(p=>p.map(m=>m.id===mid?{...m,status:"completed",winner_id:winnerId}:m));
  };
  const postAnn = async () => {
    if (!annText.trim()) return;
    const { data } = await sb.from("messages").insert({ team_name:"League Admin", is_admin:true, content:annText.trim() }).select().single();
    if (data) { setMessages(p=>[...p,data]); setAnnText(""); }
  };

  const tabs = [["pending",`Pending (${pending.length})`],["disputes",`Disputes (${disputes.length})`],["teams","All Teams"],["announce","Announce"]];

  return (
    <div>
      <div style={{ ...T.row, marginBottom:"4px" }}>
        <div style={T.h1}>Admin panel</div>
        <Tag c="amber">Jimmie · Ascend PB</Tag>
      </div>
      <div style={T.sub}>{SEASON_NAME} · League management</div>
      <div style={{ ...T.row, marginBottom:"22px" }}>
        {tabs.map(([id,lbl])=>(
          <button key={id} style={tab===id?{...T.btn,padding:"8px 16px",fontSize:"13px"}:{...T.btnGray,padding:"8px 16px",fontSize:"13px"}} onClick={()=>setTab(id)}>{lbl}</button>
        ))}
      </div>

      <div style={T.card}>
        {tab==="pending" && <>
          <div style={T.h2}>Pending registrations ({pending.length})</div>
          {pending.length===0 ? <p style={{ fontSize:"13px", color:"#999" }}>No pending registrations.</p> :
            pending.map(t=>(
              <div key={t.id} style={{ padding:"14px 0", borderBottom:"1px solid #f0f0ee" }}>
                <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"3px" }}>{t.name}</div>
                <div style={{ fontSize:"12px", color:"#888", marginBottom:"8px" }}>{t.p1_name} ({t.p1_skill}) and {t.p2_name} ({t.p2_skill}) · {dL(t.division)}</div>
                <div style={{ fontSize:"12px", color:"#666", marginBottom:"10px" }}>{t.p1_email}</div>
                <div style={T.row}>
                  <Tag c={t.paid?"green":"red"}>{t.paid?"Paid":"Unpaid"}</Tag>
                  {!t.paid && <button style={{ ...T.btnAmb, fontSize:"11px", padding:"5px 12px" }} onClick={()=>markPaid(t.id)}>Mark paid</button>}
                  <button style={{ ...T.btnGrn, fontSize:"11px", padding:"5px 12px" }} onClick={()=>approve(t.id)}>Approve</button>
                  <button style={{ ...T.btnRed, fontSize:"11px", padding:"5px 12px" }} onClick={()=>removeTeam(t.id)}>Remove</button>
                </div>
              </div>
            ))}
        </>}

        {tab==="disputes" && <>
          <div style={T.h2}>Score disputes ({disputes.length})</div>
          {disputes.length===0 ? <p style={{ fontSize:"13px", color:"#999" }}>No disputes. All scores confirmed.</p> :
            disputes.map(m=>(
              <div key={m.id} style={{ padding:"14px 0", borderBottom:"1px solid #f0f0ee" }}>
                <div style={{ fontSize:"16px", fontWeight:"700", marginBottom:"3px" }}>{tName(m.t1_id)} vs {tName(m.t2_id)}</div>
                <div style={{ fontSize:"12px", color:"#888", marginBottom:"10px" }}>{m.match_date}</div>
                <p style={{ fontSize:"13px", color:"#555", marginBottom:"8px" }}>Select the winning team to resolve:</p>
                <div style={T.row}>
                  <button style={T.btnGrn} onClick={()=>resolveDispute(m.id,m.t1_id,m.t2_id)}>{tName(m.t1_id)} won</button>
                  <button style={T.btnGrn} onClick={()=>resolveDispute(m.id,m.t2_id,m.t1_id)}>{tName(m.t2_id)} won</button>
                </div>
              </div>
            ))}
        </>}

        {tab==="teams" && <>
          <div style={T.h2}>All teams ({teams.length})</div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["Team","Division","W/L/Pts","Paid","Status","Action"].map(h=><th key={h} style={T.th}>{h}</th>)}</tr></thead>
            <tbody>
              {teams.map(t=>(
                <tr key={t.id}>
                  <td style={T.td}><div style={{ fontWeight:"700" }}>{t.name}</div><div style={{ fontSize:"11px", color:"#aaa" }}>{t.p1_name} and {t.p2_name}</div></td>
                  <td style={T.td}><Tag c={t.division==="low"?"gray":"blue"}>{dL(t.division)}</Tag></td>
                  <td style={{ ...T.td, fontSize:"12px", color:"#888" }}>{t.wins}W / {t.losses}L / {t.points}pts</td>
                  <td style={T.td}><Tag c={t.paid?"green":"red"}>{t.paid?"Paid":"Unpaid"}</Tag></td>
                  <td style={T.td}><Tag c={t.approved?"green":"amber"}>{t.approved?"Active":"Pending"}</Tag></td>
                  <td style={T.td}><button style={{ ...T.btnRed, fontSize:"11px", padding:"4px 10px" }} onClick={()=>removeTeam(t.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>}

        {tab==="announce" && <>
          <div style={T.h2}>Post announcement to league chat</div>
          <p style={{ fontSize:"13px", color:"#888", marginBottom:"14px" }}>Posts as "League Admin" — visible to all teams.</p>
          <Lbl>Message</Lbl>
          <textarea style={{ ...T.inp, minHeight:"100px", resize:"vertical", marginBottom:"14px" }} value={annText} placeholder={`e.g. Week 4 window opens Monday. Get your matches scheduled!`} onChange={e=>setAnnText(e.target.value)} />
          <button style={{ ...T.btn, padding:"10px 24px" }} onClick={postAnn}>Post announcement</button>
        </>}
      </div>
    </div>
  );
}

// ================================================================
// ROOT APP
// ================================================================
const NAV_PLAYER = [["dashboard","Dashboard"],["board","Match Board"],["scores","Scores"],["standings","Standings"],["chat","Chat"]];
const NAV_ADMIN  = [...NAV_PLAYER,["admin","Admin"]];

export default function AscendLeague() {
  useFonts();
  const [session,   setSession]  = useState(null);
  const [loading,   setLoading]  = useState(true);
  const [myTeam,    setMyTeam]   = useState(null);
  const [isAdmin,   setIsAdmin]  = useState(false);
  const [tab,       setTab]      = useState("dashboard");
  const [division,  setDivision] = useState("low");
  const [teams,     setTeams]    = useState([]);
  const [matches,   setMatches]  = useState([]);
  const [requests,  setRequests] = useState([]);
  const [messages,  setMessages] = useState([]);

  useEffect(()=>{
    sb.auth.getSession().then(({data})=>{
      setSession(data.session);
      if (data.session) loadUser(data.session.user.id);
      else setLoading(false);
    });
    const { data:sub } = sb.auth.onAuthStateChange((_,session)=>{
      setSession(session);
      if (session) loadUser(session.user.id);
      else { setMyTeam(null); setIsAdmin(false); setLoading(false); }
    });
    return ()=>sub.subscription.unsubscribe();
  },[]);

  const loadUser = async uid => {
    const { data:profile } = await sb.from("profiles").select("*").eq("id",uid).single();
    if (profile?.is_admin) setIsAdmin(true);
    if (profile?.team_id) {
      const { data:team } = await sb.from("teams").select("*").eq("id",profile.team_id).single();
      if (team) { setMyTeam(team); setDivision(team.division); }
    }
    await loadLeagueData();
    setLoading(false);
  };

  const loadLeagueData = useCallback(async ()=>{
    const [{ data:t },{ data:m },{ data:r },{ data:msgs }] = await Promise.all([
      sb.from("teams").select("*").order("points",{ascending:false}),
      sb.from("matches").select("*").order("created_at",{ascending:false}),
      sb.from("match_requests").select("*, responses:request_responses(*)").order("created_at",{ascending:false}),
      sb.from("messages").select("*").order("created_at",{ascending:true}).limit(300),
    ]);
    if (t) setTeams(t);
    if (m) setMatches(m);
    if (r) setRequests(r);
    if (msgs) setMessages(msgs);
  },[]);

  const signOut = async ()=>{ await sb.auth.signOut(); setSession(null); setMyTeam(null); setIsAdmin(false); };

  if (loading) return (
    <div style={{ ...T.page, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"22px", fontWeight:"500" }}>ascend<span style={{ color:"#0ea5e9" }}>pb</span></div>
        <div style={{ fontSize:"12px", color:"#aaa", marginTop:"8px" }}>Loading...</div>
      </div>
    </div>
  );

  if (!session) return <div style={T.page}><AuthScreen /></div>;

  const nav = isAdmin ? NAV_ADMIN : NAV_PLAYER;

  return (
    <div style={T.page}>
      <nav style={T.nav}>
        <div style={T.logo} onClick={()=>setTab("dashboard")}>ascend<span style={{ color:"#0ea5e9" }}>pb</span></div>
        <DivBar />
        {nav.map(([id,lbl])=><NavBtn key={id} active={tab===id} onClick={()=>setTab(id)}>{lbl}</NavBtn>)}
        <div style={{ flex:1 }}/>
        {myTeam && <span style={{ fontSize:"12px", color:"#aaa", marginRight:"12px" }}>{myTeam.name}</span>}
        <button style={{ ...T.btnGray, fontSize:"12px", padding:"6px 14px" }} onClick={signOut}>Sign out</button>
      </nav>
      <div style={T.pg}>
        {tab==="dashboard" && <Dashboard  myTeam={myTeam}  teams={teams} matches={matches} requests={requests} division={division} setDivision={setDivision} setTab={setTab} />}
        {tab==="board"     && <MatchBoard myTeam={myTeam}  teams={teams} matches={matches} requests={requests} setRequests={setRequests} division={division} setDivision={setDivision} />}
        {tab==="scores"    && <Scores     myTeam={myTeam}  teams={teams} matches={matches} setMatches={setMatches} />}
        {tab==="standings" && <Standings  myTeam={myTeam}  teams={teams} division={division} setDivision={setDivision} />}
        {tab==="chat"      && <Chat       myTeam={myTeam}  messages={messages} setMessages={setMessages} />}
        {tab==="admin" && isAdmin && <AdminPanel teams={teams} setTeams={setTeams} matches={matches} setMatches={setMatches} messages={messages} setMessages={setMessages} />}
      </div>
    </div>
  );
}
