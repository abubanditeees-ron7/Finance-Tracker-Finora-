
const API = "/api";
const $ = (id) => document.getElementById(id);
const t = (key) => window.FinoraI18n?.t(key) ?? key;

let accounts = [];
let categories = [];
let editingAccountId = null;
let editingCategoryId = null;

function getToken() {
    return localStorage.getItem("access_token");
}

async function apiRequest(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login/";
        throw new Error(t("sessionExpired"));
    }

    const data = response.status === 204
        ? null
        : await response.json().catch(() => null);

    if (!response.ok) {
        const message = data && typeof data === "object"
            ? Object.entries(data).map(([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : value}`
            ).join("\n")
            : `${t("requestFailed")} (${response.status})`;

        throw new Error(message);
    }

    return data;
}

function listFrom(data) {
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.results) ? data.results : [];
}

function showMessage(id, text, isError = false) {
    const element = $(id);
    element.textContent = text;
    element.className = `message ${isError ? "error" : "success"}`;
}

function clearMessage(id) {
    $(id).textContent = "";
}

function createButton(text, className, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `btn small ${className}`;
    button.textContent = text;
    button.addEventListener("click", onClick);
    return button;
}

function addItem(container, title, subtitle, editHandler, deleteHandler, color) {
    const row = document.createElement("div");
    row.className = "item";

    const info = document.createElement("div");
    info.className = "item-info";

    const heading = document.createElement("div");
    heading.className = "item-title";
    heading.textContent = title;

    if (color) {
        const dot = document.createElement("span");
        dot.style.cssText =
            `display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:9px;`;
        heading.prepend(dot);
    }

    const details = document.createElement("div");
    details.className = "item-sub";
    details.textContent = subtitle;

    info.append(heading, details);

    const actions = document.createElement("div");
    actions.className = "item-actions";
    actions.append(
        createButton(t("edit"), "secondary", editHandler),
        createButton(t("delete"), "danger", deleteHandler)
    );

    row.append(info, actions);
    container.append(row);
}

async function loadAccounts() {
    const container = $("accounts-list");
    container.textContent = t("loadingAccounts");

    try {
        const data = await apiRequest("/accounts/?page_size=100");
        accounts = listFrom(data);
        container.replaceChildren();

        if (!accounts.length) {
            container.textContent = t("noAccountsYet");
            container.className = "empty";
            return;
        }

        container.className = "";

        const typeLabels = {
            cash: "cash",
            card: "bankCard",
            bank: "bankAccount",
            other: "other"
        };

        accounts.forEach((account) => {
            const subtitle = [
                t(typeLabels[account.account_type] || "other"),
                account.bank_name,
                account.masked_card_number
                    ? `•••• ${account.masked_card_number.slice(-4)}`
                    : ""
            ].filter(Boolean).join(" · ");

            addItem(
                container,
                account.name,
                subtitle,
                () => editAccount(account),
                () => deleteAccount(account.id),
                account.color
            );
        });
    } catch (error) {
        container.textContent = t("loadAccountsError");
        showMessage("account-message", error.message, true);
    }
}

async function loadCategories() {
    const container = $("categories-list");
    container.textContent = t("loadingCategories");

    try {
        const data = await apiRequest("/categories/?page_size=100");
        categories = listFrom(data);
        container.replaceChildren();

        if (!categories.length) {
            container.textContent = t("noCategoriesYet");
            container.className = "empty";
            return;
        }

        container.className = "";

        categories.forEach((category) => {
            addItem(
                container,
                category.name,
                t(category.kind === "income" ? "income" : "expense"),
                () => editCategory(category),
                () => deleteCategory(category.id),
                category.color
            );
        });
    } catch (error) {
        container.textContent = t("loadCategoriesError");
        showMessage("category-message", error.message, true);
    }
}

function resetAccountForm() {
    editingAccountId = null;
    $("account-form").reset();
    $("account-color").value = "#0D9488";
    $("account-form-title").textContent = t("addAccount");
    $("account-save").textContent = t("saveAccount");
    $("account-cancel").hidden = true;
    clearMessage("account-message");
}

function editAccount(account) {
    editingAccountId = account.id;
    $("account-form-title").textContent = t("editAccount");
    $("account-save").textContent = t("saveChanges");
    $("account-cancel").hidden = false;

    $("account-name").value = account.name;
    $("account-type").value = account.account_type;
    $("bank-name").value = account.bank_name || "";
    $("account-color").value = account.color || "#0D9488";
    $("card-number").value = "";

    clearMessage("account-message");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveAccount(event) {
    event.preventDefault();
    clearMessage("account-message");

    const payload = {
        name: $("account-name").value.trim(),
        account_type: $("account-type").value,
        bank_name: $("bank-name").value.trim(),
        color: $("account-color").value
    };

    const cardNumber = $("card-number").value.trim();

    if (cardNumber) {
        payload.card_number = cardNumber;
    } else if (editingAccountId === null) {
        payload.card_number = "";
    }

    const editing = editingAccountId !== null;
    const url = editing ? `/accounts/${editingAccountId}/` : "/accounts/";

    $("account-save").disabled = true;

    try {
        await apiRequest(url, {
            method: editing ? "PATCH" : "POST",
            body: JSON.stringify(payload)
        });

        showMessage(
            "account-message",
            t(editing ? "accountUpdated" : "accountCreated")
        );

        resetAccountForm();
        await loadAccounts();
    } catch (error) {
        showMessage("account-message", error.message, true);
    } finally {
        $("account-save").disabled = false;
    }
}

async function deleteAccount(id) {
    if (!confirm(t("deleteAccountConfirm"))) return;

    try {
        await apiRequest(`/accounts/${id}/`, { method: "DELETE" });
        showMessage("account-message", t("accountDeleted"));
        await loadAccounts();
    } catch (error) {
        showMessage("account-message", error.message, true);
    }
}

function resetCategoryForm() {
    editingCategoryId = null;
    $("category-form").reset();
    $("category-color").value = "#4F46E5";
    $("category-form-title").textContent = t("addCategory");
    $("category-save").textContent = t("saveCategory");
    $("category-cancel").hidden = true;
    clearMessage("category-message");
}

function editCategory(category) {
    editingCategoryId = category.id;
    $("category-form-title").textContent = t("editCategory");
    $("category-save").textContent = t("saveChanges");
    $("category-cancel").hidden = false;

    $("category-name").value = category.name;
    $("category-kind").value = category.kind;
    $("category-color").value = category.color || "#4F46E5";

    clearMessage("category-message");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveCategory(event) {
    event.preventDefault();
    clearMessage("category-message");

    const payload = {
        name: $("category-name").value.trim(),
        kind: $("category-kind").value,
        color: $("category-color").value
    };

    const editing = editingCategoryId !== null;
    const url = editing ? `/categories/${editingCategoryId}/` : "/categories/";

    $("category-save").disabled = true;

    try {
        await apiRequest(url, {
            method: editing ? "PATCH" : "POST",
            body: JSON.stringify(payload)
        });

        showMessage(
            "category-message",
            t(editing ? "categoryUpdated" : "categoryCreated")
        );

        resetCategoryForm();
        await loadCategories();
    } catch (error) {
        showMessage("category-message", error.message, true);
    } finally {
        $("category-save").disabled = false;
    }
}

async function deleteCategory(id) {
    if (!confirm(t("deleteCategoryConfirm"))) return;

    try {
        await apiRequest(`/categories/${id}/`, { method: "DELETE" });
        showMessage("category-message", t("categoryDeleted"));
        await loadCategories();
    } catch (error) {
        showMessage("category-message", error.message, true);
    }
}

function setupTabs() {
    document.querySelectorAll(".tab").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach((tab) => {
                tab.classList.remove("active");
                tab.classList.add("secondary");
            });

            button.classList.add("active");
            button.classList.remove("secondary");

            $("accounts-panel").hidden =
                button.dataset.panel !== "accounts-panel";
            $("categories-panel").hidden =
                button.dataset.panel !== "categories-panel";
        });
    });
}

async function init() {
    if (!getToken()) {
        window.location.href = "/login/";
        return;
    }

    await window.FinoraI18n?.init();

    $("account-form").addEventListener("submit", saveAccount);
    $("category-form").addEventListener("submit", saveCategory);
    $("account-cancel").addEventListener("click", resetAccountForm);
    $("category-cancel").addEventListener("click", resetCategoryForm);

    $("logout-button").addEventListener("click", () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
    });

    setupTabs();

    await Promise.all([loadAccounts(), loadCategories()]);
}

document.addEventListener("DOMContentLoaded", init);
