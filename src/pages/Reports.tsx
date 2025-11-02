import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Reports = () => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const categoryData = [
    { name: "Food", value: 447.05, color: "hsl(var(--primary))" },
    { name: "Travel", value: 535.00, color: "hsl(var(--accent))" },
    { name: "Office", value: 122.49, color: "hsl(var(--success))" },
    { name: "Software", value: 299.00, color: "hsl(var(--warning))" },
  ];

  const memberData = [
    { name: "John Doe", amount: 171.25 },
    { name: "Jane Smith", amount: 122.49 },
    { name: "Mike Johnson", amount: 535.00 },
    { name: "Sarah Williams", amount: 574.80 },
  ];

  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Reports</h1>
            <p className="text-muted-foreground">Analyze spending patterns and trends</p>
          </div>
          
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-popover" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border/50 shadow-soft">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Total Expenses</p>
              <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-soft">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Average per Category</p>
              <p className="text-3xl font-bold">${(totalExpenses / categoryData.length).toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-soft">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Team Members</p>
              <p className="text-3xl font-bold">{memberData.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Breakdown Pie Chart */}
          <Card className="border-border/50 shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Expense by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Member Spending Bar Chart */}
          <Card className="border-border/50 shadow-medium">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Expense by Team Member</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={memberData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => value.split(" ")[0]}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value) => [`$${value}`, "Amount"]}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown Table */}
        <Card className="border-border/50 shadow-medium">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-4">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }} />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {((category.value / totalExpenses) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${category.value.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
