from django.shortcuts import render


def landing_page(request):
    return render(request, "landing.html")


def dashboard(request):
    return render(request, "dashboard.html")


def transactions_page(request):
    return render(request, "transactions.html")


def manage_page(request):
    return render(request, "manage.html")
