
(() => {
    const translations = {
        en: {
            signIn: "Sign in",
            signUp: "Sign up",
            dashboardTitle: "Personal Finance Dashboard",
            dashboardDescription: "Track your money. Understand your spending. Plan ahead.",
            totalBalance: "Total balance",
            totalIncome: "Total income",
            totalExpenses: "Total expenses",
            recentTransactions: "Recent transactions",
            latestTransactions: "Your latest income and expenses",
            manageApi: "Manage via API",
            loadingTransactions: "Loading transactions...",
            noTransactions: "No transactions yet. Add your first transaction through the API.",
            apiDocumentation: "API and documentation",
            apiDescription: "Backend documentation and API testing.",
            openSwagger: "Open Swagger",
            transactions: "Transactions",
            reports: "Financial reports",
            accountsCategories: "Accounts & Categories",
            settings: "Settings",
            signedIn: "Signed in",
            signOut: "Sign out",
            dashboard: "Dashboard",

            transactionsHeading: "Transactions",
            transactionsDescription: "Manage your income and expenses in one place.",
            addTransaction: "Add transaction",
            editTransaction: "Edit transaction",
            transactionType: "Transaction type",
            expense: "Expense",
            income: "Income",
            amountUZS: "Amount (UZS)",
            date: "Date",
            account: "Account",
            category: "Category",
            commentOptional: "Comment (optional)",
            commentPlaceholder: "What was this transaction for?",
            saveTransaction: "Save transaction",
            saveChanges: "Save changes",
            cancelEdit: "Cancel edit",
            yourTransactions: "Your transactions",
            allTypes: "All types",
            incomeOnly: "Income only",
            expensesOnly: "Expenses only",
            typeColumn: "Type",
            amountColumn: "Amount",
            commentColumn: "Comment",
            actionsColumn: "Actions",
            previous: "Previous",
            next: "Next",
            loadingAccounts: "Loading accounts...",
            chooseCategory: "Choose a category",
            noCategoriesForType: "No categories for this type",
            chooseAccount: "Choose an account",
            noAccounts: "No accounts yet — create one first",
            noCategories: "No categories yet — create one first",
            loadAccountsError: "Could not load accounts",
            loadCategoriesError: "Could not load categories",
            noTransactionsFound: "No transactions found on this page.",
            transactionCount: "transaction(s) on this page",
            page: "Page",
            of: "of",
            edit: "Edit",
            delete: "Delete",
            deleteConfirm: "Delete this transaction? This action cannot be undone.",
            transactionDeleted: "Transaction deleted.",
            transactionCreated: "Transaction created successfully.",
            transactionUpdated: "Transaction updated successfully.",
            createAccountCategoryFirst: "Create an account and a matching category first.",
            sessionExpired: "Session expired. Please sign in again.",
            apiError: "API error",
            requestFailed: "Request failed",
            loading: "Loading...",

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
            cardLabelOptional: "Card number or label (optional)",
            cardReferencePlaceholder: "Only a reference, never PIN/CVV",
            cardSecurityNote: "Avoid entering sensitive card details. This is only for your own reference.",
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
            accountCreated: "Account created.",
            accountUpdated: "Account updated.",
            accountDeleted: "Account deleted.",
            categoryCreated: "Category created.",
            categoryUpdated: "Category updated.",
            categoryDeleted: "Category deleted.",
            deleteAccountConfirm: "Delete this account? Accounts used by transactions cannot be deleted.",
            deleteCategoryConfirm: "Delete this category? Categories used by transactions cannot be deleted."
        },

        ru: {
            signIn: "Войти",
            signUp: "Регистрация",
            dashboardTitle: "Панель личных финансов",
            dashboardDescription: "Следите за деньгами, анализируйте расходы и планируйте бюджет.",
            totalBalance: "Общий баланс",
            totalIncome: "Общий доход",
            totalExpenses: "Общие расходы",
            recentTransactions: "Последние транзакции",
            latestTransactions: "Ваши последние доходы и расходы",
            manageApi: "Управление через API",
            loadingTransactions: "Загрузка транзакций...",
            noTransactions: "Транзакций пока нет. Добавьте первую через API.",
            apiDocumentation: "API и документация",
            apiDescription: "Документация backend и тестирование API.",
            openSwagger: "Открыть Swagger",
            transactions: "Транзакции",
            reports: "Финансовые отчёты",
            accountsCategories: "Счета и категории",
            settings: "Настройки",
            signedIn: "Вы вошли в аккаунт",
            signOut: "Выйти",
            dashboard: "Панель управления",

            transactionsHeading: "Транзакции",
            transactionsDescription: "Управляйте доходами и расходами в одном месте.",
            addTransaction: "Добавить транзакцию",
            editTransaction: "Редактировать транзакцию",
            transactionType: "Тип транзакции",
            expense: "Расход",
            income: "Доход",
            amountUZS: "Сумма (UZS)",
            date: "Дата",
            account: "Счёт",
            category: "Категория",
            commentOptional: "Комментарий (необязательно)",
            commentPlaceholder: "На что была потрачена сумма?",
            saveTransaction: "Сохранить транзакцию",
            saveChanges: "Сохранить изменения",
            cancelEdit: "Отменить редактирование",
            yourTransactions: "Ваши транзакции",
            allTypes: "Все типы",
            incomeOnly: "Только доходы",
            expensesOnly: "Только расходы",
            typeColumn: "Тип",
            amountColumn: "Сумма",
            commentColumn: "Комментарий",
            actionsColumn: "Действия",
            previous: "Назад",
            next: "Далее",
            loadingAccounts: "Загрузка счетов...",
            chooseCategory: "Выберите категорию",
            noCategoriesForType: "Нет категорий для этого типа",
            chooseAccount: "Выберите счёт",
            noAccounts: "Счетов пока нет — сначала создайте счёт",
            noCategories: "Категорий пока нет — сначала создайте категорию",
            loadAccountsError: "Не удалось загрузить счета",
            loadCategoriesError: "Не удалось загрузить категории",
            noTransactionsFound: "На этой странице транзакций нет.",
            transactionCount: "транзакций на этой странице",
            page: "Страница",
            of: "из",
            edit: "Изменить",
            delete: "Удалить",
            deleteConfirm: "Удалить эту транзакцию? Это действие нельзя отменить.",
            transactionDeleted: "Транзакция удалена.",
            transactionCreated: "Транзакция успешно создана.",
            transactionUpdated: "Транзакция успешно обновлена.",
            createAccountCategoryFirst: "Сначала создайте счёт и подходящую категорию.",
            sessionExpired: "Сессия истекла. Войдите в аккаунт снова.",
            apiError: "Ошибка API",
            requestFailed: "Ошибка запроса",
            loading: "Загрузка...",

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
            cardLabelOptional: "Номер или название карты (необязательно)",
            cardReferencePlaceholder: "Только обозначение, не PIN/CVV",
            cardSecurityNote: "Не вводите конфиденциальные данные карты. Это поле только для вашего удобства.",
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
            accountCreated: "Счёт создан.",
            accountUpdated: "Счёт обновлён.",
            accountDeleted: "Счёт удалён.",
            categoryCreated: "Категория создана.",
            categoryUpdated: "Категория обновлена.",
            categoryDeleted: "Категория удалена.",
            deleteAccountConfirm: "Удалить этот счёт? Счета, используемые в транзакциях, удалить нельзя.",
            deleteCategoryConfirm: "Удалить эту категорию? Категории, используемые в транзакциях, удалить нельзя."
        },

        uz: {
            signIn: "Kirish",
            signUp: "Ro‘yxatdan o‘tish",
            dashboardTitle: "Shaxsiy moliya paneli",
            dashboardDescription: "Pul mablag‘laringizni kuzating, xarajatlarni tahlil qiling va reja tuzing.",
            totalBalance: "Umumiy balans",
            totalIncome: "Umumiy daromad",
            totalExpenses: "Umumiy xarajatlar",
            recentTransactions: "Oxirgi tranzaksiyalar",
            latestTransactions: "Oxirgi daromad va xarajatlaringiz",
            manageApi: "API orqali boshqarish",
            loadingTransactions: "Tranzaksiyalar yuklanmoqda...",
            noTransactions: "Hozircha tranzaksiyalar yo‘q. Birinchi tranzaksiyani API orqali qo‘shing.",
            apiDocumentation: "API va hujjatlar",
            apiDescription: "Backend hujjatlari va API sinovlari.",
            openSwagger: "Swagger-ni ochish",
            transactions: "Tranzaksiyalar",
            reports: "Moliyaviy hisobotlar",
            accountsCategories: "Hisoblar va kategoriyalar",
            settings: "Sozlamalar",
            signedIn: "Tizimga kirilgan",
            signOut: "Chiqish",
            dashboard: "Boshqaruv paneli",

            transactionsHeading: "Tranzaksiyalar",
            transactionsDescription: "Daromad va xarajatlaringizni bir joyda boshqaring.",
            addTransaction: "Tranzaksiya qo‘shish",
            editTransaction: "Tranzaksiyani tahrirlash",
            transactionType: "Tranzaksiya turi",
            expense: "Xarajat",
            income: "Daromad",
            amountUZS: "Summa (UZS)",
            date: "Sana",
            account: "Hisob",
            category: "Kategoriya",
            commentOptional: "Izoh (ixtiyoriy)",
            commentPlaceholder: "Bu tranzaksiya nima uchun edi?",
            saveTransaction: "Tranzaksiyani saqlash",
            saveChanges: "O‘zgarishlarni saqlash",
            cancelEdit: "Tahrirlashni bekor qilish",
            yourTransactions: "Tranzaksiyalaringiz",
            allTypes: "Barcha turlar",
            incomeOnly: "Faqat daromad",
            expensesOnly: "Faqat xarajat",
            typeColumn: "Turi",
            amountColumn: "Summa",
            commentColumn: "Izoh",
            actionsColumn: "Amallar",
            previous: "Oldingi",
            next: "Keyingi",
            loadingAccounts: "Hisoblar yuklanmoqda...",
            chooseCategory: "Kategoriyani tanlang",
            noCategoriesForType: "Bu tur uchun kategoriyalar yo‘q",
            chooseAccount: "Hisobni tanlang",
            noAccounts: "Hozircha hisoblar yo‘q — avval hisob yarating",
            noCategories: "Hozircha kategoriyalar yo‘q — avval kategoriya yarating",
            loadAccountsError: "Hisoblarni yuklab bo‘lmadi",
            loadCategoriesError: "Kategoriyalarni yuklab bo‘lmadi",
            noTransactionsFound: "Bu sahifada tranzaksiyalar topilmadi.",
            transactionCount: "ta tranzaksiya",
            page: "Sahifa",
            of: "/",
            edit: "Tahrirlash",
            delete: "O‘chirish",
            deleteConfirm: "Bu tranzaksiya o‘chirilsinmi? Bu amalni ortga qaytarib bo‘lmaydi.",
            transactionDeleted: "Tranzaksiya o‘chirildi.",
            transactionCreated: "Tranzaksiya muvaffaqiyatli yaratildi.",
            transactionUpdated: "Tranzaksiya muvaffaqiyatli yangilandi.",
            createAccountCategoryFirst: "Avval hisob va mos kategoriyani yarating.",
            sessionExpired: "Sessiya tugadi. Qaytadan tizimga kiring.",
            apiError: "API xatosi",
            requestFailed: "So‘rov bajarilmadi",
            loading: "Yuklanmoqda...",

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
            cardLabelOptional: "Karta raqami yoki nomi (ixtiyoriy)",
            cardReferencePlaceholder: "Faqat belgi, PIN/CVV emas",
            cardSecurityNote: "Kartaning maxfiy ma’lumotlarini kiritmang. Bu maydon faqat o‘zingiz uchun.",
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
            accountCreated: "Hisob yaratildi.",
            accountUpdated: "Hisob yangilandi.",
            accountDeleted: "Hisob o‘chirildi.",
            categoryCreated: "Kategoriya yaratildi.",
            categoryUpdated: "Kategoriya yangilandi.",
            categoryDeleted: "Kategoriya o‘chirildi.",
            deleteAccountConfirm: "Bu hisob o‘chirilsinmi? Tranzaksiyalarda ishlatilayotgan hisoblarni o‘chirib bo‘lmaydi.",
            deleteCategoryConfirm: "Bu kategoriya o‘chirilsinmi? Tranzaksiyalarda ishlatilayotgan kategoriyalarni o‘chirib bo‘lmaydi."
        }
    };

    let currentLanguage = "en";
    let initPromise = null;

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

    async function init() {
        if (initPromise) return initPromise;

        initPromise = (async () => {
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
                        }
                    }
                } catch (error) {
                    console.error("Could not load language preference:", error);
                }
            }

            translateDOM();
            return currentLanguage;
        })();

        return initPromise;
    }

    window.FinoraI18n = {
        t,
        init,
        translateDOM,
        getLanguage: () => currentLanguage
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
