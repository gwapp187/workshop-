const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");
const statusSelect = form.querySelector("select");
const table = document.querySelector("table");

let jobs = JSON.parse(localStorage.getItem("workshopJobs")) || [];

function saveJobs() {
  localStorage.setItem("workshopJobs", JSON.stringify(jobs));
}

function displayJobs() {
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  jobs.forEach(function (job) {
    const row = table.insertRow();

    const jobCell = row.insertCell();
    const materialCell = row.insertCell();
    const quantityCell = row.insertCell();
    const dueDateCell = row.insertCell();
    const statusCell = row.insertCell();

    jobCell.textContent = job.jobName;
    materialCell.textContent = job.material;
    quantityCell.textContent = job.quantity;
    dueDateCell.textContent = job.dueDate;
    statusCell.textContent = job.status;
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const jobName = inputs[0].value.trim();
  const material = inputs[1].value.trim();
  const quantity = inputs[2].value;
  const dueDate = inputs[3].value;
  const status = statusSelect.value;

  if (!jobName || !material || !quantity || !dueDate) {
    alert("Please fill in all fields.");
    return;
  }

  const newJob = {
    jobName,
    material,
    quantity,
    dueDate,
    status
  };

  jobs.push(newJob);

  saveJobs();
  displayJobs();

  form.reset();
});

displayJobs();
