
const API_BASE = "/api";

const $ = (id) => document.getElementById(id);

const t = (key) => window.FinoraI18n
    ? window.FinoraI18n.t(key)
    : key;

function getAccessToken() {
    return localStorage.getItem("access_token");
}

function formatUZS(value) {
    const language = window.FinoraI18n?.getLanguage() || "en";

    const locale = {
        en: "en-US",
        ru: "ru-RU",
        uz: "uz-UZ"
    }[language] || "en-US";

    return `${Number(value ?? 0).toLocaleString(locale, {
        maximumFractionDigits: 2
    })} UZS`;
}

function setText(id, value) {
    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}

async function apiRequest(path) {
    const token = getAccessToken();

    if (!token) {
        window.location.href = "/login/";
        throw new Error(t("sessionExpired"));
    }

    const response = await fetch(`${API_BASE}${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        }
    });

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/login/";
        throw new Error(t("sessionExpired"));
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.detail ||
            data?.message ||
            `${t("apiError")}: ${response.status}`
        );
    }

    return data;
}

function getList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.results)) {
        return data.results;
    }

    if (Array.isArray(data?.transactions)) {
        return data.transactions;
    }

    return [];
}

function renderTransactions(data) {
    const container = $("transactions-list");

    if (!container) return;

    const transactions = getList(data).slice(0, 5);
    container.replaceChildren();

    if (!transactions.length) {
        container.textContent = t("noTransactions");
        return;
    }

    transactions.forEach((transaction) => {
        const row = document.createElement("div");

        row.style.cssText =
            "display:flex;justify-content:space-between;" +
            "align-items:center;gap:16px;padding:16px 0;" +
            "border-bottom:1px solid #e7ebf0;";

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
        date.style.cssText =
            "color:#667085;font-size:13px;margin-top:6px;";
        date.textContent =
            transaction.date || transaction.created_at || "";

        details.append(title, date);

        const amount = document.createElement("strong");
        const value = Number(transaction.amount ?? 0);

        const type = String(
            transaction.kind ||
            transaction.transaction_type ||
            transaction.type ||
            ""
        ).toLowerCase();

        const isExpense = [
            "expense",
            "outcome",
            "outgoing"
        ].includes(type);

        amount.textContent =
            `${isExpense ? "−" : "+"}${formatUZS(Math.abs(value))}`;

        amount.style.color = isExpense ? "#dc2626" : "#16a34a";

        row.append(details, amount);
        container.append(row);
    });
}

async function loadDashboard() {
    setText("balance", t("loading"));
    setText("income", t("loading"));
    setText("expense", t("loading"));

    const container = $("transactions-list");

    if (container) {
        container.textContent = t("loadingTransactions");
    }

    try {
        const report = await apiRequest("/reports/?period=month");

        setText("balance", formatUZS(report.balance));
        setText("income", formatUZS(report.total_income));
        setText("expense", formatUZS(report.total_expense));
    } catch (error) {
        setText("balance", t("apiError"));
        setText("income", t("apiError"));
        setText("expense", t("apiError"));

        console.error("Dashboard report error:", error);
    }

    try {
        const transactions = await apiRequest("/transactions/");
        renderTransactions(transactions);
    } catch (error) {
        if (container) {
            container.textContent = `${t("apiError")}: ${error.message}`;
        }

        console.error("Transactions error:", error);
    }
}

function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
}

async function initDashboard() {
    if (!getAccessToken()) {
        window.location.href = "/login/";
        return;
    }

    if (window.FinoraI18n) {
        await window.FinoraI18n.init();
    }

    const logoutButton = $("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    await loadDashboard();
}

document.addEventListener("DOMContentLoaded", initDashboard);
