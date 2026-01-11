let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let history = JSON.parse(localStorage.getItem("history")) || {};
let streak = JSON.parse(localStorage.getItem("streak")) || 0;
let lastDoneDate = localStorage.getItem("lastDoneDate") || null;
let celebrated = false;

/* 🌸 PETALS */
(function startPetals() {
  const container = document.getElementById("petals");
  setInterval(() => {
    const p = document.createElement("div");
    p.className = "petal";
    p.innerText = "🌸";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 4 + Math.random() * 3 + "s";
    container.appendChild(p);
    setTimeout(() => p.remove(), 7000);
  }, 500);
})();

/* TASKS */
function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

  tasks.push({
    text: input.value.trim(),
    done: false,
    completedAt: null
  });

  input.value = "";
  save();
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  tasks[i].completedAt = tasks[i].done ? Date.now() : null;
  save();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  save();
}

/* ✅ RESET FUNCTION */
function resetTasks() {
  if (!tasks.length) return;
  if (!confirm("Reset all tasks for today?")) return;

  tasks = [];
  localStorage.setItem("tasks", JSON.stringify(tasks));
  celebrated = false;
  render();
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

/* 🎉 CELEBRATION */
function showCelebration() {
  const box = document.getElementById("celebration");
  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("hidden"), 2500);
}

/* RENDER */
function render() {
  const list = document.getElementById("taskList");
  const completed = document.getElementById("completedList");
  const historyList = document.getElementById("weeklyHistory");
  const bar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const streakEl = document.getElementById("streakCount");

  list.innerHTML = "";
  completed.innerHTML = "";
  historyList.innerHTML = "";

  const pending = tasks.filter(t => !t.done);
  const doneTasks = tasks.filter(t => t.done);

  pending.forEach(t => {
    const i = tasks.indexOf(t);
    list.innerHTML += `
      <li>
        <span onclick="toggleTask(${i})">${t.text}</span>
        <span onclick="deleteTask(${i})">✕</span>
      </li>`;
  });

  doneTasks.forEach(t => {
    completed.innerHTML += `
      <li class="completed">
        <span>${t.text}</span>
        <span>✔</span>
      </li>`;
  });

  const done = doneTasks.length;
  const total = tasks.length;

  bar.style.width = total ? (done / total) * 100 + "%" : "0%";
  progressText.innerText = `${done} / ${total} done`;

  /* 🔥 STREAK */
  const today = new Date().toDateString();
  if (total > 0 && done === total && lastDoneDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    streak = (lastDoneDate === yesterday.toDateString()) ? streak + 1 : 1;
    lastDoneDate = today;
    localStorage.setItem("streak", streak);
    localStorage.setItem("lastDoneDate", today);
  }
  streakEl.innerText = streak;

  /* 🎉 CELEBRATION WHEN ALL DONE */
  if (total > 0 && done === total && !celebrated) {
    celebrated = true;
    setTimeout(showCelebration, 100);
  }
  if (done !== total) celebrated = false;

  /* HISTORY */
  history[today] = done;
  localStorage.setItem("history", JSON.stringify(history));
  Object.keys(history).slice(-7).reverse().forEach(day => {
    historyList.innerHTML += `<li>${day} → ${history[day]} tasks</li>`;
  });
}

function openDonePage() {
  document.querySelector(".pages").style.transform = "translateX(-50%)";
}

function closeDonePage() {
  document.querySelector(".pages").style.transform = "translateX(0)";
}

render();
