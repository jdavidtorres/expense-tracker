using System.Text;
using System.Text.Json;
using ExpenseTracker.Shared.Models;
using Microsoft.Extensions.Logging;

namespace ExpenseTracker.Shared.Services;

public class ExpenseService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<ExpenseService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public ExpenseService(HttpClient httpClient, ILogger<ExpenseService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

    // Subscription Methods
    public async Task<List<Subscription>> GetSubscriptionsAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("subscriptions");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Subscription>>(json, _jsonOptions) ?? new();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get subscriptions");
            return new List<Subscription>();
        }
    }

    public async Task<Subscription?> GetSubscriptionAsync(string id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"subscriptions/{id}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Subscription>(json, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get subscription with id {Id}", id);
            return null;
        }
    }

    public async Task<Subscription?> CreateSubscriptionAsync(Subscription subscription)
    {
        try
        {
            var json = JsonSerializer.Serialize(subscription, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("subscriptions", content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Subscription>(responseJson, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create subscription");
            return null;
        }
    }

    public async Task<Subscription?> UpdateSubscriptionAsync(Subscription subscription)
    {
        try
        {
            var json = JsonSerializer.Serialize(subscription, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"subscriptions/{subscription.Id}", content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Subscription>(responseJson, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update subscription with id {Id}", subscription.Id);
            return null;
        }
    }

    public async Task<bool> DeleteSubscriptionAsync(string id)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"subscriptions/{id}");
            response.EnsureSuccessStatusCode();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete subscription with id {Id}", id);
            return false;
        }
    }

    // Invoice Methods
    public async Task<List<Invoice>> GetInvoicesAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("invoices");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Invoice>>(json, _jsonOptions) ?? new();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get invoices");
            return new List<Invoice>();
        }
    }

    public async Task<Invoice?> GetInvoiceAsync(string id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"invoices/{id}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Invoice>(json, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get invoice with id {Id}", id);
            return null;
        }
    }

    public async Task<Invoice?> CreateInvoiceAsync(Invoice invoice)
    {
        try
        {
            var json = JsonSerializer.Serialize(invoice, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("invoices", content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Invoice>(responseJson, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create invoice");
            return null;
        }
    }

    public async Task<Invoice?> UpdateInvoiceAsync(Invoice invoice)
    {
        try
        {
            var json = JsonSerializer.Serialize(invoice, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"invoices/{invoice.Id}", content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Invoice>(responseJson, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to update invoice with id {Id}", invoice.Id);
            return null;
        }
    }

    public async Task<bool> DeleteInvoiceAsync(string id)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"invoices/{id}");
            response.EnsureSuccessStatusCode();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete invoice with id {Id}", id);
            return false;
        }
    }

    // Summary and Reports
    public async Task<ExpensesSummary> GetMonthlySummaryAsync(int year, int month)
    {
        try
        {
            var response = await _httpClient.GetAsync($"summary/monthly?year={year}&month={month}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<ExpensesSummary>(json, _jsonOptions) ?? new ExpensesSummary();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get monthly summary for {Year}-{Month}", year, month);
            return new ExpensesSummary();
        }
    }

    public async Task<ExpensesSummary> GetYearlySummaryAsync(int year)
    {
        try
        {
            var response = await _httpClient.GetAsync($"summary/yearly?year={year}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<ExpensesSummary>(json, _jsonOptions) ?? new ExpensesSummary();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get yearly summary for {Year}", year);
            return new ExpensesSummary();
        }
    }

    // Upload invoice file
    public async Task<FileUploadResult?> UploadInvoiceFileAsync(Stream fileStream, string fileName)
    {
        try
        {
            using var content = new MultipartFormDataContent();
            using var fileContent = new StreamContent(fileStream);

            content.Add(fileContent, "file", fileName);

            var response = await _httpClient.PostAsync("invoices/upload", content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<FileUploadResult>(responseJson, _jsonOptions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload invoice file {FileName}", fileName);
            return null;
        }
    }
}
