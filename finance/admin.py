from django.contrib import admin
from .models import Category, FinancialAccount, Transaction


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "kind", "user", "color", "created_at")
    list_filter = ("kind",)
    search_fields = ("name", "user__username")


@admin.register(FinancialAccount)
class FinancialAccountAdmin(admin.ModelAdmin):
    list_display = ("name", "account_type", "user", "bank_name")
    list_filter = ("account_type",)
    search_fields = ("name", "bank_name", "user__username")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id", "user", "kind", "amount", "date", "category", "account"
    )
    list_filter = ("kind", "date", "category")
    search_fields = ("user__username", "comment")
    date_hierarchy = "date"
    list_select_related = ("user", "category", "account")
