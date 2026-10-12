
(() => {
    const $ = (id) => document.getElementById(id);

    let currentLanguage = "en";

    const translations = {
        en: {
            dashboard: "Dashboard",
            transactions: "Transactions",
            accountsCategories: "Accounts & Categories",
            signOut: "Sign out",
            heading: "Financial reports",
            description: "Understand your income, expenses and spending habits.",
            reportingPeriod: "Reporting period",
            today: "Today",
            thisWeek: "This week",
            thisMonth: "This month",
            thisYear: "This year",
            customDates: "Custom dates",
            from: "From",
            to: "To",
            generateReport: "Generate report",
            loading: "Loading...",
            netBalance: "Net balance for period",
            totalIncome: "Total income",
            totalExpenses: "Total expenses",
            reportSummary: "Report summary",
            selectPeriod: "Select a period to begin.",
            incomeByCategory: "Income by category",
            expensesByCategory: "Expenses by category",
            noReportLoaded: "No report loaded yet.",
            selectBothDates: "Please select both dates.",
            invalidDateRange: "The start date must not be later than the end date.",
            reportSuccess: "Report generated successfully.",
            loadReportError: "Could not load the report.",
            noTransactions: "No transactions in this period.",
            percentOfTotal: "% of category total",
            requestFailed: "Request failed",
            apiError: "The server returned an API error.",
            pageTitle: "Financial Reports — Finora"
        },

        ru: {
            dashboard: "Главная",
            transactions: "Транзакции",
            accountsCategories: "Счета и категории",
            signOut: "Выйти",
            heading: "Финансовые отчёты",
            description: "Анализируйте доходы, расходы и свои финансовые привычки.",
            reportingPeriod: "Отчётный период",
            today: "Сегодня",
            thisWeek: "Эта неделя",
            thisMonth: "Этот месяц",
            thisYear: "Этот год",
            customDates: "Произвольный период",
            from: "С",
            to: "По",
            generateReport: "Сформировать отчёт",
            loading: "Загрузка...",
            netBalance: "Баланс за период",
            totalIncome: "Общий доход",
            totalExpenses: "Общие расходы",
            reportSummary: "Сводка отчёта",
            selectPeriod: "Выберите период для начала.",
            incomeByCategory: "Доходы по категориям",
            expensesByCategory: "Расходы по категориям",
            noReportLoaded: "Отчёт ещё не загружен.",
            selectBothDates: "Пожалуйста, выберите обе даты.",
            invalidDateRange: "Начальная дата не может быть позже конечной.",
            reportSuccess: "Отчёт успешно сформирован.",
            loadReportError: "Не удалось загрузить отчёт.",
            noTransactions: "За этот период транзакций нет.",
            percentOfTotal: "% от общей суммы категории",
            requestFailed: "Ошибка запроса",
            apiError: "Сервер вернул ошибку API.",
            pageTitle: "Финансовые отчёты — Finora"
        },

        uz: {
            dashboard: "Bosh sahifa",
            transactions: "Tranzaksiyalar",
            accountsCategories: "Hisoblar va kategoriyalar",
            signOut: "Chiqish",
            heading: "Moliyaviy hisobotlar",
            description: "Daromadlar, xarajatlar va moliyaviy odatlaringizni tahlil qiling.",
            reportingPeriod: "Hisobot davri",
            today: "Bugun",
            thisWeek: "Bu hafta",
            thisMonth: "Bu oy",
            thisYear: "Bu yil",
            customDates: "Boshqa davr",
            from: "Dan",
            to: "Gacha",
            generateReport: "Hisobot tuzish",
            loading: "Yuklanmoqda...",
            netBalance: "Davr uchun sof balans",
            totalIncome: "Umumiy daromad",
            totalExpenses: "Umumiy xarajatlar",
            reportSummary: "Hisobot xulosasi",
            selectPeriod: "Boshlash uchun davrni tanlang.",
            incomeByCategory: "Kategoriyalar bo‘yicha daromad",
            expensesByCategory: "Kategoriyalar bo‘yicha xarajatlar",
            noReportLoaded: "Hisobot hali yuklanmagan.",
            selectBothDates: "Iltimos, ikkala sanani ham tanlang.",
            invalidDateRange: "Boshlanish sanasi tugash sanasidan keyin bo‘lishi mumkin emas.",
            reportSuccess: "Hisobot muvaffaqiyatli tuzildi.",
            loadReportError: "Hisobotni yuklab bo‘lmadi.",
            noTransactions: "Bu davrda tranzaksiyalar mavjud emas.",
            percentOfTotal: "% — kategoriya umumiy summasidan",
            requestFailed: "So‘rov xatosi",
            apiError: "Server API xatosini qaytardi.",
            pageTitle: "Moliyaviy hisobotlar — Finora"
        }
    };

    function t(key) {
        return translations[currentLanguage]?.[key]
            ?? translations.en[key]
            ?? key;
    }

    function translatePage() {
        document.documentElement.lang = currentLanguage;

        document.querySelectorAll("[data-report-i18n]").forEach((element) => {
            const key = element.dataset.reportI18n;
            if (translations[currentLanguage][key]) {
                element.textContent = t(key);
            }
        });

        document.title = t("pageTitle");
    }

    async function loadLanguage() {
        const token = localStorage.getItem("access_token");

        if (!token) {
            translatePage();
            return;
        }

        try {
            const response = await fetch("/api/auth/profile/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login/";
                return;
            }

            if (response.ok) {
                const profile = await response.json();

                if (["en", "ru", "uz"].includes(profile.language)) {
                    currentLanguage = profile.language;
                }
            }
        } catch (error) {
            console.error("Could not load language preference:", error);
        }

        translatePage();
    }

    function formatMoney(value) {
        const locale = {
            en: "en-US",
            ru: "ru-RU",
            uz: "uz-UZ"
        }[currentLanguage] || "en-US";

        return `${Number(value || 0).toLocaleString(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} UZS`;
    }

    function showMessage(message, isError = false) {
        const element = $("report-message");
        element.textContent = message;
        element.className = `message ${isError ? "error" : "success"}`;
    }

    async function loadReport() {
        const token = localStorage.getItem("access_token");

        if (!token) {
            window.location.href = "/login/";
            return;
        }

        const period = $("period").value;
        const params = new URLSearchParams({ period });

        if (period === "custom") {
            const dateFrom = $("date-from").value;
            const dateTo = $("date-to").value;

            if (!dateFrom || !dateTo) {
                showMessage(t("selectBothDates"), true);
                return;
            }

            if (dateFrom > dateTo) {
                showMessage(t("invalidDateRange"), true);
                return;
            }

            params.set("date_from", dateFrom);
            params.set("date_to", dateTo);
        }

        const button = $("report-submit");
        button.disabled = true;
        button.textContent = t("loading");
        showMessage("");

        try {
            const response = await fetch(`/api/reports/?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json"
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login/";
                return;
            }

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                console.error("Report API error:", data);
                throw new Error(`${t("apiError")} (${response.status})`);
            }

            $("report-balance").textContent = formatMoney(data.balance);
            $("report-income").textContent = formatMoney(data.total_income);
            $("report-expense").textContent = formatMoney(data.total_expense);

            $("report-period-title").textContent = t("reportSummary");
            $("report-dates").textContent =
                `${data.date_from} — ${data.date_to} · ${data.currency}`;

            renderCategories("income-categories", data.income_by_category);
            renderCategories("expense-categories", data.expense_by_category);

            showMessage(t("reportSuccess"));
        } catch (error) {
            console.error("Could not load report:", error);
            showMessage(
                error.message || t("loadReportError"),
                true
            );
        } finally {
            button.disabled = false;
            button.textContent = t("generateReport");
        }
    }

    function renderCategories(containerId, categories) {
        const container = $(containerId);
        container.replaceChildren();

        if (!Array.isArray(categories) || categories.length === 0) {
            container.className = "empty";
            container.textContent = t("noTransactions");
            return;
        }

        container.className = "";

        categories.forEach((category) => {
            const row = document.createElement("div");
            row.className = "category-row";

            const heading = document.createElement("div");
            heading.className = "category-heading";

            const name = document.createElement("span");
            name.className = "category-name";
            name.textContent = category.category_name;

            const amount = document.createElement("strong");
            amount.textContent = formatMoney(category.total);

            heading.append(name, amount);

            const bar = document.createElement("div");
            bar.className = "bar";

            const fill = document.createElement("div");
            fill.className = "bar-fill";

            const percentage = Math.min(
                100,
                Math.max(0, Number(category.percentage) || 0)
            );

            fill.style.width = `${percentage}%`;

            const color = /^#[0-9a-fA-F]{6}$/.test(category.color || "")
                ? category.color
                : "#2563eb";

            fill.style.backgroundColor = color;
            bar.append(fill);

            const detail = document.createElement("div");
            detail.className = "muted";
            detail.style.cssText = "font-size:12px;margin-top:6px;";
            detail.textContent =
                `${percentage.toFixed(2)}${t("percentOfTotal")}`;

            row.append(heading, bar, detail);
            container.append(row);
        });
    }

    function updateDateFields() {
        $("date-fields").hidden = $("period").value !== "custom";
    }

    async function initReports() {
        $("period").addEventListener("change", updateDateFields);

        $("report-form").addEventListener("submit", (event) => {
            event.preventDefault();
            loadReport();
        });

        $("logout-button").addEventListener("click", () => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/";
        });

        await loadLanguage();

        updateDateFields();
        await loadReport();
    }

    document.addEventListener("DOMContentLoaded", initReports);
})();
