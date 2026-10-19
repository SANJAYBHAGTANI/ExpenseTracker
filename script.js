const Amount = document.querySelector("#AmountInput");
const Description = document.querySelector("#descriptionInput");
const Type = document.querySelector("#type");
const Category = document.querySelector("#category");
const InputDate = document.querySelector("#InputDate");
const Submit = document.querySelector(".SubmitBtn");
const outputSection = document.querySelector(".Output");
const formArea = document.querySelector(".formArea");
const SubmitAlert = document.querySelector('#SubmitAlert');

const homeIcon = document.querySelector("#homeIcon");
const TransIcon = document.querySelector("#TransIcon");
const Income = document.querySelector("#Income");
const Expense = document.querySelector("#Expense");
const AddIcon = document.querySelector("#AddIcon");

const headerArea = document.querySelector('.headerArea');
const expenseArea = document.querySelector('.expenseArea');
const BalanceBox = document.getElementsByClassName('BalanceBox');
const formSection = document.querySelector('.formSection');
const OutputSection = document.querySelector('.Output');
const btnSearchProsnal = document.querySelector('#btnSearchProsnal');
const btnAddProsnal = document.querySelector('#btnAddProsnal');
const searchSection = document.querySelector(".SearchSection");

const startInput = document.querySelector("#StartInput");
const endInput = document.querySelector("#EndInput");
const searchBtn = document.querySelector("#searchBtn");
const quickBtns = document.querySelectorAll(".quick-btn");

const AddMoney = document.querySelector("#AddMoney");
const budgetModal = document.querySelector("#budgetModal");
const saveBudgetBtn = document.querySelector("#saveBudgetBtn");
const closeBudgetBtn = document.querySelector("#closeBudgetBtn");
const budgetInput = document.querySelector("#budgetInput");
const budgetDisplay = document.querySelector("#TotalBudgut");


// ==========================================
// 2. INITIAL LOAD & PAGE SETUP (Shuruati setup)
// ==========================================
showTransactions();
updateDashboard();

window.addEventListener('DOMContentLoaded', () => {
    if (homeIcon) {
        homeIcon.classList.add("active");
    }

    const allButtons = document.querySelectorAll(".Icons");
    allButtons.forEach(button => {
        button.addEventListener("click", () => {
            allButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });

    // Saved Budget Check on Load
    const savedBudget = localStorage.getItem("totalBudget") || "00";
    if (budgetDisplay) {
        budgetDisplay.innerText = `₹ ${savedBudget}`;
        AddMoney.innerHTML = "Change Your Budget";
        AddMoney.style.width = "150px";
    }
});


// ==========================================
// 3. TRANSACTION SUBMIT LOGIC (Data save karna)
// ==========================================
Submit.addEventListener("click", (e) => {
    e.preventDefault();

    const AmountValue = Amount.value; 
    const DescriptionValue = Description.value.trim(); 
    const TypeValue = Type.value; 
    const CategoryValue = Category.value; 
    const InputDateValue = InputDate.value; 

    if(AmountValue == "" || DescriptionValue == "" || 
        TypeValue == "" || CategoryValue == "" || InputDateValue == "") {
        alert("Brother, data enter nahi kiya hai!");
        return;
    }

    const userExpenses = {
        Amount: AmountValue,
        Description: DescriptionValue,
        Type: TypeValue,
        Category: CategoryValue,
        Date: InputDateValue
    };

    let allExpense = JSON.parse(localStorage.getItem("transactions")) || [];
    allExpense.unshift(userExpenses);
    localStorage.setItem("transactions", JSON.stringify(allExpense));

    showTransactions();
    updateDashboard(); // Live Dashboard Update

    formArea.reset();
    SubmitAlert.innerHTML = "Data Submitted Successfully!!"

    setTimeout(() => {
        SubmitAlert.innerHTML = "";
    }, 2500);
});


// ==========================================
// 4. SHOW TRANSACTIONS FUNCTION (Data dikhana aur filter karna)
// ==========================================
function showTransactions(filter = 'all') {
    let allExpense = JSON.parse(localStorage.getItem("transactions")) || [];

    let filteredData = allExpense;
    if (filter === 'income') {
        filteredData = allExpense.filter(item => item.Type === 'income');
    } else if (filter === 'expense') {
        filteredData = allExpense.filter(item => item.Type === 'expense');
    }

    outputSection.innerHTML = filteredData.length > 0 ? filteredData.map(item => `
        <div class="transaction-card">
            <div>
                <h4>${item.Description}</h4>
                <p>${item.Category} | ${item.Date}</p>
            </div>
            <div class="${item.Type === 'income' ? 'income-amount' : 'expense-amount'}">
                ${item.Type === 'income' ? '+' : '-'} ₹ ${item.Amount}
            </div>
        </div>
    `).join('') : `<p style="text-align:center; color:gray; padding:20px;">Koi transaction nahi mili!</p>`;
}


// ==========================================
// 5. NAVIGATION & SECTION SWITCHING (Screens badalna)
// ==========================================
Income.addEventListener('click', (e) => {
    expenseArea.style.display = "none";
    OutputSection.style.display = "flex";
    formSection.style.display = "none";
    searchSection.style.display = "none";
    btnAddProsnal.style.display = "block";
    showTransactions('income');
});

Expense.addEventListener('click', (e) => {
    expenseArea.style.display = "none";
    formSection.style.display = "none";
    outputSection.style.display = "flex";
    searchSection.style.display = "none";
    btnAddProsnal.style.display = "block";
    showTransactions('expense');
});

TransIcon.addEventListener('click', (e) => {
    expenseArea.style.display = "none";
    OutputSection.style.display = "flex";
    formSection.style.display = "none";
    searchSection.style.display = "none";
    btnAddProsnal.style.display = "block";
    showTransactions('all');
});

homeIcon.addEventListener('click', (e) => {
    expenseArea.style.display = "flex";
    expenseArea.style.flexDirection = "column"; 
    expenseArea.style.gap = "12px"; 
    OutputSection.style.display = "none";
    formSection.style.display = "none";
    searchSection.style.display = "none";
    btnAddProsnal.style.display = "block";
    updateDashboard(); 
});

AddIcon.addEventListener('click', (e) => {
    expenseArea.style.display = "none";
    OutputSection.style.display = "none";
    searchSection.style.display = "none";
    formSection.style.display = "block";
    formSection.style.margin = "0px auto";
    btnAddProsnal.style.display = "none";
    formSection.style.width = "90%";
});

btnAddProsnal.addEventListener('click', (e) => {
    expenseArea.style.display = "none";
    OutputSection.style.display = "none";
    searchSection.style.display = "none";
    formSection.style.display = "block";
    formSection.style.margin = "0px auto";
    btnAddProsnal.style.display = "none";
    formSection.style.width = "90%";
});


// ==========================================
// 6. SEARCH & QUICK SELECTION LOGIC (Search aur date filter)
// ==========================================
quickBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        quickBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const range = btn.getAttribute("data-range");
        const today = new Date();
        let startDate = new Date();
        let endDate = new Date();

        if (range === "today") {
            // Today
        } else if (range === "yesterday") {
            startDate.setDate(today.getDate() - 1);
            endDate.setDate(today.getDate() - 1);
        } else if (range === "week") {
            startDate.setDate(today.getDate() - 7);
        } else if (range === "month") {
            startDate.setMonth(today.getMonth() - 1);
        }

        startInput.value = startDate.toISOString().split('T')[0];
        endInput.value = endDate.toISOString().split('T')[0];
    });
});

btnSearchProsnal.addEventListener("click", () => {
    expenseArea.style.display = "none";
    OutputSection.style.display = "none";
    formSection.style.display = "none";
    btnAddProsnal.style.display = "block";

    if (searchSection.style.display === "flex") {
        searchSection.style.display = "none";
    } else {
        searchSection.style.display = "flex";
        searchSection.style.flexDirection = "column";
    }
});

searchBtn.addEventListener("click", () => {
    const startDate = startInput.value;
    const endDate = endInput.value;

    let allExpense = JSON.parse(localStorage.getItem("transactions")) || [];

    let results = allExpense.filter(item => {
        if (!startDate && !endDate) return true;
        const itemDate = item.Date; 
        
        if (startDate && endDate) {
            return itemDate >= startDate && itemDate <= endDate;
        } else if (startDate) {
            return itemDate >= startDate;
        } else if (endDate) {
            return itemDate <= endDate;
        }
        return true;
    });

    searchSection.style.display = "none";
    OutputSection.style.display = "flex";

    OutputSection.innerHTML = results.length > 0 ? results.map(item => `
        <div class="transaction-card">
            <div>
                <h4>${item.Description}</h4>
                <p>${item.Category} | ${item.Date}</p>
            </div>
            <div class="${item.Type === 'income' ? 'income-amount' : 'expense-amount'}">
                ${item.Type === 'income' ? '+' : '-'} ₹ ${item.Amount}
            </div>
        </div>
    `).join('') : `<p style="text-align:center; color:gray; padding:20px;">Is date range me koi transaction nahi mili!</p>`;
});


// ==========================================
// 7. BUDGET MODAL & MANAGEMENT (Budget set karna)
// ==========================================
AddMoney.addEventListener('click', () => {
    budgetModal.style.display = "flex";
    budgetInput.value = ""; 
});

closeBudgetBtn.addEventListener('click', () => {
    budgetModal.style.display = "none";
});

budgetInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        saveBudgetBtn.click();
    }
});

saveBudgetBtn.addEventListener('click', (e) => {
    const amount = budgetInput.value.trim();

    if (amount === "" || isNaN(amount)) {
        alert("Please Enter Correct amount!");
        return;
    }

    localStorage.setItem("totalBudget", amount);

    if (budgetDisplay) {
        budgetDisplay.innerText = `₹ ${amount}`;
        AddMoney.innerHTML = "Change Your Budget";
        AddMoney.style.width = "150px"; 
    }

    updateDashboard(); 
    budgetModal.style.display = "none";
});


// ==========================================
// 8. DASHBOARD LIVE CALCULATION (Hisab lagana)
// ==========================================
function updateDashboard() {
    let allTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let baseBudget = parseFloat(localStorage.getItem("totalBudget")) || 0;

    let totalIncome = 0;
    let totalExpense = 0;

    allTransactions.forEach(item => {
        let amount = parseFloat(item.Amount) || 0;
        // .toLowerCase() lagane se 'Income', 'INCOME' ya 'income' sabhi match ho jayenge
        let type = item.Type ? item.Type.toLowerCase() : '';

        if (type === 'income') {
            totalIncome += amount;
        } else if (type === 'expense') {
            totalExpense += amount;
        }
    });

    let finalBudget = baseBudget + totalIncome;
    let totalBalance = finalBudget - totalExpense;

    const budgetDisplayElem = document.querySelector("#TotalBudgut");
    const expenseDisplayElem = document.querySelector("#ExpendBudget");
    const balanceDisplayElem = document.querySelector("#AvlBudget");

    if (budgetDisplayElem) budgetDisplayElem.innerText = `₹ ${finalBudget}`;
    if (expenseDisplayElem) expenseDisplayElem.innerText = `-₹ ${totalExpense}`;
    if (balanceDisplayElem) balanceDisplayElem.innerText = `₹ ${totalBalance}`;
}