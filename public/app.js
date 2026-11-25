const API = "/api/tasks";
let tasks = [];
let currentFilter = "all";

const $ = (id) => document.getElementById(id);
const taskList = $("taskList");
const message = $("message");
const editDialog = $("editDialog");

function notify(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => { message.textContent = ""; }, 3500);
}
function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  })[char]);
}
function dateOnly(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
function formatDue(value) {
  if (!value) return "No due date";
  return new Date(value).toLocaleDateString(undefined, { day:"numeric", month:"short", year:"numeric" });
}
async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type":"application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
async function loadTasks() {
  try {
    tasks = await request(API);
    render();
  } catch (error) {
    taskList.innerHTML = `<div class="empty-state"><strong>Unable to load tasks</strong>${escapeHTML(error.message)}. Check that the server and MongoDB are running.</div>`;
  }
}
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const progress = total ? Math.round(completed / total * 100) : 0;
  $("totalStat").textContent = total;
  $("completedStat").textContent = completed;
  $("pendingStat").textContent = pending;
  $("progressStat").textContent = `${progress}%`;
  $("progressBar").style.width = `${progress}%`;
  $("allCount").textContent = total;
}
function visibleTasks() {
  let result = [...tasks];
  if (currentFilter === "pending") result = result.filter(task => !task.completed);
  if (currentFilter === "completed") result = result.filter(task => task.completed);
  const query = $("searchInput").value.trim().toLowerCase();
  if (query) result = result.filter(task =>
    task.title.toLowerCase().includes(query) ||
    (task.description || "").toLowerCase().includes(query)
  );
  const sort = $("sortSelect").value;
  if (sort === "oldest") result.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (sort === "newest") result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (sort === "priority") {
    const rank = { High:0, Medium:1, Low:2 };
    result.sort((a,b) => rank[a.priority] - rank[b.priority]);
  }
  if (sort === "due") result.sort((a,b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
  return result;
}
function render() {
  updateStats();
  const filtered = visibleTasks();
  $("visibleCount").textContent = `${filtered.length} ${filtered.length === 1 ? "task" : "tasks"}`;
  $("listHeading").textContent = currentFilter === "all" ? "All tasks" :
    currentFilter === "pending" ? "Pending tasks" : "Completed tasks";
  if (!filtered.length) {
    taskList.innerHTML = `<div class="empty-state"><div class="empty-symbol">✦</div><strong>${tasks.length ? "Nothing to show here" : "Your space is clear"}</strong>${tasks.length ? "Try another filter or search term." : "Add your first task above and make today productive."}</div>`;
    return;
  }
  taskList.innerHTML = filtered.map(task => `
    <article class="task-item ${task.completed ? "done" : ""}">
      <button class="check-button ${task.completed ? "checked" : ""}" data-action="toggle" data-id="${task._id}" aria-label="${task.completed ? "Mark pending" : "Mark complete"}">${task.completed ? "✓" : ""}</button>
      <div class="task-info">
        <div class="task-title">${escapeHTML(task.title)}</div>
        ${task.description ? `<div class="task-description">${escapeHTML(task.description)}</div>` : ""}
        <div class="task-meta"><span class="priority ${escapeHTML(task.priority)}">${escapeHTML(task.priority)} priority</span><span class="due">◷ ${escapeHTML(formatDue(task.dueDate))}</span></div>
      </div>
      <div class="task-actions"><button class="icon-button" data-action="edit" data-id="${task._id}" aria-label="Edit task">✎</button><button class="icon-button" data-action="delete" data-id="${task._id}" aria-label="Delete task">⌫</button></div>
    </article>`).join("");
}
$("taskForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = $("taskTitle").value.trim();
  if (!title) return notify("Please enter a task title.", true);
  try {
    await request(API, { method:"POST", body:JSON.stringify({
      title, description:$("taskDescription").value.trim(),
      priority:$("taskPriority").value, dueDate:$("taskDueDate").value || null
    })});
    event.target.reset();
    $("taskPriority").value = "Medium";
    await loadTasks();
    notify("Task added successfully.");
  } catch (error) { notify(error.message, true); }
});
taskList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  const task = tasks.find(item => item._id === id);
  if (!task) return;
  try {
    if (action === "toggle") {
      await request(`${API}/${id}`, { method:"PUT", body:JSON.stringify({ completed:!task.completed }) });
      await loadTasks(); notify(task.completed ? "Task moved to pending." : "Great work! Task completed.");
    }
    if (action === "delete") {
      if (!window.confirm(`Delete "${task.title}"?`)) return;
      await request(`${API}/${id}`, { method:"DELETE" });
      await loadTasks(); notify("Task deleted.");
    }
    if (action === "edit") {
      $("editId").value = id;
      $("editTitle").value = task.title;
      $("editDescription").value = task.description || "";
      $("editPriority").value = task.priority;
      $("editDueDate").value = dateOnly(task.dueDate);
      editDialog.showModal();
    }
  } catch (error) { notify(error.message, true); }
});
$("editForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await request(`${API}/${$("editId").value}`, { method:"PUT", body:JSON.stringify({
      title:$("editTitle").value.trim(), description:$("editDescription").value.trim(),
      priority:$("editPriority").value, dueDate:$("editDueDate").value || null
    })});
    editDialog.close(); await loadTasks(); notify("Task updated successfully.");
  } catch (error) { notify(error.message, true); }
});
$("closeDialog").addEventListener("click", () => editDialog.close());
document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => {
  currentFilter = button.dataset.filter;
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item === button));
  render();
}));
$("searchInput").addEventListener("input", render);
$("sortSelect").addEventListener("change", render);

const now = new Date();
$("dateChip").textContent = now.toLocaleDateString(undefined, { weekday:"short", day:"numeric", month:"short", year:"numeric" });
$("todayText").textContent = `It's ${now.toLocaleDateString(undefined, { weekday:"long" })}. Make today count, one task at a time.`;
loadTasks();
