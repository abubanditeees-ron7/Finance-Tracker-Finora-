(() => {
    const translations = {
        en: {
            signIn: "Sign in",
            signUp: "Sign up",
            language: "Language",
            eyebrow: "YOUR MONEY. YOUR CONTROL.",
            titleStart: "Make your money work",
            titleEnd: "for you.",
            description: "Take control of your personal finances. Track income, manage expenses, organize transactions and understand where your money goes — all in one place.",
            getStarted: "Get started — it's free",
            haveAccount: "I have an account",
            previewLabel: "Your finances at a glance",
            previewBalance: "Your money, clearly organized.",
            income: "Income",
            trackIt: "Track it",
            expenses: "Expenses",
            understandIt: "Understand it",
            featureOneTitle: "Know your numbers",
            featureOneText: "See your income, expenses and balance in one personal dashboard.",
            featureTwoTitle: "Track every transaction",
            featureTwoText: "Organize financial activity and add categories, notes and details.",
            featureThreeTitle: "Build better habits",
            featureThreeText: "Use financial reports to understand your spending and plan ahead.",
            dashboard: "Dashboard",
            signOut: "Sign out",
            openDashboard: "Open my dashboard",
            footer: "Personal finance, made clearer.",
            languageSaved: "Language preference saved."
        },
        ru: {
            signIn: "Войти",
            signUp: "Регистрация",
            language: "Язык",
            eyebrow: "ВАШИ ДЕНЬГИ. ПОД ВАШИМ КОНТРОЛЕМ.",
            titleStart: "Пусть ваши деньги работают",
            titleEnd: "на вас.",
            description: "Управляйте личными финансами: отслеживайте доходы, контролируйте расходы, ведите историю транзакций и понимайте, куда уходят деньги, — всё в одном месте.",
            getStarted: "Начать бесплатно",
            haveAccount: "У меня уже есть аккаунт",
            previewLabel: "Ваши финансы с первого взгляда",
            previewBalance: "Ваши деньги под контролем.",
            income: "Доходы",
            trackIt: "Отслеживайте",
            expenses: "Расходы",
            understandIt: "Анализируйте",
            featureOneTitle: "Знайте свои цифры",
            featureOneText: "Смотрите доходы, расходы и баланс в одной панели.",
            featureTwoTitle: "Учитывайте каждую транзакцию",
            featureTwoText: "Организуйте финансовые операции, категории и комментарии.",
            featureThreeTitle: "Формируйте полезные привычки",
            featureThreeText: "Используйте финансовые отчёты, чтобы анализировать расходы и планировать бюджет.",
            dashboard: "Панель управления",
            signOut: "Выйти",
            openDashboard: "Открыть панель",
            footer: "Личные финансы — проще и понятнее.",
            languageSaved: "Язык интерфейса сохранён."
        },
        uz: {
            signIn: "Kirish",
            signUp: "Ro‘yxatdan o‘tish",
            language: "Til",
            eyebrow: "PULLARINGIZ. SIZNING NAZORATINGIZ.",
            titleStart: "Pullaringiz siz uchun",
            titleEnd: "ishlasin.",
            description: "Shaxsiy moliyangizni boshqaring: daromadlarni kuzating, xarajatlarni nazorat qiling, tranzaksiyalarni tartibga soling va pullaringiz qayerga ketayotganini bir joyda ko‘ring.",
            getStarted: "Bepul boshlash",
            haveAccount: "Hisobim bor",
            previewLabel: "Moliyangiz bir qarashda",
            previewBalance: "Pullaringiz tartib bilan.",
            income: "Daromad",
            trackIt: "Kuzatish",
            expenses: "Xarajatlar",
            understandIt: "Tahlil qilish",
            featureOneTitle: "Moliyangizni biling",
            featureOneText: "Daromad, xarajat va balansni bitta boshqaruv panelida ko‘ring.",
            featureTwoTitle: "Har bir tranzaksiyani kuzating",
            featureTwoText: "Moliyaviy amallar, kategoriyalar va izohlarni tartibga soling.",
            featureThreeTitle: "Yaxshi odatlarni shakllantiring",
            featureThreeText: "Xarajatlarni tahlil qilish va oldindan rejalashtirish uchun hisobotlardan foydalaning.",
            dashboard: "Boshqaruv paneli",
            signOut: "Chiqish",
            openDashboard: "Panelni ochish",
            footer: "Shaxsiy moliya — oson va tushunarli.",
            languageSaved: "Interfeys tili saqlandi."
        }
    };

    const languageSelect = document.getElementById("language-select");
    const navigation = document.getElementById("navigation");
    const heroActions = document.getElementById("hero-actions");

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
        document.title = `Finora — ${t("footer")}`;

        document.querySelectorAll("[data-public-i18n]").forEach((element) => {
            element.textContent = t(element.dataset.publicI18n);
        });

        if (languageSelect) {
            languageSelect.value = currentLanguage;
        }

        renderNavigation();
    }

    function renderNavigation() {
        if (!navigation || !heroActions) return;

        const isLoggedIn = Boolean(localStorage.getItem("access_token"));

        if (isLoggedIn) {
            navigation.innerHTML = `
                <a class="btn btn-light" href="/dashboard/">
                    ${t("dashboard")}
                </a>
            `;

            heroActions.innerHTML = `
                <a class="btn btn-primary" href="/dashboard/">
                    ${t("openDashboard")}
                </a>
            `;

            document.getElementById("logout-button")
                .addEventListener("click", () => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.reload();
                });
        } else {
            navigation.innerHTML = `
                <a class="btn btn-light" href="/login/">${t("signIn")}</a>
                <a class="btn btn-primary" href="/register/">${t("signUp")}</a>
            `;

            heroActions.innerHTML = `
                <a class="btn btn-primary" href="/register/">
                    ${t("getStarted")}
                </a>
                <a class="btn btn-light" href="/login/">
                    ${t("haveAccount")}
                </a>
            `;
        }
    }

    if (languageSelect) {
        languageSelect.addEventListener("change", (event) => {
            applyLanguage(event.target.value);
        });
    }

    async function init() {
        const token = localStorage.getItem("access_token");

        if (token) {
            try {
                const response = await fetch("/api/auth/profile/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    }
                });

                if (response.ok) {
                    const profile = await response.json();

                    if (translations[profile.language]) {
                        currentLanguage = profile.language;
                        localStorage.setItem("finora_language", currentLanguage);
                    }
                }
            } catch (error) {
                console.error("Could not load language preference:", error);
            }
        }

        applyLanguage(currentLanguage);
    }

    init();
})();
