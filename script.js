const form = document.querySelector("form");
const inputs = form.querySelectorAll("input");
const statusSelect = form.querySelector("select");
const table = document.querySelector("table");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const jobName = inputs[0].value;
  const material = inputs[1].value;
  const quantity = inputs[2].value;
  const dueDate = inputs[3].value;
  const status = statusSelect.value;

  if (!jobName || !material || !quantity || !dueDate) {
    alert("Please fill in all fields.");
    return;
  }

  const newRow = table.insertRow();

  newRow.innerHTML = `
    <td>${jobName}</td>
    <td>${material}</td>
    <td>${quantity}</td>
    <td>${dueDate}</td>
    <td>${status}</td>
  `;

  form.reset();
});
