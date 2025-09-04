# Expense Tracker - AI Coding Guidelines

## Architecture Overview
Cross-platform .NET MAUI Blazor Hybrid application for tracking subscriptions and invoices, with additional Blazor Web support.

**Key Components:**
- `ExpenseService` - Central service for API communication to `localhost:8083` using HttpClient
- Blazor components with shared logic across platforms
- Data models: `Expense`, `Subscription`, `Invoice` with inheritance
- Dashboard with expense summaries and category breakdowns
- Native platform integration through .NET MAUI

## Core Patterns

### Blazor Component Structure
```csharp
@page "/subscriptions"
@using ExpenseTracker.Models
@using ExpenseTracker.Services
@inject ExpenseService ExpenseService
@inject IJSRuntime JSRuntime

<PageTitle>Subscriptions</PageTitle>

<div class="container-fluid">
    <h2>Subscriptions</h2>
    <!-- Component content -->
</div>

@code {
    private List<Subscription> subscriptions = new();
    private bool loading = true;
    private string? error;

    protected override async Task OnInitializedAsync()
    {
        await LoadSubscriptions();
    }

    private async Task LoadSubscriptions()
    {
        try
        {
            loading = true;
            subscriptions = await ExpenseService.GetSubscriptionsAsync();
        }
        catch (Exception ex)
        {
            error = $"Failed to load subscriptions: {ex.Message}";
        }
        finally
        {
            loading = false;
        }
    }
}
```

### Service Registration (MauiProgram.cs)
```csharp
public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
            });

        builder.Services.AddMauiBlazorWebView();
        builder.Services.AddHttpClient<ExpenseService>(client =>
        {
            client.BaseAddress = new Uri("http://localhost:8083/api/");
        });

#if DEBUG
        builder.Services.AddBlazorWebViewDeveloperTools();
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
```

### HttpClient Service Pattern
```csharp
public class ExpenseService
{
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions;

    public ExpenseService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
    }

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
            // Log error
            return new List<Subscription>();
        }
    }
}
```

### Error Handling
```csharp
private async Task<T?> HandleApiCall<T>(Func<Task<T>> apiCall, string operation)
{
    try
    {
        return await apiCall();
    }
    catch (HttpRequestException ex)
    {
        Logger.LogError(ex, "HTTP error in {Operation}", operation);
        throw new ApplicationException($"Network error in {operation}");
    }
    catch (Exception ex)
    {
        Logger.LogError(ex, "Unexpected error in {Operation}", operation);
        throw;
    }
}
```

### Platform-Specific Code
```csharp
#if ANDROID
    // Android-specific implementation
#elif IOS
    // iOS-specific implementation
#elif WINDOWS
    // Windows-specific implementation
#elif MACCATALYST
    // macOS-specific implementation
#endif
```

## Best Practices & Standards

### C# and .NET Standards
- Use nullable reference types and null-conditional operators
- Implement proper async/await patterns
- Use record types for immutable data models
- Follow SOLID principles and dependency injection

### Blazor Best Practices
- Use @code blocks for component logic
- Implement IDisposable for cleanup when needed
- Use StateHasChanged() sparingly and only when necessary
- Prefer one-way data binding with event callbacks

```csharp
// Proper component lifecycle
public void Dispose()
{
    // Clean up resources, cancel tokens, etc.
}

// Event handling pattern
[Parameter] public EventCallback<Subscription> OnSubscriptionChanged { get; set; }

private async Task NotifySubscriptionChanged()
{
    await OnSubscriptionChanged.InvokeAsync(subscription);
}
```

### MAUI Best Practices
- Use platform-specific folder structure for custom implementations
- Implement proper navigation using Shell or traditional navigation
- Handle app lifecycle events appropriately
- Use secure storage for sensitive data

```csharp
// Secure storage example
await SecureStorage.SetAsync("api_token", token);
var token = await SecureStorage.GetAsync("api_token");
```

### Code Quality
- Use dependency injection for services
- Implement proper logging with ILogger
- Handle exceptions gracefully with user-friendly messages
- Use CancellationToken for long-running operations

### Security & Performance
- Validate inputs on both client and server
- Use HTTPS for all API communications
- Implement proper error boundaries
- Cache data appropriately to reduce API calls

## Development Workflow

### Building the Apps
```bash
# Build MAUI app for all platforms
dotnet build -f net9.0-android
dotnet build -f net9.0-ios
dotnet build -f net9.0-windows
dotnet build -f net9.0-maccatalyst

# Build Blazor Web app
dotnet build --project ExpenseTracker.Web

# Run in development
dotnet run --project ExpenseTracker.Maui
dotnet run --project ExpenseTracker.Web
```

### Key Files to Reference
- `Models/Expense.cs` - Data models and interfaces
- `Services/ExpenseService.cs` - API service implementation
- `Components/SubscriptionsList.razor` - CRUD example component
- `Components/Dashboard.razor` - Data loading and chart patterns

## Specific Conventions

### UI Components
- Bootstrap 5 classes for styling across all platforms
- Lucide icons: Reference via CDN or npm package
- Toast notifications using built-in Blazor patterns
- Consistent loading/error state handling

### Data Management
- All API calls through ExpenseService with HttpClient
- Use async/await for all data operations
- Proper error boundaries with fallback UI
- Update component state after successful operations

### Forms and Validation
- Use EditForm with DataAnnotations validation
- Implement proper two-way data binding
- Reset forms after successful operations
- Support both create and edit scenarios

```razor
<EditForm Model="subscription" OnValidSubmit="HandleValidSubmit">
    <DataAnnotationsValidator />
    <ValidationSummary />

    <div class="mb-3">
        <label class="form-label">Name</label>
        <InputText @bind-Value="subscription.Name" class="form-control" />
        <ValidationMessage For="() => subscription.Name" />
    </div>

    <button type="submit" class="btn btn-primary">Save</button>
</EditForm>
```

### Navigation
- Use MAUI Shell navigation for mobile/desktop apps
- Use Blazor Router for web navigation
- Implement proper deep linking support
- Handle back button behavior appropriately

## Common Patterns

### Loading and Error States
```razor
@if (loading)
{
    <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
}
else if (!string.IsNullOrEmpty(error))
{
    <div class="alert alert-danger" role="alert">
        @error
    </div>
}
else
{
    <!-- Content -->
}
```

### CRUD Operations
```csharp
private async Task SaveSubscriptionAsync()
{
    try
    {
        loading = true;

        if (isNewSubscription)
        {
            await ExpenseService.CreateSubscriptionAsync(subscription);
        }
        else
        {
            await ExpenseService.UpdateSubscriptionAsync(subscription);
        }

        await LoadSubscriptions();
        NavigateToList();
    }
    catch (Exception ex)
    {
        error = $"Failed to save subscription: {ex.Message}";
    }
    finally
    {
        loading = false;
    }
}

private async Task DeleteSubscriptionAsync(string id)
{
    if (await JSRuntime.InvokeAsync<bool>("confirm", "Are you sure you want to delete this subscription?"))
    {
        try
        {
            await ExpenseService.DeleteSubscriptionAsync(id);
            await LoadSubscriptions();
        }
        catch (Exception ex)
        {
            error = $"Failed to delete subscription: {ex.Message}";
        }
    }
}
```

## Dependencies
- **.NET 9.0** - Base framework
- **.NET MAUI** - Cross-platform native app development
- **Blazor** - Interactive web UI components
- **Bootstrap 5** - CSS framework for responsive design
- **Lucide Icons** - Modern icon library
- **Chart.js** - Data visualization (via JS interop)
- **System.Text.Json** - JSON serialization
- **Microsoft.Extensions.Http** - HttpClient dependency injection
- **Microsoft.Extensions.Logging** - Logging infrastructure

## Backend Integration
- REST API at `http://localhost:8083/api`
- Endpoints: `/subscriptions`, `/invoices`, `/summary/monthly`, `/summary/yearly`
- JSON serialization with camelCase naming policy
- Proper HTTP status code handling
- File upload support for invoice attachments through multipart/form-data

## Platform-Specific Considerations

### Android
- Network security configuration for localhost development
- File provider for sharing attachments
- Permission handling for storage access

### iOS
- Info.plist configuration for HTTP connections
- File sharing capabilities
- Keychain integration for secure storage

### Windows
- Package.appxmanifest configuration
- File associations for invoice files
- Windows Hello integration possibilities

### Web
- Progressive Web App (PWA) capabilities
- Browser storage limitations
- CORS configuration for API calls
