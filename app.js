// ═══════════════════════════════════════════════════════════════════
//  11:11 Manifestation — app.js
// ═══════════════════════════════════════════════════════════════════

// ─── Default wishes ───────────────────────────────────────────────
const defaultCategories = [
 {name:"Health",emoji:"🧬",wishes:[
 "I enjoy excellent physical, mental and emotional health throughout my life.",
 "I achieve my dream physique: muscular, lean, athletic and strong.",
 "I maintain a healthy body fat percentage and an ideal body weight.",
 "I have thick, healthy hair, clear glowing skin and a youthful appearance.",
 "I enjoy deep, uninterrupted and restorative sleep every night.",
 "My body has excellent strength, stamina, flexibility and endurance.",
 "I am free from chronic illnesses, injuries and unnecessary health complications.",
 "I maintain discipline in my nutrition, exercise and daily habits.",
 "I have a calm mind, emotional stability and freedom from excessive stress.",
 "I age gracefully and maintain my vitality, confidence and physical attractiveness.",
 "I live a long, energetic and healthy life."
 ]},
 {name:"Wealth",emoji:"💰",wishes:[
 "I become financially independent and never have to worry about money.",
 "I build a net worth of ₹5 crore or more through legitimate sources.",
 "I develop multiple reliable sources of passive and active income.",
 "My investments grow consistently through disciplined financial decisions.",
 "I own a beautiful, spacious and luxurious home.",
 "I own my dream car and premium motorcycle.",
 "I have sufficient savings and investments to handle any financial emergency.",
 "Money flows into my life through valuable skills, opportunities and smart decisions.",
 "I become an intelligent investor who builds and protects generational wealth.",
 "I enjoy travelling internationally without financial restrictions.",
 "I achieve the freedom to work because I want to, not because I have to."
 ]},
 {name:"Career",emoji:"🎯",wishes:[
 "I secure my dream government position through my own merit and hard work.",
 "I successfully clear the MPSC examination and become a Sales Tax Inspector.",
 "I achieve professional excellence and become exceptionally knowledgeable in my field.",
 "I earn respect, recognition and a reputation for honesty and competence.",
 "I become financially secure through a successful and rewarding career.",
 "I develop extraordinary decision-making, leadership and communication skills.",
 "I build a successful technology venture using my engineering knowledge.",
 "I create something meaningful that positively impacts thousands of people's lives.",
 "I attract opportunities that accelerate my professional growth.",
 "I work in an environment that values my talent, dignity and contribution.",
 "I achieve a career that gives me financial freedom, professional authority and personal satisfaction."
 ]},
 {name:"Relationship",emoji:"❤️",wishes:[
 "I attract a beautiful, emotionally mature, loyal and loving life partner.",
 "I find someone who genuinely understands, respects and accepts me.",
 "I experience a deeply fulfilling romantic relationship built on trust.",
 "I marry someone who becomes my best friend and lifelong companion.",
 "My relationship is filled with affection, intimacy, passion and mutual respect.",
 "I build a peaceful, happy and financially secure family.",
 "I attract people who genuinely care about me and support my growth.",
 "I maintain meaningful relationships with my parents, family and close friends.",
 "I communicate honestly and handle conflicts with maturity.",
 "I experience unconditional love without manipulation, dishonesty or emotional insecurity.",
 "I build a lifelong partnership in which we grow, travel, succeed and age together."
 ]}
];

// ─── Storage keys ─────────────────────────────────────────────────
const SK = {
  CATEGORIES: "1111-categories",
  CUSTOM:     "1111-custom-wishes",   // legacy – migrated on load
  READ:       "1111-read",
  ALARMS:     "1111-alarms",
  THEME:      "1111-theme",
  STREAK:     "1111-streak"
};

// ─── Themes ───────────────────────────────────────────────────────
const THEMES = ["midnight", "amethyst", "emerald", "sunset", "daybreak"];
const THEME_COLORS = {
  midnight: "#0b1220",
  amethyst: "#0d0817",
  emerald:  "#071510",
  sunset:   "#180d07",
  daybreak: "#f6f5ef"
};

function getActiveTheme() {
  return localStorage.getItem(SK.THEME) || "midnight";
}

function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = "midnight";
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(SK.THEME, theme);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme && THEME_COLORS[theme]) {
    metaTheme.setAttribute("content", THEME_COLORS[theme]);
  }

  document.querySelectorAll("#themePicker .theme-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

function cycleTheme() {
  const current = getActiveTheme();
  const nextIdx = (THEMES.indexOf(current) + 1) % THEMES.length;
  const nextTheme = THEMES[nextIdx];
  applyTheme(nextTheme);
  const names = {
    midnight: "Midnight 🌌",
    amethyst: "Amethyst 🔮",
    emerald:  "Emerald 🍃",
    sunset:   "Sunset 🌅",
    daybreak: "Daybreak ☀️"
  };
  toast(`Theme: ${names[nextTheme] || nextTheme}`);
}

// ─── Streak tracking ──────────────────────────────────────────────
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getYesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getStreakData() {
  try {
    return JSON.parse(localStorage.getItem(SK.STREAK) || '{"count":0,"lastDate":""}');
  } catch {
    return { count: 0, lastDate: "" };
  }
}
function updateStreakBadge() {
  const data = getStreakData();
  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  let count = data.count || 0;
  if (data.lastDate && data.lastDate !== today && data.lastDate !== yesterday) {
    count = 0;
  }
  const el = $("streakCount");
  if (el) el.textContent = count;
}
function recordDailyProgress() {
  const today = getTodayStr();
  const yesterday = getYesterdayStr();
  let data = getStreakData();
  if (data.lastDate === today) return;
  if (data.lastDate === yesterday) {
    data.count = (data.count || 0) + 1;
  } else {
    data.count = 1;
  }
  data.lastDate = today;
  localStorage.setItem(SK.STREAK, JSON.stringify(data));
  updateStreakBadge();
}

// ─── Migrate legacy custom-wishes format ──────────────────────────
(function migrateStorage() {
  if (localStorage.getItem(SK.CATEGORIES)) return;
  const old = localStorage.getItem(SK.CUSTOM);
  if (!old) return;
  try {
    const customWishes = JSON.parse(old);
    const cats = defaultCategories.map(c => ({ name: c.name, emoji: c.emoji, wishes: [...c.wishes] }));
    for (const [key, text] of Object.entries(customWishes)) {
      const [ci, wi] = key.split(":").map(Number);
      if (cats[ci]?.wishes[wi] !== undefined) cats[ci].wishes[wi] = text;
    }
    localStorage.setItem(SK.CATEGORIES, JSON.stringify(cats));
    localStorage.removeItem(SK.CUSTOM);
  } catch {}
})();

// ─── Categories ───────────────────────────────────────────────────
function loadCategories() {
  try {
    const s = localStorage.getItem(SK.CATEGORIES);
    if (s) return JSON.parse(s);
  } catch {}
  return defaultCategories.map(c => ({ name: c.name, emoji: c.emoji, wishes: [...c.wishes] }));
}
function saveCategories() { localStorage.setItem(SK.CATEGORIES, JSON.stringify(categories)); }

let categories = loadCategories();

function isDefaultWish(ci, wi) {
  return categories[ci]?.wishes[wi] === defaultCategories[ci]?.wishes[wi];
}

// ─── Alarms ───────────────────────────────────────────────────────
function loadAlarms() {
  try { return JSON.parse(localStorage.getItem(SK.ALARMS) || "[]"); }
  catch { return []; }
}
function saveAlarms(list) { localStorage.setItem(SK.ALARMS, JSON.stringify(list)); }

let alarms = loadAlarms();
let inPageTimers = [];

// ─── App state ────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
let categoryIndex = 0;
let wishIndex = 0;
let readSet = new Set(JSON.parse(localStorage.getItem(SK.READ) || "[]"));

// ─── Utilities ────────────────────────────────────────────────────
function totalWishes() { return categories.reduce((n, c) => n + c.wishes.length, 0); }
function wishKey(ci, wi) { return `${ci}:${wi}`; }
function escapeHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
function toast(msg, duration = 2400) {
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), duration);
}
function msUntilTime(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  const now = new Date(), target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target - now;
}

// ─── Alarm Sound (Web Audio API) ──────────────────────────────────
function playAlarmSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    function bell(freq, start, duration) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    }
    bell(880, 0,   1.2);
    bell(880, 0.5, 1.2);
    bell(1047, 1.1, 1.5);
    bell(880, 1.6, 1.2);
    bell(880, 2.1, 1.2);
    bell(1047, 2.6, 2.0);
  } catch {}
}

// ─── Notifications ────────────────────────────────────────────────
async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try { return await Notification.requestPermission(); }
  catch { return "denied"; }
}

async function getSW() {
  if (!("serviceWorker" in navigator)) return null;
  try { return await navigator.serviceWorker.ready; } catch { return null; }
}

async function pushAlarmsToSW(list) {
  const reg = await getSW();
  if (!reg || !reg.active) return;
  reg.active.postMessage({ type: "SCHEDULE_ALARM", alarms: list });
}

async function registerPeriodicSync(reg) {
  if (!("periodicSync" in reg)) return;
  try {
    const status = await navigator.permissions.query({ name: "periodic-background-sync" });
    if (status.state !== "granted") return;
    await reg.periodicSync.register("1111-alarm", { minInterval: 24 * 60 * 60 * 1000 });
  } catch {}
}

function scheduleInPageAlarms(list) {
  inPageTimers.forEach(clearTimeout);
  inPageTimers = [];
  list.forEach(alarm => {
    if (!alarm.enabled) return;
    const ms = msUntilTime(alarm.time);
    const t = setTimeout(() => {
      playAlarmSound();
      showInPageAlarmBanner(alarm.label || "Time for your daily intentions!");
      if (Notification.permission === "granted") {
        new Notification("🔔 11:11 Manifestation", {
          body: alarm.label || "Time for your daily intentions. Open the app and begin.",
          icon: "./icons/icon-192.png",
          tag: "1111-alarm",
          requireInteraction: true,
          vibrate: [300, 150, 300, 150, 600],
        });
      }
      const t2 = setTimeout(() => scheduleInPageAlarms(list), 1000);
      inPageTimers.push(t2);
    }, ms);
    inPageTimers.push(t);
  });
}

function showInPageAlarmBanner(message) {
  const banner = $("alarmBanner");
  $("alarmBannerMsg").textContent = message;
  banner.hidden = false;
  banner.classList.add("visible");
  const t = setTimeout(() => dismissAlarmBanner(), 60000);
  banner._dismissTimer = t;
}

function dismissAlarmBanner() {
  const banner = $("alarmBanner");
  clearTimeout(banner._dismissTimer);
  banner.classList.remove("visible");
  setTimeout(() => { banner.hidden = true; }, 350);
}

function updateNotifStatus() {
  const el = $("notifStatus");
  if (!("Notification" in window)) {
    el.innerHTML = "⚠️ Notifications are <strong>not supported</strong> in this browser.";
    return;
  }
  const perm = Notification.permission;
  if (perm === "granted") {
    el.innerHTML = "✅ Notifications <strong>enabled</strong>. Alarms will fire even when app is in background.";
    el.style.color = "#6fcc8f";
  } else if (perm === "denied") {
    el.innerHTML = "🚫 Notifications <strong>blocked</strong>. Please allow in browser/OS settings then reload.";
    el.style.color = "#e07070";
  } else {
    el.innerHTML = "🔔 Notifications <strong>not yet enabled</strong>. Save an alarm to grant permission.";
    el.style.color = "";
  }
}

// ─── Alarm settings UI ────────────────────────────────────────────
function renderAlarmList() {
  const container = $("alarmList");
  if (!alarms.length) {
    container.innerHTML = `<p class="no-alarms-hint">No alarms set. Add one below.</p>`;
    return;
  }
  container.innerHTML = alarms.map((a, i) => `
    <div class="alarm-row" data-index="${i}">
      <label class="alarm-toggle" title="${a.enabled ? "Enabled" : "Disabled"}">
        <input type="checkbox" class="alarm-enabled" ${a.enabled ? "checked" : ""}>
        <span class="alarm-toggle-track"></span>
      </label>
      <input type="time" class="alarm-time-input" value="${a.time}">
      <input type="text" class="alarm-label-input" value="${escapeHtml(a.label || "")}" placeholder="Label (optional)" maxlength="40">
      <button class="alarm-del-btn" title="Remove alarm" data-index="${i}">×</button>
    </div>
  `).join("");

  container.querySelectorAll(".alarm-row").forEach(row => {
    const idx = Number(row.dataset.index);
    row.querySelector(".alarm-enabled").addEventListener("change", e => {
      alarms[idx].enabled = e.target.checked;
    });
    row.querySelector(".alarm-time-input").addEventListener("change", e => {
      alarms[idx].time = e.target.value;
    });
    row.querySelector(".alarm-label-input").addEventListener("input", e => {
      alarms[idx].label = e.target.value;
    });
    row.querySelector(".alarm-del-btn").addEventListener("click", () => {
      alarms.splice(idx, 1);
      renderAlarmList();
    });
  });
}

$("addAlarmBtn").addEventListener("click", () => {
  if (alarms.length >= 5) { toast("Maximum 5 alarms allowed."); return; }
  alarms.push({ time: "07:00", label: "", enabled: true });
  renderAlarmList();
});

$("saveAlarms").addEventListener("click", async () => {
  const perm = await requestNotificationPermission();
  updateNotifStatus();
  if (perm === "denied") {
    toast("⚠️ Permission denied. Allow notifications in settings.", 3500);
    return;
  }
  saveAlarms(alarms);
  scheduleInPageAlarms(alarms);
  pushAlarmsToSW(alarms);
  const reg = await getSW();
  if (reg) registerPeriodicSync(reg);
  $("settingsDialog").close();
  const count = alarms.filter(a => a.enabled).length;
  toast(count ? `✅ ${count} alarm${count > 1 ? "s" : ""} saved!` : "Alarms saved (all disabled).");
});

$("testAlarmBtn").addEventListener("click", async () => {
  const perm = await requestNotificationPermission();
  updateNotifStatus();
  playAlarmSound();
  showInPageAlarmBanner("🔔 Test alarm — your intentions await!");
  if (perm === "granted") {
    const reg = await getSW();
    if (reg?.active) {
      reg.active.postMessage({ type: "FIRE_TEST", label: "🔔 Test alarm — time for your daily intentions!" });
    } else {
      new Notification("🔔 11:11 Manifestation", {
        body: "Test alarm — time for your daily intentions!",
        icon: "./icons/icon-192.png",
        requireInteraction: true,
      });
    }
  }
});

$("alarmBannerClose").addEventListener("click", dismissAlarmBanner);
$("alarmBannerOpen").addEventListener("click", () => {
  dismissAlarmBanner();
  document.querySelector(".reading-card").scrollIntoView({ behavior: "smooth" });
});

// ─── Settings dialog open ─────────────────────────────────────────
$("settingsBtn").addEventListener("click", () => {
  alarms = loadAlarms();
  renderAlarmList();
  updateNotifStatus();
  applyTheme(getActiveTheme());
  $("settingsDialog").showModal();
});

// ─── Reading progress reset ───────────────────────────────────────
$("resetProgress").addEventListener("click", () => {
  if (confirm("Reset all reading progress on this device?")) {
    readSet = new Set();
    localStorage.removeItem(SK.READ);
    $("settingsDialog").close();
    render();
    toast("Reading progress reset");
  }
});

// ─── Manage Wishes button ─────────────────────────────────────────
$("manageWishesBtn").addEventListener("click", () => {
  $("settingsDialog").close();
  renderManageWishes();
  $("manageWishesDialog").showModal();
});

// ─── Export / Import wishes ───────────────────────────────────────
$("exportWishesBtn").addEventListener("click", () => {
  const data = JSON.stringify({ categories, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "1111-manifestations.json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Intentions exported 📤");
});

$("importWishesBtn").addEventListener("click", () => {
  $("importFileInput").click();
});

$("importFileInput").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
        categories = parsed.categories;
        saveCategories();
        render();
        toast("Intentions imported successfully! 📥");
      } else if (Array.isArray(parsed) && parsed.length > 0) {
        categories = parsed;
        saveCategories();
        render();
        toast("Intentions imported successfully! 📥");
      } else {
        toast("Invalid JSON format.");
      }
    } catch {
      toast("Failed to parse JSON file.");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

// ─── Theme Handlers ───────────────────────────────────────────────
$("themeQuickBtn").addEventListener("click", cycleTheme);

document.querySelectorAll("#themePicker .theme-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
    const themeName = btn.querySelector(".theme-name")?.textContent || btn.dataset.theme;
    toast(`Theme set: ${themeName}`);
  });
});

// ─── SW message listener ──────────────────────────────────────────
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", event => {
    if (event.data?.type === "ALARMS_SCHEDULED") {
      console.log(`SW acknowledged ${event.data.count} alarm(s) scheduled.`);
    }
  });
}

// ─── Render: categories grid ──────────────────────────────────────
function renderCategories() {
  $("categoryGrid").innerHTML = categories.map((c, i) =>
    `<button class="category-btn ${i === categoryIndex ? "active" : ""}" data-category="${i}">
      <span class="emoji">${c.emoji}</span>${c.name}
    </button>`
  ).join("");
  document.querySelectorAll("[data-category]").forEach(btn =>
    btn.addEventListener("click", () => {
      categoryIndex = Number(btn.dataset.category);
      wishIndex = 0;
      closeEditMode();
      render("next");
    })
  );
}

// ─── Render: overall progress ─────────────────────────────────────
function renderOverall() {
  const count = readSet.size, total = totalWishes(), pct = Math.round(count / total * 100);
  $("readCount").textContent = `${count} / ${total}`;
  $("overallPercent").textContent = `${pct}%`;
  $("overallProgress").style.width = `${pct}%`;
  $("totalLabel").textContent = `${total} intentions`;
  $("sessionNote").textContent = `${total} intentions · ${categories.length} categories · One stronger you`;
  updateStreakBadge();
}

// ─── Render: reading card with animation ──────────────────────────
function render(direction = null) {
  const c = categories[categoryIndex];
  const totalInCat = c.wishes.length;
  wishIndex = Math.min(wishIndex, totalInCat - 1);
  const wish = c.wishes[wishIndex];

  $("categoryLabel").textContent = `${c.emoji} ${c.name.toUpperCase()}`;
  $("wishCounter").textContent = `${String(wishIndex + 1).padStart(2, "0")} / ${totalInCat}`;
  $("wishKicker").textContent = `WISH NO. ${wishIndex + 1}`;

  const wishEl = $("wishText");
  wishEl.textContent = wish;
  wishEl.classList.remove("anim-slide-next", "anim-slide-prev");
  if (direction === "next") {
    void wishEl.offsetWidth; // force reflow for smooth re-trigger
    wishEl.classList.add("anim-slide-next");
  } else if (direction === "prev") {
    void wishEl.offsetWidth;
    wishEl.classList.add("anim-slide-prev");
  }

  $("categoryProgress").style.width = `${(wishIndex + 1) / totalInCat * 100}%`;
  $("prevBtn").disabled = wishIndex === 0;
  $("nextBtn").textContent = wishIndex === totalInCat - 1 ? "Complete category ✓" : "Next wish →";
  $("completePanel").hidden = true;

  const cpText = $("completePanelText");
  if (cpText) cpText.textContent = `You have finished all ${totalInCat} intentions in this category.`;

  const editBtn = $("editWishBtn");
  editBtn.textContent = isDefaultWish(categoryIndex, wishIndex) ? "✎ Edit wish" : "✎ Edited";
  editBtn.classList.toggle("edited", !isDefaultWish(categoryIndex, wishIndex));

  $("wishKicker").hidden = false;
  $("wishText").hidden = false;
  $("reading-prompt").hidden = false;
  $("prevBtn").hidden = false;
  $("nextBtn").hidden = false;
  $("editWishBtn").hidden = false;

  closeEditMode();
  renderCategories();
  renderOverall();
}

// ─── Inline wish editor ───────────────────────────────────────────
function openEditMode() {
  $("editTextarea").value = categories[categoryIndex].wishes[wishIndex];
  $("editPanel").hidden = false;
  $("editPanel").classList.add("active");
  $("wishText").style.display = "none";
  $("reading-prompt").style.display = "none";
  $("editWishBtn").style.display = "none";
  $("editTextarea").focus();
}
function closeEditMode() {
  $("editPanel").hidden = true;
  $("editPanel").classList.remove("active");
  $("wishText").style.display = "";
  $("reading-prompt").style.display = "";
  $("editWishBtn").style.display = "";
}
function saveCurrentWish() {
  const text = $("editTextarea").value.trim();
  if (!text) { toast("Wish cannot be empty."); return; }
  categories[categoryIndex].wishes[wishIndex] = text;
  saveCategories();
  render();
  toast("Wish saved ✓");
}
function resetCurrentWish() {
  if (!confirm("Reset this wish back to the default?")) return;
  if (defaultCategories[categoryIndex]?.wishes[wishIndex] !== undefined) {
    categories[categoryIndex].wishes[wishIndex] = defaultCategories[categoryIndex].wishes[wishIndex];
    saveCategories();
  }
  render();
  toast("Wish restored to default.");
}

$("editWishBtn").addEventListener("click", openEditMode);
$("cancelEditBtn").addEventListener("click", closeEditMode);
$("saveWishBtn").addEventListener("click", saveCurrentWish);
$("resetWishBtn").addEventListener("click", resetCurrentWish);

// ─── Navigation ───────────────────────────────────────────────────
function markRead() {
  readSet.add(wishKey(categoryIndex, wishIndex));
  localStorage.setItem(SK.READ, JSON.stringify([...readSet]));
}

$("prevBtn").addEventListener("click", () => {
  if (wishIndex > 0) {
    wishIndex--;
    render("prev");
  }
});

$("nextBtn").addEventListener("click", () => {
  markRead();
  recordDailyProgress();
  const totalInCat = categories[categoryIndex].wishes.length;
  if (wishIndex < totalInCat - 1) {
    wishIndex++;
    render("next");
    return;
  }
  $("wishKicker").hidden = true;
  $("wishText").hidden = true;
  $("reading-prompt").hidden = true;
  $("prevBtn").hidden = true;
  $("nextBtn").hidden = true;
  $("editWishBtn").hidden = true;
  $("completePanel").hidden = false;
  renderCategories();
  renderOverall();
});

$("restartBtn").addEventListener("click", () => {
  wishIndex = 0;
  render("next");
});

// ─── Manage Wishes Dialog ─────────────────────────────────────────
function renderManageWishes() {
  const list = $("manageWishesList");
  list.innerHTML = categories.map((cat, ci) => `
    <div class="mw-category">
      <div class="mw-cat-header">${cat.emoji} ${cat.name}</div>
      ${cat.wishes.map((wish, wi) => {
        const isDefault = wish === (defaultCategories[ci]?.wishes[wi] ?? "");
        return `
        <div class="mw-wish-row" data-ci="${ci}" data-wi="${wi}">
          <div class="mw-wish-display">
            <span class="mw-wish-text">${escapeHtml(wish)}</span>
            <div class="mw-wish-actions">
              ${!isDefault ? `<span class="mw-badge">edited</span>` : ""}
              <button class="mw-del-btn" title="Delete wish" ${cat.wishes.length <= 1 ? "disabled" : ""}>×</button>
            </div>
          </div>
          <div class="mw-wish-editor" hidden>
            <textarea class="edit-textarea mw-textarea" rows="3" maxlength="300">${escapeHtml(wish)}</textarea>
            <div class="edit-actions">
              ${!isDefault ? `<button class="secondary-btn mw-reset-btn">↺ Default</button>` : "<span></span>"}
              <div class="edit-action-right">
                <button class="secondary-btn mw-cancel-btn">Cancel</button>
                <button class="primary-btn mw-save-btn">Save ✓</button>
              </div>
            </div>
          </div>
          <button class="mw-edit-btn secondary-btn">${!isDefault ? "✎ Edited" : "✎ Edit"}</button>
        </div>`;
      }).join("")}
      <div class="mw-add-panel" data-ci="${ci}">
        <button class="mw-add-btn">+ Add intention</button>
        <div class="mw-add-editor" hidden>
          <textarea class="edit-textarea mw-textarea mw-add-textarea" rows="2" maxlength="300" placeholder="Write a new intention…"></textarea>
          <div class="edit-actions">
            <span></span>
            <div class="edit-action-right">
              <button class="secondary-btn mw-add-cancel">Cancel</button>
              <button class="primary-btn mw-add-save">Add ✓</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".mw-wish-row").forEach(row => {
    const ci = Number(row.dataset.ci), wi = Number(row.dataset.wi);
    const display = row.querySelector(".mw-wish-display");
    const editor  = row.querySelector(".mw-wish-editor");
    const editBtn = row.querySelector(".mw-edit-btn");
    const cancelBtn = row.querySelector(".mw-cancel-btn");
    const saveBtn = row.querySelector(".mw-save-btn");
    const resetBtn = row.querySelector(".mw-reset-btn");
    const delBtn  = row.querySelector(".mw-del-btn");
    const textarea = row.querySelector(".mw-textarea");

    editBtn.addEventListener("click", () => {
      display.hidden = true; editor.hidden = false; editBtn.hidden = true; textarea.focus();
    });
    cancelBtn.addEventListener("click", () => {
      display.hidden = false; editor.hidden = true; editBtn.hidden = false;
    });
    saveBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) { toast("Wish cannot be empty."); return; }
      categories[ci].wishes[wi] = text;
      saveCategories();
      renderManageWishes();
      render();
      toast("Wish saved ✓");
    });
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (!confirm("Reset this wish to the default?")) return;
        if (defaultCategories[ci]?.wishes[wi] !== undefined) {
          categories[ci].wishes[wi] = defaultCategories[ci].wishes[wi];
          saveCategories();
          renderManageWishes();
          render();
          toast("Wish restored to default.");
        }
      });
    }
    if (delBtn && !delBtn.disabled) {
      delBtn.addEventListener("click", () => {
        if (!confirm("Delete this intention permanently?")) return;
        categories[ci].wishes.splice(wi, 1);
        saveCategories();
        if (categoryIndex === ci && wishIndex >= categories[ci].wishes.length) {
          wishIndex = Math.max(0, categories[ci].wishes.length - 1);
        }
        renderManageWishes();
        render();
        toast("Intention removed.");
      });
    }
  });

  list.querySelectorAll(".mw-add-panel").forEach(panel => {
    const ci = Number(panel.dataset.ci);
    const addBtn    = panel.querySelector(".mw-add-btn");
    const editor    = panel.querySelector(".mw-add-editor");
    const cancelBtn = panel.querySelector(".mw-add-cancel");
    const saveBtn   = panel.querySelector(".mw-add-save");
    const textarea  = panel.querySelector(".mw-add-textarea");

    addBtn.addEventListener("click", () => {
      editor.hidden = false; addBtn.hidden = true; textarea.value = ""; textarea.focus();
    });
    cancelBtn.addEventListener("click", () => {
      editor.hidden = true; addBtn.hidden = false;
    });
    saveBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) { toast("Intention cannot be empty."); return; }
      categories[ci].wishes.push(text);
      saveCategories();
      renderManageWishes();
      render();
      toast("Intention added ✓");
    });
  });
}

// ─── Service Worker registration ──────────────────────────────────
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("./sw.js");
      await reg.ready;
      const saved = loadAlarms().filter(a => a.enabled);
      if (saved.length && reg.active) {
        reg.active.postMessage({ type: "SCHEDULE_ALARM", alarms: saved });
      }
      registerPeriodicSync(reg);
    } catch {}
  });
}

// ─── Initialize ───────────────────────────────────────────────────
applyTheme(getActiveTheme());
scheduleInPageAlarms(loadAlarms());
updateStreakBadge();

$("dateLabel").textContent = new Intl.DateTimeFormat("en-IN", {
  weekday: "long", day: "numeric", month: "long"
}).format(new Date()).toUpperCase();

render();
