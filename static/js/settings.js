const $ = (id) => document.getElementById(id);

const translations = {
    en: {
        title: "Settings",
        description: "Manage your account and profile.",
        profile: "Your profile",
        username: "Username",
        email: "Email",
        phone: "Phone",
        language: "Interface language",
        edit: "Edit profile",
        changeEmail: "Change email",
        save: "Save changes",
        cancel: "Cancel",
        photo: "Profile photo",
        dashboard: "Dashboard",
        logout: "Sign out",
        loading: "Loading...",
        loadFailed: "Could not load profile.",
        saved: "Profile updated successfully.",
        saveFailed: "Could not save profile.",
        emailTitle: "Change email",
        emailDescription: "A verification code will be sent to your new email address.",
        newEmail: "New email",
        currentPassword: "Current password",
        sendCode: "Send verification code",
        code: "Verification code",
        confirmEmail: "Confirm new email",
        codeSent: "Verification code sent. Check your new email.",
        emailChanged: "Email changed successfully.",
        emailFailed: "Could not change email.",
        passwordTitle: "Change password",
        newPassword: "New password",
        confirmPassword: "Confirm new password",
        changePassword: "Change password",
        passwordChanged: "Password changed successfully.",
        passwordFailed: "Could not change password.",
        passwordMismatch: "The new passwords do not match.",
        sessionExpired: "Your session has expired. Please sign in again.",
        phoneHelp: "Use the format +998901234567, or leave it empty.",
        optional: "Not provided",
        back: "Back",
        emailVerified: "Your new email has been confirmed."
    },

    ru: {
        title: "Настройки",
        description: "Управление аккаунтом и профилем.",
        profile: "Ваш профиль",
        username: "Имя пользователя",
        email: "Электронная почта",
        phone: "Телефон",
        language: "Язык интерфейса",
        edit: "Редактировать профиль",
        changeEmail: "Изменить почту",
        save: "Сохранить изменения",
        cancel: "Отмена",
        photo: "Фотография профиля",
        dashboard: "Главная панель",
        logout: "Выйти",
        loading: "Загрузка...",
        loadFailed: "Не удалось загрузить профиль.",
        saved: "Профиль успешно обновлён.",
        saveFailed: "Не удалось сохранить профиль.",
        emailTitle: "Изменение почты",
        emailDescription: "Код подтверждения будет отправлен на новую почту.",
        newEmail: "Новая почта",
        currentPassword: "Текущий пароль",
        sendCode: "Отправить код подтверждения",
        code: "Код подтверждения",
        confirmEmail: "Подтвердить новую почту",
        codeSent: "Код отправлен. Проверь новую почту.",
        emailChanged: "Почта успешно изменена.",
        emailFailed: "Не удалось изменить почту.",
        passwordTitle: "Изменение пароля",
        newPassword: "Новый пароль",
        confirmPassword: "Подтвердите новый пароль",
        changePassword: "Изменить пароль",
        passwordChanged: "Пароль успешно изменён.",
        passwordFailed: "Не удалось изменить пароль.",
        passwordMismatch: "Новые пароли не совпадают.",
        sessionExpired: "Сессия истекла. Войдите в аккаунт снова.",
        phoneHelp: "Формат: +998901234567. Можно оставить поле пустым.",
        optional: "Не указано",
        back: "Назад",
        emailVerified: "Новая почта подтверждена."
    },

    uz: {
        title: "Sozlamalar",
        description: "Hisob va profilni boshqarish.",
        profile: "Profilingiz",
        username: "Foydalanuvchi nomi",
        email: "Elektron pochta",
        phone: "Telefon",
        language: "Interfeys tili",
        edit: "Profilni tahrirlash",
        changeEmail: "Pochta manzilini o‘zgartirish",
        save: "O‘zgarishlarni saqlash",
        cancel: "Bekor qilish",
        photo: "Profil rasmi",
        dashboard: "Boshqaruv paneli",
        logout: "Chiqish",
        loading: "Yuklanmoqda...",
        loadFailed: "Profilni yuklab bo‘lmadi.",
        saved: "Profil muvaffaqiyatli yangilandi.",
        saveFailed: "Profilni saqlab bo‘lmadi.",
        emailTitle: "Pochta manzilini o‘zgartirish",
        emailDescription: "Tasdiqlash kodi yangi pochtangizga yuboriladi.",
        newEmail: "Yangi pochta",
        currentPassword: "Joriy parol",
        sendCode: "Tasdiqlash kodini yuborish",
        code: "Tasdiqlash kodi",
        confirmEmail: "Yangi pochtani tasdiqlash",
        codeSent: "Kod yuborildi. Yangi pochtangizni tekshiring.",
        emailChanged: "Pochta muvaffaqiyatli o‘zgartirildi.",
        emailFailed: "Pochta manzilini o‘zgartirib bo‘lmadi.",
        passwordTitle: "Parolni o‘zgartirish",
        newPassword: "Yangi parol",
        confirmPassword: "Yangi parolni tasdiqlang",
        changePassword: "Parolni o‘zgartirish",
        passwordChanged: "Parol muvaffaqiyatli o‘zgartirildi.",
        passwordFailed: "Parolni o‘zgartirib bo‘lmadi.",
        passwordMismatch: "Yangi parollar mos kelmaydi.",
        sessionExpired: "Sessiya tugadi. Qaytadan tizimga kiring.",
        phoneHelp: "Format: +998901234567. Maydonni bo‘sh qoldirish mumkin.",
        optional: "Kiritilmagan",
        back: "Orqaga",
        emailVerified: "Yangi pochta tasdiqlandi."
    }
};

let currentLanguage = "en";
let profileSnapshot = null;
let pendingEmail = "";

function t(key) {
    return translations[currentLanguage]?.[key] ?? translations.en[key] ?? key;
}

function showMessage(id, message = "", type = "") {
    const element = $(id);
    element.textContent = message;
    element.className = `message ${type}`;
}

function setBusy(button, busy) {
    button.disabled = busy;
}

async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("access_token");

    if (!token) {
        window.location.href = "/login/";
        throw new Error(t("sessionExpired"));
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(options.headers || {})
    };

    const response = await fetch(path, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login/";
        throw new Error(t("sessionExpired"));
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

        throw new Error(message || `HTTP ${response.status}`);
    }

    return data;
}

async function profileRequest(method = "GET", body = null) {
    const options = { method };

    if (body instanceof FormData) {
        options.body = body;
    } else if (body !== null) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
    }

    return apiRequest("/api/auth/profile/", options);
}

function languageName(code) {
    return {
        en: "English",
        ru: "Русский",
        uz: "O‘zbekcha"
    }[code] || code || "English";
}

function applyLanguage(language) {
    currentLanguage = translations[language] ? language : "en";

    document.documentElement.lang = currentLanguage;
    document.title = `${t("title")} — Finora`;

    const textMap = {
        "page-title": "title",
        "page-description": "description",
        "profile-heading": "profile",
        "username-label": "username",
        "email-label": "email",
        "phone-label": "phone",
        "language-label": "language",
        "edit-profile-button": "edit",
        "change-email-button": "changeEmail",
        "username-input-label": "username",
        "phone-input-label": "phone",
        "language-input-label": "language",
        "avatar-input-label": "photo",
        "save-profile-button": "save",
        "cancel-edit-button": "cancel",
        "dashboard-link": "dashboard",
        "logout-button": "logout",
        "email-heading": "emailTitle",
        "email-description": "emailDescription",
        "new-email-label": "newEmail",
        "email-password-label": "currentPassword",
        "send-email-code-button": "sendCode",
        "email-code-label": "code",
        "confirm-email-button": "confirmEmail",
        "cancel-email-button": "cancel",
        "back-email-button": "back",
        "password-heading": "passwordTitle",
        "current-password-label": "currentPassword",
        "new-password-label": "newPassword",
        "confirm-password-label": "confirmPassword",
        "change-password-button": "changePassword"
    };

    for (const [id, key] of Object.entries(textMap)) {
        const element = $(id);
        if (element) element.textContent = t(key);
    }

    $("phone-input").placeholder = "+998901234567";
    $("phone-input").title = t("phoneHelp");
    $("username-value").textContent =
        profileSnapshot?.username || t("optional");
    $("email-value").textContent =
        profileSnapshot?.email || t("optional");
    $("phone-value").textContent =
        profileSnapshot?.phone || t("optional");
    $("language-value").textContent =
        languageName(profileSnapshot?.language || currentLanguage);
}

function renderProfile(profile) {
    profileSnapshot = profile;

    $("username-value").textContent = profile.username || t("optional");
    $("email-value").textContent = profile.email || t("optional");
    $("phone-value").textContent = profile.phone || t("optional");
    $("language-value").textContent = languageName(profile.language);

    $("username-input").value = profile.username || "";
    $("phone-input").value = profile.phone || "";
    $("language-input").value = profile.language || "en";

    const avatar = $("profile-avatar");
    if (profile.avatar) {
        avatar.src = profile.avatar;
        avatar.classList.remove("hidden");
    } else {
        avatar.removeAttribute("src");
        avatar.classList.add("hidden");
    }

    applyLanguage(profile.language || "en");
}

async function loadProfile() {
    $("username-value").textContent = t("loading");
    $("email-value").textContent = t("loading");

    try {
        const profile = await profileRequest();
        renderProfile(profile);
        showMessage("profile-message");
    } catch (error) {
        console.error("Profile loading failed:", error);
        showMessage("profile-message", `${t("loadFailed")}\n${error.message}`, "error");
    }
}

function setEditMode(enabled) {
    $("profile-view").classList.toggle("hidden", enabled);
    $("profile-form").classList.toggle("hidden", !enabled);
    showMessage("profile-message");
}

$("edit-profile-button").addEventListener("click", () => {
    if (profileSnapshot) {
        $("username-input").value = profileSnapshot.username || "";
        $("phone-input").value = profileSnapshot.phone || "";
        $("language-input").value = profileSnapshot.language || "en";
        $("avatar-input").value = "";
        $("avatar-preview").classList.add("hidden");
    }
    setEditMode(true);
});

$("cancel-edit-button").addEventListener("click", () => {
    setEditMode(false);
});

$("avatar-input").addEventListener("change", () => {
    const file = $("avatar-input").files[0];
    const preview = $("avatar-preview");

    if (!file) {
        preview.classList.add("hidden");
        return;
    }

    if (!file.type.startsWith("image/")) {
        showMessage("profile-message", "Please select an image file.", "error");
        $("avatar-input").value = "";
        preview.classList.add("hidden");
        return;
    }

    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
});

$("profile-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = $("save-profile-button");
    setBusy(button, true);
    showMessage("profile-message");

    const avatarFile = $("avatar-input").files[0];
    let body;

    if (avatarFile) {
        body = new FormData();
        body.append("username", $("username-input").value.trim());
        body.append("phone", $("phone-input").value.trim());
        body.append("language", $("language-input").value);
        body.append("avatar", avatarFile);
    } else {
        body = {
            username: $("username-input").value.trim(),
            phone: $("phone-input").value.trim(),
            language: $("language-input").value
        };
    }

    try {
        const profile = await profileRequest("PATCH", body);
        renderProfile(profile);
        setEditMode(false);
        localStorage.setItem("finora_language", profile.language || "en");
        showMessage("profile-message", t("saved"), "success");
    } catch (error) {
        console.error("Profile update failed:", error);
        showMessage("profile-message", `${t("saveFailed")}\n${error.message}`, "error");
    } finally {
        setBusy(button, false);
        button.textContent = t("save");
    }
});

$("change-email-button").addEventListener("click", () => {
    $("email-panel").classList.remove("hidden");
    $("email-request-form").classList.remove("hidden");
    $("email-confirm-form").classList.add("hidden");
    $("new-email-input").value = profileSnapshot?.email || "";
    $("email-current-password").value = "";
    $("email-code-input").value = "";
    pendingEmail = "";
    showMessage("email-message");
    $("email-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("cancel-email-button").addEventListener("click", () => {
    $("email-panel").classList.add("hidden");
    showMessage("email-message");
});

$("back-email-button").addEventListener("click", () => {
    $("email-confirm-form").classList.add("hidden");
    $("email-request-form").classList.remove("hidden");
    showMessage("email-message");
});

$("email-request-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = $("send-email-code-button");
    setBusy(button, true);
    showMessage("email-message");

    pendingEmail = $("new-email-input").value.trim().toLowerCase();

    try {
        await apiRequest("/api/auth/profile/email/request/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                new_email: pendingEmail,
                current_password: $("email-current-password").value
            })
        });

        $("email-request-form").classList.add("hidden");
        $("email-confirm-form").classList.remove("hidden");
        showMessage("email-message", t("codeSent"), "success");
        $("email-code-input").focus();
    } catch (error) {
        console.error("Email change request failed:", error);
        showMessage("email-message", `${t("emailFailed")}\n${error.message}`, "error");
    } finally {
        setBusy(button, false);
        button.textContent = t("sendCode");
    }
});

$("email-confirm-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = $("confirm-email-button");
    setBusy(button, true);
    showMessage("email-message");

    try {
        await apiRequest("/api/auth/profile/email/confirm/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                new_email: pendingEmail,
                code: $("email-code-input").value.trim()
            })
        });

        profileSnapshot.email = pendingEmail;
        $("email-value").textContent = pendingEmail;
        $("email-panel").classList.add("hidden");
        $("email-request-form").reset();
        $("email-confirm-form").reset();

        showMessage("profile-message", t("emailVerified"), "success");
    } catch (error) {
        console.error("Email confirmation failed:", error);
        showMessage("email-message", `${t("emailFailed")}\n${error.message}`, "error");
    } finally {
        setBusy(button, false);
        button.textContent = t("confirmEmail");
    }
});

$("password-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = $("change-password-button");
    const newPassword = $("new-password").value;
    const confirmPassword = $("confirm-password").value;

    if (newPassword !== confirmPassword) {
        showMessage("password-message", t("passwordMismatch"), "error");
        return;
    }

    setBusy(button, true);
    showMessage("password-message");

    try {
        await apiRequest("/api/auth/profile/password/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                current_password: $("current-password").value,
                new_password: newPassword,
                new_password_confirm: confirmPassword
            })
        });

        $("password-form").reset();
        showMessage("password-message", t("passwordChanged"), "success");
    } catch (error) {
        console.error("Password change failed:", error);
        showMessage("password-message", `${t("passwordFailed")}\n${error.message}`, "error");
    } finally {
        setBusy(button, false);
        button.textContent = t("changePassword");
    }
});

$("logout-button").addEventListener("click", () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
});

document.addEventListener("DOMContentLoaded", loadProfile);
