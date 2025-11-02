import { useState } from "react";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (expense: {
    date: string;
    category: string;
    description: string;
    amount: number;
    paidBy: string;
    receipt: boolean;
    receiptUrl?: string;
  }) => void;
}

const AddExpenseModal = ({ open, onOpenChange, onAdd }: AddExpenseModalProps) => {
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!date || !description || !category || !amount || !paidBy) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create receipt URL from uploaded file
    let receiptUrl: string | undefined;
    if (receipt) {
      receiptUrl = URL.createObjectURL(receipt);
    }

    // Add the expense
    onAdd({
      date: date.toISOString().split('T')[0],
      description,
      category,
      amount: parseFloat(amount),
      paidBy,
      receipt: !!receipt,
      receiptUrl,
    });
    
    // Reset form
    setDate(undefined);
    setDescription("");
    setCategory("");
    setAmount("");
    setPaidBy("");
    setReceipt(null);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Expense</DialogTitle>
          <DialogDescription>
            Fill in the details below to record a new expense
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="e.g., Team lunch at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background"
            />
          </div>

          {/* Category and Amount - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="office">Office Supplies</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By *</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
                <SelectItem value="mike">Mike Johnson</SelectItem>
                <SelectItem value="sarah">Sarah Williams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt (Optional)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById("receipt")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {receipt ? receipt.name : "Upload receipt"}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full gradient-primary border-0 shadow-medium hover:shadow-strong transition-all">
            Save Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
