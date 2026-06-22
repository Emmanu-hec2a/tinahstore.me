from django.contrib import admin
from .models import MpesaTransaction

@admin.register(MpesaTransaction)
class MpesaTransactionAdmin(admin.ModelAdmin):
    list_display = (
        'order', 'checkout_request_id', 'mpesa_receipt_number',
        'result_code', 'created_at'
    )
    search_fields = ('checkout_request_id', 'mpesa_receipt_number')
    readonly_fields = ('created_at',)
