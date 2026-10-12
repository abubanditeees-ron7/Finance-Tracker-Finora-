
(() => {
    const translations = {
        en: {
            transactions: "Transactions",
            reports: "Financial reports",
            settings: "Settings",
            signOut: "Sign out",
            dashboard: "Dashboard",
            expense: "Expense",
            income: "Income",
            saveChanges: "Save changes",
            loadingAccounts: "Loading accounts...",
            loadAccountsError: "Could not load accounts",
            loadCategoriesError: "Could not load categories",
            edit: "Edit",
            delete: "Delete",
            sessionExpired: "Session expired. Please sign in again.",
            requestFailed: "Request failed",
            manageHeading: "Accounts & Categories",
            manageDescription: "Manage the accounts and categories used in your transactions.",
            accountsTab: "Accounts",
            categoriesTab: "Categories",
            addAccount: "Add account",
            editAccount: "Edit account",
            accountName: "Account name",
            accountNamePlaceholder: "My wallet",
            accountType: "Account type",
            cash: "Cash",
            bankCard: "Bank card",
            bankAccount: "Bank account",
            other: "Other",
            bankNameOptional: "Bank name (optional)",
            cardLabelOptional: "Card label or last 4 digits (optional)",
            cardReferencePlaceholder: "Enter a label or last 4 digits only",
            cardSecurityNote: "Do not enter a full card number, PIN, CVV, or other sensitive card details.",
            color: "Color",
            saveAccount: "Save account",
            saveCategory: "Save category",
            cancel: "Cancel",
            yourAccounts: "Your accounts",
            noAccountsYet: "No accounts yet. Add your first account.",
            addCategory: "Add category",
            editCategory: "Edit category",
            categoryName: "Category name",
            categoryNamePlaceholder: "Food, Salary...",
            categoryType: "Category type",
            yourCategories: "Your categories",
            loadingCategories: "Loading categories...",
            noCategoriesYet: "No categories yet. Add your first category.",
            accountCreated: "Account created successfully.",
            accountUpdated: "Account updated successfully.",
            categoryCreated: "Category created successfully.",
            categoryUpdated: "Category updated successfully.",
            accountDeleted: "Account deleted.",
            categoryDeleted: "Category deleted.",
            deleteAccountConfirm: "Delete this account? Accounts used by transactions cannot be deleted.",
            deleteCategoryConfirm: "Delete this category? Categories used by transactions cannot be deleted."
        },

        ru: {
            transactions: "Транзакции",
            reports: "Финансовые отчёты",
            settings: "Настройки",
            signOut: "Выйти",
            dashboard: "Панель управления",
            expense: "Расход",
            income: "Доход",
            saveChanges: "Сохранить изменения",
            loadingAccounts: "Загрузка счетов...",
            loadAccountsError: "Не удалось загрузить счета",
            loadCategoriesError: "Не удалось загрузить категории",
            edit: "Изменить",
            delete: "Удалить",
            sessionExpired: "Сессия истекла. Войдите в аккаунт снова.",
            requestFailed: "Ошибка запроса",
            manageHeading: "Счета и категории",
            manageDescription: "Управляйте счетами и категориями для транзакций.",
            accountsTab: "Счета",
            categoriesTab: "Категории",
            addAccount: "Добавить счёт",
            editAccount: "Редактировать счёт",
            accountName: "Название счёта",
            accountNamePlaceholder: "Мой кошелёк",
            accountType: "Тип счёта",
            cash: "Наличные",
            bankCard: "Банковская карта",
            bankAccount: "Банковский счёт",
            other: "Другое",
            bankNameOptional: "Название банка (необязательно)",
            cardLabelOptional: "Метка карты или последние 4 цифры (необязательно)",
            cardReferencePlaceholder: "Укажите метку или только последние 4 цифры",
            cardSecurityNote: "Не вводите полный номер карты, PIN, CVV или другие конфиденциальные данные карты.",
            color: "Цвет",
            saveAccount: "Сохранить счёт",
            saveCategory: "Сохранить категорию",
            cancel: "Отмена",
            yourAccounts: "Ваши счета",
            noAccountsYet: "Счетов пока нет. Добавьте первый счёт.",
            addCategory: "Добавить категорию",
            editCategory: "Редактировать категорию",
            categoryName: "Название категории",
            categoryNamePlaceholder: "Продукты, зарплата...",
            categoryType: "Тип категории",
            yourCategories: "Ваши категории",
            loadingCategories: "Загрузка категорий...",
            noCategoriesYet: "Категорий пока нет. Добавьте первую категорию.",
            accountCreated: "Счёт успешно создан.",
            accountUpdated: "Счёт успешно обновлён.",
            categoryCreated: "Категория успешно создана.",
            categoryUpdated: "Категория успешно обновлена.",
            accountDeleted: "Счёт удалён.",
            categoryDeleted: "Категория удалена.",
            deleteAccountConfirm: "Удалить этот счёт? Счета, используемые в транзакциях, удалить нельзя.",
            deleteCategoryConfirm: "Удалить эту категорию? Категории, используемые в транзакциях, удалить нельзя."
        },

        uz: {
            transactions: "Tranzaksiyalar",
            reports: "Moliyaviy hisobotlar",
            settings: "Sozlamalar",
            signOut: "Chiqish",
            dashboard: "Boshqaruv paneli",
            expense: "Xarajat",
            income: "Daromad",
            saveChanges: "O‘zgarishlarni saqlash",
            loadingAccounts: "Hisoblar yuklanmoqda...",
            loadAccountsError: "Hisoblarni yuklab bo‘lmadi",
            loadCategoriesError: "Kategoriyalarni yuklab bo‘lmadi",
            edit: "Tahrirlash",
            delete: "O‘chirish",
            sessionExpired: "Sessiya tugadi. Qaytadan tizimga kiring.",
            requestFailed: "So‘rov bajarilmadi",
            manageHeading: "Hisoblar va kategoriyalar",
            manageDescription: "Tranzaksiyalarda ishlatiladigan hisob va kategoriyalarni boshqaring.",
            accountsTab: "Hisoblar",
            categoriesTab: "Kategoriyalar",
            addAccount: "Hisob qo‘shish",
            editAccount: "Hisobni tahrirlash",
            accountName: "Hisob nomi",
            accountNamePlaceholder: "Mening hamyonim",
            accountType: "Hisob turi",
            cash: "Naqd pul",
            bankCard: "Bank kartasi",
            bankAccount: "Bank hisobi",
            other: "Boshqa",
            bankNameOptional: "Bank nomi (ixtiyoriy)",
            cardLabelOptional: "Karta belgisi yoki oxirgi 4 raqam (ixtiyoriy)",
            cardReferencePlaceholder: "Belgi yoki faqat oxirgi 4 raqamni kiriting",
            cardSecurityNote: "To‘liq karta raqami, PIN, CVV yoki boshqa maxfiy karta ma’lumotlarini kiritmang.",
            color: "Rang",
            saveAccount: "Hisobni saqlash",
            saveCategory: "Kategoriyani saqlash",
            cancel: "Bekor qilish",
            yourAccounts: "Hisoblaringiz",
            noAccountsYet: "Hozircha hisoblar yo‘q. Birinchi hisobni qo‘shing.",
            addCategory: "Kategoriya qo‘shish",
            editCategory: "Kategoriyani tahrirlash",
            categoryName: "Kategoriya nomi",
            categoryNamePlaceholder: "Oziq-ovqat, maosh...",
            categoryType: "Kategoriya turi",
            yourCategories: "Kategoriyalaringiz",
            loadingCategories: "Kategoriyalar yuklanmoqda...",
            noCategoriesYet: "Hozircha kategoriyalar yo‘q. Birinchi kategoriyani qo‘shing.",
            accountCreated: "Hisob muvaffaqiyatli yaratildi.",
            accountUpdated: "Hisob muvaffaqiyatli yangilandi.",
            categoryCreated: "Kategoriya muvaffaqiyatli yaratildi.",
            categoryUpdated: "Kategoriya muvaffaqiyatli yangilandi.",
            accountDeleted: "Hisob o‘chirildi.",
            categoryDeleted: "Kategoriya o‘chirildi.",
            deleteAccountConfirm: "Bu hisob o‘chirilsinmi? Tranzaksiyalarda ishlatilayotgan hisoblarni o‘chirib bo‘lmaydi.",
            deleteCategoryConfirm: "Bu kategoriya o‘chirilsinmi? Tranzaksiyalarda ishlatilayotgan kategoriyalarni o‘chirib bo‘lmaydi."
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

const API = "/api";
const $ = (id) => document.getElementById(id);

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
                `${key}: ${Array.isArray(value)
                    ? value.join(", ")
                    : typeof value === "object"
                        ? JSON.stringify(value)
                        : value}`
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

    if (!element) return;

    element.textContent = text;
    element.className = `message ${isError ? "error" : "success"}`;
}

function clearMessage(id) {
    const element = $(id);

    if (element) {
        element.textContent = "";
    }
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

    if (!container) return;

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
        console.error("Could not load accounts:", error);
    }
}

async function loadCategories() {
    const container = $("categories-list");

    if (!container) return;

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
        console.error("Could not load categories:", error);
    }
}

function resetAccountForm() {
    editingAccountId = null;

    const form = $("account-form");
    if (form) form.reset();

    if ($("account-color")) $("account-color").value = "#0D9488";
    if ($("account-form-title")) $("account-form-title").textContent = t("addAccount");
    if ($("account-save")) $("account-save").textContent = t("saveAccount");
    if ($("account-cancel")) $("account-cancel").hidden = true;

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
        console.error("Could not save account:", error);
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
        console.error("Could not delete account:", error);
    }
}

function resetCategoryForm() {
    editingCategoryId = null;

    const form = $("category-form");
    if (form) form.reset();

    if ($("category-color")) $("category-color").value = "#4F46E5";
    if ($("category-form-title")) $("category-form-title").textContent = t("addCategory");
    if ($("category-save")) $("category-save").textContent = t("saveCategory");
    if ($("category-cancel")) $("category-cancel").hidden = true;

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
        console.error("Could not save category:", error);
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
        console.error("Could not delete category:", error);
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

            if ($("accounts-panel")) {
                $("accounts-panel").hidden =
                    button.dataset.panel !== "accounts-panel";
            }

            if ($("categories-panel")) {
                $("categories-panel").hidden =
                    button.dataset.panel !== "categories-panel";
            }
        });
    });
}

async function init() {
    if (!getToken()) {
        window.location.href = "/login/";
        return;
    }

    await window.FinoraPageI18n.initLanguage();

    const accountForm = $("account-form");
    const categoryForm = $("category-form");
    const accountCancel = $("account-cancel");
    const categoryCancel = $("category-cancel");

    if (accountForm) {
        accountForm.addEventListener("submit", saveAccount);
    }

    if (categoryForm) {
        categoryForm.addEventListener("submit", saveCategory);
    }

    if (accountCancel) {
        accountCancel.addEventListener("click", resetAccountForm);
    }

    if (categoryCancel) {
        categoryCancel.addEventListener("click", resetCategoryForm);
    }

    // The logout button is optional on this page.
    // If it exists, attach the handler; otherwise continue normally.
    const logoutButton = $("logout-button");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/";
        });
    }

    setupTabs();

    await Promise.all([
        loadAccounts(),
        loadCategories()
    ]);
}

document.addEventListener("DOMContentLoaded", init);
