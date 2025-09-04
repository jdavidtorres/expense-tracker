# Expense Tracker - .NET MAUI & Blazor Edition

A comprehensive cross-platform expense tracking application built with .NET MAUI and Blazor technology stack, providing native mobile, desktop, and web experiences.

## 🚀 Features

- **Cross-Platform Compatibility**: Native apps for Android, iOS, Windows, macOS, and Web browsers
- **Subscription Management**: Track recurring expenses with automated billing cycle calculations
- **Invoice Processing**: Upload and categorize one-time expenses and documents
- **Financial Reporting**: Interactive charts and analytics for expense insights
- **Real-time Sync**: Cloud-based API integration for data synchronization
- **Responsive Design**: Optimized UI for all screen sizes and device types

## 🏗️ Architecture

### Technology Stack
- **.NET 9.0**: Latest framework with enhanced performance
- **.NET MAUI**: Cross-platform native application framework
- **Blazor Hybrid**: Web technologies in native apps via WebView
- **Blazor Server**: Standalone web application
- **Bootstrap 5**: Modern responsive UI framework
- **Chart.js**: Interactive data visualization
- **Lucide Icons**: Beautiful, consistent icon system

### Project Structure
```
ExpenseTracker/
├── ExpenseTracker.Shared/           # Shared business logic
│   ├── Models/                      # Data models and entities
│   │   ├── Expense.cs              # Base expense model
│   │   ├── Subscription.cs         # Recurring subscription model
│   │   └── Invoice.cs              # One-time invoice model
│   └── Services/                    # API communication services
│       └── ExpenseService.cs       # HTTP client service
├── ExpenseTracker.Maui/            # Native cross-platform app
│   ├── Components/                  # Blazor Hybrid components
│   ├── Platforms/                   # Platform-specific code
│   ├── Resources/                   # App icons, images, fonts
│   └── wwwroot/                     # Web assets and styles
├── ExpenseTracker.Web/             # Standalone web application
│   ├── Components/                  # Blazor Server components
│   │   ├── Layout/                 # Navigation and layout
│   │   ├── Pages/                  # Application pages
│   │   └── Shared/                 # Reusable components
│   └── wwwroot/                     # Static web assets
└── ExpenseTracker.sln              # Visual Studio solution
```

## 🛠️ Development Setup

### Prerequisites
- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) with MAUI workload
- [.NET MAUI workload](https://docs.microsoft.com/dotnet/maui/)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-org/expense-tracker-app.git
cd expense-tracker-app

# Restore dependencies
dotnet restore

# Build the solution
dotnet build
```

### Running Applications

#### Web Application
```bash
dotnet run --project ExpenseTracker.Web
# Navigate to http://localhost:5000
```

#### MAUI Applications
```bash
# Windows (WinUI)
dotnet run --project ExpenseTracker.Maui --framework net9.0-windows10.0.19041.0

# Android (requires Android SDK)
dotnet run --project ExpenseTracker.Maui --framework net9.0-android

# iOS (requires Xcode on macOS)
dotnet run --project ExpenseTracker.Maui --framework net9.0-ios
```

## 📱 Platform Support

| Platform | Framework | Minimum Version | Status |
|----------|-----------|----------------|---------|
| Windows | WinUI 3 | Windows 10 1809+ | ✅ Supported |
| Android | Android API | API Level 24+ | ✅ Supported |
| iOS | UIKit | iOS 11.0+ | ✅ Supported |
| macOS | Mac Catalyst | macOS 10.15+ | ✅ Supported |
| Web | Blazor Server | Modern browsers | ✅ Supported |

## 🎯 Core Features

### Subscription Management
- **Billing Cycles**: Monthly, Quarterly, and Yearly options
- **Payment Tracking**: Automatic next billing date calculations
- **Category Organization**: Entertainment, Productivity, Health, Education
- **Status Monitoring**: Visual indicators for upcoming payments

### Dashboard Analytics
- **Expense Overview**: Total subscriptions and monthly spending
- **Payment Alerts**: Upcoming payment notifications
- **Trend Analysis**: Historical spending patterns
- **Category Breakdown**: Spending distribution by category

### Data Management
- **Cloud Sync**: REST API integration at localhost:8083
- **Offline Capability**: Local storage for mobile scenarios
- **Data Validation**: Comprehensive input validation and error handling
- **Export Options**: Data export capabilities for reporting

## 🔧 Configuration

### API Configuration
Update the API base URL in the service registration:

```csharp
// In Program.cs
builder.Services.AddHttpClient<ExpenseService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8083/");
});
```

### Environment Variables
Create a `.env` file in the project root for sensitive configuration:

```env
API_BASE_URL=http://localhost:8083
AZURE_KEY_VAULT_URL=your-keyvault-url
APPLICATION_INSIGHTS_KEY=your-insights-key
```

## 🚀 Deployment

### Web Application
```bash
# Publish for production
dotnet publish ExpenseTracker.Web -c Release -o ./publish

# Deploy to Azure App Service, IIS, or container platform
```

### Mobile Applications
```bash
# Android APK
dotnet publish ExpenseTracker.Maui -f net9.0-android -c Release

# iOS IPA (macOS required)
dotnet publish ExpenseTracker.Maui -f net9.0-ios -c Release

# Windows MSIX
dotnet publish ExpenseTracker.Maui -f net9.0-windows10.0.19041.0 -c Release
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow [Microsoft's .NET coding conventions](https://docs.microsoft.com/dotnet/csharp/fundamentals/coding-style/coding-conventions)
- Write unit tests for new features
- Update documentation for API changes
- Ensure cross-platform compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [.NET MAUI Team](https://github.com/dotnet/maui) for the excellent cross-platform framework
- [Blazor Team](https://github.com/dotnet/aspnetcore) for the innovative web development approach
- [Bootstrap](https://getbootstrap.com/) for the responsive design system
- [Lucide](https://lucide.dev/) for the beautiful icon collection

## 📞 Support

For support and questions:
- 📧 Email: support@expense-tracker.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/expense-tracker-app/issues)
- 📖 Documentation: [Wiki](https://github.com/your-org/expense-tracker-app/wiki)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/expense-tracker-app/discussions)

## Technologies Used

- **.NET 9.0**: Base framework
- **.NET MAUI**: Cross-platform native app development
- **Blazor**: Web UI framework for interactive components
- **Bootstrap 5**: CSS framework for responsive design
- **Lucide Icons**: Modern icon library
- **Chart.js**: Data visualization for expense charts
- **HttpClient**: REST API communication
- **System.Text.Json**: JSON serialization
