import calendar
from datetime import date, timedelta
from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Transaction


def get_report_dates(period, date_from=None, date_to=None):
    today = timezone.localdate()

    if period == "day":
        return today, today

    if period == "week":
        start = today - timedelta(days=today.weekday())
        return start, start + timedelta(days=6)

    if period == "month":
        return today.replace(day=1), today

    if period == "year":
        return today.replace(month=1, day=1), today

    if period == "custom":
        if not date_from or not date_to:
            raise ValidationError(
                "For custom reports, provide date_from and date_to."
            )

        try:
            start = date.fromisoformat(date_from)
            end = date.fromisoformat(date_to)
        except (TypeError, ValueError):
            raise ValidationError(
                "Dates must use YYYY-MM-DD format."
            )

        if start > end:
            raise ValidationError(
                "date_from must not be later than date_to."
            )

        if (end - start).days > 3660:
            raise ValidationError(
                "The selected date range cannot exceed 10 years."
            )

        return start, end

    raise ValidationError(
        "period must be day, week, month, year, or custom."
    )


def build_category_summary(queryset):
    rows = (
        queryset.values(
            "category_id",
            "category__name",
            "category__color",
        )
        .annotate(total=Sum("amount"))
        .order_by("-total", "category__name")
    )

    items = [
        {
            "category_id": row["category_id"],
            "category_name": row["category__name"],
            "color": row["category__color"],
            "total": row["total"] or Decimal("0.00"),
        }
        for row in rows
    ]

    total = sum(
        (item["total"] for item in items),
        Decimal("0.00"),
    )

    for item in items:
        item["percentage"] = (
            round(float(item["total"] / total * 100), 2)
            if total
            else 0.0
        )

    return items


def build_finance_report(user, period, date_from=None, date_to=None):
    start, end = get_report_dates(period, date_from, date_to)

    transactions = Transaction.objects.filter(
        user=user,
        date__gte=start,
        date__lte=end,
    )

    income = transactions.filter(kind=Transaction.Kind.INCOME)
    expenses = transactions.filter(kind=Transaction.Kind.EXPENSE)

    total_income = income.aggregate(total=Sum("amount"))["total"] or Decimal("0.00")
    total_expense = expenses.aggregate(total=Sum("amount"))["total"] or Decimal("0.00")

    return {
        "date_from": start,
        "date_to": end,
        "currency": "UZS",
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
        "income_by_category": build_category_summary(income),
        "expense_by_category": build_category_summary(expenses),
    }
