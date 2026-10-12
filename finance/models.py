import re

from django.core.exceptions import ValidationError
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Q

from decimal import Decimal


def validate_card_reference(value):
    """Reject full bank card numbers."""
    digits = re.sub(r"\D", "", value or "")

    if len(digits) >= 12:
        raise ValidationError(
            "Enter a card label or a short reference, "
            "not a full card number."
        )


class Category(models.Model):
    class Kind(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="finance_categories",
    )
    name = models.CharField(max_length=100)
    kind = models.CharField(max_length=10, choices=Kind.choices)
    color = models.CharField(max_length=7, default="#4F46E5")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name", "kind"],
                name="unique_user_category_name_kind",
            ),
        ]

    def __str__(self):
        return f"{self.name} ({self.kind})"


class FinancialAccount(models.Model):
    class AccountType(models.TextChoices):
        CASH = "cash", "Cash"
        CARD = "card", "Bank card"
        BANK = "bank", "Bank account"
        OTHER = "other", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="financial_accounts",
    )
    name = models.CharField(max_length=100)
    account_type = models.CharField(
        max_length=10,
        choices=AccountType.choices,
        default=AccountType.CASH,
    )
    bank_name = models.CharField(max_length=100, blank=True)
    card_number = models.CharField(
        max_length=30,
        blank=True,
        validators=[validate_card_reference],
    )
    color = models.CharField(max_length=7, default="#0D9488")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class Transaction(models.Model):
    class Kind(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    account = models.ForeignKey(
        FinancialAccount,
        on_delete=models.PROTECT,
        related_name="transactions",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="transactions",
    )
    kind = models.CharField(max_length=10, choices=Kind.choices)
    amount = models.DecimalField(
        max_digits=14,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    date = models.DateField()
    comment = models.TextField(blank=True)
    receipt_image = models.ImageField(
        upload_to="receipts/%Y/%m/",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        indexes = [
            models.Index(fields=["user", "date"]),
            models.Index(fields=["user", "kind", "date"]),
        ]
        constraints = [
            models.CheckConstraint(
                condition=Q(amount__gt=0),
                name="transaction_amount_positive",
            ),
        ]

    def __str__(self):
        return f"{self.kind}: {self.amount} UZS - {self.date}"
