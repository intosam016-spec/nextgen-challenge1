/* ============================================================
   NEXTGEN CHALLENGE — Application
   ============================================================ */
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = n => Number(n||0).toLocaleString();

// Avatar renderer: shows image if user has one, else gradient initial.
function avatarHTML(u, cls="av"){
  if (u && u.avatar) return `<img class="${cls}" src="${esc(u.avatar)}" alt="${esc(u.name||"")}">`;
  const initial = (u && u.name) ? String(u.name)[0].toUpperCase() : "?";
  return `<span class="${cls}" style="background:${esc((u&&u.gradient)||"var(--grad)")}">${esc(initial)}</span>`;
}

/* ---------- SVG icon system (stroke-based, Feather/Lucide-style) ---------- */
const SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">';
const ICONS = {
  logo: '<svg viewBox="0 0 24 24" fill="url(#nggrad)"><defs><linearGradient id="nggrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset=".55" stop-color="#a855f7"/><stop offset="1" stop-color="#ff4fd8"/></linearGradient></defs><path d="M8.5 3 3 8.5 8.5 14 3 19.5 8.5 21l5.5-5.5 5.5 5.5L21 19.5 15.5 14 21 8.5 15.5 3 10 8.5 8.5 3Z"/></svg>',
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 5M17 6h3a3 3 0 0 1-3 5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.5 3-5 6-5s5.4 1.5 6 5"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6M18.5 15.5c.8 1 1.2 2.2 1.4 3.5"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.7-3.8 3.6-5.5 7-5.5s6.3 1.7 7 5.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
  flame: '<path d="M12 2c1 4-4 6-4 11a6 6 0 0 0 12 0c0-3-2-5-3-6 0 2-2 3-3 3 1-3-1-6-2-8z"/>',
  star: '<path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.9L12 16.9 6.8 19.2l1-5.9L3.5 9.2l5.9-.9z"/>',
  check: '<path d="M4 12.5 9.5 18 20 6"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  box: '<path d="m12 2 8 4.5v9L12 20l-8-4.5v-9z"/><path d="M12 20v-9M20 6.5 12 11 4 6.5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  bell: '<path d="M18 9a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  award: '<circle cx="12" cy="9" r="5"/><path d="m8.5 13-1.5 8 5-2.5 5 2.5-1.5-8"/>',
  diamond: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M9 3l3 6 3-6M12 9v12"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  rocket: '<path d="M12 15c-2-2-2-6 1-9l6-3c0 4-1 6-3 8-1 1-2 4-4 4z"/><circle cx="12" cy="15" r="3"/><path d="M9 20c-1 1-3 1-3 1s0-2 1-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18"/>',
  chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  external: '<path d="M14 4h6v6M20 4 11 13"/><path d="M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
  github: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 0 1 1-2.7 3.6 3.6 0 0 1 .1-2.7s.8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1a3.6 3.6 0 0 1 .1 2.7 3.9 3.9 0 0 1 1 2.7c0 1.1-2.4 2.1-4.6 2.2.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  eye: '<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/>',
  xp: '<path d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  lightbulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.8.6 1.1 1.2 1.1 2.2h5c0-1 .3-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
  code: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13 5l-2 14"/>',
  cube: '<path d="m12 2 8 4.5v9L12 20l-8-4.5v-9z"/><path d="M12 20v-9M20 6.5 12 11 4 6.5"/>',
};
function ico(name, size=18, cls=""){
  return `<span class="ico ${cls}" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center">${SVG}${ICONS[name]||ICONS.grid}</svg></span>`;
}
const CAT_ICONS = { "AI":"sparkle", "Web Development":"code", "Automation":"settings", "Design":"pen", "Web3":"cube", "Content Creation":"pen", "Robotics":"rocket", "General":"grid", "Security":"shield" };
const catIcon = c => CAT_ICONS[c] || "grid";
const BADGE_ICONS = { "First Challenge":"trophy", "Challenge Streak":"flame", "Builder":"rocket", "Innovator":"lightbulb", "Champion":"award", "Speed Builder":"bolt", "Top 10":"star", "Elite Creator":"diamond" };
const badgeIcon = b => BADGE_ICONS[b] || "award";
const ACT_ICONS = { "join":"compass", "xp":"bolt", "badge":"award", "submit":"send", "win":"trophy" };
const actIcon = t => ACT_ICONS[t] || "sparkle";

/* ---------- Store (localStorage) ---------- */
const Store = {
  get(key, d){ try { const v = localStorage.getItem("nextgen_"+key); return v==null?d:JSON.parse(v); } catch(e){ return d; } },
  set(key, val){ localStorage.setItem("nextgen_"+key, JSON.stringify(val)); },
  users(){ let u = this.get("users", null); if(!u){ u = DB.users.slice(); u.push({ id:"admin1", name:"NextGen Admin", email:"admin@nextgen.academy", password:"admin123", handle:"nextgenadmin", avatar:"admin.png", bio:"Platform administrator.", xp:9000, points:9000, wins:0, completed:0, rank:0, admin:true, badges:[], projects:[], gradient:"linear-gradient(135deg,#7c3aed,#ff4fd8)" }); this.set("users", u); } return u; },
  session(){ return this.get("session", null); },
  submissions(){ return this.get("submissions", []); },
  joined(){ return this.get("joined", DB.defaultJoined || []); },
};

const App = {
  cur: null,
  boot(){
    $("#year").textContent = new Date().getFullYear();
    this.renderNav();
    this.bindGlobal();
    this.particles();
    this.startCount();
    window.addEventListener("hashchange", () => this.route());
    if (!location.hash) location.hash = "/";
    this.route();
    this.animateLoader();
  },

  animateLoader(){
    const DUR = 3600; // ms of suspense before reveal
    const messages = [
      "Initializing engine…",
      "Calibrating challenges…",
      "Syncing XP engine…",
      "Forging badges…",
      "Ranking the leaderboard…",
      "Loading your arena…",
      "Almost ready…"
    ];
    const start = performance.now();
    const pctEl = $("#loaderPercent");
    const barEl = $("#loaderBar");
    const ringEl = document.querySelector(".ring-fill");
    let mi = 0;
    const statusEl = $("#loaderStatus");
    if (statusEl){ setInterval(()=>{ mi=(mi+1)%messages.length; statusEl.textContent = messages[mi]; }, 700); }
    const tick = (t)=>{
      const e = Math.min(1,(t-start)/DUR);
      const p = Math.round(e*100);
      if (pctEl) pctEl.textContent = p+"%";
      if (barEl) barEl.style.width = e*100+"%";
      if (ringEl) ringEl.style.strokeDashoffset = 340*(1-e);
      if (e<1){ requestAnimationFrame(tick); }
      else { const ls=$("#loaderScreen"); if(ls) ls.classList.add("hide"); }
    };
    requestAnimationFrame(tick);
  },

  /* ---------- Router ---------- */
  route(){
    const h = location.hash.replace(/^#/, "") || "/";
    const [path, q] = h.split("?");
    const params = Object.fromEntries(new URLSearchParams(q||""));
    this.cur = { path, params };
    this.renderNav();
    const view = $("#app");
    this.renderView(view, path, params);
    window.scrollTo({ top: 0 });
    this.observeReveal();
  },
  go(h){ location.hash = h; },

  renderView(el, path, p){
    const pub = ["/", "/challenges", "/challenge", "/submit", "/leaderboard", "/profile", "/projects", "/community", "/about", "/contact", "/terms", "/privacy", "/login", "/signup"];
    const s = this.session();
    if (path === "/dashboard"){ el.innerHTML = s ? this.dashboardView() : this.authView("login"); return; }
    if (path === "/admin"){ el.innerHTML = (s && s.admin) ? this.adminView() : (s? "<div class='container page-head'><h1>Admins only</h1></div>" : this.authView("login")); return; }
    if (pub.includes(path)){ return this.pubView(el, path, p); }
    el.innerHTML = this.notFound();
  },

  pubView(el, path, p){
    if (path === "/") return el.innerHTML = this.landing();
    if (path === "/login") return el.innerHTML = this.authView("login");
    if (path === "/signup") return el.innerHTML = this.authView("signup");
    if (path === "/forgot") return el.innerHTML = this.forgotView("forgot");
    if (path === "/reset") return el.innerHTML = this.forgotView("reset");
    if (path === "/challenges") return el.innerHTML = this.challengesView(p);
    if (path === "/challenge"){ const c = DB.challenges.find(x=>x.id===p.id); return el.innerHTML = c ? this.challengeDetail(c) : this.notFound(); }
    if (path === "/submit"){ const c = DB.challenges.find(x=>x.id===p.id); if(!c) return el.innerHTML=this.notFound(); if(!this.session()){ this.toast("Log in required", "Please log in to submit your project.", "err"); return el.innerHTML=this.authView("login"); } return el.innerHTML = this.submitView(c); }
    if (path === "/leaderboard") return el.innerHTML = this.leaderboardView(p);
    if (path === "/profile"){ const u = this.users().find(x=>x.handle===p.handle); return el.innerHTML = u ? this.profileView(u) : this.notFound(); }
    if (path === "/projects") return el.innerHTML = this.projectsView(p);
    if (path === "/community") return el.innerHTML = this.communityView();
    if (path === "/about") return el.innerHTML = this.aboutView();
    return el.innerHTML = this.comingSoon(this.titleFor(path), "This page is part of the NextGen build and ships in the next step.");
  },

  titleFor(path){
    return ({ "/challenges":"Challenges", "/challenge":"Challenge", "/leaderboard":"Leaderboard",
      "/profile":"User Profile", "/projects":"Community Projects", "/community":"Community",
      "/about":"About", "/contact":"Contact", "/terms":"Terms", "/privacy":"Privacy" }[path] || "Page");
  },

  dashboardView(){ return this.dashboard(); },
  adminView(){ return this.admin(); },

  // current session user, merged with store
  me(){ const s = this.session(); if(!s) return null; return this.users().find(u=>u.id===s.id) || s; },
  isJoined(id){ return this.joined().includes(id); },

  authView(mode){
    const login = mode !== "signup";
    return `
      <div class="auth-wrap">
        <div class="auth-card card">
          <div class="logo-row"><span class="logo-mark"><img src="logo.png" alt="NextGen"></span></div>
          <h1>${login?"Welcome back":"Join NextGen"}</h1>
          <p class="sub">${login?"Log in to continue building.":"Create your account and start earning XP."}</p>
          ${this.loginForm(login)}
          <div class="auth-alt">${login?"New here? <a href='#/signup'>Create an account</a>":"Already a member? <a href='#/login'>Log in</a>"}</div>
        </div>
      </div>`;
  },

  forgotView(mode){
    return `
      <div class="auth-wrap">
        <div class="auth-card card">
          <div class="logo-row"><span class="logo-mark"><img src="logo.png" alt="NextGen"></span></div>
          <h1>${mode==="reset"?"Reset password":"Forgot password"}</h1>
          <p class="sub">${mode==="reset"?"Choose a new password for your account.":"Enter your email and we'll send a reset link."}</p>
          <form onsubmit="App.submitReset(event, '${mode}')">
            ${mode==="reset"?"":`<div class="field"><label>Email</label><input class="input" type="email" name="email" required placeholder="you@example.com"></div>`}
            ${mode==="reset"?`<div class="field"><label>New password</label><input class="input" type="password" name="password" required minlength="6" placeholder="••••••••"></div>`:""}
            <button class="btn btn-primary btn-block">${mode==="reset"?"Reset Password":"Send Reset Link"}</button>
          </form>
          <div class="auth-alt"><a href="#/login">← Back to login</a></div>
        </div>
      </div>`;
  },

  submitReset(e, mode){
    e.preventDefault();
    if (mode === "forgot"){ this.toast("Reset link sent 📬", "Check your inbox for instructions.", "ok"); return this.go("/login"); }
    this.toast("Password reset 🔐", "Your password has been updated. Log in again.", "ok");
    this.go("/login");
  },

  loginForm(login){
    return `
      <form onsubmit="App.submitAuth(event, ${login})">
        ${login?"":`<div class="field"><label>Full name</label><input class="input" name="name" required placeholder="Your name"></div>`}
        <div class="field"><label>Email</label><input class="input" type="email" name="email" required placeholder="you@example.com"></div>
        <div class="field"><label>Password</label><input class="input" type="password" name="password" required minlength="6" placeholder="••••••••"></div>
        ${login?`<div style="text-align:right;margin:-6px 0 16px"><a href="#/forgot" style="color:var(--accent);font-size:13px;font-weight:600">Forgot password?</a></div>`:""}
        <button class="btn btn-primary btn-block">${login?"Log In":"Create Account"}</button>
      </form>`;
  },

  submitAuth(e, login){
    e.preventDefault();
    const f = new FormData(e.target);
    const email = f.get("email").trim().toLowerCase();
    const pass = f.get("password");
    let users = this.users();
    if (!login){
      if (users.some(u=>u.email===email)) return this.toast("Email taken", "An account already exists for this email.", "err");
      const u = { id: nextId("u"), name: f.get("name").trim(), email, pass, handle: email.split("@")[0],
        bio: "New to NextGen — building my reputation!", xp: 10, points: 10, wins: 0, completed: 0, rank: 0,
        badges: [], projects: [], gradient: "linear-gradient(135deg,#8b5cf6,#ff4fd8)" };
      users.push(u); this.set("users", users);
      this.toast("Welcome to NextGen! 🎉", "Your account is ready.", "ok");
      this.setSession(u); this.go("/dashboard");
    } else {
      const u = users.find(x=>x.email===email && x.password===pass);
      if (!u){ this.toast("Login failed", "Check your email and password.", "err"); return; }
      this.toast("Welcome back, " + u.name.split(" ")[0] + "! 👋", "You're logged in.", "ok");
      this.setSession(u); this.go("/dashboard");
    }
  },

  /* ---------- Nav ---------- */
  renderNav(){
    const links = [["/","Home","home"],["/challenges","Challenges","compass"],["/leaderboard","Leaderboard","trophy"],["/projects","Projects","grid"],["/community","Community","users"]];
    const s = this.session();
    const active = "/" + (this.cur ? this.cur.path.split("/")[1] : "");
    const path = this.cur ? this.cur.path : "/";

    const chip = s ? `
      <a class="user-chip" href="#/profile?handle=${esc(s.handle||s.email.split("@")[0])}">
        ${avatarHTML(s,"av")}
        ${esc(s.name.split(" ")[0])}
      </a>
      ${s.admin ? `<a class="btn btn-ghost btn-sm" href="#/admin">Admin</a>` : ""}
      <a class="btn btn-ghost btn-sm" href="#/dashboard">Dashboard</a>
      <button class="btn btn-ghost btn-sm" onclick="App.logout()">Log out</button>`
      : `<a class="btn btn-ghost btn-sm" href="#/login">Log In</a>
         <a class="btn btn-primary btn-sm" href="#/signup">Join NextGen</a>`;

    $("#navLinks").innerHTML = links.map(([h,t]) =>
      `<a href="#${h}" class="${path===h?"active":""}">${t}</a>`).join("");
    $("#navActions").innerHTML = chip;

    $("#drawerLinks").innerHTML = links.map(([h,t,ic]) =>
      `<a href="#${h}" onclick="App.toggleDrawer(false)">${ico(ic,18)} ${t}</a>`).join("");
    $("#drawerActions").innerHTML = s
      ? `<a href="#/profile?handle=${esc(s.handle||s.email.split("@")[0])}" onclick="App.toggleDrawer(false)">${ico("user",18)} My Profile</a>
         <a href="#/dashboard" onclick="App.toggleDrawer(false)">${ico("chart",18)} Dashboard</a>
         ${s.admin?`<a href="#/admin" onclick="App.toggleDrawer(false)">${ico("settings",18)} Admin</a>`:""}
         <a href="#" onclick="App.logout();App.toggleDrawer(false)">${ico("logout",18)} Log out</a>`
      : `<a href="#/login" onclick="App.toggleDrawer(false)">${ico("user",18)} Log In</a>
         <a href="#/signup" onclick="App.toggleDrawer(false)">${ico("plus",18)} Join NextGen</a>`;

    const bn = $("#bottomNav"); if (bn) $$("a[data-link]", bn).forEach(a =>
      a.classList.toggle("active", path === (a.dataset.link||"")));
  },

  toggleDrawer(open){ $("#drawer").classList.toggle("open", open); },

  logout(){ this.setSession(null); this.toast("Logged out", "See you soon! 👋", "ok"); this.go("/"); },

  setSession(u){ this.set("session", u); },
  updateSession(u){ const users = this.users().map(x=>x.id===u.id?u:x); this.set("users", users); this.set("session", u); },

  /* ---------- Toast ---------- */
  toast(title, msg, type="ok"){
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = `<span class="tico">${type==="err"?"⚠️":"✅"}</span><div><b>${esc(title)}</b><p>${esc(msg)}</p></div>`;
    $("#toasts").appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .3s"; setTimeout(()=>el.remove(), 320); }, 4200);
  },

  bindGlobal(){
    document.addEventListener("click", e => {
      const t = e.target.closest("[data-action]");
      if (t) this.handleAction(t.dataset.action, t);
    });
  },

  handleAction(action, el){
    if (action === "join") return this.joinChallenge(el.dataset.id);
    if (action === "logout") return this.logout();
    if (action === "edit") return this.toast("Edit challenge", "Challenge editing ships in the admin upgrade.", "ok");
    if (action === "del"){
      if(!confirm("Delete this challenge?")) return;
      const i = DB.challenges.findIndex(c=>c.id===el.dataset.id);
      if(i>-1){ DB.challenges.splice(i,1); this.toast("Deleted", "Challenge removed.", "ok"); this.route(); }
    }
  },

  /* ---------- Shared helpers ---------- */
  statusChip(c){
    return c.status === "open" ? `<span class="chip badge-open">${ico("bolt",13)} Open</span>`
      : c.status === "ending" ? `<span class="chip badge-ending">${ico("clock",13)} Ending Soon</span>`
      : `<span class="chip badge-completed">${ico("check",13)} Completed</span>`;
  },
  diffChip(d){
    const m = { beginner:["easy","Beginner"], intermediate:["mid","Intermediate"], advanced:["hard","Advanced"] };
    const [k,lab] = m[d.toLowerCase()] || ["mid", d];
    return `<span class="chip diff-${k}">${lab}</span>`;
  },
  levelOf(xp){
    const l = DB.levels.filter(l => xp >= l.min).pop() || DB.levels[0];
    return l;
  },

  /* ============================================================
     STEP 1 — LANDING PAGE
     ============================================================ */
  landing(){
    const feat = DB.challenges[0];
    const feats = DB.challenges.filter(c=>c.status!=="completed").slice(0,3);
    return `
      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div>
              <span class="eyebrow reveal">NextGen Academy</span>
              <h1 class="reveal" style="margin-top:16px">
                <span class="line">Build.</span>
                <span class="line grad-text">Compete.</span>
                <span class="line">Create.</span>
              </h1>
              <p class="sub reveal">Turn your ideas into real-world projects, compete in challenges, earn XP and build your reputation with NextGen.</p>
              <div class="hero-cta reveal">
                <a class="btn btn-primary btn-lg" href="#/challenges">${ico("compass",18)} Explore Challenges</a>
                <a class="btn btn-secondary btn-lg" href="#/signup">Join NextGen</a>
              </div>
              <div class="hero-note reveal">
                <div>${ico("check",15)} 100+ creators</div>
                <div>${ico("check",15)} 15+ challenges</div>
                <div>${ico("check",15)} 250K XP awarded</div>
              </div>
            </div>
            ${this.heroPanel()}
          </div>
        </div>
      </section>

      ${this.contestSection()}

      <section class="section">
        <div class="container">
          <div class="section-head reveal">
            <span class="eyebrow">Featured challenge</span>
            <h2 style="margin-top:14px">This week's big build</h2>
            <p class="lead">A hands-on challenge with real criteria. Ship it, get reviewed, earn XP.</p>
          </div>
          <div class="featured reveal">
            <div class="grid2">
              <div>
                <div class="chal-top" style="margin-bottom:14px">
                  <span class="chal-icon">${ico(catIcon(feat.category),20)}</span>
                  <span class="chip badge-ending">Ending soon</span>
                </div>
                <h2>${esc(feat.title)}</h2>
                <div class="chal-tags" style="margin-top:12px">
                  <span class="chip cat">${esc(feat.sub||feat.category)}</span>
                  ${this.diffChip(feat.difficulty)}
                </div>
                <p style="color:var(--muted);margin:16px 0">${esc(feat.blurb)} Ship something real, get it live, and get reviewed by the community.</p>
                <div class="feat-stats">
                  <div><b>${fmt(feat.participants)}</b><span>Participants</span></div>
                  <div><b>${feat.reward} XP</b><span>Reward</span></div>
                  <div><b>${feat.deadline}d</b><span>Deadline</span></div>
                </div>
                <div class="prog" style="max-width:340px;margin-top:16px"><span style="width:65%"></span></div>
                <p style="color:var(--muted);font-size:13px;margin-top:8px">65% joined — deadline soon</p>
                <div style="margin-top:22px"><a class="btn btn-primary" href="#/challenge/${feat.id}">View challenge ${ico("arrow",15)}</a></div>
              </div>
              <div>
                <div class="panel">
                  <div class="panel-bar"><i class="r"></i><i class="y"></i><i class="g"></i><span>nextgen.app/challenge</span></div>
                  <div class="panel-body">
                    <div class="mini-card">
                      <div class="mc-top"><b>${esc(feat.title)}</b><span class="chip cat">${esc(feat.category)}</span></div>
                      <div class="mc-row"><span>${ico("users",14)} ${fmt(feat.participants)}</span><span>${ico("clock",14)} ${feat.deadline}d</span><span>${ico("bolt",14)} ${feat.reward} XP</span></div>
                    </div>
                    <div class="mini-list">${this.miniRows(3)}</div>
                    <div class="prog" style="margin-top:6px"><span style="width:68%"></span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section" style="padding-top:10px">
        <div class="container">
          <div class="section-head reveal">
            <span class="eyebrow">Live now</span>
            <h2 style="margin-top:14px">Challenges to join</h2>
            <p class="lead">Pick a lane and start building today.</p>
          </div>
          <div class="grid grid-3">
            ${feats.map((c,i)=>this.challengeCard(c, i)).join("")}
          </div>
          <div style="text-align:center;margin-top:36px" class="reveal">
            <a class="btn btn-secondary" href="#/challenges">Browse all challenges ${ico("arrow",15)}</a>
          </div>
        </div>
      </section>

      ${this.communityStrip()}
    `;
  },

  miniRows(n){
    const top = this.users().filter(u=>u.xp).sort((a,b)=>b.xp-a.xp).slice(0,n);
    return top.map((u,i)=>{
      const r=i+1;
      return `<div class="row"><span class="rank ${r<=3?"g"+r:"plain"}">${r}</span>${avatarHTML(u,"av")}<span style="white-space:nowrap">${esc(u.name)}</span><span class="sp">${ico("bolt",13)} ${fmt(u.xp)}</span></div>`;
    }).join("");
  },

  heroPanel(){
    return `
      <div class="panel reveal">
        <div class="panel-bar"><i class="r"></i><i class="y"></i><i class="g"></i><span>nextgen.app/leaderboard</span></div>
        <div class="panel-body">
          <div class="mini-card">
            <div class="mc-top"><b>${ico("bolt",15)} XP Leaderboard</b><span class="chip badge-ending">Live</span></div>
            <div class="mc-row"><span>This week</span><span style="margin-left:auto;color:var(--text-2)">Updated now</span></div>
          </div>
          <div class="mini-list">${this.miniRows(5)}</div>
          <div class="prog" style="margin-top:6px"><span style="width:68%"></span></div>
          <p style="color:var(--muted);font-size:11.5px;margin-top:8px">Join, build, and climb the board — unlock badges along the way.</p>
        </div>
      </div>`;
  },

  contestSection(){
    return `
      <section class="section" style="padding-top:46px">
        <div class="container">
          <div class="contest-card reveal">
            <div class="contest-head">
              <span class="chip badge-ending">${ico("flame",14)} Live contest</span>
              <span class="contest-days" id="contestDays">7 days to go</span>
            </div>
            <h2 class="contest-title">Introduce CREAO to a friend — <span class="grad-text">$200 prize pool</span></h2>
            <p class="contest-sub">Two weeks. Bring your friends onto CREAO. The more friends you refer who actually build an agent, the higher you climb. Top 10 win.</p>
            <div class="contest-count" id="contestCount">
              <div><b id="cd-d">07</b><span>Days</span></div>
              <div><b id="cd-h">00</b><span>Hrs</span></div>
              <div><b id="cd-m">00</b><span>Min</span></div>
              <div><b id="cd-s">00</b><span>Sec</span></div>
            </div>
            <div class="contest-grid">
              <div class="box">
                <h3>${ico("trophy",18)} Prize pool — $200</h3>
                <ul class="prize-list">
                  <li><span class="prize-medal">1</span><span><b>1st</b> · $25 cash + 300 credits</span><em>$70 value</em></li>
                  <li><span class="prize-medal">2</span><span><b>2nd</b> · $15 cash + 200 credits</span><em>$45 value</em></li>
                  <li><span class="prize-medal">3</span><span><b>3rd</b> · $10 cash + 150 credits</span><em>$32.50 value</em></li>
                  <li class="others"><span>4th–10th</span><em>50 credits each</em></li>
                </ul>
                <p class="note">Every spot in the top 10 wins something.</p>
              </div>
              <div class="box">
                <h3>${ico("rocket",18)} How to enter</h3>
                <ol class="steps">
                  <li>Retweet the campaign post</li>
                  <li>Share this CREAO link with friends: <code>agent.creao.ai/<wbr>@Sonofpeace</code></li>
                  <li>Your friend signs up through that link and builds an agent by chatting with CREAO AI</li>
                  <li>Screenshot the friend's profile and submit it in the contest channel</li>
                </ol>
                <p class="note">${ico("flame",13)} New to CREAO? Build your first agent in under 5 minutes.</p>
              </div>
            </div>
            <div class="contest-cta">
              <a class="btn btn-primary btn-lg" href="https://x.com/G_NEXTGEN/status/2077689871049560431" target="_blank" rel="noopener">${ico("flame",16)} Retweet campaign</a>
              <a class="btn btn-secondary btn-lg" href="https://agent.creao.ai/@Sonofpeace" target="_blank" rel="noopener">${ico("link",16)} Share CREAO link</a>
            </div>
            <p class="contest-foot">Runs Aug 15 – 29 · Winners announced day 14 · Leaderboard updates days 3, 6, 9, 12 · Friends get up to 50–75 free credits</p>
          </div>
        </div>
      </section>`;
  },

  startCount(){
    if (this._cdTimer){ clearInterval(this._cdTimer); this._cdTimer = null; }
    // Real contest deadline — fixed date so it counts down like a real event
    const end = Date.UTC(2026, 7, 29, 23, 59, 59); // Aug 29, 2026 23:59 UTC
    const pad = n => String(n).padStart(2,"0");
    const tick = () => {
      let d = end - Date.now(); if(d<0) d=0;
      const dd=Math.floor(d/864e5), hh=Math.floor(d%864e5/36e5), mm=Math.floor(d%36e5/6e4), ss=Math.floor(d%6e4/1e3);
      const D=document.getElementById("cd-d"),H=document.getElementById("cd-h"),M=document.getElementById("cd-m"),S=document.getElementById("cd-s");
      if(D)D.textContent=pad(dd); if(H)H.textContent=pad(hh); if(M)M.textContent=pad(mm); if(S)S.textContent=pad(ss);
      const C=document.getElementById("contestDays");
      const days = Math.max(0, Math.ceil(d/864e5));
      if(C) C.textContent = days + (days===1?" day":" days") + " to go";
    };
    tick();
    this._cdTimer = setInterval(tick, 1000);
  },

  challengeCard(c, i){
    return `
      <article class="card chal-card reveal" style="transition-delay:${i*80}ms">
        <div class="chal-body">
          <div class="chal-top">
            <span class="chal-icon">${ico(catIcon(c.category),20)}</span>
            <div style="margin-left:auto">${this.statusChip(c)}</div>
          </div>
          <h3><a href="#/challenge/${c.id}">${esc(c.title)}</a></h3>
          <div class="chal-tags">
            <span class="chip cat">${esc(c.category)}</span>
            ${this.diffChip(c.difficulty)}
          </div>
          <p class="chal-desc">${esc(c.blurb)}</p>
          <div class="chal-meta">
            <div>${ico("users",14)} ${fmt(c.participants)}</div>
            <div>${ico("clock",14)} ${c.deadline>0?c.deadline+"d":"Closed"}</div>
            <div class="reward">${ico("bolt",14)} ${c.reward} XP</div>
            <a class="btn btn-secondary btn-sm" style="margin-left:auto" href="#/challenge/${c.id}">View</a>
          </div>
        </div>
      </article>`;
  },

  communityStrip(){
    return `
      <section class="section">
        <div class="container">
          <div class="community reveal">
            <span class="eyebrow center">Community</span>
            <h2 style="margin:16px auto 10px;max-width:640px">Build together. Learn together. <span class="grad-text">Grow together.</span></h2>
            <p class="lead" style="max-width:520px;margin:0 auto 24px">Join thousands of builders sharing feedback, ideas, and wins every day.</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
              <a class="btn btn-primary btn-lg" href="#/signup">Join Community</a>
              <a class="btn btn-secondary btn-lg" href="#/community">Meet the builders ${ico("arrow",16)}</a>
            </div>
            <div class="ico-row">
              <a href="https://x.com/G_NEXTGEN" target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7 8 8 12h-6l-5-7-6 7H2l8-9L2 2h6l4 5z"/></svg></a>
              <a href="https://discord.gg/7XU2G7mA9" target="_blank" rel="noopener" aria-label="Discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5a16 16 0 0 0-4.5-1.3c-.2.4-.5 1-.6 1.4a15 15 0 0 0-4.5 0c-.2-.5-.4-1-.6-1.4A16 16 0 0 0 4.2 5C2.8 7.6 2.2 10.2 2.5 12.7a16 16 0 0 0 4.8 2.4c.4-.5.7-1.1 1-1.7-.5-.2-1-.5-1.5-.9.1-.1.3-.2.4-.3a11.5 11.5 0 0 0 9.6 0c.1.1.3.2.4.3-.5.4-1 .7-1.5.9.3.6.7 1.2 1 1.7a16 16 0 0 0 4.8-2.4c.3-3-.5-5.6-1.5-8.2ZM9.3 11c-.8 0-1.4-.7-1.4-1.6S8.5 7.8 9.3 7.8s1.4.7 1.4 1.6S10.1 11 9.3 11Zm5.4 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6Z"/></svg></a>
              <a href="https://linktr.ee/Nextgen0001" target="_blank" rel="noopener" aria-label="Linktree"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></a>
            </div>
          </div>
        </div>
      </section>`;
  },

  /* ---------- Storage helpers ---------- */
  get(k, d){ return Store.get(k, d); },
  set(k, v){ return Store.set(k, v); },
  recentActivity(){ return this.get("acts", []); },
  session(){ return Store.session(); },
  users(){ return Store.users(); },
  submissions(){ return Store.submissions(); },
  joined(){ return Store.joined(); },

  /* ---------- STEP 2: Challenges ---------- */
  challengesView(p){
    const cats = ["All","AI","Web Development","Automation","Design","Web3","Content Creation"];
    const diffs = ["All","Beginner","Intermediate","Advanced"];
    let list = DB.challenges;
    if (p.cat && p.cat!=="All") list = list.filter(c=>c.category===p.cat);
    if (p.diff && p.diff!=="All") list = list.filter(c=>c.difficulty.toLowerCase()===p.diff.toLowerCase());
    const catChip = c => `<button class="filter ${(p.cat||"All")===c?"active":""}" onclick="App.go('/challenges?cat=${c}')">${c}</button>`;
    const diffChip = d => `<button class="filter ${(p.diff||"All")===d?"active":""}" onclick="App.go('/challenges?diff=${d}')">${d}</button>`;
    return `
      <section class="page-head"><div class="container">
        <span class="eyebrow">◆ Explore</span>
        <h1 style="margin-top:14px">Challenges</h1>
        <p>Pick a challenge, join, build, and ship something amazing.</p>
      </div></section>
      <section class="container">
        <div class="filters">${cats.map(catChip).join("")}</div>
        <div class="filters" style="margin-top:0">${diffs.map(diffChip).join("")}</div>
        <div class="grid grid-3" style="margin-top:10px">
          ${list.length ? list.map((c,i)=>this.challengeCard(c,i)).join("") : this.emptyState("No challenges match this filter.", "search")}
        </div>
      </section>`;
  },

  emptyState(msg, ic="grid"){ return `<div class="empty" style="grid-column:1/-1"><div class="ico">${ico(ic,34)}</div><p>${esc(msg)}</p></div>`; },

  challengeDetail(c){
    const joined = this.isJoined(c.id);
    const criteria = (c.criteria || [["Creativity",25],["Functionality",30],["Design",20],["Innovation",25]]);
    const req = c.requirements || ["Original, working project", "Public link or repo", "Short write-up"];
    const rules = c.rules || ["One entry per participant","Must be original work","Deadline is final"];
    return `
      <section class="container" style="padding-top:34px">
        <div class="detail-hero">
          <a href="#/challenges" style="color:var(--muted);font-weight:600;font-size:14px">${ico("arrowLeft",15)} All challenges</a>
          <div style="display:flex;gap:18px;align-items:center;flex-wrap:wrap;margin-top:14px">
            <span class="chal-icon" style="width:52px;height:52px;border-radius:12px">${ico(catIcon(c.category),26)}</span>
            <div style="flex:1;min-width:220px">
              <h1>${esc(c.title)}</h1>
              <div class="chal-tags" style="margin-top:12px">
                <span class="chip cat">${esc(c.sub||c.category)}</span>
                ${this.diffChip(c.difficulty)} ${this.statusChip(c)}
              </div>
            </div>
          </div>
          <div class="feat-stats" style="margin-top:24px">
            <div><b>${fmt(c.participants)}</b><span>Participants</span></div>
            <div><b>${c.reward} XP</b><span>Reward</span></div>
            <div><b>${c.deadline>0?c.deadline+" Days Left":"Closed"}</b><span>Deadline</span></div>
          </div>
          <div style="margin-top:22px;display:flex;gap:12px;flex-wrap:wrap">
            ${joined
              ? `<button class="btn btn-secondary" disabled>${ico("check",15)} Joined</button>`
              : `<button class="btn btn-primary" data-action="join" data-id="${c.id}">${ico("plus",15)} Join Challenge</button>`}
            <a class="btn btn-secondary" href="#/submit?id=${c.id}">${ico("send",15)} Submit your project</a>
          </div>
        </div>

        <div class="detail-grid">
          <div>
            <div class="box"><h3>${ico("layers",18)} Overview</h3><p style="color:var(--text-2)">${esc(c.overview || c.blurb)}</p></div>
            <div class="box"><h3>${ico("pen",18)} Challenge brief</h3><p style="color:var(--text-2)">${esc(c.brief || (c.blurb + " Ship something real. Focus on a clear use case, polish, and impact."))}</p></div>
            <div class="box"><h3>${ico("checkCircle",18)} Requirements</h3><ul class="list-check">${req.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>
            <div class="box"><h3>${ico("shield",18)} Rules</h3><ul class="list-check rules">${rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ul></div>
            <div class="box"><h3>${ico("chart",18)} Evaluation criteria</h3>${criteria.map(([k,v])=>`<div class="criteria-row"><b>${esc(k)}</b><div class="prog"><span style="width:${v}%"></span></div><span>${v}%</span></div>`).join("")}</div>
          </div>
          <aside class="detail-side">
            <div class="box" style="margin-bottom:0">
              <h3>${ico("rocket",18)} Ready to build?</h3>
              <p style="color:var(--muted);font-size:14px;margin-bottom:16px">Join this challenge to unlock XP and get your project reviewed.</p>
              ${joined
                ? `<a class="btn btn-primary btn-block" href="#/submit?id=${c.id}">${ico("send",16)} Submit your project</a>`
                : `<button class="btn btn-primary btn-block" data-action="join" data-id="${c.id}">${ico("plus",16)} Join challenge (+50 XP)</button>`}
              <div style="margin-top:14px" class="prog"><span style="width:${Math.min(100,Math.round(c.participants/3))}%"></span></div>
              <p style="color:var(--muted);font-size:12px;margin-top:8px">${fmt(c.participants)} people already building</p>
            </div>
          </aside>
        </div>
      </section>`;
  },

  /* ---------- STEP 2: Submission ---------- */
  submitView(c){
    return `
      <section class="container" style="max-width:760px;padding-top:44px">
        <div class="page-head" style="padding-bottom:10px">
          <a href="#/challenge?id=${c.id}" style="color:var(--muted);font-weight:600;font-size:14px">${ico("arrowLeft",15)} Back to challenge</a>
          <h1 style="margin-top:10px">Submit Your Project</h1>
          <p>Submitting to: <b style="color:var(--text)">${esc(c.title)}</b></p>
        </div>
        <form class="card" style="padding:32px" onsubmit="App.submitProject(event)">
          <input type="hidden" name="challenge" value="${c.id}">
          <div class="field"><label>Project name *</label><input class="input" name="name" required placeholder="e.g. MindForge"></div>
          <div class="field"><label>Project description *</label><textarea class="input" name="desc" required placeholder="What did you build and why?"></textarea></div>
          <div class="field"><label>Category</label>
            <select class="input" name="category">${["AI","Web Development","Automation","Design","Web3","Content Creation"].map(x=>`<option>${x}</option>`).join("")}</select>
          </div>
          <div class="field"><label>Live demo URL</label><input class="input" type="url" name="demo" placeholder="https://"></div>
          <div class="field"><label>GitHub URL</label><input class="input" type="url" name="github" placeholder="https://github.com/..."></div>
          <div class="field"><label>Video / demo URL</label><input class="input" type="url" name="video" placeholder="https://"></div>
          <div class="field"><label>Upload screenshots</label>
            <input class="input" type="file" name="shots" multiple accept="image/*" style="padding:10px;cursor:pointer;color:var(--muted)">
            <div class="hint">Screenshots help judges review your work.</div>
          </div>
          <div class="field"><label>Additional information</label><textarea class="input" name="info" placeholder="Anything else we should know?"></textarea></div>
          <button class="btn btn-primary btn-block">Submit Project</button>
        </form>
      </section>`;
  },

  submitProject(e){
    e.preventDefault();
    const s = this.session(); if(!s){ this.toast("Log in required","Please log in first.","err"); return this.go("/login"); }
    const f = new FormData(e.target);
    const sub = { id: nextId("p"), name: f.get("name").trim(), desc: f.get("desc").trim(), category: f.get("category"),
      demo: f.get("demo"), github: f.get("github"), video: f.get("video"), info: f.get("info"),
      challengeId: f.get("challenge"), by: s.id, handle: s.handle||s.email.split("@")[0],
      createdAt: Date.now(), likes: 0, views: 12, emoji: "📦", featured: false, winner: false,
      gradient: "linear-gradient(135deg,#7c3aed,#ff4fd8)" };
    const subs = this.submissions(); subs.unshift(sub); this.set("submissions", subs);
    const u = this.me(); if(u){ u.xp = (u.xp||0)+100; u.points = (u.points||0)+100; u.completed = (u.completed||0)+1; this.updateSession(u); this.award("📦", "Submitted a project", "just now"); }
    this.toast("Submission Received 🎉", "Your project has been submitted for review.", "ok");
    this.go("/dashboard");
  },

  /* ---------- STEP 3: Leaderboard ---------- */
  leaderboardView(p){
    const range = p.range || "all";
    const users = this.users().filter(u=>u.xp).sort((a,b)=>b.xp-a.xp);
    const rows = users.map((u,i)=>{
      const r = i+1;
      return `<tr><td><span class="rank ${r<=3?"g"+r:"plain"}">${r}</span></td>
        <td><a href="#/profile?handle=${esc(u.handle)}" class="user-cell">${avatarHTML(u)} ${esc(u.name)}</a></td>
        <td style="color:var(--muted)">${esc(u.handle)}</td>
        <td>${u.completed||0}</td><td>${u.wins||0}</td>
        <td><b>${fmt(u.xp)}</b></td><td style="color:var(--muted)">${fmt(u.points)}</td></tr>`;
    }).join("");
    const seg = r => `<button class="${range===r?"active":""}" onclick="App.go('/leaderboard?range=${r}')">${r.charAt(0).toUpperCase()+r.slice(1)}</button>`;
    return `
      <section class="page-head"><div class="container">
        <span class="eyebrow">Rankings</span>
        <h1 style="margin-top:14px">NextGen Leaderboard</h1>
        <p>See who's leading the challenge.</p>
      </div></section>
      <section class="container">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;margin-bottom:20px">
          <div class="seg">${["week","month","all"].map(x=>seg(x)).join("")}</div>
        </div>
        <div class="card" style="overflow:auto">
          <table class="tbl"><thead><tr><th>Rank</th><th>User</th><th>Handle</th><th>Challenges</th><th>Wins</th><th>XP</th><th>Points</th></tr></thead><tbody>${rows}</tbody></table>
        </div>
      </section>`;
  },

  /* ---------- STEP 3: Profile ---------- */
  profileView(u){
    const lv = this.levelOf(u.xp);
    const myProjects = DB.projects.filter(p=>p.handle===u.handle);
    return `
      <section class="container" style="padding-top:34px">
        <div class="profile-hero">
          ${avatarHTML(u,"p-av")}
          <div style="flex:1;min-width:220px">
            <h1>${esc(u.name)}</h1>
            <span class="handle">@${esc(u.handle)}</span>
            <p style="color:var(--muted);margin-top:8px">${esc(u.bio||"Building my reputation on NextGen.")}</p>
            <div style="margin-top:12px" class="chal-meta">
              <span class="chip cat">#${u.rank||"-"} Global</span>
              <span class="chip diff-mid">Level ${lv.n} · ${lv.name}</span>
            </div>
          </div>
        </div>
        <div class="profile-stats">
          <div class="stat-card"><div class="ico">${ico("bolt",18)}</div><b>${fmt(u.xp)}</b><span>XP</span></div>
          <div class="stat-card"><div class="ico">${ico("star",18)}</div><b>${fmt(u.points)}</b><span>Points</span></div>
          <div class="stat-card"><div class="ico">${ico("checkCircle",18)}</div><b>${u.completed||0}</b><span>Challenges Completed</span></div>
          <div class="stat-card"><div class="ico">${ico("trophy",18)}</div><b>${u.wins||0}</b><span>Challenges Won</span></div>
        </div>
        ${this.badgesSection(u)}
        ${this.projectsSection(myProjects, u)}
      </section>`;
  },

  badgesSection(u){
    const owned = new Set(u.badges||[]);
    const grid = DB.badges.map(b=>
      `<div class="badge-tile ${owned.has(b.name)?"":"locked"}"><div class="ico">${ico(badgeIcon(b.name),26)}</div><h4>${esc(b.name)}</h4><p>${esc(b.desc)}</p></div>`).join("");
    return `<div class="box" style="margin-bottom:26px"><h3>${ico("award",18)} Achievements</h3>
      <div class="grid" style="grid-template-columns:repeat(4,1fr);gap:12px">${grid}</div></div>`;
  },

  projectsSection(proj, u){
    const s = this.submissions().filter(x=>x.handle===u.handle);
    const all = proj.concat(s);
    const cards = all.length? all.map(p=>this.projectCard(p)).join("") : `<div class="empty" style="grid-column:1/-1"><p>No projects yet.</p></div>`;
    return `<div class="box"><h3>${ico("grid",18)} Projects</h3><div class="grid grid-3">${cards}</div></div>`;
  },

  /* ---------- STEP 4: Showcase ---------- */
  projectsView(p){
    const sorter = p.sort || "featured";
    let list = DB.projects.slice().concat(this.submissions().map(x=>({...x,name:x.name,creator:x.name,handle:x.handle,category:x.category,desc:x.desc,likes:x.likes||0,views:x.views||0,gradient:x.gradient,emoji:x.emoji})));
    if (sorter==="featured") list.sort((a,b)=>(b.featured?1:0)-(a.featured?1:0));
    else if (sorter==="popular") list.sort((a,b)=>(b.likes||0)-(a.likes||0));
    else if (sorter==="recent") list.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    else if (sorter==="winners") list.sort((a,b)=>(b.winner?1:0)-(a.winner?1:0));
    const s = x => `<button class="${sorter===x?"active":""}" onclick="App.go('/projects?sort=${x}')">${x.charAt(0).toUpperCase()+x.slice(1)}</button>`;
    return `
      <section class="page-head"><div class="container">
        <span class="eyebrow">▣ Showcase</span>
        <h1 style="margin-top:14px">Community Projects</h1>
        <p>The best work built by NextGen members.</p>
      </div></section>
      <section class="container">
        <div class="filters">${["featured","popular","recent","winners"].map(x=>s(x)).join("")}</div>
        <div class="grid grid-3">${list.map(p=>this.projectCard(p)).join("")}</div>
      </section>`;
  },

  projectCard(p){
    return `<article class="card proj-card reveal">
      <div class="proj-thumb" style="background:${esc(p.gradient||"var(--grad-soft)")}">${p.emoji||"📦"}</div>
      <div class="proj-body">
        <h3>${esc(p.name)}</h3>
        <div class="proj-creator"><span class="av" style="width:24px;height:24px;font-size:11px;background:var(--grad)">${esc((p.creator||p.handle||"?")[0].toUpperCase())}</span> ${esc(p.creator||p.handle)}</div>
        <span class="chip cat">${esc(p.category||"General")}</span>
        <p style="color:var(--muted);font-size:14px;flex:1">${esc(p.desc||"")}</p>
        <div class="proj-actions"><span>❤️ ${fmt(p.likes||0)}</span><span>👁 ${fmt(p.views||0)}</span>
          <a class="btn btn-ghost btn-sm" style="margin-left:auto" href="#/projects">View Project</a></div>
      </div></article>`;
  },

  /* ---------- STEP 4: Community ---------- */
  communityView(){
    return `
      <section class="container" style="padding-top:44px">
        <div class="community reveal">
          <span class="eyebrow">✦ Community</span>
          <h2 style="margin:16px auto 10px;max-width:640px">Build together. Learn together. <span class="grad-text">Grow together.</span></h2>
          <p class="lead" style="max-width:540px;margin:0 auto 24px">Join thousands of builders sharing feedback, ideas, and wins every day.</p>
          <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
            <a class="btn btn-primary" href="#/signup">Join Community</a>
            <a class="btn btn-ghost" href="#/">Follow NextGen</a>
          </div>
          <div class="ico-row">
            <a href="https://x.com/G_NEXTGEN" target="_blank" rel="noopener" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7 8 8 12h-6l-5-7-6 7H2l8-9L2 2h6l4 5z"/></svg></a>
            <a href="https://discord.gg/7XU2G7mA9" target="_blank" rel="noopener" aria-label="Discord"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5a16 16 0 0 0-4.5-1.3c-.2.4-.5 1-.6 1.4a15 15 0 0 0-4.5 0c-.2-.5-.4-1-.6-1.4A16 16 0 0 0 4.2 5C2.8 7.6 2.2 10.2 2.5 12.7a16 16 0 0 0 4.8 2.4c.4-.5.7-1.1 1-1.7-.5-.2-1-.5-1.5-.9.1-.1.3-.2.4-.3a11.5 11.5 0 0 0 9.6 0c.1.1.3.2.4.3-.5.4-1 .7-1.5.9.3.6.7 1.2 1 1.7a16 16 0 0 0 4.8-2.4c.3-3-.5-5.6-1.5-8.2ZM9.3 11c-.8 0-1.4-.7-1.4-1.6S8.5 7.8 9.3 7.8s1.4.7 1.4 1.6S10.1 11 9.3 11Zm5.4 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6Z"/></svg></a>
            <a href="https://linktr.ee/Nextgen0001" target="_blank" rel="noopener" aria-label="Linktree"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></a>
          </div>
        </div>
      </section>`;
  },

  aboutView(){ return this.comingSoon("About", "Learn more about NextGen Academy and our mission."); },

  /* ---------- STEP 5: Dashboard + Gamification ---------- */
  dashboard(){
    const me = this.me(); if(!me) return this.authView("login");
    const joined = this.joined();
    const active = DB.challenges.filter(c=>c.status!=="completed" && joined.includes(c.id));
    const rec = DB.challenges.filter(c=>c.status!=="completed" && !joined.includes(c.id)).slice(0,3);
    const lv = this.levelOf(me.xp||0);
    const next = DB.levels.find(l=>l.n===lv.n+1);
    const pct = next ? Math.min(100, Math.round(((me.xp||0)-lv.min)/((next.min-lv.min))*100)) : 100;
    const act = DB.activity.concat(this.recentActivity()).slice(0,6);
    return `
      <section class="container" style="padding-top:38px">
        <div class="dash-head reveal">
          <div><span class="eyebrow">📊 Dashboard</span><h1 style="margin-top:12px">Welcome back, ${esc(me.name.split(" ")[0])} 👋</h1></div>
          <a class="btn btn-primary" href="#/challenges">Explore Challenges</a>
        </div>

        <div class="card reveal" style="margin:26px 0;padding:22px">
          <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:14px">
            <div><b style="font-size:20px">Level ${lv.n} — ${lv.name}</b>
              <p style="color:var(--muted);font-size:14px;margin-top:4px">${next?`${fmt(next.min-(me.xp||0))} XP to ${next.name}`:"Max level reached!"}</p></div>
            <div style="display:flex;gap:26px;flex-wrap:wrap">
              <div><b style="font-size:22px">${fmt(me.xp||0)}</b><span style="color:var(--muted);font-size:13px;display:block">XP</span></div>
              <div><b style="font-size:22px">${fmt(me.points||0)}</b><span style="color:var(--muted);font-size:13px;display:block">Points</span></div>
              <div><b style="font-size:22px">#${me.rank||"-"}</b><span style="color:var(--muted);font-size:13px;display:block">Rank</span></div>
              <div><b style="font-size:22px">${me.completed||0}</b><span style="color:var(--muted);font-size:13px;display:block">Completed</span></div>
              <div><b style="font-size:22px">${me.wins||0}</b><span style="color:var(--muted);font-size:13px;display:block">Wins</span></div>
            </div>
          </div>
          <div class="xpbar" style="margin-top:18px"><span style="width:${pct}%"></span></div>
        </div>

        <div class="dash-grid">
          <div>
            <h3 style="margin-bottom:16px">🎯 Active Challenges</h3>
            ${active.length? `<div class="grid grid-3">${active.map((c,i)=>this.challengeCard(c,i)).join("")}</div>` : `<div class="card empty"><div class="ico">📭</div><p>You haven't joined any challenges yet.</p><a class="btn btn-primary" style="margin-top:16px" href="#/challenges">Browse challenges</a></div>`}
            <h3 style="margin:30px 0 16px">✨ Recommended for you</h3>
            <div class="grid grid-3">${rec.map((c,i)=>this.challengeCard(c,i)).join("")}</div>
          </div>
          <div>
            <div class="card" style="padding:20px"><h3 style="margin-bottom:12px">🕘 Recent Activity</h3>
              <div class="activity">${act.map(a=>`<div class="item"><span class="ico">${a.icon||"⚡"}</span><div><p>${esc(a.text)}</p><span>${esc(a.time||"")}</span></div></div>`).join("")}</div></div>
            <div class="card" style="padding:20px;margin-top:20px"><h3 style="margin-bottom:12px">🏅 Achievements</h3>
              <div class="grid" style="grid-template-columns:repeat(4,1fr);gap:10px">${DB.badges.map(b=>`<div class="badge-tile ${(me.badges||[]).includes(b.name)?"":"locked"}" style="padding:14px 8px"><div class="ico" style="font-size:26px">${b.icon}</div><h4 style="font-size:12px">${esc(b.name)}</h4></div>`).join("")}</div></div>
          </div>
        </div>
      </section>`;
  },

  award(icon, text, time){ const acts = this.get("acts",[]); acts.unshift({icon,text,time}); this.set("acts", acts.slice(0,12)); },

  joinChallenge(id){
    const s = this.session(); if(!s){ this.toast("Log in required","Create an account to join challenges.","err"); return this.go("/signup"); }
    let joined = this.joined();
    if (joined.includes(id)){ this.toast("Already joined","You're already part of this challenge.","ok"); return; }
    joined.push(id); this.set("joined", joined);
    const u = this.me(); if(u){ u.xp = (u.xp||0)+50; u.points = (u.points||0)+50; u.badges = u.badges||[]; if(!u.badges.includes("Builder")) u.badges.push("Builder"); this.updateSession(u); this.award("🎯", "Joined a new challenge", "just now"); this.award("⭐", "Earned 50 XP", "just now"); }
    this.toast("Challenge joined! 🎉", "You earned +50 XP and the Builder badge.", "ok");
    this.route();
  },

  /* ---------- STEP 6: Admin ---------- */
  admin(){
    if(!this.session()) return this.authView("login");
    const tab = this.cur.params.tab || "overview";
    const stats = [
      ["users", this.users().length, "Total users"],
      ["layers", DB.challenges.filter(c=>c.status!=="completed").length, "Active challenges"],
      ["grid", this.submissions().length, "Total submissions"],
      ["checkCircle", DB.challenges.filter(c=>c.status==="completed").length, "Completed challenges"],
      ["bolt", DB.users.reduce((s,u)=>s+(u.xp||0),0), "Total XP awarded"],
    ];
    const tabs = [["overview","Overview"],["challenges","Challenges"],["submissions","Submissions"],["users","Users"]];
    return `
      <section class="container" style="padding-top:38px">
        <div class="dash-head reveal"><div><span class="eyebrow">Admin</span><h1 style="margin-top:12px">Admin Dashboard</h1></div>
          <a class="btn btn-primary" href="#/challenges">Create Challenge</a></div>
        <div class="tabs" style="margin-top:22px">${tabs.map(t=>`<button class="tab ${tab===t[0]?"active":""}" onclick="App.go('/admin?tab=${t[0]}')">${t[1]}</button>`).join("")}</div>
        ${tab==="overview"? this.adminOverview(stats) : tab==="challenges"? this.adminChallenges() : tab==="submissions"? this.adminSubmissions() : this.adminUsers()}
      </section>`;
  },

  adminOverview(stats){
    return `<div class="admin-grid">${stats.map(s=>`<div class="stat-card"><div class="ico">${ico(s[0],22)}</div><b>${fmt(s[1])}</b><span>${s[2]}</span></div>`).join("")}</div>
      <div class="box"><h3>${ico("chart",18)} Quick Actions</h3><div style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="btn btn-primary btn-sm" href="#/admin?tab=challenges">Manage Challenges</a>
        <a class="btn btn-ghost btn-sm" href="#/admin?tab=submissions">Review Submissions</a>
        <a class="btn btn-ghost btn-sm" href="#/admin?tab=users">Manage Users</a></div></div>`;
  },

  adminChallenges(){
    const rows = DB.challenges.map(c=>`<tr><td>${c.icon}</td><td><b>${esc(c.title)}</b></td><td><span class="chip cat">${esc(c.category)}</span></td><td>${c.reward} XP</td><td>${this.statusChip(c)}</td>
      <td><div style="display:flex;gap:6px"><button class="btn btn-ghost btn-sm" data-action="edit" data-id="${c.id}">Edit</button><button class="btn btn-ghost btn-sm" style="border-color:rgba(244,63,94,.4);color:#fda4af" data-action="del" data-id="${c.id}">Delete</button></div></td></tr>`).join("");
    return `<div class="card" style="overflow:auto"><table class="tbl"><thead><tr><th></th><th>Title</th><th>Category</th><th>Reward</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
  },

  adminSubmissions(){
    const rows = this.submissions().map(s=>`<tr><td>${s.emoji||"📦"}</td><td><b>${esc(s.name)}</b></td><td>${esc(s.handle||s.by)}</td><td>${esc(s.category||"")}</td><td><span class="chip badge-open">Pending</span></td>
      <td><div style="display:flex;gap:6px"><button class="btn btn-ghost btn-sm">Approve</button><button class="btn btn-ghost btn-sm" style="border-color:rgba(244,63,94,.4)">Reject</button></div></td></tr>`).join("");
    return this.submissions().length? `<div class="card" style="overflow:auto"><table class="tbl"><thead><tr><th></th><th>Project</th><th>User</th><th>Category</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` : this.emptyState("No submissions yet.");
  },

  adminUsers(){
    const rows = this.users().map((u,i)=>`<tr><td><span class="rank plain">${i+1}</span></td><td><span class="user-cell">${avatarHTML(u)} ${esc(u.name)}</span></td><td>@${esc(u.handle)}</td><td>${fmt(u.xp)}</td><td>${u.wins||0}</td><td>${u.admin?"<span class='chip diff-hard'>Admin</span>":"<span class='chip badge-open'>Member</span>"}</td></tr>`).join("");
    return `<div class="card" style="overflow:auto"><table class="tbl"><thead><tr><th>#</th><th>User</th><th>Handle</th><th>XP</th><th>Wins</th><th>Role</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  },

  /* ---------- Placeholder for upcoming steps ---------- */
  comingSoon(title, note){
    return `
      <section class="page-head"><div class="container">
        <span class="eyebrow">✧ ${esc(title)}</span>
        <h1 style="margin-top:14px">${esc(title)}</h1>
        <p>${esc(note)}</p>
      </div></section>
      <section class="container"><div class="empty">
        <div class="ico">🚧</div>
        <h3 style="margin-bottom:8px">Coming in the next build step</h3>
        <p>I'm building this platform page by page — this section is next on my list.</p>
      </div></section>`;
  },

  notFound(){ return `<div class="empty" style="padding:120px 20px"><div class="ico">${ico("compass",40)}</div><b>Page not found</b><p style="color:var(--muted)">The page you're looking for doesn't exist.</p></div>`; },

  /* ---------- Particles ---------- */
  particles(){
    const cv = $("#particles"); if (!cv || !cv.getContext) return;
    const ctx = cv.getContext("2d");
    cv.width = innerWidth; cv.height = innerHeight;
    const N = Math.min(50, Math.floor(innerWidth/28));
    const pts = Array.from({length:N}, ()=>({
      x: Math.random()*cv.width, y: Math.random()*cv.height,
      r: Math.random()*1.6+0.4, vx: (Math.random()-.5)*0.4, vy: (Math.random()-.5)*0.4,
      c: ["#a855f7","#ff4fd8","#8b5cf6","#c4b5fd"][Math.floor(Math.random()*4)]
    }));
    (function draw(){
      ctx.clearRect(0,0,cv.width,cv.height);
      for (const p of pts){
        p.x += p.vx; p.y += p.vy;
        if (p.x<0||p.x>cv.width) p.vx*=-1;
        if (p.y<0||p.y>cv.height) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fillStyle=p.c; ctx.globalAlpha=.5; ctx.fill();
      }
      requestAnimationFrame(draw);
    })();
    addEventListener("resize", ()=>{ cv.width=innerWidth; cv.height=innerHeight; });
  },

  observeReveal(){
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    $$(".reveal").forEach(el => io.observe(el));
  },
};

document.addEventListener("DOMContentLoaded", () => App.boot());