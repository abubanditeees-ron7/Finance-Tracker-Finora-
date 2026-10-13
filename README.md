# Finora — Personal Finance Tracker

Finora is a Django web application for tracking personal income and expenses, managing financial accounts and categories, and viewing financial reports. The interface supports English, Russian, and Uzbek. Amounts are tracked in Uzbek soum (UZS).

## Live application

- **Website:** http://142.44.160.226/
- **Django administration:** http://142.44.160.226/admin/
- **Swagger API documentation:** http://142.44.160.226/api/docs/
- **ReDoc API documentation:** http://142.44.160.226/api/redoc/
- **OpenAPI schema:** http://142.44.160.226/api/schema/

The deployment currently uses the server IP over HTTP. The browser may show “Not secure” because HTTPS and a domain have not been configured.

## Features

- Registration and email verification
- JWT login and refresh tokens
- User profile editing, password change, and email change with verification
- Income and expense transactions
- Financial accounts and transaction categories
- Dashboard and date-range financial reports
- English, Russian, and Uzbek interface
- Django admin site
- Swagger, ReDoc, and an importable Postman collection

## Technology stack

- Python 3.11+
- Django 5.2
- Django REST Framework
- PostgreSQL
- Simple JWT
- drf-spectacular (OpenAPI, Swagger UI, ReDoc)
- Gunicorn and Nginx
- WhiteNoise
- HTML, CSS, JavaScript

## Project structure

```text
.
├── accounts/                 # Users, registration, email verification and profile API
├── config/                   # Django settings and project URLs
├── finance/                  # Accounts, categories, transactions and reports
├── postman/
│   └── personal-finance-tracker.postman_collection.json
├── static/                   # CSS and JavaScript
├── templates/                # HTML pages
├── schema.yml                # OpenAPI schema file
├── manage.py
├── requirements.txt
└── README.md
```

## Run locally

### 1. Get the source code

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with the actual repository URL and folder name.

### 2. Create and activate a virtual environment

**Windows (PowerShell):**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Create the `.env` file

Create a file named `.env` in the project root, in the same directory as `manage.py`. Copy the following template into `.env`, then replace the example values with your own. **Do not commit `.env` to GitHub.**

```dotenv
# Django
SECRET_KEY=REPLACE_WITH_A_UNIQUE_RANDOM_SECRET_KEY_AT_LEAST_50_CHARACTERS_LONG
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# PostgreSQL — create this database and user before running migrations
DB_ENGINE=postgres
DB_NAME=finora_db
DB_USER=finora_user
DB_PASSWORD=REPLACE_WITH_YOUR_DATABASE_PASSWORD
DB_HOST=127.0.0.1
DB_PORT=5432

# Email — SMTP configuration for actual email delivery
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=YOUR_GMAIL_ADDRESS@gmail.com
EMAIL_HOST_PASSWORD=YOUR_GMAIL_APP_PASSWORD
DEFAULT_FROM_EMAIL="Finora <YOUR_GMAIL_ADDRESS@gmail.com>"
```

Before starting Django:

- Generate a unique Django `SECRET_KEY` of at least 50 characters; do not leave the placeholder.
- Replace the database name, username, and password with credentials for your PostgreSQL database.
- For Gmail, use an **App Password** where supported, not your normal Gmail password. Keep it private.
- `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` sends email through SMTP. `django.core.mail.backends.console.EmailBackend` only prints email content in the server terminal and does **not** deliver messages to an inbox.
- `DEBUG=True` is for local development only. For production, use `DEBUG=False` after configuring HTTPS and the required secure-cookie settings. The current IP-only deployment uses HTTP, so do not copy production cookie settings blindly into a local HTTP setup.
- Add any hostname or IP used to open the site to `ALLOWED_HOSTS`.

The project loads `.env` automatically using `python-dotenv`. The `.env` file is intentionally not included in this repository package because it contains private settings.

### 5. Create the PostgreSQL database

Create the database and database user in PostgreSQL, and grant the user access to the database. Ensure the values match `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` in `.env`.

### 6. Apply migrations and create an administrator

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 7. Run the development server

```bash
python manage.py runserver
```

Open http://127.0.0.1:8000/.

## Main pages

| Page | Local URL | Deployed URL |
|---|---|---|
| Home | `/` | http://142.44.160.226/ |
| Registration | `/register/` | http://142.44.160.226/register/ |
| Login | `/login/` | http://142.44.160.226/login/ |
| Dashboard | `/dashboard/` | http://142.44.160.226/dashboard/ |
| Transactions | `/transactions/` | http://142.44.160.226/transactions/ |
| Accounts and categories | `/manage/` | http://142.44.160.226/manage/ |
| Reports | `/reports/` | http://142.44.160.226/reports/ |
| Settings | `/settings/` | http://142.44.160.226/settings/ |
| Django admin | `/admin/` | http://142.44.160.226/admin/ |

## API documentation

| Documentation | Deployed URL |
|---|---|
| Swagger UI | http://142.44.160.226/api/docs/ |
| ReDoc | http://142.44.160.226/api/redoc/ |
| OpenAPI schema | http://142.44.160.226/api/schema/ |

### Authentication endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register/` | Register an account |
| `POST` | `/api/auth/verify-email/` | Verify email using the code sent to the address |
| `POST` | `/api/auth/login/` | Obtain JWT access and refresh tokens |
| `POST` | `/api/auth/token/refresh/` | Refresh an access token |
| `GET`, `PATCH` | `/api/auth/profile/` | Read or update the profile |
| `POST` | `/api/auth/profile/password/` | Change password |
| `POST` | `/api/auth/profile/email/request/` | Request an email change |
| `POST` | `/api/auth/profile/email/confirm/` | Confirm the new email address |

### Finance endpoints

| Methods | Endpoint | Purpose |
|---|---|---|
| `GET`, `POST` | `/api/categories/` | List or create categories |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/api/categories/<id>/` | Retrieve, update or delete a category |
| `GET`, `POST` | `/api/accounts/` | List or create financial accounts |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/api/accounts/<id>/` | Retrieve, update or delete an account |
| `GET`, `POST` | `/api/transactions/` | List or create transactions |
| `GET`, `PUT`, `PATCH`, `DELETE` | `/api/transactions/<id>/` | Retrieve, update or delete a transaction |
| `GET` | `/api/reports/` | Retrieve a financial report |

Protected API requests use a JWT bearer token:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Users should only be able to access their own financial records through the authenticated API.

## Postman collection

**Collection file:** [Finora API — Postman collection JSON](postman/personal-finance-tracker.postman_collection.json)

The JSON file is included in this repository and can be imported into Postman. This is a repository file link, not a separately published Postman web-documentation URL. To create a public Postman documentation link, import the collection into your Postman account and use Postman's Share/Publish documentation feature; then replace or supplement the link above with the actual generated URL.

### Import and use

1. Open [Postman](https://web.postman.co/).
2. Choose **Import** and select `postman/personal-finance-tracker.postman_collection.json` from this project.
3. The collection's `baseUrl` is set to `http://142.44.160.226`. For local testing, change it to `http://127.0.0.1:8000` in the collection variables.
4. Register a test account and verify the email using the code delivered to the configured email address.
5. Run **Login**. On a successful response, the collection stores the `access` and `refresh` tokens.
6. Requests that require authentication use `Authorization: Bearer {{access}}`.
7. Replace example values such as `REPLACE_WITH_CURRENT_PASSWORD`, `REPLACE_WITH_EMAIL_CODE`, and the resource IDs with values from your test account. Create a category and account before creating a transaction.

### API schema validation

```bash
python manage.py spectacular --validate
```

## Deployment notes

The application is deployed on a VPS and served by Gunicorn behind Nginx. The current public entry point is http://142.44.160.226/. The `finora` systemd service is configured to start automatically on boot (`systemctl is-enabled finora` should return `enabled`).

Useful server commands:

```bash
sudo systemctl status finora --no-pager
sudo systemctl restart finora
sudo journalctl -u finora -n 100 --no-pager
sudo nginx -t
sudo systemctl reload nginx
```

The server still depends on the VPS provider, network availability, and active service billing. Automatic service startup does not replace database backups or monitoring.

## Security notes

- Never commit `.env`, SMTP app passwords, database credentials, JWTs, or `SECRET_KEY`.
- Do not publish real user credentials or email verification codes.
- Use `DEBUG=False` and HTTPS for a production deployment before enabling secure-cookie settings.
- Back up the PostgreSQL database regularly.

## License

Educational portfolio project. No separate open-source license has been specified.
