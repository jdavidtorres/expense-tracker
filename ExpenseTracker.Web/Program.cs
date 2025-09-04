using ExpenseTracker.Shared.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Configure HttpClient for API access with better error handling
builder.Services.AddHttpClient<ExpenseService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8083/api/");
    client.Timeout = TimeSpan.FromSeconds(30);
});

// Register custom services
builder.Services.AddScoped<ExpenseService>();

// Add logging
builder.Logging.AddConsole();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<ExpenseTracker.Web.Components.App>()
    .AddInteractiveServerRenderMode();

app.Run();
