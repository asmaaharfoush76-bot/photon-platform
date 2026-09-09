/* =========================================================
   PHOTON | FUTON
   Frontend JavaScript with Supabase Integration & Admin Panel
========================================================= */

/* ================= SUPABASE INIT ================= */
const SUPABASE_URL = 'https://ahijhhefbjslieeckjkc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JJUMW1OLWg1zY7H_bWw8cQ_McBx0TUf'; 

let supabaseClient = null;

// تهيئة Supabase مع وضع الحماية لتجنب تعطل الصفحة
try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn("تعذر الربط التلقائي بـ Supabase:", e);
}


/* ================= STORAGE ================= */

const STORAGE = {
  points: "photon_points",
  lessons: "photon_lessons",
  exams: "photon_exams",
  student: "photon_student"
};


let points = Number(localStorage.getItem(STORAGE.points)) || 0;
let lessonsCompleted = Number(localStorage.getItem(STORAGE.lessons)) || 0;
let examsCompleted = Number(localStorage.getItem(STORAGE.exams)) || 0;
let studentName = localStorage.getItem(STORAGE.student) || "";


/* ================= SUBJECT DATA ================= */

const subjects = {

  physics: {
    title: "الفيزياء",
    label: "العلوم الفيزيائية",
    icon: "Φ",

    lessons: [
      "الحركة والقوانين الأساسية",
      "القوة والتأثيرات الميكانيكية",
      "الطاقة والتحولات",
      "الكهرباء والمجالات",
      "الموجات والاهتزازات",
      "مراجعة شاملة"
    ],

    resources: [
      "ملخص أساسيات الفيزياء",
      "ورقة القوانين المهمة",
      "تدريبات تطبيقية",
      "مراجعة سريعة قبل الاختبار"
    ]
  },


  history: {
    title: "التاريخ الوطني",
    label: "المجال الإنساني",
    icon: "⌘",

    lessons: [
      "مدخل إلى التاريخ الوطني",
      "المراحل التاريخية الأساسية",
      "أهم الأحداث والتحولات",
      "الشخصيات التاريخية",
      "قراءة وتحليل الوثائق",
      "مراجعة شاملة"
    ],

    resources: [
      "ملخص التاريخ الوطني",
      "خط زمني للأحداث",
      "بطاقات الشخصيات",
      "تدريبات تحليل الوثائق"
    ]
  },


  english: {
    title: "اللغة الإنجليزية",
    label: "Language",
    icon: "Aa",

    lessons: [
      "Building Strong Vocabulary",
      "Essential Grammar",
      "Reading Skills",
      "Writing Skills",
      "Communication",
      "Revision"
    ],

    resources: [
      "Vocabulary List",
      "Grammar Guide",
      "Writing Templates",
      "Reading Practice"
    ]
  },


  arabic: {
    title: "اللغة العربية",
    label: "اللغة والأدب",
    icon: "ع",

    lessons: [
      "أساسيات النحو",
      "الجملة وأنواعها",
      "البلاغة والصور البيانية",
      "الأدب والنصوص",
      "فهم وتحليل النص",
      "مراجعة شاملة"
    ],

    resources: [
      "ملخص النحو",
      "دليل البلاغة",
      "تدريبات النصوص",
      "مراجعة شاملة"
    ]
  }

};


/* ================= EXAM QUESTIONS ================= */

const examQuestions = {

  physics: [
    {
      q: "أي مما يلي يمثل كمية فيزيائية متجهة؟",
      options: ["الزمن", "الكتلة", "الإزاحة", "درجة الحرارة"],
      answer: 2
    },
    {
      q: "ما الوحدة الأساسية لقياس الزمن في النظام الدولي؟",
      options: ["المتر", "الثانية", "الكيلوجرام", "الأمبير"],
      answer: 1
    },
    {
      q: "إذا زادت سرعة جسم خلال فترة زمنية، فهذا يعني وجود:",
      options: ["تسارع", "كتلة", "طاقة حرارية فقط", "حجم"],
      answer: 0
    }
  ],


  history: [
    {
      q: "ما المقصود بالوثيقة التاريخية؟",
      options: [
        "مصدر يساعد على دراسة الماضي",
        "قانون فيزيائي",
        "تجربة علمية",
        "معادلة رياضية"
      ],
      answer: 0
    },
    {
      q: "ما أهمية دراسة التاريخ؟",
      options: [
        "فهم الماضي واستخلاص الدروس",
        "حفظ الأرقام فقط",
        "تجنب دراسة الحاضر",
        "إلغاء الاختلاف"
      ],
      answer: 0
    },
    {
      q: "الخط الزمني يساعد على:",
      options: [
        "ترتيب الأحداث",
        "حل المعادلات",
        "تعلم الكلمات",
        "قياس المسافات"
      ],
      answer: 0
    }
  ],


  english: [
    {
      q: "Choose the correct sentence:",
      options: [
        "She go to school.",
        "She goes to school.",
        "She going school.",
        "She gone school."
      ],
      answer: 1
    },
    {
      q: "What is the opposite of 'easy'?",
      options: ["simple", "hard", "small", "early"],
      answer: 1
    },
    {
      q: "Choose the correct past form of 'go':",
      options: ["goed", "goes", "went", "going"],
      answer: 2
    }
  ],


  arabic: [
    {
      q: "ما نوع كلمة «كتاب»؟",
      options: ["فعل", "اسم", "حرف", "جملة"],
      answer: 1
    },
    {
      q: "الجملة التي تبدأ باسم تسمى:",
      options: ["جملة فعلية", "جملة اسمية", "شبه جملة", "مفرد"],
      answer: 1
    },
    {
      q: "الفعل الماضي يدل غالبًا على:",
      options: [
        "حدث وقع في الماضي",
        "حدث يقع الآن",
        "طلب",
        "نفي"
      ],
      answer: 0
    }
  ]

};


/* ================= PAGE NAVIGATION ================= */

function showPage(pageId) {

  const pages = document.querySelectorAll(".page");

  pages.forEach(page => {
    page.classList.remove("active-page");
  });


  const target = document.getElementById(pageId);

  if (target) {
    target.classList.add("active-page");
  }


  document.querySelectorAll(".nav-links a").forEach(link => {
    link.classList.remove("active");

    if (link.dataset.page === pageId) {
      link.classList.add("active");
    }
  });


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  const menu = document.querySelector(".nav-links");

  if (menu) {
    menu.classList.remove("open");
  }
}


/* ================= NAV LINKS ================= */

document.querySelectorAll(".nav-links a").forEach(link => {

  link.addEventListener("click", function(event) {

    event.preventDefault();

    const page = this.dataset.page;

    if (page) {
      showPage(page);
    }

  });

});


/* ================= MOBILE MENU ================= */

const menuBtn = document.getElementById("menuBtn");

if (menuBtn) {

  menuBtn.addEventListener("click", () => {

    const nav = document.querySelector(".nav-links");

    nav.classList.toggle("open");

  });

}


/* ================= LOGIN & AUTHENTICATION ================= */

function openLogin() {
  const modal = document.getElementById("loginModal");
  if (!modal) return;
  modal.classList.add("show");
}

async function handleSignUp() {
  const nameInput = document.getElementById("studentNameInput");
  const emailInput = document.getElementById("studentEmailInput");
  const passwordInput = document.getElementById("studentPasswordInput");

  const name = nameInput ? nameInput.value.trim() : "";
  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  if (!name || !email || !password) {
    showToast("يرجى ملء جميع الحقول لتسجيل حساب جديد ⚠️");
    return;
  }

  showToast("جاري إنشاء حسابك...");

  if (!supabaseClient) {
    studentName = name;
    localStorage.setItem(STORAGE.student, studentName);
    updateDashboard();
    closeModal("loginModal");
    showToast("أهلًا بك في فوتون يا " + studentName + " ✨");
    showPage("dashboard");
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) {
      showToast("خطأ: " + error.message);
      return;
    }

    if (data?.user) {
      await supabaseClient.from('students').insert([
        { id: data.user.id, email: email, name: name, points: 0 }
      ]);
    }

    studentName = name;
    localStorage.setItem(STORAGE.student, studentName);

    updateDashboard();
    closeModal("loginModal");
    showToast("أهلًا بك في فوتون يا " + studentName + " ✨");
    showPage("dashboard");

  } catch (err) {
    studentName = name;
    localStorage.setItem(STORAGE.student, studentName);
    updateDashboard();
    closeModal("loginModal");
    showToast("تم الدخول بنجاح ✨");
    showPage("dashboard");
  }
}

async function handleLogin() {
  const emailInput = document.getElementById("studentEmailInput");
  const passwordInput = document.getElementById("studentPasswordInput");

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  if (!email || !password) {
    showToast("أدخل البريد الإلكتروني وكلمة السر لتسجيل الدخول ⚠️");
    return;
  }

  showToast("جاري تسجيل الدخول...");

  if (!supabaseClient) {
    studentName = email.split('@')[0];
    localStorage.setItem(STORAGE.student, studentName);
    updateDashboard();
    closeModal("loginModal");
    showToast("تم تسجيل الدخول بنجاح 🎉");
    showPage("dashboard");
    return;
  }

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      showToast("خطأ في تسجيل الدخول: " + error.message);
      return;
    }

    if (data?.user) {
      const { data: studentData } = await supabaseClient
        .from('students')
        .select('name, points')
        .eq('id', data.user.id)
        .single();

      if (studentData) {
        studentName = studentData.name;
        points = studentData.points || 0;
        localStorage.setItem(STORAGE.points, points);
      } else {
        studentName = data.user.user_metadata?.full_name || email.split('@')[0];
      }

      localStorage.setItem(STORAGE.student, studentName);
      updateDashboard();
      closeModal("loginModal");
      showToast("تم تسجيل الدخول بنجاح 🎉");
      showPage("dashboard");
    }

  } catch (err) {
    studentName = email.split('@')[0];
    localStorage.setItem(STORAGE.student, studentName);
    updateDashboard();
    closeModal("loginModal");
    showToast("تم تسجيل الدخول 🎉");
    showPage("dashboard");
  }
}


/* ================= DASHBOARD ================= */

function updateDashboard() {

  const pointsElement =
    document.getElementById("pointsValue");

  const lessonsElement =
    document.getElementById("lessonsValue");

  const examsElement =
    document.getElementById("examsValue");

  const badgesElement =
    document.getElementById("badgesValue");

  const progressElement =
    document.getElementById("dashboardProgress");

  const bigProgressBar =
    document.getElementById("bigProgressBar");

  const homeProgress =
    document.getElementById("homeProgress");

  const studentDisplay =
    document.getElementById("studentNameDisplay");

  const profileName =
    document.getElementById("profileName");


  if (pointsElement) {
    pointsElement.textContent = points;
  }


  if (lessonsElement) {
    lessonsElement.textContent = lessonsCompleted;
  }


  if (examsElement) {
    examsElement.textContent = examsCompleted;
  }


  let badges = 1;

  if (lessonsCompleted >= 5) {
    badges++;
  }

  if (examsCompleted >= 1) {
    badges++;
  }

  if (points >= 500) {
    badges++;
  }


  if (badgesElement) {
    badgesElement.textContent = badges;
  }


  const progress = Math.min(
    100,
    Math.round(
      (lessonsCompleted / 12) * 100
    )
  );


  if (progressElement) {
    progressElement.textContent = progress + "%";
  }


  if (bigProgressBar) {
    bigProgressBar.style.width = progress + "%";
  }


  if (homeProgress) {
    homeProgress.textContent = progress + "%";
  }


  if (studentDisplay) {

    studentDisplay.textContent =
      studentName || "يا بطل";
  }


  if (profileName) {

    profileName.textContent =
      studentName || "طالب فوتون";
  }


  const badgeLesson =
    document.getElementById("badgeLesson");

  if (badgeLesson) {

    if (lessonsCompleted >= 5) {
      badgeLesson.classList.add("unlocked");
    } else {
      badgeLesson.classList.remove("unlocked");
    }

  }


  updateHomeCircle(progress);
}


function updateHomeCircle(progress) {

  const circle =
    document.querySelector(".progress-circle");

  if (!circle) return;

  circle.style.background =
    `radial-gradient(circle, #0d1b2d 62%, transparent 63%),
     conic-gradient(#22d3ee ${progress}%,
     rgba(255,255,255,.08) ${progress}%)`;
}


/* ================= LESSONS ================= */

function completeLesson(button, lessonName) {

  if (!button) return;

  if (button.dataset.completed === "true") {

    showToast("الدرس ده مكتمل بالفعل ✓");

    return;
  }


  button.dataset.completed = "true";

  button.textContent = "مكتمل ✓";

  button.style.background = "#ecfdf3";
  button.style.color = "#079455";


  lessonsCompleted++;

  points += 25;


  localStorage.setItem(
    STORAGE.lessons,
    lessonsCompleted
  );

  localStorage.setItem(
    STORAGE.points,
    points
  );


  updateDashboard();

  showToast(
    "أحسنت! أكملت: " + lessonName + " +25 نقطة 🎉"
  );
}


/* ================= SUBJECT MODAL ================= */

let currentSubject = "physics";


function openSubject(subjectKey) {

  const subject = subjects[subjectKey];

  if (!subject) return;


  currentSubject = subjectKey;


  document.getElementById("modalSubjectIcon").textContent =
    subject.icon;

  document.getElementById("modalSubjectLabel").textContent =
    subject.label;

  document.getElementById("modalSubjectTitle").textContent =
    subject.title;


  document.querySelectorAll(".modal-tab").forEach(tab => {
    tab.classList.remove("active");
  });


  const firstTab =
    document.querySelector(".modal-tab[data-tab='lessons']");

  if (firstTab) {
    firstTab.classList.add("active");
  }


  renderSubjectTab("lessons");


  document.getElementById("subjectModal")
    .classList.add("show");
}


function renderSubjectTab(tab) {

  const subject = subjects[currentSubject];

  const container =
    document.getElementById("subjectModalContent");

  if (!container || !subject) return;


  if (tab === "lessons") {

    container.innerHTML = `
      <div class="modal-list">

        ${subject.lessons.map((lesson, index) => `
          <div class="modal-list-item">

            <div>
              <h4>${index + 1}. ${lesson}</h4>
              <p>درس تعليمي • ${20 + index * 5} دقيقة</p>
            </div>

            <button onclick="modalLessonComplete('${lesson.replace(/'/g, "\\'")}')">
              ابدأ
            </button>

          </div>
        `).join("")}

      </div>
    `;

  }


  if (tab === "resources") {

    container.innerHTML = `
      <div class="modal-list">

        ${subject.resources.map(resource => `
          <div class="modal-list-item">

            <div>
              <h4>${resource}</h4>
              <p>مصدر تعليمي</p>
            </div>

            <button onclick="openResource('${resource.replace(/'/g, "\\'")}')">
              فتح
            </button>

          </div>
        `).join("")}

      </div>
    `;

  }


  if (tab === "practice") {

    container.innerHTML = `
      <div class="modal-list">

        <div class="modal-list-item">

          <div>
            <h4>اختبار قصير</h4>
            <p>أسئلة سريعة لقياس فهمك</p>
          </div>

          <button onclick="startExam('${currentSubject}')">
            ابدأ
          </button>

        </div>


        <div class="modal-list-item">

          <div>
            <h4>تدريب إضافي</h4>
            <p>تدرب على المفاهيم الأساسية</p>
          </div>

          <button onclick="showToast('سيتم إضافة التدريب قريبًا ✨')">
            قريبًا
          </button>

        </div>

      </div>
    `;

  }
}


document.querySelectorAll(".modal-tab").forEach(tab => {

  tab.addEventListener("click", function() {

    document.querySelectorAll(".modal-tab").forEach(item => {
      item.classList.remove("active");
    });

    this.classList.add("active");

    renderSubjectTab(
      this.dataset.tab
    );

  });

});


function modalLessonComplete(name) {

  points += 10;

  localStorage.setItem(
    STORAGE.points,
    points
  );

  updateDashboard();

  showToast(
    "بدأت درس " + name + " +10 نقاط ⚡"
  );
}


/* ================= LIBRARY ================= */

const filters =
  document.querySelectorAll(".filter");

filters.forEach(filter => {

  filter.addEventListener("click", function() {

    filters.forEach(item => {
      item.classList.remove("active");
    });

    this.classList.add("active");

    filterBooks(
      this.dataset.filter
    );

  });

});


function filterBooks(subject) {

  const books =
    document.querySelectorAll(".book-card");

  books.forEach(book => {

    if (
      subject === "all" ||
      book.dataset.subject === subject
    ) {

      book.style.display = "";

    } else {

      book.style.display = "none";

    }

  });

}


/* ================= BOOK SEARCH ================= */

const bookSearch =
  document.getElementById("bookSearch");


if (bookSearch) {

  bookSearch.addEventListener("input", function() {

    const query =
      this.value.trim().toLowerCase();

    document.querySelectorAll(".book-card")
      .forEach(book => {

        const title =
          (book.dataset.title || "")
          .toLowerCase();

        if (title.includes(query)) {
          book.style.display = "";
        } else {
          book.style.display = "none";
        }

      });

  });

}


/* ================= RESOURCE ================= */

function openResource(title) {

  const resourceTitle =
    document.getElementById("resourceTitle");

  if (resourceTitle) {
    resourceTitle.textContent = title;
  }

  document.getElementById("resourceModal")
    .classList.add("show");
}


/* ================= EXAMS ================= */

let currentExam = null;
let currentQuestion = 0;
let examScore = 0;


function startExam(subject) {

  if (!examQuestions[subject]) {

    showToast("الاختبار غير متاح حاليًا");

    return;
  }


  currentExam = subject;

  currentQuestion = 0;

  examScore = 0;


  document.getElementById("examModal")
    .classList.add("show");


  renderQuestion();
}


function renderQuestion() {

  const questions =
    examQuestions[currentExam];


  if (!questions) return;


  if (currentQuestion >= questions.length) {

    finishExam();

    return;
  }


  const question =
    questions[currentQuestion];


  const percent =
    Math.round(
      ((currentQuestion + 1) / questions.length) * 100
    );


  const subject =
    subjects[currentExam];


  const html = `

    <div class="exam-head">

      <span>${subject.label}</span>

      <h2>${subject.title}</h2>

    </div>


    <div class="exam-progress">
      <span style="width:${percent}%"></span>
    </div>


    <div class="question-number">
      السؤال ${currentQuestion + 1} من ${questions.length}
    </div>


    <h3 class="question-text">
      ${question.q}
    </h3>


    <div class="options">

      ${question.options.map((option, index) => `

        <button
          class="option"
          onclick="selectAnswer(${index})"
        >
          ${option}
        </button>

      `).join("")}

    </div>

  `;


  document.getElementById("examContent")
    .innerHTML = html;
}


function selectAnswer(index) {

  const question =
    examQuestions[currentExam][currentQuestion];


  if (index === question.answer) {
    examScore++;
  }


  currentQuestion++;

  renderQuestion();
}


function finishExam() {

  examsCompleted++;

  const earnedPoints =
    examScore * 30;


  points += earnedPoints;


  localStorage.setItem(
    STORAGE.exams,
    examsCompleted
  );

  localStorage.setItem(
    STORAGE.points,
    points
  );


  updateDashboard();


  const total =
    examQuestions[currentExam].length;


  const percentage =
    Math.round(
      (examScore / total) * 100
    );


  document.getElementById("examContent")
    .innerHTML = `

      <div class="result-box">

        <div class="section-label">
          انتهى الاختبار
        </div>

        <h2>أحسنت! 🎉</h2>

        <div class="result-score">
          ${percentage}%
        </div>

        <p>
          حصلت على ${examScore} من ${total}
          إجابات صحيحة.
        </p>

        <p style="margin-top:8px;color:#667085;font-size:12px;">
          +${earnedPoints} نقطة
        </p>

        <button
          class="primary-btn"
          style="margin-top:20px;width:100%;"
          onclick="closeModal('examModal')"
        >
          العودة للمنصة
        </button>

      </div>

    `;


  showToast(
    "تم تسجيل نتيجتك وإضافة النقاط 🏆"
  );
}


/* ================= MODAL CONTROL ================= */

function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (modal) {
    modal.classList.remove("show");
  }
}


/* ================= OUTSIDE CLICK ================= */

document.querySelectorAll(".modal").forEach(modal => {

  modal.addEventListener("click", function(event) {

    if (event.target === this) {
      this.classList.remove("show");
    }

  });

});


/* ================= ESCAPE ================= */

document.addEventListener("keydown", function(event) {

  if (event.key === "Escape") {

    document.querySelectorAll(".modal")
      .forEach(modal => {
        modal.classList.remove("show");
      });

  }

});


/* ================= TOAST ================= */

let toastTimer;


function showToast(message) {

  const toast =
    document.getElementById("toast");

  const toastMessage =
    document.getElementById("toastMessage");


  if (!toast || !toastMessage) return;


  toastMessage.textContent = message;

  toast.classList.add("show");


  clearTimeout(toastTimer);


  toastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 3000);
}


/* ================= ADMIN ACTIONS ================= */

async function addNewLesson() {
  const subjectKey = document.getElementById("adminSubjectSelect").value;
  const title = document.getElementById("adminLessonTitle").value.trim();
  const duration = document.getElementById("adminLessonDuration").value.trim();

  if (!title) {
    showToast("يرجى كتابة عنوان الدرس ⚠️");
    return;
  }

  // إضافة الدرس للمصفوفة المحتفظة بالبيانات في الشاشة
  if (subjects[subjectKey]) {
    subjects[subjectKey].lessons.push(title);
  }

  // حفظ الدرس في قاعدة البيانات Supabase
  if (supabaseClient) {
    try {
      await supabaseClient.from('lessons').insert([
        { subject: subjectKey, title: title, duration: duration }
      ]);
    } catch (e) {
      console.log("تم الحفظ محليًا فقط");
    }
  }

  // تنظيف الخانات وإظهار إشعار
  document.getElementById("adminLessonTitle").value = "";
  document.getElementById("adminLessonDuration").value = "";
  
  showToast("تمت إضافة الدرس بنجاح! 🎉");
}


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

  updateDashboard();

  showPage("home");

});
