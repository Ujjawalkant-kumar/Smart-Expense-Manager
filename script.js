let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const budget = 15000;

document.getElementById("today").textContent =
  new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });

document.getElementById("budgetDisplay").textContent = money(budget);

function money(value) {
  return "₹" + Number(value).toLocaleString("en-IN");
}

function render() {
  let income = 0, expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").textContent = money(income);
  document.getElementById("expense").textContent = money(expense);
  document.getElementById("balance").textContent = money(income - expense);
  document.getElementById("budgetLeft").textContent = money(budget - expense);

  const box = document.getElementById("transactions");

  if (transactions.length === 0) {
    box.innerHTML = '<p class="empty">No transactions yet.</p>';
  } else {
    box.innerHTML = transactions.slice().reverse().map(t => `
      <div class="transaction">
        <div>
          <strong>${escapeHtml(t.description)}</strong>
          <small>${escapeHtml(t.category)}</small>
        </div>
        <div class="${t.type === "income" ? "income-text" : "expense-text"}">
          ${t.type === "income" ? "+" : "-"}${money(t.amount)}
        </div>
      </div>
    `).join("");
  }

  updateInsight(expense);
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateInsight(expense) {
  const text = document.getElementById("insightText");
  const percent = (expense / budget) * 100;

  if (expense === 0) text.textContent = "Add a few transactions to receive spending insights.";
  else if (percent >= 100) text.textContent = "⚠️ You have crossed your monthly budget.";
  else if (percent >= 80) text.textContent = "⚠️ You have used more than 80% of your monthly budget.";
  else text.textContent = `You have used ${percent.toFixed(1)}% of your monthly budget. Keep tracking your spending.`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

document.getElementById("transactionForm").addEventListener("submit", e => {
  e.preventDefault();

  transactions.push({
    type: document.getElementById("type").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    amount: Number(document.getElementById("amount").value)
  });

  e.target.reset();
  render();
});

document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("Delete all transactions?")) {
    transactions = [];
    render();
  }
});

render();
