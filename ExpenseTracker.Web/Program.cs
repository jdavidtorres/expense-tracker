using ExpenseTracker.Shared.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Configure HttpClient for API access
builder.Services.AddHttpClient<ExpenseService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8083/");
});

// Register custom services
builder.Services.AddScoped<ExpenseService>();

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
