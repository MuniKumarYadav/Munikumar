const jobs = [
  { title: "Frontend Developer", company: "Infosys", location: "Bengaluru", exp: "1-3 years", salary: 8, type: "Full-time", tags: ["React", "JavaScript", "CSS"] },
  { title: "Data Analyst", company: "TCS", location: "Pune", exp: "0-2 years", salary: 6, type: "Full-time", tags: ["SQL", "Python", "Power BI"] },
  { title: "UI/UX Designer", company: "Wipro", location: "Remote", exp: "2-4 years", salary: 10, type: "Remote", tags: ["Figma", "Wireframing"] },
  { title: "Software Intern", company: "Zoho", location: "Chennai", exp: "Fresher", salary: 4, type: "Internship", tags: ["Java", "DSA"] },
  { title: "Backend Engineer", company: "HCL", location: "Noida", exp: "3-5 years", salary: 14, type: "Full-time", tags: ["Node.js", "MongoDB", "API"] },
  { title: "DevOps Engineer", company: "Accenture", location: "Hyderabad", exp: "4-7 years", salary: 18, type: "Remote", tags: ["AWS", "Docker", "CI/CD"] }
];

const jobList = document.getElementById("jobList");
const resultCount = document.getElementById("resultCount");
const keyword = document.getElementById("keyword");
const locationInput = document.getElementById("location");
const experience = document.getElementById("experience");
const salary = document.getElementById("salary");
const salaryValue = document.getElementById("salaryValue");
const searchBtn = document.getElementById("searchBtn");
const typeFilters = document.querySelectorAll(".filter-type");

function render(list) {
  if (!jobList || !resultCount) return;

  jobList.innerHTML = "";
  resultCount.textContent = list.length + " jobs";

  if (!list.length) {
    jobList.innerHTML = "<p>No jobs found. Try changing filters.</p>";
    return;
  }

  list.forEach(function (j) {
    const el = document.createElement("article");
    el.className = "job-card";
    const tags = j.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    el.innerHTML =
      "<h3>" + j.title + "</h3>" +
      "<div class='meta'>" + j.company + " • " + j.location + " • " + j.exp + " • " + j.salary + " LPA</div>" +
      "<div class='tags'>" + tags + "</div>" +
      "<button class='btn ghost'>Save</button> <button class='btn primary'>Apply</button>";
    jobList.appendChild(el);
  });
}

function applyFilters() {
  if (!keyword || !locationInput || !experience || !salary) return;

  const q = keyword.value.toLowerCase();
  const loc = locationInput.value.toLowerCase();
  const exp = experience.value.toLowerCase();
  const maxSalary = Number(salary.value);
  const selectedTypes = Array.from(typeFilters).filter(function (c) { return c.checked; }).map(function (c) { return c.value; });

  const filtered = jobs.filter(function (j) {
    const matchesQ = !q || (j.title + " " + j.company + " " + j.tags.join(" ")).toLowerCase().includes(q);
    const matchesLoc = !loc || j.location.toLowerCase().includes(loc);
    const matchesExp = !exp || j.exp.toLowerCase().includes(exp);
    const matchesSalary = j.salary <= maxSalary;
    const matchesType = !selectedTypes.length || selectedTypes.includes(j.type);
    return matchesQ && matchesLoc && matchesExp && matchesSalary && matchesType;
  });

  render(filtered);
}

if (salary) {
  salary.addEventListener("input", function () {
    if (salaryValue) salaryValue.textContent = salary.value;
    applyFilters();
  });
}

if (searchBtn) searchBtn.addEventListener("click", applyFilters);
typeFilters.forEach(function (c) { c.addEventListener("change", applyFilters); });

render(jobs);