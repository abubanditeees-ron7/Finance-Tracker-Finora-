"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

from config.views import (
    landing_page,
    dashboard,
    transactions_page,
    manage_page,
    reports_page,
    settings_page,
)
from accounts.views import( 
    login_page, 
    register_page,
)


urlpatterns = [
    path("", landing_page, name="home"),
    path("dashboard/", dashboard, name="dashboard"),
    path("login/", login_page, name="login-page"),
    path("register/", register_page, name="register-page"),
    path("transactions/", transactions_page, name="transactions-page"),
    path("manage/", manage_page, name="manage"),
    path("reports/", reports_page, name="reports"),
    path("settings/", settings_page, name="settings"),
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/", include("finance.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]
