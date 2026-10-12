
(() => {
    const translations = {
        en: {
            loginTitle: "Login",
            registerTitle: "Create account",
            language: "Language",
            welcomeBack: "Welcome back",
            loginDescription: "Sign in to manage your money.",
            usernameOrEmail: "Username or email",
            password: "Password",
            signIn: "Sign in",
            signingIn: "Signing in...",
            noAccount: "Don't have an account?",
            createOne: "Create one",
            backHome: "Back to home",
            createAccount: "Create account",
            registerDescription: "Start managing your finances.",
            username: "Username",
            email: "Email",
            confirmPassword: "Confirm password",
            creatingAccount: "Creating account...",
            alreadyRegistered: "Already registered?",
            verifyEmail: "Verify your email",
            verificationDescription: "Enter the six-digit code sent to your email.",
            verificationCode: "Verification code",
            verify: "Verify email",
            verifying: "Verifying...",
            passwordsMismatch: "Passwords do not match.",
            registrationSuccess: "Account created. Check your email or the terminal for the verification code.",
            verificationSuccess: "Email verified! Opening dashboard...",
            loginFailed: "Unable to sign in.",
            registrationFailed: "Registration failed.",
            verificationFailed: "Email verification failed.",
            tokensMissing: "Tokens are missing. Please check the server response.",
            loading: "Loading...",

            invalidCredentials: "Incorrect username/email or password.",
            emailNotVerified: "Please verify your email before logging in.",
            showPassword: "Show password",
            hidePassword: "Hide password"
        },

        ru: {
            loginTitle: "Вход",
            registerTitle: "Создание аккаунта",
            language: "Язык",
            welcomeBack: "С возвращением!",
            loginDescription: "Войдите, чтобы управлять своими финансами.",
            usernameOrEmail: "Имя пользователя или email",
            password: "Пароль",
            signIn: "Войти",
            signingIn: "Выполняется вход...",
            noAccount: "Нет аккаунта?",
            createOne: "Создать аккаунт",
            backHome: "На главную",
            createAccount: "Создать аккаунт",
            registerDescription: "Начните управлять своими финансами.",
            username: "Имя пользователя",
            email: "Электронная почта",
            confirmPassword: "Подтвердите пароль",
            creatingAccount: "Создание аккаунта...",
            alreadyRegistered: "Уже зарегистрированы?",
            verifyEmail: "Подтверждение email",
            verificationDescription: "Введите шестизначный код, отправленный на вашу почту.",
            verificationCode: "Код подтверждения",
            verify: "Подтвердить email",
            verifying: "Проверка...",
            passwordsMismatch: "Пароли не совпадают.",
            registrationSuccess: "Аккаунт создан. Проверьте почту или терминал на наличие кода подтверждения.",
            verificationSuccess: "Email подтверждён! Открываем панель управления...",
            loginFailed: "Не удалось войти.",
            registrationFailed: "Не удалось зарегистрироваться.",
            verificationFailed: "Не удалось подтвердить email.",
            tokensMissing: "Токены отсутствуют. Проверьте ответ сервера.",
            loading: "Загрузка...",

            invalidCredentials: "Неверное имя пользователя, email или пароль.",
            emailNotVerified: "Перед входом подтвердите свой email.",
            showPassword: "Показать пароль",
            hidePassword: "Скрыть пароль"
        },

        uz: {
            loginTitle: "Tizimga kirish",
            registerTitle: "Hisob yaratish",
            language: "Til",
            welcomeBack: "Xush kelibsiz!",
            loginDescription: "Moliyangizni boshqarish uchun tizimga kiring.",
            usernameOrEmail: "Foydalanuvchi nomi yoki email",
            password: "Parol",
            signIn: "Kirish",
            signingIn: "Kirilmoqda...",
            noAccount: "Hisobingiz yo‘qmi?",
            createOne: "Hisob yaratish",
            backHome: "Bosh sahifaga",
            createAccount: "Hisob yaratish",
            registerDescription: "Moliyangizni boshqarishni boshlang.",
            username: "Foydalanuvchi nomi",
            email: "Elektron pochta",
            confirmPassword: "Parolni tasdiqlang",
            creatingAccount: "Hisob yaratilmoqda...",
            alreadyRegistered: "Avval ro‘yxatdan o‘tganmisiz?",
            verifyEmail: "Emailni tasdiqlash",
            verificationDescription: "Emailingizga yuborilgan olti xonali kodni kiriting.",
            verificationCode: "Tasdiqlash kodi",
            verify: "Emailni tasdiqlash",
            verifying: "Tekshirilmoqda...",
            passwordsMismatch: "Parollar mos kelmaydi.",
            registrationSuccess: "Hisob yaratildi. Tasdiqlash kodini email yoki terminaldan tekshiring.",
            verificationSuccess: "Email tasdiqlandi! Boshqaruv paneli ochilmoqda...",
            loginFailed: "Tizimga kirib bo‘lmadi.",
            registrationFailed: "Ro‘yxatdan o‘tib bo‘lmadi.",
            verificationFailed: "Emailni tasdiqlab bo‘lmadi.",
            tokensMissing: "Tokenlar topilmadi. Server javobini tekshiring.",
            loading: "Yuklanmoqda...",

            invalidCredentials: "Foydalanuvchi nomi, email yoki parol noto‘g‘ri.",
            emailNotVerified: "Tizimga kirishdan oldin emailingizni tasdiqlang.",
            showPassword: "Parolni ko‘rsatish",
            hidePassword: "Parolni yashirish"
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

    function applyLanguage(language) {
        currentLanguage = translations[language] ? language : "en";

        localStorage.setItem("finora_language", currentLanguage);
        document.documentElement.lang = currentLanguage;

        const page = document.body.dataset.authPage;

        document.title = page === "register"
            ? `${t("registerTitle")} — Finora`
            : `${t("loginTitle")} — Finora`;

        document.querySelectorAll("[data-auth-i18n]").forEach((element) => {
            element.textContent = t(element.dataset.authI18n);
        });

        const select = document.getElementById("auth-language-select");

        if (select) {
            select.value = currentLanguage;
        }

        // Update password visibility buttons when the language changes.
        document.querySelectorAll("[data-password-toggle]").forEach((button) => {
            const input = document.getElementById(
                button.dataset.passwordToggle
            );

            if (!input) return;

            const isVisible = input.type === "text";
            const label = t(isVisible ? "hidePassword" : "showPassword");

            button.setAttribute("aria-label", label);
            button.setAttribute("title", label);
        });
    }

    const select = document.getElementById("auth-language-select");

    if (select) {
        select.addEventListener("change", (event) => {
            applyLanguage(event.target.value);
        });
    }

    window.finoraAuthT = t;
    window.finoraApplyAuthLanguage = applyLanguage;

    applyLanguage(currentLanguage);
})();
