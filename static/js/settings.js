
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
        success: "Language settings saved.",
        failed: "Could not save settings.",
        dashboard: "Dashboard",
        logout: "Sign out"
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
        success: "Язык успешно сохранён.",
        failed: "Не удалось сохранить настройки.",
        dashboard: "Главная панель",
        logout: "Выйти"
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
        success: "Til sozlamalari saqlandi.",
        failed: "Sozlamalarni saqlab bo‘lmadi.",
        dashboard: "Boshqaruv paneli",
        logout: "Chiqish"
    }
};

let currentLanguage = "en";

function applyLanguage(language) {
    currentLanguage = translations[language] ? language : "en";
    const t = translations[currentLanguage];

    document.documentElement.lang = currentLanguage;
    $("page-title").textContent = t.title;
    $("page-description").textContent = t.description;
    $("profile-heading").textContent = t.profile;
    $("username-label").textContent = t.username;
    $("email-label").textContent = t.email;
    $("language-label").textContent = t.language;
    $("language-help").textContent = t.help;
    $("save-language").textContent = t.save;
    $("logout-button").textContent = t.logout;

    document.querySelector('a[href="/dashboard/"]').textContent =
        t.dashboard;
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

    if (body) {
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
        throw new Error(
            data ? JSON.stringify(data) : `HTTP ${response.status}`
        );
    }

    return data;
}

async function loadProfile() {
    try {
        const profile = await requestProfile();

        if (!profile) return;

        $("username").textContent = profile.username;
        $("email").textContent = profile.email;
        $("language").value = profile.language;
        applyLanguage(profile.language);
    } catch (error) {
        $("message").textContent = error.message;
        $("message").className = "message error";
    }
}

async function saveLanguage() {
    const button = $("save-language");
    button.disabled = true;

    try {
        const profile = await requestProfile("PATCH", {
            language: $("language").value
        });

        if (!profile) return;

        applyLanguage(profile.language);
        $("message").textContent = translations[currentLanguage].success;
        $("message").className = "message success";
    } catch (error) {
        $("message").textContent =
            `${translations[currentLanguage].failed} ${error.message}`;
        $("message").className = "message error";
    } finally {
        button.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    $("save-language").addEventListener("click", saveLanguage);

    $("language").addEventListener("change", (event) => {
        applyLanguage(event.target.value);
    });

    $("logout-button").addEventListener("click", () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
    });

    loadProfile();
});
