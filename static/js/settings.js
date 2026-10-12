
const $ = (id) => document.getElementById(id);

const translations = {
    en: {
        title: "Settings",
        description: "Manage your account preferences.",
        profile: "Your profile",
        username: "Username:",
        email: "Email:",
        language: "Interface language",
        help: "Choose the language you prefer to use on Finora.",
        save: "Save settings",
        saving: "Saving...",
        success: "Language settings saved.",
        failed: "Could not save settings.",
        dashboard: "Dashboard",
        logout: "Sign out",
        loading: "Loading...",
        loadFailed: "Could not load your profile.",
        sessionExpired: "Your session has expired. Please sign in again."
    },

    ru: {
        title: "Настройки",
        description: "Управляйте настройками своего аккаунта.",
        profile: "Ваш профиль",
        username: "Имя пользователя:",
        email: "Электронная почта:",
        language: "Язык интерфейса",
        help: "Выберите удобный язык Finora.",
        save: "Сохранить настройки",
        saving: "Сохранение...",
        success: "Язык успешно сохранён.",
        failed: "Не удалось сохранить настройки.",
        dashboard: "Главная панель",
        logout: "Выйти",
        loading: "Загрузка...",
        loadFailed: "Не удалось загрузить профиль.",
        sessionExpired: "Сессия истекла. Войдите в аккаунт снова."
    },

    uz: {
        title: "Sozlamalar",
        description: "Hisob sozlamalarini boshqaring.",
        profile: "Profilingiz",
        username: "Foydalanuvchi nomi:",
        email: "Elektron pochta:",
        language: "Interfeys tili",
        help: "Finora uchun o‘zingizga qulay tilni tanlang.",
        save: "Sozlamalarni saqlash",
        saving: "Saqlanmoqda...",
        success: "Til sozlamalari saqlandi.",
        failed: "Sozlamalarni saqlab bo‘lmadi.",
        dashboard: "Boshqaruv paneli",
        logout: "Chiqish",
        loading: "Yuklanmoqda...",
        loadFailed: "Profilni yuklab bo‘lmadi.",
        sessionExpired: "Sessiya tugadi. Qaytadan tizimga kiring."
    }
};

let currentLanguage = "en";
let originalLanguage = "en";

function getTranslations() {
    return translations[currentLanguage] || translations.en;
}

function applyLanguage(language) {
    currentLanguage = translations[language] ? language : "en";
    const text = getTranslations();

    document.documentElement.lang = currentLanguage;
    document.title = `${text.title} — Finora`;

    $("page-title").textContent = text.title;
    $("page-description").textContent = text.description;
    $("profile-heading").textContent = text.profile;
    $("username-label").textContent = text.username;
    $("email-label").textContent = text.email;
    $("language-label").textContent = text.language;
    $("language-help").textContent = text.help;
    $("save-language").textContent = text.save;
    $("logout-button").textContent = text.logout;

    const dashboardLink = document.querySelector('a[href="/dashboard/"]');

    if (dashboardLink) {
        dashboardLink.textContent = text.dashboard;
    }
}

function showMessage(message, type = "") {
    const element = $("message");
    element.textContent = message;
    element.className = `message ${type}`;
}

async function requestProfile(method = "GET", body = null) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login/";
        return null;
    }

    const options = {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        }
    };

    if (body !== null) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch("/api/auth/profile/", options);

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login/";
        return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data
            ? Object.values(data)
                .flat()
                .map((item) =>
                    typeof item === "string" ? item : JSON.stringify(item)
                )
                .join("\n")
            : `HTTP ${response.status}`;

        throw new Error(message);
    }

    return data;
}

async function loadProfile() {
    const saveButton = $("save-language");
    saveButton.disabled = true;

    try {
        const profile = await requestProfile();

        if (!profile) return;

        $("username").textContent = profile.username || "—";
        $("email").textContent = profile.email || "—";

        const language = translations[profile.language]
            ? profile.language
            : "en";

        originalLanguage = language;
        $("language").value = language;

        applyLanguage(language);
        showMessage("");
    } catch (error) {
        console.error("Profile loading failed:", error);
        applyLanguage(currentLanguage);
        showMessage(
            `${getTranslations().loadFailed} ${error.message}`,
            "error"
        );
    } finally {
        saveButton.disabled = false;
    }
}

async function saveLanguage() {
    const button = $("save-language");
    const selectedLanguage = $("language").value;

    button.disabled = true;
    button.textContent = getTranslations().saving;
    showMessage("");

    try {
        const profile = await requestProfile("PATCH", {
            language: selectedLanguage
        });

        if (!profile) return;

        const savedLanguage = translations[profile.language]
            ? profile.language
            : selectedLanguage;

        originalLanguage = savedLanguage;
        $("language").value = savedLanguage;

        applyLanguage(savedLanguage);
        showMessage(getTranslations().success, "success");
    } catch (error) {
        console.error("Saving language failed:", error);

        $("language").value = originalLanguage;
        applyLanguage(originalLanguage);

        showMessage(
            `${getTranslations().failed} ${error.message}`,
            "error"
        );
    } finally {
        button.disabled = false;
        button.textContent = getTranslations().save;
    }
}

function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
}

document.addEventListener("DOMContentLoaded", () => {
    $("save-language").addEventListener("click", saveLanguage);

    $("language").addEventListener("change", (event) => {
        applyLanguage(event.target.value);
        showMessage("");
    });

    $("logout-button").addEventListener("click", logout);

    applyLanguage("en");
    loadProfile();
});
