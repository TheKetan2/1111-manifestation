const categories = [
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

const $ = id => document.getElementById(id);
let categoryIndex = 0;
let wishIndex = 0;
let readSet = new Set(JSON.parse(localStorage.getItem("1111-read") || "[]"));
let reminder = localStorage.getItem("1111-reminder") || "07:00";
let reminderTimer = null;

function totalWishes(){return categories.reduce((n,c)=>n+c.wishes.length,0)}
function key(c,w){return `${c}:${w}`}
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
function renderCategories(){
 $("categoryGrid").innerHTML = categories.map((c,i)=>`<button class="category-btn ${i===categoryIndex?"active":""}" data-category="${i}"><span class="emoji">${c.emoji}</span>${c.name}</button>`).join("");
 document.querySelectorAll("[data-category]").forEach(btn=>btn.addEventListener("click",()=>{categoryIndex=Number(btn.dataset.category);wishIndex=0;render()}));
}
function render(){
 const c=categories[categoryIndex], wish=c.wishes[wishIndex];
 $("categoryLabel").textContent=`${c.emoji} ${c.name.toUpperCase()}`;
 $("wishCounter").textContent=`${String(wishIndex+1).padStart(2,"0")} / 11`;
 $("wishKicker").textContent=`WISH NO. ${wishIndex+1}`;
 $("wishText").textContent=wish;
 $("categoryProgress").style.width=`${(wishIndex+1)/c.wishes.length*100}%`;
 $("prevBtn").disabled=wishIndex===0;
 $("nextBtn").textContent=wishIndex===10?"Complete category ✓":"Next wish →";
 $("completePanel").hidden=true;
 $("wishKicker").hidden=false;$("wishText").hidden=false;$("reading-prompt").hidden=false;$("prevBtn").hidden=false;$("nextBtn").hidden=false;
 renderCategories();renderOverall();
}
function renderOverall(){
 const count=readSet.size, total=totalWishes(), pct=Math.round(count/total*100);
 $("readCount").textContent=`${count} / ${total}`;
 $("overallPercent").textContent=`${pct}%`;
 $("overallProgress").style.width=`${pct}%`;
 $("totalLabel").textContent=`${total} intentions`;
}
function markRead(){readSet.add(key(categoryIndex,wishIndex));localStorage.setItem("1111-read",JSON.stringify([...readSet]));}
$("prevBtn").addEventListener("click",()=>{if(wishIndex>0){wishIndex--;render()}});
$("nextBtn").addEventListener("click",()=>{
 markRead();
 if(wishIndex<10){wishIndex++;render();return}
 $("wishKicker").hidden=true;$("wishText").hidden=true;document.querySelector(".reading-prompt").hidden=true;
 $("prevBtn").hidden=true;$("nextBtn").hidden=true;$("completePanel").hidden=false;
 renderCategories();renderOverall();
});
$("restartBtn").addEventListener("click",()=>{wishIndex=0;render()});
$("settingsBtn").addEventListener("click",()=>{$("reminderTime").value=reminder;$("settingsDialog").showModal()});
$("saveReminder").addEventListener("click",async()=>{
 reminder=$("reminderTime").value;localStorage.setItem("1111-reminder",reminder);
 if("Notification" in window && Notification.permission==="default"){
   try{await Notification.requestPermission()}catch(e){}
 }
 $("settingsDialog").close();scheduleReminder();toast(`Reminder preference saved: ${reminder}`);
});
$("resetProgress").addEventListener("click",()=>{
 if(confirm("Reset all reading progress on this device?")){readSet=new Set();localStorage.removeItem("1111-read");$("settingsDialog").close();render();toast("Reading progress reset")}
});
function scheduleReminder(){
 if(reminderTimer)clearTimeout(reminderTimer);
 if(!("Notification" in window))return;
 // Browser timers only operate while the page is alive; this is a best-effort in-app reminder.
 const now=new Date(), [h,m]=reminder.split(":").map(Number), next=new Date();
 next.setHours(h,m,0,0);if(next<=now)next.setDate(next.getDate()+1);
 reminderTimer=setTimeout(async()=>{
   if(Notification.permission==="granted")new Notification("11:11 Manifestation",{body:"Take a few minutes for your daily intentions.",icon:"./icons/icon-192.png"});
   scheduleReminder();
 },next-now);
}
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
$("dateLabel").textContent=new Intl.DateTimeFormat("en-IN",{weekday:"long",day:"numeric",month:"long"}).format(new Date()).toUpperCase();
render();scheduleReminder();
