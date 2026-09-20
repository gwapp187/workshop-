const API_URL = "https://workshop-job-tracker-api.onrender.com/api/jobs";

const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");
const statusSelect = form.querySelector("select");
const table = document.querySelector("table");
const submitButton = form.querySelector('button[type="submit"]');

let jobs = [];
let editingId = null;

function addActionsHeading() {
  const headingRow = table.rows[0];

  if (headingRow.cells.length < 6) {
    const heading = document.createElement("th");
    heading.textContent = "Actions";
    headingRow.appendChild(heading);
  }
}

async function loadJobs() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Could not load jobs");
    }

    jobs = await response.json();
    displayJobs();
  } catch (error) {
    console.error(error);
    alert("Could not load jobs from the server.");
  }
}

function displayJobs() {
  addActionsHeading();

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  jobs.forEach(function (job) {
    const row = table.insertRow();

    row.insertCell().textContent = job.jobName;
    row.insertCell().textContent = job.material;
    row.insertCell().textContent = job.quantity;
    row.insertCell().textContent = job.dueDate;
    row.insertCell().textContent = job.status;

    const actionsCell = row.insertCell();

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "action-button edit-button";

    editButton.addEventListener("click", function () {
      inputs[0].value = job.jobName;
      inputs[1].value = job.material;
      inputs[2].value = job.quantity;
      inputs[3].value = job.dueDate;
      statusSelect.value = job.status;

      editingId = job.id;
      submitButton.textContent = "Update Job";

      form.scrollIntoView({
        behavior: "smooth"
      });
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "action-button delete-button";

    deleteButton.addEventListener("click", async function () {
      const confirmed = confirm(
        "Delete " + job.jobName + "?"
      );

      if (!confirmed) {
        return;
      }

      try {
        const response = await fetch(
          API_URL + "/" + job.id,
          {
            method: "DELETE"
          }
        );

        if (!response.ok) {
          throw new Error("Could not delete job");
        }

        await loadJobs();
      } catch (error) {
        console.error(error);
        alert("Could not delete the job.");
      }
    });

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
  });
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const job = {
    jobName: inputs[0].value.trim(),
    material: inputs[1].value.trim(),
    quantity: Number(inputs[2].value),
    dueDate: inputs[3].value,
    status: statusSelect.value
  };

  if (
    !job.jobName ||
    !job.material ||
    !job.quantity ||
    !job.dueDate
  ) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    let response;

    if (editingId === null) {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(job)
      });
    } else {
      response = await fetch(
        API_URL + "/" + editingId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(job)
        }
      );
    }

    if (!response.ok) {
      throw new Error("Could not save job");
    }

    form.reset();
    editingId = null;
    submitButton.textContent = "Add Job";

    await loadJobs();
  } catch (error) {
    console.error(error);
    alert("Could not save the job.");
  }
});

loadJobs();
