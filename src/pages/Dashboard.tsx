import { DollarSign, Receipt, Users, Calendar, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/StatCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const recentExpenses = [
    { id: 1, description: "Team Lunch", amount: 125.50, category: "Food", paidBy: "John Doe", date: "2024-01-15" },
    { id: 2, description: "Office Supplies", amount: 89.99, category: "Office", paidBy: "Jane Smith", date: "2024-01-14" },
    { id: 3, description: "Client Meeting", amount: 450.00, category: "Travel", paidBy: "Mike Johnson", date: "2024-01-13" },
    { id: 4, description: "Software License", amount: 299.00, category: "Software", paidBy: "Sarah Williams", date: "2024-01-12" },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track and manage your team's expenses</p>
          </div>
          <Button onClick={() => navigate("/expenses")} className="gradient-primary border-0 shadow-medium hover:shadow-strong transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Spent"
            value="$4,964.49"
            icon={DollarSign}
            trend={{ value: "12.5% from last month", isPositive: false }}
            iconColor="text-primary"
          />
          <StatCard
            title="Transactions"
            value="48"
            icon={Receipt}
            trend={{ value: "8 this week", isPositive: true }}
            iconColor="text-accent"
          />
          <StatCard
            title="Team Members"
            value="12"
            icon={Users}
            iconColor="text-success"
          />
          <StatCard
            title="Avg per Member"
            value="$413.71"
            icon={TrendingUp}
            trend={{ value: "5.2% increase", isPositive: true }}
            iconColor="text-warning"
          />
        </div>

        {/* Recent Expenses */}
        <Card className="border-border/50 shadow-medium">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-xl font-semibold">Recent Expenses</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/expenses")} className="text-primary hover:text-primary/80">
              View All →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Receipt className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{expense.category}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{expense.paidBy}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
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

export default Dashboard;
