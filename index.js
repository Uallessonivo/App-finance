const Modal = {
  open() {
    const modal = document.querySelector(".modal-overlay");
    modal.classList.add("active");
  },
  close() {
    const modal = document.querySelector(".modal-overlay");
    modal.classList.remove("active");
  },
};

const transactions = [
  {
    description: "Luz",
    amount: -50000,
    date: "23/01/2021",
  },
  {
    description: "Agua",
    amount: -10000,
    date: "23-01-2021",
  },
  {
    description: "Internet",
    amount: -50000,
    date: "23/01/2021",
  },
  {
    description: "Criação",
    amount: 500001,
    date: "23/01/2021",
  },
  {
    description: "Job",
    amount: 50000,
    date: "23/01/2021",
  },
];

const Transactions = {
  all: transactions,
  add(transaction) {
    Transactions.all.push(transactions);
    App.reload();
  },
  incomes() {
    let income = 0;
    Transactions.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },
  remove(index) {
    Transactions.all.splice(index, 1);
    App.realod();
  },
  expenses() {
    let expense = 0;
    Transactions.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },
  total() {
    return Transactions.incomes() + Transactions.expenses();
  },
};

const Utils = {
  formart(value) {
    const signal = Number(value) < 0 ? "-" : "+";
    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const texts = {
  transactionsContainer: document.querySelector("#data-table-tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = texts.innerHTMLTransaction(transaction);
    texts.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction) {
    const Css = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formart(transaction.amount);
    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${Css}">${amount}</td>
      <td class="date">${transaction.date}</td>
        <td>
            <img
              src="./src//negative.png"
              alt="Botão para apagar a transação"
            />
        </td>
    `;

    return html;
  },

  updateBalance() {
    document.querySelector("#income-display").innerHTML = Utils.formart(
      Transactions.incomes()
    );
    document.querySelector("#expense-display").innerHTML = Utils.formart(
      Transactions.expenses()
    );
    document.querySelector("#total-display").innerHTML = Utils.formart(
      Transactions.total()
    );
  },

  clear() {
    texts.transactionsContainer.innerHTML = "";
  },
};

const App = {
  init() {
    transactions.forEach(function (transaction) {
      texts.addTransaction(transaction);
    });
    texts.updateBalance();
  },

  reload() {
    texts.clear();
    App.init();
  },
};

App.init();
