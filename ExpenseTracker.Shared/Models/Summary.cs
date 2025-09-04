namespace ExpenseTracker.Shared.Models;

public class ExpensesSummary
{
    public decimal Total { get; set; }
    public Dictionary<string, decimal> ByCategory { get; set; } = new();
    public decimal MonthlyAverage { get; set; }
    public decimal YearlyTotal { get; set; }
}

public class TimePeriodSummary
{
    public string Period { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
}

public class FileUploadResult
{
    public string FileUrl { get; set; } = string.Empty;
}
