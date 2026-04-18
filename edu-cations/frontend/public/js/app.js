// ─── CONFIG ────────────────────────────────────────────────────────────────
const API = "/api";

// ─── STATE ─────────────────────────────────────────────────────────────────
let state = {
  user: null,
  token: null,
  currentClass: null,
  currentSubject: null,
  currentChapter: null,
  classes: [],
  chapters: [],
  videos: [],
  progress: [],
  adminVideos: [],
  adminChapters: [],
};

// ─── INIT ───────────────────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem('edu_token');
  const savedUser = localStorage.getItem('edu_user');

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
  
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  if (saved && savedUser) {
    state.token = saved;
    state.user = JSON.parse(savedUser);
    updateAuthUI();
    if (state.user.role !== "admin") fetchProgress();
  }

  navigate("courses");
});

// ─── NAVIGATION ────────────────────────────────────────────────────────────
function navigate(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  const el = document.getElementById("page-" + page);
  if (el) el.classList.add("active");
  updateBreadcrumb(page);
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "courses") loadClasses();
  if (page === "admin") loadAdminStats();
}

function updateBreadcrumb(page) {
  const bc = document.getElementById("breadcrumb");
  let html = "";
  if (page === "home") {
    bc.innerHTML = "";
    return;
  }
  if (page === "courses") {
    html = "<span>Courses</span>";
  }
  if (page === "chapters" && state.currentClass) {
    html = `<span onclick="navigate('courses')">Courses</span><span class="sep">›</span><span class="current">Class ${state.currentClass.number}</span>`;
  }
  if (page === "videos" && state.currentChapter) {
    html = `<span onclick="navigate('courses')">Courses</span><span class="sep">›</span><span onclick="loadChaptersPage(state.currentClass)">Class ${state.currentClass.number}</span><span class="sep">›</span><span class="current">${state.currentChapter.name}</span>`;
  }
  if (page === "admin") html = "<span>Admin Panel</span>";
  bc.innerHTML = html;
}

function scrollToFeatures() {
  document.getElementById("features").scrollIntoView({ behavior: "smooth" });
}

// ─── API HELPERS ────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json" };
  if (state.token) headers["Authorization"] = `Bearer ${state.token}`;
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json();
  return { ok: res.ok, data };
}

// ─── CLASSES ────────────────────────────────────────────────────────────────
async function loadClasses() {
  const grid = document.getElementById("classesGrid");
  grid.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><p>Loading classes...</p></div>`;
  const { ok, data } = await apiFetch("/classes");
  if (!ok) {
    grid.innerHTML = `<p style="color:var(--accent2);padding:2rem">Failed to load classes.</p>`;
    return;
  }
  state.classes = data.data;
  const colors = { 9: "#6c63ff", 10: "#ff6584", 11: "#43e97b", 12: "#ffd700" };
  grid.innerHTML = state.classes
    .map(
      (cls) => `
    <div class="class-card" style="--c:${cls.color}" onclick="loadChaptersPage(${JSON.stringify(cls).replace(/"/g, "&quot;")})">
      <div class="class-num">${cls.number}</div>
      <div class="class-label">Class</div>
      <h3>${cls.tagline}</h3>
      <p>${cls.description}</p>
      <span class="class-tag" style="background:${cls.color}22;color:${cls.color}">${cls.tag}</span>
    </div>
  `,
    )
    .join("");
}

// ─── CHAPTERS ───────────────────────────────────────────────────────────────
async function loadChaptersPage(cls) {
  if (typeof cls === "string") cls = JSON.parse(cls);
  state.currentClass = cls;
  document.getElementById("chaptersTitle").textContent =
    `Class ${cls.number} — Chapters`;
  document.getElementById("chaptersSubtitle").textContent =
    `Subject choose karo aur chapter pe click karo.`;
  navigate("chapters");

  // Load subjects
  const { ok, data } = await apiFetch(`/chapters/subjects/${cls.number}`);
  if (!ok) return;
  const subjects = data.data;
  const tabs = document.getElementById("subjectTabs");
  tabs.innerHTML = subjects
    .map(
      (s, i) =>
        `<button class="subject-tab${i === 0 ? " active" : ""}" onclick="loadChapters('${s}',this)">${s}</button>`,
    )
    .join("");
  if (subjects.length)
    loadChapters(subjects[0], tabs.querySelector(".subject-tab"));
}

async function loadChapters(subject, tabEl) {
  state.currentSubject = subject;
  document
    .querySelectorAll(".subject-tab")
    .forEach((t) => t.classList.remove("active"));
  if (tabEl) tabEl.classList.add("active");

  const grid = document.getElementById("chaptersGrid");
  grid.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><p>Loading chapters...</p></div>`;

  const { ok, data } = await apiFetch(
    `/chapters?classNumber=${state.currentClass.number}&subject=${encodeURIComponent(subject)}`,
  );
  if (!ok) {
    grid.innerHTML = `<p style="color:var(--accent2);padding:2rem">Failed to load chapters.</p>`;
    return;
  }

  const chapters = data.data;
  const completedIds = state.progress
    .filter((p) => p.completed)
    .map((p) => p.chapterId?._id || p.chapterId);

  grid.innerHTML =
    chapters
      .map((ch, i) => {
        const done = completedIds.includes(ch._id);
        return `
      <div class="chapter-card" onclick="loadVideosPage('${ch._id}')">
        <div class="ch-num">Ch ${i + 1}</div>
        <div class="ch-info">
          <h4>${ch.name}</h4>
          <p>${ch.nextSteps?.length || 0} next steps</p>
        </div>
        ${done ? '<div class="ch-done">✅</div>' : '<div class="ch-arrow">›</div>'}
      </div>`;
      })
      .join("") ||
    `<p style="color:var(--text2);padding:2rem">No chapters found for this subject yet.</p>`;
}

// ─── VIDEOS ─────────────────────────────────────────────────────────────────
async function loadVideosPage(chapterId) {
  const { ok: cOk, data: cData } = await apiFetch(`/chapters/${chapterId}`);
  if (!cOk) return;
  state.currentChapter = cData.data;

  const { ok: vOk, data: vData } = await apiFetch(
    `/videos?chapterId=${chapterId}`,
  );
  if (!vOk) return;
  state.videos = vData.data;

  document.getElementById("videosTitle").textContent =
    state.currentChapter.name;
  document.getElementById("videosSubtitle").textContent =
    `${state.videos.length} video${state.videos.length !== 1 ? "s" : ""} curated for this chapter — watch in order for best results.`;

  const watchedIds =
    (
      state.progress.find(
        (p) => (p.chapterId?._id || p.chapterId) === chapterId,
      ) || {}
    ).videoIds || [];

  const grid = document.getElementById("videosGrid");
  grid.innerHTML = state.videos
    .map((v, i) => {
      const watched = watchedIds.includes(v._id);
      return `
      <div class="video-card" onclick="openVideoModal('${v._id}')">
        <div class="video-thumb">
          <img src="${v.thumb}" alt="${v.title}" loading="lazy" onerror="this.style.opacity='0'"/>
          <div class="play-overlay">
            <div class="play-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
          </div>
          <div class="vid-order">#${i + 1}</div>
          ${watched ? '<div class="vid-watched">✓ Watched</div>' : ""}
        </div>
        <div class="video-body">
          <div class="video-title">${v.title}</div>
          <div class="video-creator">
            <div class="creator-dot">${v.creator[0]}</div>
            <span>${v.creator}</span><span style="color:var(--text3)">${v.handle || ""}</span>
          </div>
          <div class="video-tags">${(v.tags || []).map((t) => `<span class="vtag">${t}</span>`).join("")}</div>
        </div>
        <a class="watch-btn" href="${v.url}" target="_blank" rel="noopener" onclick="markVideoWatched('${v._id}','${chapterId}');event.stopPropagation()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.8 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
          Watch on YouTube
        </a>
      </div>`;
    })
    .join("");

  // Next Steps
  const ns = document.getElementById("nextSteps");
  const nl = document.getElementById("nextList");
  const btn = document.getElementById("markCompleteBtn");
  if (state.currentChapter.nextSteps?.length) {
    ns.style.display = "block";
    nl.innerHTML = state.currentChapter.nextSteps
      .map((s) => `<li>${s}</li>`)
      .join("");
    const alreadyDone = state.progress.some(
      (p) => (p.chapterId?._id || p.chapterId) === chapterId && p.completed,
    );
    if (alreadyDone) {
      btn.textContent = "✅ Chapter Completed!";
      btn.disabled = true;
    } else {
      btn.textContent = "Mark Chapter as Complete ✓";
      btn.disabled = !state.user;
      if (!state.user) btn.title = "Login to track progress";
    }
    btn.dataset.chapterid = chapterId;
  } else {
    ns.style.display = "none";
  }

  navigate("videos");
}

// ─── VIDEO MODAL ─────────────────────────────────────────────────────────────
function openVideoModal(videoId) {
  const v = state.videos.find((x) => x._id === videoId);
  if (!v) return;
  document.getElementById("vModalThumb").src = v.thumb;
  document.getElementById("vModalTitle").textContent = v.title;
  document.getElementById("vModalMeta").textContent =
    `By ${v.creator} ${v.handle || ""} · ${(v.tags || []).join(", ")}`;
  document.getElementById("vModalLink").href = v.url;
  document.getElementById("vModalCredit").innerHTML =
    `<strong>🎖️ Credit:</strong> This video is created by <strong>${v.creator}</strong> (${v.handle || "YouTube"}). EDU-Cations only curates — please visit their channel, like, and subscribe to support them!`;
  openModal("videoModal");
}

function closeVideoModalOutside(e) {
  if (e.target === document.getElementById("videoModal"))
    closeModal("videoModal");
}

// ─── PROGRESS ───────────────────────────────────────────────────────────────
async function fetchProgress() {
  if (!state.user) return;
  const { ok, data } = await apiFetch("/progress");
  if (ok) state.progress = data.data;
}

async function markVideoWatched(videoId, chapterId) {
  if (!state.user) return;
  await apiFetch("/progress/video", {
    method: "POST",
    body: JSON.stringify({ chapterId, videoId }),
  });
  fetchProgress();
}

async function markChapterComplete() {
  if (!state.user) {
    openModal("loginModal");
    return;
  }
  const chapterId =
    document.getElementById("markCompleteBtn").dataset.chapterid;
  const { ok } = await apiFetch("/progress/complete", {
    method: "POST",
    body: JSON.stringify({ chapterId }),
  });
  if (ok) {
    showToast("Chapter marked complete! 🎉", "success");
    await fetchProgress();
    const btn = document.getElementById("markCompleteBtn");
    btn.textContent = "✅ Chapter Completed!";
    btn.disabled = true;
    loadChapters(state.currentSubject, null);
  }
}

// ─── AUTH ───────────────────────────────────────────────────────────────────
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const errEl = document.getElementById("loginError");
  errEl.style.display = "none";
  if (!email || !password) {
    showAuthError("loginError", "Please fill all fields");
    return;
  }
  const { ok, data } = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!ok) {
    showAuthError("loginError", data.message);
    return;
  }
  state.token = data.token;
  state.user = data.user;
  localStorage.setItem("edu_token", data.token);
  localStorage.setItem("edu_user", JSON.stringify(data.user));
  closeModal("loginModal");
  updateAuthUI();
  fetchProgress();
  showToast(`Welcome back, ${data.user.name}! 👋`, "success");
  if (data.user.role === "admin") {
    document.getElementById("adminNavBtn").style.display = "inline-block";
  }
}

async function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const cls = document.getElementById("regClass").value;
  if (!name || !email || !password) {
    showAuthError("registerError", "Please fill all required fields");
    return;
  }
  if (password.length < 6) {
    showAuthError("registerError", "Password must be at least 6 characters");
    return;
  }
  const { ok, data } = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, class: cls || null }),
  });
  if (!ok) {
    showAuthError("registerError", data.message);
    return;
  }
  state.token = data.token;
  state.user = data.user;
  localStorage.setItem("edu_token", data.token);
  localStorage.setItem("edu_user", JSON.stringify(data.user));
  closeModal("registerModal");
  updateAuthUI();
  showToast(`Account created! Welcome, ${data.user.name}! 🎉`, "success");
}

function logout() {
  state.token = null;
  state.user = null;
  state.progress = [];
  localStorage.removeItem("edu_token");
  localStorage.removeItem("edu_user");
  updateAuthUI();
  showToast("Logged out successfully.", "success");
  navigate("home");
}

function updateAuthUI() {
  const authBtns = document.getElementById("authButtons");
  const userMenu = document.getElementById("userMenu");
  const adminBtn = document.getElementById("adminNavBtn");
  if (state.user) {
    authBtns.style.display = "none";
    userMenu.style.display = "flex";
    userMenu.style.alignItems = "center";
    userMenu.style.gap = "0.5rem";
    document.getElementById("navUserName").textContent = state.user.name;
    adminBtn.style.display =
      state.user.role === "admin" ? "inline-block" : "none";
  } else {
    authBtns.style.display = "flex";
    userMenu.style.display = "none";
    adminBtn.style.display = "none";
  }
}

function showAuthError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = "block";
}

// ─── MODALS ─────────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}
function switchModal(from, to) {
  closeModal(from);
  openModal(to);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape")
    document
      .querySelectorAll(".modal-overlay.open")
      .forEach((m) => m.classList.remove("open"));
});

// ─── TOAST ───────────────────────────────────────────────────────────────────
function showToast(msg, type = "") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show " + type;
  setTimeout(() => (t.className = "toast"), 3200);
}

// ─── AUTO THUMBNAIL FROM YOUTUBE URL ─────────────────────────────────────────
function autoThumb(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  if (match)
    document.getElementById("avThumb").value =
      `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
}

// ─── ADMIN ───────────────────────────────────────────────────────────────────
async function loadAdminStats() {
  if (!state.user || state.user.role !== "admin") {
    navigate("home");
    return;
  }
  const { ok, data } = await apiFetch("/admin/stats");
  if (!ok) return;
  const s = data.data;
  document.getElementById("adminStats").innerHTML = `
    <div class="admin-stat-card"><div class="big">${s.classes}</div><div class="lbl">Classes</div></div>
    <div class="admin-stat-card"><div class="big">${s.chapters}</div><div class="lbl">Chapters</div></div>
    <div class="admin-stat-card"><div class="big">${s.videos}</div><div class="lbl">Videos</div></div>
    <div class="admin-stat-card"><div class="big">${s.students}</div><div class="lbl">Students</div></div>
  `;
  showAdminTab("videos");
}

let activeAdminTab = "videos";
function showAdminTab(tab) {
  activeAdminTab = tab;
  document.querySelectorAll(".admin-tab").forEach((t, i) => {
    const tabs = ["videos", "chapters", "users"];
    t.classList.toggle("active", tabs[i] === tab);
  });
  if (tab === "videos") loadAdminVideos();
  if (tab === "chapters") loadAdminChapters();
  if (tab === "users") loadAdminUsers();
}

async function loadAdminVideos() {
  const c = document.getElementById("adminContent");
  c.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
  const { ok, data } = await apiFetch("/admin/videos");
  if (!ok) return;
  state.adminVideos = data.data;
  c.innerHTML = `
    <div class="admin-section-header">
      <h3>📹 All Videos (${data.data.length})</h3>
      <button class="add-btn" onclick="openAddVideo()">+ Add Video</button>
    </div>
    <div style="overflow-x:auto">
    <table class="admin-table">
      <thead><tr><th>Thumb</th><th>Title</th><th>Creator</th><th>Chapter</th><th>Tags</th><th>Actions</th></tr></thead>
      <tbody>
        ${data.data
          .map(
            (v) => `
          <tr>
            <td><img class="tbl-thumb" src="${v.thumb}" onerror="this.style.opacity=0"/></td>
            <td style="max-width:220px"><a class="tbl-link" href="${v.url}" target="_blank">${v.title}</a></td>
            <td><div style="font-size:0.8rem">${v.creator}<br/><span style="color:var(--text3)">${v.handle || ""}</span></div></td>
            <td style="font-size:0.8rem;color:var(--text2)">${v.chapterId?.name || "-"}<br/><span style="color:var(--text3)">${v.chapterId?.subject || ""}</span></td>
            <td>${(v.tags || []).map((t) => `<span class="tag-pill">${t}</span>`).join("")}</td>
            <td>
              <button class="btn-edit" onclick="editVideo('${v._id}')">Edit</button>
              <button class="btn-del" onclick="deleteVideo('${v._id}')">Delete</button>
            </td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>
    </div>`;
}

async function loadAdminChapters() {
  const c = document.getElementById("adminContent");
  c.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
  const { ok, data } = await apiFetch("/admin/chapters");
  if (!ok) return;
  state.adminChapters = data.data;
  c.innerHTML = `
    <div class="admin-section-header">
      <h3>📖 All Chapters (${data.data.length})</h3>
      <button class="add-btn" onclick="openAddChapter()">+ Add Chapter</button>
    </div>
    <div style="overflow-x:auto">
    <table class="admin-table">
      <thead><tr><th>Class</th><th>Subject</th><th>Name</th><th>Order</th><th>Next Steps</th><th>Actions</th></tr></thead>
      <tbody>
        ${data.data
          .map(
            (ch) => `
          <tr>
            <td><span style="font-family:Syne;font-weight:700;color:var(--accent)">Class ${ch.classId?.number || "?"}</span></td>
            <td style="font-size:0.82rem">${ch.subject}</td>
            <td style="font-weight:600">${ch.name}</td>
            <td style="text-align:center">${ch.order}</td>
            <td style="font-size:0.78rem;color:var(--text2)">${ch.nextSteps?.length || 0} steps</td>
            <td>
              <button class="btn-edit" onclick="editChapter('${ch._id}')">Edit</button>
              <button class="btn-del" onclick="deleteChapter('${ch._id}')">Delete</button>
            </td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>
    </div>`;
}

async function loadAdminUsers() {
  const c = document.getElementById("adminContent");
  c.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
  const { ok, data } = await apiFetch("/admin/users");
  if (!ok) return;
  c.innerHTML = `
    <div class="admin-section-header"><h3>👥 Students (${data.data.filter((u) => u.role === "student").length})</h3></div>
    <div style="overflow-x:auto">
    <table class="admin-table">
      <thead><tr><th>Name</th><th>Email</th><th>Class</th><th>Role</th><th>Joined</th></tr></thead>
      <tbody>
        ${data.data
          .map(
            (u) => `
          <tr>
            <td style="font-weight:600">${u.name}</td>
            <td style="font-size:0.82rem;color:var(--text2)">${u.email}</td>
            <td>${u.class ? "Class " + u.class : "—"}</td>
            <td><span style="font-size:0.72rem;padding:3px 10px;border-radius:8px;background:${u.role === "admin" ? "rgba(108,99,255,0.2)" : "rgba(67,233,123,0.1)"};color:${u.role === "admin" ? "var(--accent)" : "var(--accent3)"}">${u.role}</span></td>
            <td style="font-size:0.78rem;color:var(--text3)">${new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
          </tr>`,
          )
          .join("")}
      </tbody>
    </table>
    </div>`;
}

// ADD / EDIT VIDEO
async function openAddVideo() {
  document.getElementById("addVideoTitle").textContent = "Add New Video";
  document.getElementById("editVideoId").value = "";
  [
    "avTitle",
    "avCreator",
    "avHandle",
    "avUrl",
    "avThumb",
    "avTags",
    "avOrder",
  ].forEach((id) => (document.getElementById(id).value = ""));
  document.getElementById("addVideoError").style.display = "none";
  await populateChapterSelect("avChapter");
  openModal("addVideoModal");
}

async function editVideo(id) {
  const v = state.adminVideos.find((x) => x._id === id);
  if (!v) return;
  document.getElementById("addVideoTitle").textContent = "Edit Video";
  document.getElementById("editVideoId").value = id;
  await populateChapterSelect("avChapter", v.chapterId?._id);
  document.getElementById("avTitle").value = v.title;
  document.getElementById("avCreator").value = v.creator;
  document.getElementById("avHandle").value = v.handle || "";
  document.getElementById("avUrl").value = v.url;
  document.getElementById("avThumb").value = v.thumb || "";
  document.getElementById("avTags").value = (v.tags || []).join(", ");
  document.getElementById("avOrder").value = v.order;
  document.getElementById("addVideoError").style.display = "none";
  openModal("addVideoModal");
}

async function submitVideo() {
  const id = document.getElementById("editVideoId").value;
  const body = {
    chapterId: document.getElementById("avChapter").value,
    title: document.getElementById("avTitle").value.trim(),
    creator: document.getElementById("avCreator").value.trim(),
    handle: document.getElementById("avHandle").value.trim(),
    url: document.getElementById("avUrl").value.trim(),
    thumb: document.getElementById("avThumb").value.trim(),
    tags: document
      .getElementById("avTags")
      .value.split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    order: parseInt(document.getElementById("avOrder").value) || 1,
  };
  if (!body.title || !body.creator || !body.url || !body.chapterId) {
    showAuthError(
      "addVideoError",
      "Title, Creator, URL and Chapter are required",
    );
    return;
  }
  const method = id ? "PUT" : "POST";
  const path = id ? `/admin/videos/${id}` : "/admin/videos";
  const { ok, data } = await apiFetch(path, {
    method,
    body: JSON.stringify(body),
  });
  if (!ok) {
    showAuthError("addVideoError", data.message);
    return;
  }
  closeModal("addVideoModal");
  showToast(id ? "Video updated! ✅" : "Video added! 🎬", "success");
  loadAdminVideos();
}

async function deleteVideo(id) {
  if (!confirm("Delete this video? This cannot be undone.")) return;
  const { ok } = await apiFetch(`/admin/videos/${id}`, { method: "DELETE" });
  if (ok) {
    showToast("Video deleted.", "success");
    loadAdminVideos();
  } else showToast("Failed to delete.", "error");
}

// ADD / EDIT CHAPTER
async function openAddChapter() {
  document.getElementById("addChapterTitle").textContent = "Add New Chapter";
  document.getElementById("editChapterId").value = "";
  ["acSubject", "acName", "acOrder", "acNextSteps"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  await populateClassSelect("acClass");
  document.getElementById("addChapterError").style.display = "none";
  openModal("addChapterModal");
}

async function editChapter(id) {
  const ch = state.adminChapters.find((x) => x._id === id);
  if (!ch) return;
  document.getElementById("addChapterTitle").textContent = "Edit Chapter";
  document.getElementById("editChapterId").value = id;
  await populateClassSelect("acClass", ch.classId?._id);
  document.getElementById("acSubject").value = ch.subject;
  document.getElementById("acName").value = ch.name;
  document.getElementById("acOrder").value = ch.order;
  document.getElementById("acNextSteps").value = (ch.nextSteps || []).join(
    "\n",
  );
  document.getElementById("addChapterError").style.display = "none";
  openModal("addChapterModal");
}

async function submitChapter() {
  const id = document.getElementById("editChapterId").value;
  const body = {
    classId: document.getElementById("acClass").value,
    subject: document.getElementById("acSubject").value.trim(),
    name: document.getElementById("acName").value.trim(),
    order: parseInt(document.getElementById("acOrder").value) || 1,
    nextSteps: document
      .getElementById("acNextSteps")
      .value.split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };
  if (!body.classId || !body.subject || !body.name) {
    showAuthError("addChapterError", "Class, Subject and Name are required");
    return;
  }
  const method = id ? "PUT" : "POST";
  const path = id ? `/admin/chapters/${id}` : "/admin/chapters";
  const { ok, data } = await apiFetch(path, {
    method,
    body: JSON.stringify(body),
  });
  if (!ok) {
    showAuthError("addChapterError", data.message);
    return;
  }
  closeModal("addChapterModal");
  showToast(id ? "Chapter updated! ✅" : "Chapter added! 📖", "success");
  loadAdminChapters();
}

async function deleteChapter(id) {
  if (
    !confirm("Delete this chapter and ALL its videos? This cannot be undone.")
  )
    return;
  const { ok } = await apiFetch(`/admin/chapters/${id}`, { method: "DELETE" });
  if (ok) {
    showToast("Chapter deleted.", "success");
    loadAdminChapters();
  } else showToast("Failed to delete.", "error");
}

// POPULATE SELECTS
async function populateChapterSelect(selectId, selectedId = "") {
  const sel = document.getElementById(selectId);
  sel.innerHTML = '<option value="">Loading chapters...</option>';
  const { ok, data } = await apiFetch("/admin/chapters");
  if (!ok) return;
  sel.innerHTML = data.data
    .map(
      (ch) =>
        `<option value="${ch._id}" ${ch._id === selectedId ? "selected" : ""}>Class ${ch.classId?.number} — ${ch.subject} — ${ch.name}</option>`,
    )
    .join("");
}

async function populateClassSelect(selectId, selectedId = "") {
  const sel = document.getElementById(selectId);
  sel.innerHTML = '<option value="">Loading classes...</option>';
  const { ok, data } = await apiFetch("/classes");
  if (!ok) return;
  sel.innerHTML = data.data
    .map(
      (cls) =>
        `<option value="${cls._id}" ${cls._id === selectedId ? "selected" : ""}>Class ${cls.number} — ${cls.tagline}</option>`,
    )
    .join("");
}
