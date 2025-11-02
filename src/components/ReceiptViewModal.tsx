import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReceiptViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptUrl: string | null;
}

const ReceiptViewModal = ({ open, onOpenChange, receiptUrl }: ReceiptViewModalProps) => {
  if (!receiptUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Receipt Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img 
            src={receiptUrl} 
            alt="Receipt" 
            className="w-full h-auto rounded-lg border border-border"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptViewModal;
