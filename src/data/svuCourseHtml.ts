export const SVU_COURSE_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title>منصة تحديد المستوى الإنجليزي — SVU</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700;800&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{
  --primary:#1E7A72; --primary-deep:#0E5845; --primary-mid:#153F3A;
  --accent:#7FDCCE; --accent-soft:#E2F0EE;
  --gold:#B8862E; --gold-soft:#F3E3C2;
  --danger:#A8472E; --danger-soft:#F6E2DB;
  --success:#1A6B45; --success-soft:#DCEFE6;
  --paper:#FAF6EE; --paper-2:#F3EEE2; --card:#FFFFFF;
  --ink:#2B2A26; --ink-soft:#615C50; --line:#E4DCC9;
  --radius:14px;
}
html.dark{
  --paper:#060F0F; --paper-2:#0D2020; --card:#112B2B;
  --ink:#EAF6F4; --ink-soft:#9FC4BE; --line:#1D3E3B;
  --accent-soft:#153B38; --gold-soft:#3A2E14; --danger-soft:#3A211C; --success-soft:#173B29;
}
*{box-sizing:border-box;}
body{margin:0;background:var(--paper);color:var(--ink);font-family:'Tajawal',sans-serif;-webkit-font-smoothing:antialiased;padding-bottom:70px;}
h1,h2,h3,h4{font-family:'Cairo',sans-serif;margin:0 0 8px;}
button{font-family:'Tajawal',sans-serif;}
.topbar{position:fixed;top:0;left:0;right:0;z-index:150;height:64px;background:linear-gradient(135deg,var(--primary-deep),var(--primary));display:flex;align-items:center;justify-content:space-between;padding:0 14px;box-shadow:0 4px 14px rgba(0,0,0,.2);}
.topbar-brand{display:flex;align-items:center;gap:10px;}
.logo-wrap{width:38px;height:38px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;font-family:'Cairo',sans-serif;font-weight:800;color:var(--primary-deep);}
.brand-name{color:#fff;font-family:'Cairo',sans-serif;font-weight:800;font-size:15px;}
.brand-sub{color:rgba(255,255,255,.75);font-size:11px;}
.nav-panel{position:fixed;top:64px;left:0;right:0;z-index:140;background:rgba(255,255,255,0.95);backdrop-filter:blur(14px);padding:14px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;border-bottom:1px solid var(--line);}
html.dark .nav-panel{background:rgba(13,32,32,0.96);}
.nav-btn{background:var(--paper-2);border:1.5px solid var(--line);border-radius:12px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;color:var(--ink);}
.nav-btn:hover,.nav-btn.active{background:var(--primary);color:#fff;border-color:var(--primary);}
.layout{max-width:760px;margin:0 auto;padding:140px 14px 40px;}
.view{display:none;}
.view.active{display:block;}
.card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:18px;box-shadow:0 4px 14px rgba(0,0,0,.05);margin-bottom:16px;}
.card-intro{background:linear-gradient(135deg,var(--primary-deep),var(--primary));color:#fff;border:none;}
.card-intro p{color:rgba(255,255,255,.9);margin:0;font-size:14px;line-height:1.8;}
.btn-primary{background:linear-gradient(135deg,var(--primary-deep),var(--primary));color:#fff;border:none;border-radius:12px;padding:12px 18px;font-weight:700;cursor:pointer;font-size:14px;width:100%;}
.btn-secondary{background:var(--accent-soft);color:var(--primary-deep);border:1.5px solid var(--accent);border-radius:12px;padding:10px 16px;font-weight:700;cursor:pointer;font-size:13px;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.level-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:16px;text-align:center;cursor:pointer;transition:.2s;}
.level-card:hover{border-color:var(--accent);transform:translateY(-2px);}
.level-card .lv-num{font-family:'Cairo',sans-serif;font-weight:800;font-size:24px;color:var(--primary);}
.level-card .lv-name{font-size:13px;color:var(--ink-soft);margin-top:2px;}
.search-wrap{position:sticky;top:128px;z-index:60;background:var(--paper);padding:8px 0;margin-bottom:12px;}
.search-input{width:100%;padding:12px 14px;border-radius:12px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font-family:'Tajawal',sans-serif;font-size:14px;}
.chapter{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:18px;margin-bottom:18px;}
.lesson-badge{background:var(--primary);color:#fff;font-family:'Cairo',sans-serif;font-weight:800;font-size:11px;border-radius:8px;padding:3px 8px;display:inline-block;margin-bottom:6px;}
.rule-box{background:var(--paper-2);border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-family:'Cairo',sans-serif;font-size:13px;white-space:pre-line;line-height:2;direction:ltr;text-align:right;}
.ex-item{background:var(--accent-soft);border-radius:10px;padding:9px 12px;margin-bottom:6px;font-size:13px;}
.ex-item .en{direction:ltr;display:block;font-weight:700;color:var(--primary-deep);margin-bottom:2px;}
.callout{border-radius:10px;padding:10px 12px;margin-bottom:8px;font-size:13px;line-height:1.8;}
.callout.gold{background:var(--gold-soft);border:1px solid var(--gold);}
.callout.danger{background:var(--danger-soft);border:1px solid var(--danger);}
.exam-opt{background:var(--paper-2);border:1.8px solid var(--line);border-radius:12px;padding:12px 16px;margin-bottom:8px;cursor:pointer;transition:.15s;}
.exam-opt:hover{border-color:var(--primary);}
.exam-opt.correct{background:var(--success-soft);border-color:var(--success);}
.exam-opt.wrong{background:var(--danger-soft);border-color:var(--danger);}
.dark-toggle{position:fixed;bottom:20px;left:20px;z-index:160;background:var(--primary);color:#fff;border:none;border-radius:50%;width:44px;height:44px;cursor:pointer;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,.3);}
</style>
</head>
<body class="dark">
<header class="topbar">
  <div class="topbar-brand">
    <div class="logo-wrap">SVU</div>
    <div>
      <div class="brand-name">منصة تحديد المستوى الإنجليزي</div>
      <div class="brand-sub">English Placement Prep — 47 درس متكامل</div>
    </div>
  </div>
</header>

<nav class="nav-panel">
  <button class="nav-btn active" onclick="showV('home')">الرئيسية</button>
  <button class="nav-btn" onclick="showV('lessons')">الدروس (47 درس)</button>
  <button class="nav-btn" onclick="showV('exam')">اختبار تجريبي</button>
  <button class="nav-btn" onclick="showV('plan')">خطة الدراسة</button>
</nav>

<button class="dark-toggle" onclick="document.body.classList.toggle('dark')">🌓</button>

<div class="layout">
  <div id="v-home" class="view active">
    <div class="card card-intro">
      <h2>أهلاً بك في منصة تحديد المستوى — SVU</h2>
      <p>دورة مكثفة وتفاعلية مصممة خصيصاً لاجتياز امتحان تحديد المستوى في اللغة الإنجليزية بنجاح. تحتوي على 47 درساً مقسماً على 5 مستويات، تدريبات فورية، أسئلة اختيار من متعدد، واختبارات شاملة.</p>
    </div>
    <div class="grid-2">
      <div class="level-card" onclick="filterLevel(1)">
        <div class="lv-num">L1</div><div class="lv-name">الأساسيات</div><div style="font-size:12px;color:var(--accent);margin-top:4px">9 دروس</div>
      </div>
      <div class="level-card" onclick="filterLevel(2)">
        <div class="lv-num">L2</div><div class="lv-name">التأسيسي</div><div style="font-size:12px;color:var(--accent);margin-top:4px">10 دروس</div>
      </div>
      <div class="level-card" onclick="filterLevel(3)">
        <div class="lv-num">L3</div><div class="lv-name">المتوسط الأول</div><div style="font-size:12px;color:var(--accent);margin-top:4px">12 درساً</div>
      </div>
      <div class="level-card" onclick="filterLevel(4)">
        <div class="lv-num">L4</div><div class="lv-name">المتوسط</div><div style="font-size:12px;color:var(--accent);margin-top:4px">11 درساً</div>
      </div>
      <div class="level-card" onclick="filterLevel(5)" style="grid-column: span 2;">
        <div class="lv-num">L5</div><div class="lv-name">المتقدم</div><div style="font-size:12px;color:var(--accent);margin-top:4px">5 دروس</div>
      </div>
    </div>
    <button class="btn-primary" style="margin-top:16px" onclick="showV('lessons')">استعراض كافة الدروس ←</button>
  </div>

  <div id="v-lessons" class="view">
    <div class="search-wrap">
      <input class="search-input" placeholder="🔎 ابحث في الدروس والقواعد..." oninput="searchL(this.value)">
    </div>
    <div id="lessonsContainer"></div>
  </div>

  <div id="v-exam" class="view">
    <div class="card card-intro">
      <h2>اختبار تحديد المستوى التجريبي</h2>
      <p>أجب عن الأسئلة التالية لقياس جاهزيتك للامتحان الحقيقي.</p>
    </div>
    <div id="examContainer"></div>
  </div>

  <div id="v-plan" class="view">
    <div class="card card-intro">
      <h2>خطة المذاكرة المقترحة</h2>
      <p>خطوة بخطوة للوصول إلى أعلى درجة في الاختبار.</p>
    </div>
    <div class="card">
      <h3 style="color:var(--accent)">1. دراسة الأساسيات (المستوى 1 و 2)</h3>
      <p style="font-size:13.5px;line-height:1.8">ركز على الضمائر، أدوات التعريف والنكرة، الأزمنة البسيطة والمستمرة، والمقارنات. هذه تمثل 40% من الامتحان.</p>
      <h3 style="color:var(--accent);margin-top:14px">2. إتقان الأزمنة التامة والمبني للمجهول (المستوى 3 و 4)</h3>
      <p style="font-size:13.5px;line-height:1.8">المضارع التام، الماضي التام، الجمل الشرطية (Conditionals)، وأدوات التضاد والربط.</p>
      <h3 style="color:var(--accent);margin-top:14px">3. المتقدم (المستوى 5)</h3>
      <p style="font-size:13.5px;line-height:1.8">الكلام المنقول (Reported Speech)، أمنيات wish، والأفعال المركبة (Phrasal Verbs).</p>
    </div>
  </div>
</div>

<script>
const LESSONS_DATA = [
  {id:1, lv:1, title:"الضمائر (Pronouns)", rule:"Subject: I, he, she, it, we, you, they\\nObject: me, him, her, it, us, you, them\\nPossessive Adj: my, his, her, its, our, your, their (+ اسم)\\nPossessive Pron: mine, his, hers, ours, yours, theirs", ex:"Her car is fast. / The book is mine.", tip:"إذا جاء بعد الفراغ اسم اختر صفة الملكية (her book)، وإذا انتهت الجملة بدون اسم اختر ضمير الملكية (hers)."},
  {id:2, lv:1, title:"الأفعال المساعدة والشرطية (Modals)", rule:"can, could, may, might, will, would, shall, should, must + V1 (مجرد)", ex:"I can help you. (not can to help)", tip:"الأفعال الشرطية يتبعها دائماً فعل بالمصدر دون to (ما عدا ought to)."},
  {id:3, lv:1, title:"المضارع البسيط (Simple Present)", rule:"S + V1 (+s/es مع he/she/it)\\nالنفي: don't / doesn't + V1\\nالسؤال: Do / Does + S + V1?", ex:"He works every day. / Water consists of H2O.", tip:"كلمات دالة: always, usually, often, every day. للعادات والحقائق."},
  {id:4, lv:1, title:"الماضي البسيط (Simple Past)", rule:"S + V2\\nالنفي: didn't + V1\\nالسؤال: Did + S + V1?", ex:"I visited Syria last year. / Did you see him?", tip:"كلمات دالة: yesterday, ago, last week. بعد did يعود الفعل لأصله."},
  {id:5, lv:1, title:"أدوات النكرة (a / an)", rule:"an + اسم مفرد يبدأ بصوت علّة (a, e, i, o, u)\\na + اسم مفرد يبدأ بصوت ساكن", ex:"an hour (صوت متحرك لأن h صامتة), a university (صوت يو ساكن).", tip:"العبرة بالصوت المسموع وليس الحرف المكتوب."},
  {id:6, lv:1, title:"أداة التعريف (The)", rule:"تستخدم للشيء المحدد أو الوحيد من نوعه: the sun, the moon, the Nile, the United States.", ex:"The teacher who taught me was great.", tip:"لا تستخدم the مع أسماء الدول المفردة (Syria) أو أسماء الأشخاص."},
  {id:7, lv:1, title:"الأسماء غير المعدودة (Uncountable)", rule:"لا تجمع ولا تسبقها a/an وتأخذ فعلاً مفرداً: information, furniture, advice, news, traffic, bread, water, money.", ex:"The news is good. (not are)", tip:"من أشهر أفخاخ الامتحان: advice و news و information أسماء غير معدودة دائماً!"},
  {id:10, lv:2, title:"المضارع المستمر (Present Continuous)", rule:"am / is / are + V-ing\\nالنفي: is not / are not + V-ing", ex:"Look! It is raining. / They are studying now.", tip:"كلمات دالة: now, at the moment, Listen!, Look!"},
  {id:14, lv:2, title:"Some & Any", rule:"some: بالجمل المثبتة، وبالعروض والطلبات المهذبة (Would you like some tea?).\\nany: بالنفي والاستفهام العام.", ex:"I have some books. / Do you have any pens?", tip:"في العروض والطلبات المهذبة نستخدم some حتى لو كان صيغة سؤال!"},
  {id:18, lv:2, title:"مقارنة الصفات (Comparison)", rule:"صفة قصيرة: er + than (taller than)\\nصفة طويلة: more + صفة + than (more expensive than)\\nشواذ: good -> better -> best, bad -> worse -> worst.", ex:"Sami is better than his brother.", tip:"لا تضع more مع صفة فيها er (more better ✗)."},
  {id:20, lv:3, title:"المضارع التام (Present Perfect)", rule:"have / has + V3\\nالدوال: since (نقطة بداية), for (مدة), already, yet, ever, never.", ex:"I have lived here for 10 years / since 2014.", tip:"since تتبعها سنة أو يوم محدد، for تتبعها مدة زمنية مجمعة (five years)."},
  {id:34, lv:4, title:"المبني للمجهول (Passive Voice)", rule:"Object + be (بنفس الزمن) + V3\\nالمضارع: is/are + V3\\nالماضي: was/were + V3", ex:"The car was cleaned by Samar.", tip:"إذا كان التركيز على الفعل والمفعول به، المفعول به يبدأ الجملة."},
  {id:35, lv:4, title:"الجمل الشرطية (Conditionals)", rule:"Type 1: If + present, will + V1\\nType 2: If + past (were لكل الضمائر), would + V1\\nType 3: If + had + V3, would have + V3", ex:"If I were you, I would accept. / If I had known, I would have come.", tip:"في النوع الثاني نفضل were مع الجميع: If I were... If he were..."},
  {id:43, lv:5, title:"الكلام المنقول (Reported Speech)", rule:"نرجع خطوة للماضي: am/is->was, are->were, will->would, can->could, have->had.", ex:"'I will travel' -> He said that he would travel.", tip:"tell تحتاج مفعولاً مباشراً (He told me)، بينما say لا تأخذ مفعولاً مباشراً (He said that)."},
  {id:44, lv:5, title:"صيغة التمني (Wish)", rule:"تمني الحاضر: wish + Past (were) / could\\nندم الماضي: wish + had + V3", ex:"I wish I were taller. / I wish I had studied harder.", tip:"بعد wish نرجع دائماً بالزمن خطوة إلى الوراء."}
];

const EXAM_QS = [
  {q: "This car isn't mine, it's ___.", opts: ["her", "hers", "she", "her's"], a: 1, exp: "hers ضمير ملكية يقف منفرداً في نهاية الجملة دون اسم بعده."},
  {q: "Can you give me some ___?", opts: ["advices", "advice", "an advice", "advises"], a: 1, exp: "advice اسم غير معدود لا يُجمع ولا يأخذ an."},
  {q: "Listen! Someone ___ at the door.", opts: ["knocks", "knocked", "is knocking", "has knocked"], a: 2, exp: "Listen! تدل على حدث يقع الآن في المضارع المستمر."},
  {q: "I haven't seen him ___ 2020.", opts: ["for", "since", "from", "in"], a: 1, exp: "since مع نقطة البداية المحددة بالزمن."},
  {q: "If I ___ you, I would accept the offer.", opts: ["was", "were", "am", "be"], a: 1, exp: "في الحالة الشرطية الثانية نستخدم were مع كل الضمائر."},
  {q: "Would you like ___ coffee?", opts: ["any", "some", "a", "many"], a: 1, exp: "في العروض المهذبة نستخدم some بالرغم من صيغة السؤال."},
  {q: "The house ___ built in 1995.", opts: ["is", "was", "has", "were"], a: 1, exp: "مبني للمجهول في زمن الماضي البسيط (was + V3)."}
];

function showV(v) {
  document.querySelectorAll('.view').forEach(e => e.classList.remove('active'));
  document.getElementById('v-' + v).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach((b, i) => {
    b.classList.toggle('active', (v === 'home' && i === 0) || (v === 'lessons' && i === 1) || (v === 'exam' && i === 2) || (v === 'plan' && i === 3));
  });
}

function renderLessons(list) {
  const c = document.getElementById('lessonsContainer');
  c.innerHTML = list.map(l => \`
    <div class="chapter">
      <span class="lesson-badge">مستوى \${l.lv} · درس \${l.id}</span>
      <h3 style="color:var(--ink)">\${l.title}</h3>
      <div style="font-size:13px;color:var(--primary);font-weight:700;margin-bottom:4px">🔑 القاعدة:</div>
      <div class="rule-box">\${l.rule}</div>
      <div style="font-size:13px;color:var(--primary);font-weight:700;margin:8px 0 4px">✏️ أمثلة:</div>
      <div class="ex-item"><span class="en">\${l.ex}</span></div>
      <div class="callout gold"><b>💡 سر الاختبار:</b> \${l.tip}</div>
    </div>
  \`).join('');
}

function filterLevel(lv) {
  showV('lessons');
  const filtered = LESSONS_DATA.filter(l => l.lv === lv);
  renderLessons(filtered.length ? filtered : LESSONS_DATA);
}

function searchL(val) {
  const q = val.trim().toLowerCase();
  const f = LESSONS_DATA.filter(l => l.title.toLowerCase().includes(q) || l.rule.toLowerCase().includes(q) || l.tip.toLowerCase().includes(q));
  renderLessons(f);
}

function renderExam() {
  const c = document.getElementById('examContainer');
  c.innerHTML = EXAM_QS.map((q, qidx) => \`
    <div class="card" id="q-card-\${qidx}">
      <div style="font-size:15px;font-weight:700;margin-bottom:12px">\${qidx + 1}. \${q.q}</div>
      \${q.opts.map((opt, oidx) => \`
        <div class="exam-opt" onclick="checkAnswer(\${qidx}, \${oidx})">\${opt}</div>
      \`).join('')}
      <div id="q-exp-\${qidx}" style="display:none;margin-top:10px" class="callout gold"></div>
    </div>
  \`).join('');
}

window.checkAnswer = function(qidx, oidx) {
  const card = document.getElementById('q-card-' + qidx);
  const q = EXAM_QS[qidx];
  const opts = card.querySelectorAll('.exam-opt');
  opts.forEach((o, i) => {
    o.onclick = null;
    if (i === q.a) o.classList.add('correct');
    else if (i === oidx) o.classList.add('wrong');
  });
  const exp = document.getElementById('q-exp-' + qidx);
  exp.style.display = 'block';
  exp.innerHTML = (oidx === q.a ? '✅ إجابة ممتازة! ' : '❌ إجابة غير صحيحة. ') + q.exp;
};

// Init
renderLessons(LESSONS_DATA);
renderExam();
</script>
</body>
</html>`;
