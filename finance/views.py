from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, FinancialAccount, Transaction
from .pagination import FinancePagination
from .serializers import (
    CategorySerializer,
    FinancialAccountSerializer,
    TransactionSerializer,
    FinanceReportSerializer,
    FinanceReportQuerySerializer,
)

from drf_spectacular.utils import( 
    extend_schema_view, 
    extend_schema,
)


class OwnedListCreateView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = FinancePagination
    serializer_class = None
    model = None

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)

    def get(self, request):
        queryset = self.get_queryset()

        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
            ) if self.model in (Category, FinancialAccount) else queryset.filter(
                Q(comment__icontains=search)
            )

        if self.model is Transaction:
            kind = request.query_params.get("kind")
            if kind in ("income", "expense"):
                queryset = queryset.filter(kind=kind)

            category_id = request.query_params.get("category")
            if category_id and category_id.isdigit():
                queryset = queryset.filter(category_id=category_id)

            date_from = request.query_params.get("date_from")
            date_to = request.query_params.get("date_to")
            if date_from:
                queryset = queryset.filter(date__gte=date_from)
            if date_to:
                queryset = queryset.filter(date__lte=date_to)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


class OwnedDetailView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = None
    model = None
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_queryset(self):
        return self.model.objects.filter(user=self.request.user)

    def get_object(self):
        return get_object_or_404(
            self.get_queryset(),
            pk=self.kwargs["pk"],
        )

    def get(self, request, pk):
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    def put(self, request, pk):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def patch(self, request, pk):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        self.get_object().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CategoryListCreateView(OwnedListCreateView):
    model = Category
    serializer_class = CategorySerializer


@extend_schema_view(
    get=extend_schema(operation_id="category_detail"),
)
class CategoryDetailView(OwnedDetailView):
    model = Category
    serializer_class = CategorySerializer


class AccountListCreateView(OwnedListCreateView):
    model = FinancialAccount
    serializer_class = FinancialAccountSerializer


@extend_schema_view(
    get=extend_schema(operation_id="account_detail"),
)
class AccountDetailView(OwnedDetailView):
    model = FinancialAccount
    serializer_class = FinancialAccountSerializer


class TransactionListCreateView(OwnedListCreateView):
    model = Transaction
    serializer_class = TransactionSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]


@extend_schema_view(
    get=extend_schema(operation_id="transaction_detail"),
)
class TransactionDetailView(OwnedDetailView):
    model = Transaction
    serializer_class = TransactionSerializer



class FinanceReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query_serializer = FinanceReportQuerySerializer(
            data=request.query_params,
        )
        query_serializer.is_valid(raise_exception=True)

        report = query_serializer.build_report(request.user)

        return Response(
            FinanceReportSerializer(report).data
        )
