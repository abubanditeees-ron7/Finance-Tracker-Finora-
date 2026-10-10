from django.urls import path

from .views import (
    AccountDetailView,
    AccountListCreateView,
    CategoryDetailView,
    CategoryListCreateView,
    TransactionDetailView,
    TransactionListCreateView,
    FinanceReportView,
)

urlpatterns = [
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path(
        "categories/<int:pk>/",
        CategoryDetailView.as_view(),
        name="category-detail",
    ),
    path("accounts/", AccountListCreateView.as_view(), name="account-list"),
    path(
        "accounts/<int:pk>/",
        AccountDetailView.as_view(),
        name="account-detail",
    ),
    path(
        "transactions/",
        TransactionListCreateView.as_view(),
        name="transaction-list",
    ),
    path(
        "transactions/<int:pk>/",
        TransactionDetailView.as_view(),
        name="transaction-detail",
    ),
    path("reports/", 
        FinanceReportView.as_view(), 
        name="finance-report"),
]
