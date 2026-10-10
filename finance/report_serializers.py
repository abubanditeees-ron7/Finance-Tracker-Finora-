from rest_framework import serializers


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
