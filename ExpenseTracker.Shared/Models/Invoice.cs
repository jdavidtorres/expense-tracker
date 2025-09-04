using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ExpenseTracker.Shared.Models;

public class Invoice : Expense
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "invoice";

    [Required(ErrorMessage = "Invoice number is required")]
    [StringLength(50, ErrorMessage = "Invoice number cannot be longer than 50 characters")]
    public string InvoiceNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Payment status is required")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    public string? AttachmentUrl { get; set; }
}
