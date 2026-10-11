
const $ = (id) => document.getElementById(id);

function formatMoney(value) {
    return `${Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} UZS`;
}

function showMessage(text, isError = false) {
    const element = $("report-message");
    element.textContent = text;
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
            showMessage("Please select both dates.", true);
            return;
        }

        if (dateFrom > dateTo) {
            showMessage("The start date must not be later than the end date.", true);
            return;
        }

        params.set("date_from", dateFrom);
        params.set("date_to", dateTo);
    }

    const button = $("report-submit");
    button.disabled = true;
    button.textContent = "Loading...";
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
            const details = data && typeof data === "object"
                ? Object.entries(data)
                    .map(([key, value]) =>
                        `${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`
                    )
                    .join("\n")
                : `Request failed (${response.status}).`;

            throw new Error(details);
        }

        $("report-balance").textContent = formatMoney(data.balance);
        $("report-income").textContent = formatMoney(data.total_income);
        $("report-expense").textContent = formatMoney(data.total_expense);

        $("report-period-title").textContent = "Report summary";
        $("report-dates").textContent =
            `${data.date_from} — ${data.date_to} · ${data.currency}`;

        renderCategories("income-categories", data.income_by_category);
        renderCategories("expense-categories", data.expense_by_category);

        showMessage("Report generated successfully.");
    } catch (error) {
        showMessage(error.message || "Could not load the report.", true);
    } finally {
        button.disabled = false;
        button.textContent = "Generate report";
    }
}

function renderCategories(containerId, categories) {
    const container = $(containerId);
    container.replaceChildren();

    if (!Array.isArray(categories) || categories.length === 0) {
        container.className = "empty";
        container.textContent = "No transactions in this period.";
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
        detail.textContent = `${percentage.toFixed(2)}% of category total`;

        row.append(heading, bar, detail);
        container.append(row);
    });
}

function updateDateFields() {
    $("date-fields").hidden = $("period").value !== "custom";
}

function initReports() {
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

    updateDateFields();
    loadReport();
}

document.addEventListener("DOMContentLoaded", initReports);
