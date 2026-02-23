// Loads courses.json and displays it in a table with search feature

const COURSES_URL = "courses.json";

const coursesBody = document.getElementById("coursesBody");
const searchInput = document.getElementById("searchInput");
const statusText = document.getElementById("statusText");

let allCourses = [];

// Prevent XSS
function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderCourses(courses) {
  coursesBody.innerHTML = "";

  if (!courses || courses.length === 0) {
    statusText.textContent = "No matching subjects found.";
    return;
  }

  statusText.textContent = `Showing ${courses.length} subject(s).`;

  coursesBody.innerHTML = courses
    .map(
      (c) => `
      <tr>
        <td>${escapeHtml(c.year_level ?? "")}</td>
        <td>${escapeHtml(c.sem ?? "")}</td>
        <td>${escapeHtml(c.code ?? "")}</td>
        <td>${escapeHtml(c.description ?? "")}</td>
        <td>${escapeHtml(c.credit ?? "")}</td>
      </tr>
    `
    )
    .join("");
}

function filterCourses(keyword) {
  const q = keyword.trim().toLowerCase();

  const filtered = allCourses.filter((c) =>
    String(c.description ?? "").toLowerCase().includes(q)
  );

  renderCourses(filtered);
}

async function loadCourses() {
  try {
    statusText.textContent = "Loading courses...";

    const response = await fetch(COURSES_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.courses)) {
      throw new Error('Invalid JSON format. Expected: { "courses": [ ... ] }');
    }

    allCourses = data.courses;
    renderCourses(allCourses);
  } catch (err) {
    console.error(err);
    statusText.textContent = `Failed to load courses.json: ${err.message}`;
  }
}

searchInput.addEventListener("input", (e) => {
  filterCourses(e.target.value);
});

loadCourses();