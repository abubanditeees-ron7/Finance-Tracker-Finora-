from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, FinancialAccount, Transaction


User = get_user_model()


class FinanceSecurityTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="finance_user_a",
            email="user_a@example.com",
            password="StrongTestPassword123!",
        )
        self.user_b = User.objects.create_user(
            username="finance_user_b",
            email="user_b@example.com",
            password="StrongTestPassword123!",
        )

        self.account_a = FinancialAccount.objects.create(
            user=self.user_a,
            name="User A account",
            account_type=FinancialAccount.AccountType.CASH,
        )
        self.account_b = FinancialAccount.objects.create(
            user=self.user_b,
            name="User B account",
            account_type=FinancialAccount.AccountType.CASH,
        )

        self.category_a = Category.objects.create(
            user=self.user_a,
            name="User A income",
            kind=Category.Kind.INCOME,
        )
        self.category_b = Category.objects.create(
            user=self.user_b,
            name="User B income",
            kind=Category.Kind.INCOME,
        )

        self.transaction_a = Transaction.objects.create(
            user=self.user_a,
            account=self.account_a,
            category=self.category_a,
            kind=Transaction.Kind.INCOME,
            amount="100000.00",
            date=date(2026, 10, 1),
            comment="User A transaction",
        )
        self.transaction_b = Transaction.objects.create(
            user=self.user_b,
            account=self.account_b,
            category=self.category_b,
            kind=Transaction.Kind.INCOME,
            amount="200000.00",
            date=date(2026, 10, 2),
            comment="User B transaction",
        )

        self.client.force_authenticate(user=self.user_a)

    def test_category_list_contains_only_current_users_categories(self):
        response = self.client.get(reverse("category-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        category_ids = {
            item["id"] for item in response.data["results"]
        }

        self.assertIn(self.category_a.id, category_ids)
        self.assertNotIn(self.category_b.id, category_ids)

    def test_account_list_contains_only_current_users_accounts(self):
        response = self.client.get(reverse("account-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        account_ids = {
            item["id"] for item in response.data["results"]
        }

        self.assertIn(self.account_a.id, account_ids)
        self.assertNotIn(self.account_b.id, account_ids)

    def test_transaction_list_contains_only_current_users_transactions(self):
        response = self.client.get(reverse("transaction-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        transaction_ids = {
            item["id"] for item in response.data["results"]
        }

        self.assertIn(self.transaction_a.id, transaction_ids)
        self.assertNotIn(self.transaction_b.id, transaction_ids)

    def test_user_cannot_retrieve_another_users_transaction(self):
        response = self.client.get(
            reverse(
                "transaction-detail",
                kwargs={"pk": self.transaction_b.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_update_another_users_transaction(self):
        response = self.client.patch(
            reverse(
                "transaction-detail",
                kwargs={"pk": self.transaction_b.id},
            ),
            {"comment": "Unauthorized change"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        self.transaction_b.refresh_from_db()
        self.assertEqual(
            self.transaction_b.comment,
            "User B transaction",
        )

    def test_user_cannot_delete_another_users_transaction(self):
        response = self.client.delete(
            reverse(
                "transaction-detail",
                kwargs={"pk": self.transaction_b.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(
            Transaction.objects.filter(pk=self.transaction_b.id).exists()
        )

    def test_transaction_cannot_use_another_users_account(self):
        response = self.client.post(
            reverse("transaction-list"),
            {
                "account": self.account_b.id,
                "category": self.category_a.id,
                "kind": "income",
                "amount": "50000.00",
                "date": "2026-10-10",
                "comment": "Test foreign account",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_transaction_cannot_use_another_users_category(self):
        response = self.client.post(
            reverse("transaction-list"),
            {
                "account": self.account_a.id,
                "category": self.category_b.id,
                "kind": "income",
                "amount": "50000.00",
                "date": "2026-10-10",
                "comment": "Test foreign category",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_transaction_category_type_must_match_transaction_type(self):
        expense_category = Category.objects.create(
            user=self.user_a,
            name="User A expense",
            kind=Category.Kind.EXPENSE,
        )

        response = self.client.post(
            reverse("transaction-list"),
            {
                "account": self.account_a.id,
                "category": expense_category.id,
                "kind": "income",
                "amount": "50000.00",
                "date": "2026-10-10",
                "comment": "Test mismatched category",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    
    def test_transaction_amount_must_be_positive(self):
        response = self.client.post(
            reverse("transaction-list"),
            {
                "account": self.account_a.id,
                "category": self.category_a.id,
                "kind": "income",
                "amount": "0.00",
                "date": "2026-10-10",
                "comment": "Test invalid amount",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_account_rejects_full_card_number(self):
        response = self.client.post(
            reverse("account-list"),
            {
                "name": "Test card",
                "account_type": "card",
                "bank_name": "Test bank",
                "card_number": "4111111111111111",
                "color": "#0D9488",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
