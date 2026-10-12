(() => {
    const translations = {
    "en": {
        "dashboardTitle": "Personal Finance Dashboard",
        "dashboardDescription": "Track your money. Understand your spending. Plan ahead.",
        "totalBalance": "Total balance",
        "totalIncome": "Total income",
        "totalExpenses": "Total expenses",
        "recentTransactions": "Recent transactions",
        "latestTransactions": "Your latest income and expenses",
        "manageApi": "Manage via API",
        "loadingTransactions": "Loading transactions...",
        "noTransactions": "No transactions yet. Add your first transaction through the API.",
        "apiDocumentation": "API and documentation",
        "apiDescription": "Backend documentation and API testing.",
        "openSwagger": "Open Swagger",
        "transactions": "Transactions",
        "reports": "Financial reports",
        "accountsCategories": "Accounts & Categories",
        "settings": "Settings",
        "signedIn": "Signed in",
        "signOut": "Sign out",
        "sessionExpired": "Session expired. Please sign in again.",
        "apiError": "API error",
        "loading": "Loading..."
    },
    "ru": {
        "dashboardTitle": "Панель личных финансов",
        "dashboardDescription": "Следите за деньгами, анализируйте расходы и планируйте бюджет.",
        "totalBalance": "Общий баланс",
        "totalIncome": "Общий доход",
        "totalExpenses": "Общие расходы",
        "recentTransactions": "Последние транзакции",
        "latestTransactions": "Ваши последние доходы и расходы",
        "manageApi": "Управление через API",
        "loadingTransactions": "Загрузка транзакций...",
        "noTransactions": "Транзакций пока нет. Добавьте первую через API.",
        "apiDocumentation": "API и документация",
        "apiDescription": "Документация backend и тестирование API.",
        "openSwagger": "Открыть Swagger",
        "transactions": "Транзакции",
        "reports": "Финансовые отчёты",
        "accountsCategories": "Счета и категории",
        "settings": "Настройки",
        "signedIn": "Вы вошли в аккаунт",
        "signOut": "Выйти",
        "sessionExpired": "Сессия истекла. Войдите в аккаунт снова.",
        "apiError": "Ошибка API",
        "loading": "Загрузка..."
    },
    "uz": {
        "dashboardTitle": "Shaxsiy moliya paneli",
        "dashboardDescription": "Pul mablag‘laringizni kuzating, xarajatlarni tahlil qiling va reja tuzing.",
        "totalBalance": "Umumiy balans",
        "totalIncome": "Umumiy daromad",
        "totalExpenses": "Umumiy xarajatlar",
        "recentTransactions": "Oxirgi tranzaksiyalar",
        "latestTransactions": "Oxirgi daromad va xarajatlaringiz",
        "manageApi": "API orqali boshqarish",
        "loadingTransactions": "Tranzaksiyalar yuklanmoqda...",
        "noTransactions": "Hozircha tranzaksiyalar yo‘q. Birinchi tranzaksiyani API orqali qo‘shing.",
        "apiDocumentation": "API va hujjatlar",
        "apiDescription": "Backend hujjatlari va API sinovlari.",
        "openSwagger": "Swagger-ni ochish",
        "transactions": "Tranzaksiyalar",
        "reports": "Moliyaviy hisobotlar",
        "accountsCategories": "Hisoblar va kategoriyalar",
        "settings": "Sozlamalar",
        "signedIn": "Tizimga kirilgan",
        "signOut": "Chiqish",
        "sessionExpired": "Sessiya tugadi. Qaytadan tizimga kiring.",
        "apiError": "API xatosi",
        "loading": "Yuklanmoqda..."
    }
};
    let currentLanguage = localStorage.getItem("finora_language") || "en";

    if (!translations[currentLanguage]) {
        currentLanguage = "en";
    }

    function t(key) {
        return translations[currentLanguage]?.[key]
            ?? translations.en[key]
            ?? key;
    }

    function translateDOM(root = document) {
        document.documentElement.lang = currentLanguage;

        root.querySelectorAll("[data-i18n]").forEach((element) => {
            element.textContent = t(element.dataset.i18n);
        });

        root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        });

        root.querySelectorAll("[data-i18n-title]").forEach((element) => {
            element.title = t(element.dataset.i18nTitle);
        });

        root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
        });
    }

    async function initLanguage() {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            try {
                const response = await fetch("/api/auth/profile/", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: "application/json"
                    }
                });

                if (response.ok) {
                    const profile = await response.json();

                    if (["en", "ru", "uz"].includes(profile.language)) {
                        currentLanguage = profile.language;
                        localStorage.setItem("finora_language", currentLanguage);
                    }
                }
            } catch (error) {
                console.error("Could not load language preference:", error);
            }
        }

        translateDOM();
        return currentLanguage;
    }

    window.FinoraPageI18n = {
        t,
        initLanguage,
        translateDOM,
        getLanguage: () => currentLanguage
    };
})();

const t = (key) => window.FinoraPageI18n.t(key);

const API_BASE = "/api";

const $ = (id) => document.getElementById(id);


function getAccessToken() {
    return localStorage.getItem("access_token");
}

function formatUZS(value) {
    const language = window.FinoraPageI18n?.getLanguage() || "en";

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
    setText("balance", "—");
    setText("income", "—");
    setText("expense", "—");

    const container = $("transactions-list");

    if (container) {
        container.textContent = t("loadingTransactions");
    }

    try {
        const transactions = await apiRequest("/transactions/");
        const list = getList(transactions);

        renderTransactions(transactions);

        // Если транзакций нет, оставляем прочерк
        // и не запрашиваем отчёт для пустого списка.
        if (list.length === 0) {
            setText("balance", "—");
            setText("income", "—");
            setText("expense", "—");
            return;
        }

        const report = await apiRequest("/reports/?period=month");

        setText("balance", formatUZS(report.balance));
        setText("income", formatUZS(report.total_income));
        setText("expense", formatUZS(report.total_expense));
    } catch (error) {
        console.error("Dashboard loading error:", error);

        // Не показываем «Ошибка API» в финансовых карточках.
        // Ошибка остаётся в консоли для диагностики.
        setText("balance", "—");
        setText("income", "—");
        setText("expense", "—");

        if (container && container.textContent === t("loadingTransactions")) {
            container.textContent = t("noTransactions");
        }
    }
}


async function initDashboard() {
    if (!getAccessToken()) {
        window.location.href = "/login/";
        return;
    }

    await window.FinoraPageI18n.initLanguage();

    await loadDashboard();
}

document.addEventListener("DOMContentLoaded", initDashboard);
