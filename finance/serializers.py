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
        number = obj.card_number
        if not number:
            return ""
        return "*" * max(0, len(number) - 4) + number[-4:]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
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
