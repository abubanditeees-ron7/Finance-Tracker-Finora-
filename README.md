# Finora — Personal Finance Tracker

Finora is a personal finance tracking web application built with Django and Django REST Framework. It helps users manage their income, expenses, financial accounts, categories, and financial reports.

## Features

- User registration and email verification
- JWT authentication and token refresh
- User profile management and password changes
- Email change with verification
- Multilingual interface: English, Russian, and Uzbek
- Income and expense tracking in Uzbek soum (UZS)
- Personal accounts and transaction categories
- Financial reports and dashboard statistics
- API documentation with Swagger UI and OpenAPI
- PostgreSQL database
- Django administration panel

## Tech Stack

- Python
- Django 5.2
- Django REST Framework
- PostgreSQL
- Simple JWT
- drf-spectacular
- HTML, CSS, and JavaScript
- Gunicorn
- WhiteNoise

## Requirements

- Python 3.11 or a compatible Python version
- PostgreSQL
- Git

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Replace the placeholders with your actual GitHub repository URL and project directory.

### 2. Create a virtual environment

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Linux or macOS:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a local `.env` file in the project root, next to `manage.py`.

Use `.env.example` as a template. Copy its variables into `.env` and replace the example values with your own configuration.

Configure the following variables:

- `SECRET_KEY` — a unique, secret Django key of at least 50 characters.
- `DEBUG` — use `True` for local development and `False` for production.
- `ALLOWED_HOSTS` — allowed hostnames separated by commas.
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` — PostgreSQL connection settings.
- `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL` — email configuration.

For local development, the console email backend can be used to inspect outgoing messages in the terminal. Configure an SMTP provider when actual email delivery is required.

**Security:** Never commit `.env` or publish real credentials, email passwords, database passwords, or secret keys.

### 5. Create the PostgreSQL database

Create a PostgreSQL database and a database user, then configure the connection details in `.env`.

Ensure that the database user has the necessary permissions on the project database.

### 6. Apply database migrations

```bash
python manage.py migrate
```

### 7. Create an administrator

```bash
python manage.py createsuperuser
```

### 8. Run the development server

```bash
python manage.py runserver
```

Open the application at:

`http://127.0.0.1:8000/`

## Main Pages

| Page | URL |
|---|---|
| Home | `/` |
| Registration | `/register/` |
| Login | `/login/` |
| Dashboard | `/dashboard/` |
| Transactions | `/transactions/` |
| Accounts and Categories | `/manage/` |
| Reports | `/reports/` |
| Settings | `/settings/` |
| Django Admin | `/admin/` |

## API Documentation

The project provides OpenAPI documentation through drf-spectacular.

| Resource | URL |
|---|---|
| Swagger UI | `/api/docs/` |
| ReDoc | `/api/redoc/` |
| OpenAPI schema | `/api/schema/` |

### Authentication Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register/` | Register a user |
| POST | `/api/auth/verify-email/` | Verify an email address |
| POST | `/api/auth/login/` | Authenticate a user |
| POST | `/api/auth/token/refresh/` | Refresh an access token |
| GET/PATCH | `/api/auth/profile/` | Retrieve or update the profile |
| POST | `/api/auth/profile/password/` | Change password |
| POST | `/api/auth/profile/email/request/` | Request an email change |
| POST | `/api/auth/profile/email/confirm/` | Confirm an email change |

Protected API requests use JWT bearer authentication:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Finance Endpoints

| Endpoint | Purpose |
|---|---|
| `/api/accounts/` | List and create accounts |
| `/api/accounts/<id>/` | Retrieve, update, or delete an account |
| `/api/categories/` | List and create categories |
| `/api/categories/<id>/` | Retrieve, update, or delete a category |
| `/api/transactions/` | List and create transactions |
| `/api/transactions/<id>/` | Retrieve, update, or delete a transaction |
| `/api/reports/` | Retrieve financial reports |

Authenticated users can access only the financial data permitted for their account.

## OpenAPI Schema Validation

Validate the API schema with:

```bash
python manage.py spectacular --validate
```

## Project Configuration

The `.env.example` file documents the environment variables needed to configure the application. Create your own `.env` file locally; do not commit it.

Database migrations are included in the project and should be applied with `python manage.py migrate`.

## Deployment

Production deployment requires a configured PostgreSQL database, production environment variables, an appropriate `ALLOWED_HOSTS` setting, static-file configuration, and a production application server.

Deployment instructions and the production URL will be added after deployment is completed.

## License

This project was developed as an educational portfolio project. No separate open-source license has been specified.
