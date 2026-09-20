const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");
const statusSelect = form.querySelector("select");
const table = document.querySelector("table");
const submitButton = form.querySelector('button[type="submit"]');

let jobs = JSON.parse(localStorage.getItem("workshopJobs")) || [];
let editingIndex = null;

function saveJobs() {
  localStorage.setItem("workshopJobs", JSON.stringify(jobs));
}

function addActionsHeading() {
  const headingRow = table.rows[0];

  if (headingRow.cells.length < 6) {
    const heading = document.createElement("th");
    heading.textContent = "Actions";
    headingRow.appendChild(heading);
  }
}

function displayJobs() {
  addActionsHeading();

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  jobs.forEach(function (job, index) {
    const row = table.insertRow();

    const jobCell = row.insertCell();
    const materialCell = row.insertCell();
    const quantityCell = row.insertCell();
    const dueDateCell = row.insertCell();
    const statusCell = row.insertCell();
    const actionsCell = row.insertCell();

    jobCell.textContent = job.jobName;
    materialCell.textContent = job.material;
    quantityCell.textContent = job.quantity;
    dueDateCell.textContent = job.dueDate;
    statusCell.textContent = job.status;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "action-button edit-button";

    editButton.addEventListener("click", function () {
      inputs[0].value = job.jobName;
      inputs[1].value = job.material;
      inputs[2].value = job.quantity;
      inputs[3].value = job.dueDate;
      statusSelect.value = job.status;

      editingIndex = index;
      submitButton.textContent = "Update Job";

      form.scrollIntoView({
        behavior: "smooth"
      });
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "action-button delete-button";

    deleteButton.addEventListener("click", function () {
      const confirmed = confirm(
        "Delete " + job.jobName + "?"
      );

      if (confirmed) {
        jobs.splice(index, 1);

        saveJobs();
        displayJobs();

        if (editingIndex === index) {
          form.reset();
          editingIndex = null;
          submitButton.textContent = "Add Job";
        }
      }
    });

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
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

  const job = {
    jobName,
    material,
    quantity,
    dueDate,
    status
  };

  if (editingIndex === null) {
    jobs.push(job);
  } else {
    jobs[editingIndex] = job;
    editingIndex = null;
  }

  saveJobs();
  displayJobs();

  form.reset();
  submitButton.textContent = "Add Job";
});

displayJobs();
