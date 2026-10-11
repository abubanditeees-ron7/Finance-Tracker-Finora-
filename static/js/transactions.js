const API = "/api";
const token = () => localStorage.getItem("access_token");

let accounts = [];
let categories = [];
let transactions = [];
let currentPage = 1;
let totalPages = 1;
let editingId = null;

const $ = (id) => document.getElementById(id);

async function apiRequest(path, options = {}) {
    const headers = {
        Authorization: `Bearer ${token()}`,
        ...(options.body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
        ...options.headers
    };

    console.log("API request:", path);
    const response = await fetch(`${API}${path}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login/";
        throw new Error("Session expired. Please sign in again.");
    }

    console.log("API response:", path, response.status);
    const data = response.status === 204
        ? null
        : await response.json().catch(() => null);

    if (!response.ok) {
        const message = data
            ? Object.entries(data)
                .map(([key, value]) =>
                    `${key}: ${Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : value}`
                )
                .join("\n")
            : `Request failed: ${response.status}`;

        throw new Error(message);
    }

    return data;
}

console.log("API data:");

function listFrom(data) {
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.results) ? data.results : [];
}

function setMessage(element, text, isError = false) {
    element.textContent = text;
    element.className = `message ${isError ? "error" : "success"}`;
}

function formatMoney(value) {
    return `${Number(value).toLocaleString("en-US", {
        maximumFractionDigits: 2
    })} UZS`;
}

function today() {
    const now = new Date();
    const localDate = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 10);
}

function fillSelect(select, items, placeholder, getLabel) {
    select.replaceChildren();

    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    select.append(first);

    items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = getLabel(item);
        select.append(option);
    });
}

function updateCategories() {
    const kind = $("kind").value;
    const currentValue = $("category").value;

    const filtered = categories.filter((category) => category.kind === kind);

    fillSelect(
        $("category"),
        filtered,
        filtered.length ? "Choose a category" : "No categories for this type",
        (category) => category.name
    );

    if (filtered.some((category) => String(category.id) === currentValue)) {
        $("category").value = currentValue;
    }
}

async function loadAccountsAndCategories() {
    accounts = [];
    categories = [];

    try {
        const accountData = await apiRequest("/accounts/?page_size=100");
        accounts = listFrom(accountData);

        fillSelect(
            $("account"),
            accounts,
            accounts.length
                ? "Choose an account"
                : "No accounts yet — create one first",
            (account) => account.name
        );
    } catch (error) {
        $("account").innerHTML =
            '<option value="">Could not load accounts</option>';
        setMessage(
            $("form-message"),
            "Accounts: " + error.message,
            true
        );
        console.error("Accounts API error:", error);
    }

    try {
        const categoryData = await apiRequest("/categories/?page_size=100");
        categories = listFrom(categoryData);
        updateCategories();

        if (!categories.length) {
            $("category").innerHTML =
                '<option value="">No categories yet — create one first</option>';
        }
    } catch (error) {
        $("category").innerHTML =
            '<option value="">Could not load categories</option>';
        setMessage(
            $("form-message"),
            "Categories: " + error.message,
            true
        );
        console.error("Categories API error:", error);
    }
}


function renderTransactions() {
    const body = $("transactions-body");
    body.replaceChildren();

    const filter = $("filter-kind").value;
    const visible = transactions.filter(
        (item) => !filter || item.kind === filter
    );

    $("list-summary").textContent =
        `${visible.length} transaction(s) on this page`;

    if (!visible.length) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "empty";
        cell.textContent = "No transactions found on this page.";
        row.append(cell);
        body.append(row);
    }
    visible.forEach((item) => {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = item.date || "—";

        const kindCell = document.createElement("td");
        kindCell.textContent = item.kind === "income" ? "Income" : "Expense";

        const amountCell = document.createElement("td");
        amountCell.textContent =
            `${item.kind === "expense" ? "-" : "+"}${formatMoney(item.amount)}`;
        amountCell.className = item.kind === "income" ? "income" : "expense";

        const commentCell = document.createElement("td");
        commentCell.textContent = item.comment || "—";

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "actions";

        const editButton = document.createElement("button");
        editButton.className = "secondary small-btn";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => startEdit(item));

        const deleteButton = document.createElement("button");
        deleteButton.className = "danger small-btn";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTransaction(item.id));

        actions.append(editButton, deleteButton);
        actionsCell.append(actions);
        row.append(dateCell, kindCell, amountCell, commentCell, actionsCell);
        body.append(row);
    });

    $("page-label").textContent = `Page ${currentPage} of ${totalPages}`;
    $("previous-button").disabled = currentPage <= 1;
    $("next-button").disabled = currentPage >= totalPages;
}

async function loadTransactions() {
    $("list-message").textContent = "";
    $("transactions-body").innerHTML =
        '<tr><td colspan="5" class="empty">Loading...</td></tr>';

    try {
        const data = await apiRequest(
            `/transactions/?page=${currentPage}&page_size=10`
        );

        transactions = listFrom(data);

        if (data && !Array.isArray(data) && "count" in data) {
            totalPages = Math.max(1, Math.ceil(data.count / 10));
        } else {
            totalPages = 1;
        }

        renderTransactions();
    } catch (error) {
    $("transactions-body").replaceChildren();

    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty";
    cell.textContent = "API error: " + error.message;

    row.append(cell);
    $("transactions-body").append(row);

    setMessage($("list-message"), error.message, true);
    console.error("Transactions error:", error);
    }
}

function startEdit(item) {
    editingId = item.id;
    $("form-title").textContent = "Edit transaction";
    $("save-button").textContent = "Save changes";
    $("cancel-button").hidden = false;

    $("kind").value = item.kind;
    $("amount").value = item.amount;
    $("date").value = item.date;
    $("comment").value = item.comment || "";

    updateCategories();
    $("account").value = String(item.account);
    $("category").value = String(item.category);

    $("form-message").textContent = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
    editingId = null;
    $("transaction-form").reset();
    $("date").value = today();
    $("form-title").textContent = "Add transaction";
    $("save-button").textContent = "Save transaction";
    $("cancel-button").hidden = true;
    $("form-message").textContent = "";
    updateCategories();
}

async function saveTransaction(event) {
    event.preventDefault();
    console.log("Save transaction clicked");

    console.log("Form data:", {
        kind: $("kind").value,
        amount: $("amount").value,
        date: $("date").value,
        account: $("account").value,
        category: $("category").value,
        comment: $("comment").value
    });

    if (!$("account").value || !$("category").value) {
        setMessage(
            $("form-message"),
            "Create an account and a matching category first.",
            true
        );
        return;
    }

    const payload = {
        kind: $("kind").value,
        amount: $("amount").value,
        date: $("date").value,
        account: Number($("account").value),
        category: Number($("category").value),
        comment: $("comment").value.trim()
    };

    $("save-button").disabled = true;
    $("form-message").textContent = "";

    console.log("Sending transaction to API...");
    try {
        if (editingId !== null) {
            await apiRequest(`/transactions/${editingId}/`, {
                method: "PATCH",
                body: JSON.stringify(payload)
            });
            console.log("Transaction created successfully");
            setMessage($("form-message"), "Transaction updated successfully.");
        } else {
            await apiRequest("/transactions/", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setMessage($("form-message"), "Transaction created successfully.");
        }

        resetForm();
        await loadTransactions();
    } catch (error) {
        setMessage($("form-message"), error.message, true);
    } finally {
        $("save-button").disabled = false;
    }
}

async function deleteTransaction(id) {
    if (!window.confirm("Delete this transaction? This action cannot be undone.")) {
        return;
    }

    try {
        await apiRequest(`/transactions/${id}/`, { method: "DELETE" });

        if (transactions.length === 1 && currentPage > 1) {
            currentPage -= 1;
        }

        setMessage($("list-message"), "Transaction deleted.");
        await loadTransactions();
    } catch (error) {
        setMessage($("list-message"), error.message, true);
    }
}

async function init() {
    if (!token()) {
        window.location.href = "/login/";
        return;
    }

    $("date").value = today();

    $("kind").addEventListener("change", updateCategories);
    $("transaction-form").addEventListener("submit", saveTransaction);
    $("cancel-button").addEventListener("click", resetForm);
    $("filter-kind").addEventListener("change", renderTransactions);

    $("previous-button").addEventListener("click", async () => {
        if (currentPage > 1) {
            currentPage -= 1;
            await loadTransactions();
        }
    });

    $("next-button").addEventListener("click", async () => {
        if (currentPage < totalPages) {
            currentPage += 1;
            await loadTransactions();
        }
    });

    $("logout-button").addEventListener("click", () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
    });

    await loadAccountsAndCategories();
    await loadTransactions();
}

document.addEventListener("DOMContentLoaded", init);
