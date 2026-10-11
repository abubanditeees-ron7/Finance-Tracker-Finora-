const API_BASE = "/api";

function getAccessToken() {
    return localStorage.getItem("access_token");
}

async function apiRequest(path) {
    const token = getAccessToken();

    if (!token) {
        window.location.href = "/login/";
        throw new Error("Please sign in.");
    }

    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login/";
        throw new Error("Your session has expired.");
    }

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
}

function formatUZS(value) {
    return `${Number(value ?? 0).toLocaleString("en-US", {
        maximumFractionDigits: 2
    })} UZS`;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function getList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.transactions)) return data.transactions;
    return [];
}

function renderTransactions(data) {
    const container = document.getElementById("transactions-list");
    if (!container) return;

    const transactions = getList(data).slice(0, 5);
    container.replaceChildren();

    if (!transactions.length) {
        container.textContent = "No transactions yet. Add your first transaction through the API.";
        return;
    }

    transactions.forEach((transaction) => {
        const row = document.createElement("div");
        row.style.cssText =
            "display:flex;justify-content:space-between;align-items:center;" +
            "gap:16px;padding:16px 0;border-bottom:1px solid #e7ebf0;";

        const details = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent =
            transaction.title ||
            transaction.name ||
            transaction.description ||
            transaction.comment ||
            transaction.category_name ||
            transaction.category ||
            "Transaction";

        const date = document.createElement("div");
        date.style.cssText = "color:#667085;font-size:13px;margin-top:6px;";
        date.textContent = transaction.date || transaction.created_at || "";

        details.append(title, date);

        const amount = document.createElement("strong");
        const value = Number(transaction.amount ?? 0);
        const type = String(
            transaction.transaction_type || transaction.type || ""
        ).toLowerCase();

        const isExpense = ["expense", "outcome", "outgoing"].includes(type);
        amount.textContent =
            `${isExpense ? "−" : "+"}${formatUZS(Math.abs(value))}`;
        amount.style.color = isExpense ? "#dc2626" : "#16a34a";

        row.append(details, amount);
        container.append(row);
    });
}

async function loadDashboard() {
    setText("balance", "Loading...");
    setText("income", "Loading...");
    setText("expense", "Loading...");

    const container = document.getElementById("transactions-list");
    if (container) container.textContent = "Loading transactions...";

    try {
        const report = await apiRequest("/reports/?period=month");

        setText("balance", formatUZS(report.balance));
        setText("income", formatUZS(report.total_income));
        setText("expense", formatUZS(report.total_expense));
    } catch (error) {
        setText("balance", "Unavailable");
        setText("income", "Unavailable");
        setText("expense", "Unavailable");

        console.error("Dashboard report error:", error);
    }

    try {
        const transactions = await apiRequest("/transactions/");
        renderTransactions(transactions);
    } catch (error) {
        if (container) {
            container.textContent = "Could not load transactions.";
        }
        console.error("Transactions error:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadDashboard);
