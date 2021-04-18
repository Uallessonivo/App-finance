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

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("app.finances:transactions")) || [];
  },

  set(transactions) {
    localStorage.setItem(
      "app.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};

const Transactions = {
  all: Storage.get(),

  add(transactions) {
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
    App.reload();
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
  fomratValue(value) {
    value = Number(value) * 100;
    return Math.round(value);
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

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
    tr.innerHTML = texts.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    texts.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const Css = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formart(transaction.amount);
    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${Css}">${amount}</td>
      <td class="date">${transaction.date}</td>
        <td>
            <img
              onclick="Transactions.remove(${index})"
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

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatData() {
    let { description, amount, date } = Form.getValues();
    amount = Utils.fomratValue(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatData();
      Transactions.add(transaction);
      Form.clearFields();
      Modal.close();
      console.log(transaction);
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transactions.all.forEach(function (transaction, index) {
      texts.addTransaction(transaction, index);
    });
    texts.updateBalance();
    Storage.set(Transactions.all);
  },

  reload() {
    texts.clear();
    App.init();
  },
};

App.init();
