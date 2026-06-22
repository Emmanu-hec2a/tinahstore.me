from django.urls import path
from .views import mpesa_initiate, mpesa_callback, mpesa_query, mpesa_status, MpesaTransactionListView

urlpatterns = [
    path('transactions/', MpesaTransactionListView.as_view(), name='mpesa-transactions'),
    path('mpesa/initiate/', mpesa_initiate, name='mpesa-initiate'),
    path('mpesa/callback/', mpesa_callback, name='mpesa-callback'),
    path('mpesa/query/', mpesa_query, name='mpesa-query'),
    path('mpesa/status/<str:checkout_request_id>/', mpesa_status, name='mpesa-status'),
]
