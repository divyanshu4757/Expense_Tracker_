const form = document.getElementById("expenseForm");
const amount = document.getElementById("amount");
const description = document.getElementById("description");
const category = document.getElementById("category");
const sampleExpense = document.querySelector(".expense-item");
const expenseList = document.getElementById("expenseList");
const premium = document.getElementById("premium");
const premiumSuccess = document.querySelector("#premium-success");
const leaderboardTable = document.getElementById("leaderboard-table");
const leaderboardButton = document.getElementById("leaderboard-button");

const tableData = document.getElementById("table-data");
const tableDataRow = document.getElementById("table-data-row");
const navigationButtons = document.getElementById("navigation-buttons");
const rowsPerPage = document.getElementById("rowsPerPage");

function createExpense(amount, description, category, id) {
  const clonedExpense = sampleExpense.cloneNode(true);

  const expenseDescription = clonedExpense.querySelector(
    ".expense-description"
  );
  const expenseCategory = clonedExpense.querySelector(".expense-category");
  const expenseAmount = clonedExpense.querySelector(".expense-amount");
  const expenseId = clonedExpense.querySelector("#expenseId");

  expenseId.textContent = id;
  expenseId.style.display = "none";
  expenseDescription.textContent = description;
  expenseCategory.textContent = category;
  expenseAmount.textContent = `$   ${amount}`;
  expenseList.appendChild(clonedExpense);
}

function getPages(token) {
  let page = 1;
  const limit = localStorage.getItem("rowsPerPage");
  rowsPerPage.value = limit;
  console.log(limit);

  function getExpenses(page) {
    axios(`http://localhost:5000/expenses?page=${page}&limit=${limit}`, {
      headers: { Authorization: token },
    })
      .then((response) => {
        const data = response.data.pureResult;
        const totalCount = response.data.count;
        const pages = Math.ceil(totalCount / limit);

        window.totalPages = pages;
        console.log(totalPages);

        if (page > totalPages) {
          document.getElementById("next").style.display = "none";
          return;
        } else {
          document.getElementById("next").style.display = "block";
        }

        data.forEach((item) => {
          createExpense(item.amount, item.description, item.category, item.id);
        });
      })

      .catch((err) => {
        console.error(err);
      });
  }

  getExpenses(page);

  document.getElementById("next").addEventListener("click", (e) => {
    expenseList.textContent = "";
    page = page + 1;
    getExpenses(page);

    document.getElementById("current").textContent = page;

    if (page > totalPages) {
      document.getElementById("next").display = "none";
    }
  });

  document.getElementById("prev").addEventListener("click", (e) => {
    if (page < 1) {
      document.getElementById("prev").display = "none";
      return;
    }
    expenseList.textContent = "";
    page = page - 1;
    getExpenses(page);

    document.getElementById("current").textContent = page;
  });
}

rowsPerPage.addEventListener("change", function () {
  const newSelectedValue = rowsPerPage.value;
  localStorage.setItem("rowsPerPage", newSelectedValue);

  console.log(newSelectedValue);
  const token = localStorage.getItem("token");
  expenseList.textContent = "";

  getPages(token);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  axios({
    method: "post",
    url: "http://localhost:5000/expenses",
    data: {
      amount: amount.value,
      description: description.value,
      category: category.value,
    },
    headers: { Authorization: token },
  }).then((response) => {
    const incomingData = response.data.data;

    createExpense(
      amount.value,
      description.value,
      category.value,
      incomingData.id
    );

    form.reset();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  premium.style.display = "block";
  const token = localStorage.getItem("token");

  getPages(token);
});

expenseList.addEventListener("click", (e) => {
  const token = localStorage.getItem("token");

  if (e.target.classList.contains("delete-expense")) {
    let parent = e.target.parentNode;

    const id = parent.children[1].textContent;
    const amount = parent.children[2].textContent;
    console.log(amount);

    //console.log(id);

    axios
      .delete(`http://localhost:5000/delete/${id}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log(response.data.message);
        parent.remove();
      });
  }
});

premium.addEventListener("click", async (e) => {
  const token = localStorage.getItem("token");

  //console.log(token);

  const response = await axios.get(
    `http://localhost:5000/purchase/premiummembership`,
    {
      headers: { Authorization: token },
    }
  );
  console.log(response);

  var option = {
    key: response.data.key_id,
    order_id: response.data.result.orderid,
    handler: async function (response) {
      await axios.post(
        `http://localhost:5000/purchase/updatetransactionstatus`,
        {
          order_id: option.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      alert("you are a premium member now");
      premium.remove();
      premiumSuccess.textContent = "You are a premium member now";
      premiumSuccess.style.fontSize = "15px";
      premiumSuccess.style.fontWeight = "bold";
    },
  };

  const rzp1 = new Razorpay(option);

  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert("payment failed");
  });
});

leaderboardButton.addEventListener("click", (e) => {
  const token = localStorage.getItem("token");

  while (tableData.firstChild) {
    tableData.removeChild(tableData.firstChild);
  }
  var i = 1;

  axios("http://localhost:5000/premium/leaderboard", {
    headers: { Authorization: token },
  }).then((result) => {
    console.log(result);

    if (result.data.isPremium === false) {
      alert(result.data.message);
      return;
    }

    result.data.sort((a, b) => b.expense - a.expense);

    result.data.forEach((expense) => {
      var clonedElement = tableDataRow.cloneNode(true);

      clonedElement.children[0].textContent = `${i}`;
      clonedElement.children[1].textContent = `${expense.name}`;
      clonedElement.children[2].textContent = `$ ${expense.expense}`;

      tableData.appendChild(clonedElement);
      i++;
    });
    if (leaderboardTable.style.display === "none") {
      leaderboardTable.style.display = "block";
      leaderboardButton.textContent = "Hide Leaderboard";
    } else {
      leaderboardTable.style.display = "none";
      leaderboardButton.textContent = "Show Leaderboard";
    }
  });
});



document.getElementById('downloadexpense').addEventListener('click', ()=>{

  const token = localStorage.getItem("token");
  axios("http://localhost:5000/premium/leaderboard", {
    headers: { Authorization: token },
  }).then((result) => {
    console.log(result);

    if (result.data.isPremium === false) {
      alert(result.data.message);
      return;
    } else {
      window.location.href = "./report.html";
    }
  });



})

