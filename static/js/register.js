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

const registerForm = document.getElementById("register-form");
        const verifyForm = document.getElementById("verify-form");
        const message = document.getElementById("message");
        const registerButton = document.getElementById("register-button");
        const verifyButton = document.getElementById("verify-button");
        const t = window.finoraAuthT;

        function setupPasswordToggles() {
            document.querySelectorAll("[data-password-toggle]").forEach((toggle) => {
                const input = document.getElementById(
                    toggle.dataset.passwordToggle
                );

                if (!input) return;

                function updateLabel() {
                    const key = input.type === "password"
                        ? "showPassword"
                        : "hidePassword";

                    const label = t(key);

                    toggle.setAttribute("aria-label", label);
                    toggle.setAttribute("title", label);
                }

                updateLabel();

                toggle.addEventListener("click", () => {
                    input.type = input.type === "password"
                        ? "text"
                        : "password";

                    toggle.textContent = input.type === "password"
                        ? "👁️"
                        : "🙈";

                    updateLabel();
                });
            });
        }

        setupPasswordToggles();

        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            message.textContent = "";

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const passwordConfirm =
                document.getElementById("password_confirm").value;

            if (password !== passwordConfirm) {
                message.textContent = t("passwordsMismatch");
                return;
            }

            registerButton.disabled = true;
            registerButton.textContent = t("creatingAccount");

            try {
                const response = await fetch("/api/auth/register/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                        password_confirm: passwordConfirm
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    const details = Object.values(data)
                        .flat()
                        .filter((value) => typeof value === "string")
                        .join("\n");

                    throw new Error(details || t("registrationFailed"));
                }

                document.getElementById("verify-email").value = email;

                registerForm.classList.add("hidden");
                verifyForm.classList.remove("hidden");

                message.textContent = t("registrationSuccess");
            } catch (error) {
                message.textContent =
                    error.message || t("registrationFailed");

                console.error("Registration error:", error);
            } finally {
                registerButton.disabled = false;
                registerButton.textContent = t("createAccount");
            }
        });

        verifyForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            message.textContent = "";

            verifyButton.disabled = true;
            verifyButton.textContent = t("verifying");

            try {
                const email = document.getElementById("verify-email").value.trim();
                const code = document.getElementById("code").value.trim();

                const response = await fetch("/api/auth/verify-email/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        code: code
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    const details = Object.values(data)
                        .flat()
                        .filter((value) => typeof value === "string")
                        .join("\n");

                    throw new Error(details || t("verificationFailed"));
                }

                if (!data.access || !data.refresh) {
                    throw new Error(t("tokensMissing"));
                }

                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);

                message.textContent = t("verificationSuccess");

                window.location.href = "/dashboard/";
            } catch (error) {
                message.textContent =
                    error.message || t("verificationFailed");

                console.error("Verification error:", error);
            } finally {
                verifyButton.disabled = false;
                verifyButton.textContent = t("verify");
            }
        });
