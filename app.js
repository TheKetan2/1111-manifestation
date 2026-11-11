// ─── Default wishes (source of truth) ───────────────────────────────────────
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

// ─── Custom wishes storage ────────────────────────────────────────────────────
// Stored as: { "0:3": "custom text", ... }  (categoryIndex:wishIndex)
const CUSTOM_KEY = "1111-custom-wishes";

function loadCustomWishes() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "{}"); }
  catch { return {}; }
}
function saveCustomWishes(map) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(map));
}
function wishKey(c, w) { return `${c}:${w}`; }

// Build live categories array (defaults merged with custom overrides)
let customWishes = loadCustomWishes();
let categories = buildCategories();

function buildCategories() {
  const cw = loadCustomWishes();
  return defaultCategories.map((cat, ci) => ({
    ...cat,
    wishes: cat.wishes.map((w, wi) => cw[wishKey(ci, wi)] ?? w)
  }));
}

function getWish(ci, wi) {
  return customWishes[wishKey(ci, wi)] ?? defaultCategories[ci].wishes[wi];
}
function isCustomised(ci, wi) {
  return wishKey(ci, wi) in customWishes;
}

// ─── App state ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
let categoryIndex = 0;
let wishIndex = 0;
let editMode = false;
let readSet = new Set(JSON.parse(localStorage.getItem("1111-read") || "[]"));
let reminder = localStorage.getItem("1111-reminder") || "07:00";
let reminderTimer = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function totalWishes() { return categories.reduce((n, c) => n + c.wishes.length, 0); }
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

// ─── Render ───────────────────────────────────────────────────────────────────
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
      render();
    })
  );
}

function render() {
  const c = categories[categoryIndex];
  const wish = getWish(categoryIndex, wishIndex);

  $("categoryLabel").textContent = `${c.emoji} ${c.name.toUpperCase()}`;
  $("wishCounter").textContent = `${String(wishIndex + 1).padStart(2, "0")} / 11`;
  $("wishKicker").textContent = `WISH NO. ${wishIndex + 1}`;
  $("wishText").textContent = wish;
  $("categoryProgress").style.width = `${(wishIndex + 1) / c.wishes.length * 100}%`;
  $("prevBtn").disabled = wishIndex === 0;
  $("nextBtn").textContent = wishIndex === 10 ? "Complete category ✓" : "Next wish →";
  $("completePanel").hidden = true;

  // Show/hide customised indicator on edit button
  const editBtn = $("editWishBtn");
  editBtn.textContent = isCustomised(categoryIndex, wishIndex) ? "✎ Edited" : "✎ Edit wish";
  editBtn.classList.toggle("edited", isCustomised(categoryIndex, wishIndex));

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

function renderOverall() {
  const count = readSet.size, total = totalWishes(), pct = Math.round(count / total * 100);
  $("readCount").textContent = `${count} / ${total}`;
  $("overallPercent").textContent = `${pct}%`;
  $("overallProgress").style.width = `${pct}%`;
  $("totalLabel").textContent = `${total} intentions`;
}

// ─── Edit mode ────────────────────────────────────────────────────────────────
function openEditMode() {
  editMode = true;
  const wish = getWish(categoryIndex, wishIndex);
  $("editTextarea").value = wish;
  $("editPanel").hidden = false;
  $("wishText").hidden = true;
  $("reading-prompt").hidden = true;
  $("editWishBtn").hidden = true;
  $("editTextarea").focus();
}

function closeEditMode() {
  editMode = false;
  $("editPanel").hidden = true;
  $("wishText").hidden = false;
  $("reading-prompt").hidden = false;
  $("editWishBtn").hidden = false;
}

function saveCurrentWish() {
  const text = $("editTextarea").value.trim();
  if (!text) { toast("Wish cannot be empty."); return; }
  customWishes[wishKey(categoryIndex, wishIndex)] = text;
  saveCustomWishes(customWishes);
  categories = buildCategories();
  render();
  toast("Wish saved ✓");
}

function resetCurrentWish() {
  if (!confirm("Reset this wish back to the default?")) return;
  delete customWishes[wishKey(categoryIndex, wishIndex)];
  saveCustomWishes(customWishes);
  categories = buildCategories();
  render();
  toast("Wish restored to default.");
}

$("editWishBtn").addEventListener("click", openEditMode);
$("cancelEditBtn").addEventListener("click", closeEditMode);
$("saveWishBtn").addEventListener("click", saveCurrentWish);
$("resetWishBtn").addEventListener("click", resetCurrentWish);

// ─── Manage Wishes Dialog ─────────────────────────────────────────────────────
function renderManageWishes() {
  const list = $("manageWishesList");
  list.innerHTML = categories.map((cat, ci) => `
    <div class="mw-category">
      <div class="mw-cat-header">${cat.emoji} ${cat.name}</div>
      ${defaultCategories[ci].wishes.map((_, wi) => {
        const custom = customWishes[wishKey(ci, wi)];
        const current = custom ?? defaultCategories[ci].wishes[wi];
        return `
          <div class="mw-wish-row" data-ci="${ci}" data-wi="${wi}">
            <div class="mw-wish-display">
              <span class="mw-wish-text">${escapeHtml(current)}</span>
              ${custom ? `<span class="mw-badge">edited</span>` : ""}
            </div>
            <div class="mw-wish-editor" hidden>
              <textarea class="edit-textarea mw-textarea" rows="3" maxlength="300">${escapeHtml(current)}</textarea>
              <div class="edit-actions">
                ${custom ? `<button class="secondary-btn mw-reset-btn">↺ Reset</button>` : `<span></span>`}
                <div class="edit-action-right">
                  <button class="secondary-btn mw-cancel-btn">Cancel</button>
                  <button class="primary-btn mw-save-btn">Save ✓</button>
                </div>
              </div>
            </div>
            <button class="mw-edit-btn secondary-btn">${custom ? "✎ Edited" : "✎ Edit"}</button>
          </div>`;
      }).join("")}
    </div>
  `).join("");

  // Wire events for manage-wishes rows
  list.querySelectorAll(".mw-wish-row").forEach(row => {
    const ci = Number(row.dataset.ci), wi = Number(row.dataset.wi);
    const display = row.querySelector(".mw-wish-display");
    const editor = row.querySelector(".mw-wish-editor");
    const editBtn = row.querySelector(".mw-edit-btn");
    const cancelBtn = row.querySelector(".mw-cancel-btn");
    const saveBtn = row.querySelector(".mw-save-btn");
    const resetBtn = row.querySelector(".mw-reset-btn");
    const textarea = row.querySelector(".mw-textarea");

    editBtn.addEventListener("click", () => {
      display.hidden = true;
      editor.hidden = false;
      editBtn.hidden = true;
      textarea.focus();
    });

    cancelBtn.addEventListener("click", () => {
      display.hidden = false;
      editor.hidden = true;
      editBtn.hidden = false;
    });

    saveBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if (!text) { toast("Wish cannot be empty."); return; }
      customWishes[wishKey(ci, wi)] = text;
      saveCustomWishes(customWishes);
      categories = buildCategories();
      renderManageWishes();
      render();
      toast("Wish saved ✓");
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (!confirm("Reset this wish back to the default?")) return;
        delete customWishes[wishKey(ci, wi)];
        saveCustomWishes(customWishes);
        categories = buildCategories();
        renderManageWishes();
        render();
        toast("Wish restored to default.");
      });
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

$("manageWishesBtn").addEventListener("click", () => {
  $("settingsDialog").close();
  renderManageWishes();
  $("manageWishesDialog").showModal();
});

// ─── Navigation ───────────────────────────────────────────────────────────────
function markRead() {
  readSet.add(wishKey(categoryIndex, wishIndex));
  localStorage.setItem("1111-read", JSON.stringify([...readSet]));
}

$("prevBtn").addEventListener("click", () => {
  if (wishIndex > 0) { wishIndex--; render(); }
});

$("nextBtn").addEventListener("click", () => {
  markRead();
  if (wishIndex < 10) { wishIndex++; render(); return; }
  $("wishKicker").hidden = true;
  $("wishText").hidden = true;
  document.querySelector(".reading-prompt").hidden = true;
  $("prevBtn").hidden = true;
  $("nextBtn").hidden = true;
  $("editWishBtn").hidden = true;
  $("completePanel").hidden = false;
  renderCategories();
  renderOverall();
});

$("restartBtn").addEventListener("click", () => { wishIndex = 0; render(); });

// ─── Settings ─────────────────────────────────────────────────────────────────
$("settingsBtn").addEventListener("click", () => {
  $("reminderTime").value = reminder;
  $("settingsDialog").showModal();
});

$("saveReminder").addEventListener("click", async () => {
  reminder = $("reminderTime").value;
  localStorage.setItem("1111-reminder", reminder);
  if ("Notification" in window && Notification.permission === "default") {
    try { await Notification.requestPermission(); } catch (e) {}
  }
  $("settingsDialog").close();
  scheduleReminder();
  toast(`Reminder preference saved: ${reminder}`);
});

$("resetProgress").addEventListener("click", () => {
  if (confirm("Reset all reading progress on this device?")) {
    readSet = new Set();
    localStorage.removeItem("1111-read");
    $("settingsDialog").close();
    render();
    toast("Reading progress reset");
  }
});

// ─── Reminder ─────────────────────────────────────────────────────────────────
function scheduleReminder() {
  if (reminderTimer) clearTimeout(reminderTimer);
  if (!("Notification" in window)) return;
  const now = new Date(), [h, m] = reminder.split(":").map(Number), next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  reminderTimer = setTimeout(async () => {
    if (Notification.permission === "granted")
      new Notification("11:11 Manifestation", { body: "Take a few minutes for your daily intentions.", icon: "./icons/icon-192.png" });
    scheduleReminder();
  }, next - now);
}

// ─── Service Worker ───────────────────────────────────────────────────────────
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

// ─── Init ─────────────────────────────────────────────────────────────────────
$("dateLabel").textContent = new Intl.DateTimeFormat("en-IN", {
  weekday: "long", day: "numeric", month: "long"
}).format(new Date()).toUpperCase();

render();
scheduleReminder();
