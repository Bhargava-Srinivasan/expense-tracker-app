import { useState, useMemo } from "react";
import { Plus, Search, Filter, Download, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import AddExpenseModal from "@/components/AddExpenseModal";
import ReceiptViewModal from "@/components/ReceiptViewModal";
import { toast } from "sonner";

export interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  paidBy: string;
  receipt: boolean;
  receiptUrl?: string;
}

const Expenses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: "2024-01-15", category: "Food", description: "Team Lunch", amount: 125.50, paidBy: "John Doe", receipt: true, receiptUrl: "https://images.unsplash.com/photo-1554224311-beee4ead2e18?w=400" },
    { id: 2, date: "2024-01-14", category: "Office", description: "Office Supplies", amount: 89.99, paidBy: "Jane Smith", receipt: true, receiptUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400" },
    { id: 3, date: "2024-01-13", category: "Travel", description: "Client Meeting", amount: 450.00, paidBy: "Mike Johnson", receipt: true, receiptUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400" },
    { id: 4, date: "2024-01-12", category: "Software", description: "Software License", amount: 299.00, paidBy: "Sarah Williams", receipt: false },
    { id: 5, date: "2024-01-11", category: "Food", description: "Coffee Meeting", amount: 45.75, paidBy: "John Doe", receipt: true, receiptUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
    { id: 6, date: "2024-01-10", category: "Travel", description: "Airport Transfer", amount: 85.00, paidBy: "Mike Johnson", receipt: true, receiptUrl: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400" },
    { id: 7, date: "2024-01-09", category: "Office", description: "Printer Paper", amount: 32.50, paidBy: "Jane Smith", receipt: false },
    { id: 8, date: "2024-01-08", category: "Food", description: "Team Dinner", amount: 275.80, paidBy: "Sarah Williams", receipt: true, receiptUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400" },
  ]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          expense.paidBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || expense.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, categoryFilter]);

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    const id = Math.max(...expenses.map(e => e.id), 0) + 1;
    setExpenses([{ ...newExpense, id }, ...expenses]);
    toast.success("Expense added successfully!");
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success("Expense deleted successfully!");
  };

  const handleViewReceipt = (receiptUrl: string) => {
    setSelectedReceipt(receiptUrl);
    setReceiptModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = [
      ["Date", "Category", "Description", "Amount", "Paid By", "Receipt"],
      ...filteredExpenses.map(e => [
        e.date,
        e.category,
        e.description,
        e.amount.toFixed(2),
        e.paidBy,
        e.receipt ? "Yes" : "No"
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Expenses exported successfully!");
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      Office: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      Travel: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      Software: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return colors[category] || "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Expenses</h1>
            <p className="text-muted-foreground">View and manage all team expenses</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gradient-primary border-0 shadow-medium hover:shadow-strong transition-all">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/50 shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48 bg-background">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full md:w-auto" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card className="border-border/50 shadow-medium">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Paid By</TableHead>
                    <TableHead className="font-semibold text-center">Receipt</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          {new Date(expense.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(expense.category)}>
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="font-semibold text-primary">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{expense.paidBy}</TableCell>
                        <TableCell className="text-center">
                          {expense.receipt && expense.receiptUrl ? (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewReceipt(expense.receiptUrl!)}
                            >
                              <FileText className="h-4 w-4 text-primary" />
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">No receipt</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-destructive"
                            onClick={() => handleDeleteExpense(expense.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredExpenses.length}</span> expense{filteredExpenses.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <AddExpenseModal open={isModalOpen} onOpenChange={setIsModalOpen} onAdd={handleAddExpense} />
      <ReceiptViewModal 
        open={receiptModalOpen} 
        onOpenChange={setReceiptModalOpen}
        receiptUrl={selectedReceipt}
      />
    </div>
  );
};

export default Expenses;
