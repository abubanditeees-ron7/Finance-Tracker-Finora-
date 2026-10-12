from datetime import timedelta
from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone

from rest_framework import serializers

from .models import Category, FinancialAccount, Transaction

from drf_spectacular.utils import extend_schema_field


class CategorySerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "user",
            "name",
            "kind",
            "color",
            "created_at",
        ]
        read_only_fields = ["id", "user", "created_at"]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")

        user = self.context["request"].user
        kind = self.initial_data.get("kind")

        queryset = Category.objects.filter(
            user=user,
            name__iexact=value,
        )
        if kind:
            queryset = queryset.filter(kind=kind)

        instance = getattr(self, "instance", None)
        if instance:
            queryset = queryset.exclude(pk=instance.pk)

        if queryset.exists():
            raise serializers.ValidationError(
                "You already have a category with this name and type."
            )
        return value

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class FinancialAccountSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    masked_card_number = serializers.SerializerMethodField()

    class Meta:
        model = FinancialAccount
        fields = [
            "id",
            "user",
            "name",
            "account_type",
            "bank_name",
            "card_number",
            "masked_card_number",
            "color",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "masked_card_number",
            "created_at",
        ]
        extra_kwargs = {
            "card_number": {"write_only": True},
        }

    
    @extend_schema_field(serializers.CharField())
    def get_masked_card_number(self, obj):
        import re

        value = (obj.card_number or "").strip()
        if not value:
            return ""

        digits = re.sub(r"\D", "", value)

        if len(digits) >= 12:
            return f"•••• {digits[-4:]}"

        if value.isdigit() and len(value) <= 4:
            return value

        return value

    
    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    
class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    account = serializers.PrimaryKeyRelatedField(
        queryset=FinancialAccount.objects.none()
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.none()
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "user",
            "account",
            "category",
            "kind",
            "amount",
            "date",
            "comment",
            "receipt_image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["account"].queryset = (
                FinancialAccount.objects.filter(user=request.user)
            )
            self.fields["category"].queryset = (
                Category.objects.filter(user=request.user)
            )

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Amount must be greater than zero."
            )
        return value

    def validate(self, attrs):
        kind = attrs.get("kind")
        category = attrs.get("category")

        if category is None and self.instance:
            category = self.instance.category

        if kind is None and self.instance:
            kind = self.instance.kind

        if category and kind and category.kind != kind:
            raise serializers.ValidationError({
                "category": (
                    "Category type must match the transaction type."
                )
            })

        return attrs

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class CategorySummarySerializer(serializers.Serializer):
    category_id = serializers.IntegerField()
    category_name = serializers.CharField()
    color = serializers.CharField()
    total = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
    )
    percentage = serializers.FloatField()


class FinanceReportSerializer(serializers.Serializer):
    date_from = serializers.DateField()
    date_to = serializers.DateField()
    currency = serializers.CharField(default="UZS")

    total_income = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
    )
    total_expense = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
    )
    balance = serializers.DecimalField(
        max_digits=14,
        decimal_places=2,
    )

    income_by_category = CategorySummarySerializer(many=True)
    expense_by_category = CategorySummarySerializer(many=True)




class FinanceReportQuerySerializer(serializers.Serializer):
    period = serializers.ChoiceField(
        choices=["day", "week", "month", "year", "custom"],
        default="month",
        required=False,
    )
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)

    def validate(self, attrs):
        period = attrs.get("period", "month")
        start = attrs.get("date_from")
        end = attrs.get("date_to")
        if period == "custom":
            if not start or not end:
                raise serializers.ValidationError(
                    "For custom reports, provide date_from and date_to."
                )
        
        if start and end and start > end:
            raise serializers.ValidationError({
                "date_from": "date_from must not be later than date_to."
            })

        if start and end and (end - start).days > 3660:
            raise serializers.ValidationError({
                "date_to": "The selected date range cannot exceed 10 years."
            })

        return attrs
    
    def get_report_dates(self):
        period = self.validated_data.get("period", "month")
        date_from = self.validated_data.get("date_from")
        date_to = self.validated_data.get("date_to")
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
        return date_from, date_to
    @staticmethod
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
    def build_report(self, user):
        start, end = self.get_report_dates()
        transactions = Transaction.objects.filter(
        user=user,
        date__gte=start,
        date__lte=end,
        )
        income = transactions.filter(kind=Transaction.Kind.INCOME)
        expenses = transactions.filter(kind=Transaction.Kind.EXPENSE)
        total_income = (
        income.aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
        )
        total_expense = (
        expenses.aggregate(total=Sum("amount"))["total"]
        or Decimal("0.00")
        )
        return {
        "date_from": start,
        "date_to": end,
        "currency": "UZS",
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": total_income - total_expense,
        "income_by_category": self.build_category_summary(income),
        "expense_by_category": self.build_category_summary(expenses),
        }
