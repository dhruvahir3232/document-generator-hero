
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Student } from "../StudentCard";

interface FeePaymentReceiptProps {
  student: Student;
}

export function FeePaymentReceipt({ student }: FeePaymentReceiptProps) {
  const receiptId = "R-" + Math.floor(10000 + Math.random() * 90000);
  const currentDate = new Date();
  
  // Mock fee structure
  const feeDetails = [
    { item: "Tuition Fee", amount: 25000 },
    { item: "Library Fee", amount: 2000 },
    { item: "Laboratory Fee", amount: 5000 },
    { item: "Activity Fee", amount: 3000 },
    { item: "Development Fee", amount: 5000 }
  ];
  
  const totalAmount = feeDetails.reduce((total, fee) => total + fee.amount, 0);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="document-preview animate-scale-in">
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden">
          {/* Receipt Header */}
          <div className="bg-primary p-6 text-primary-foreground">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">FEE PAYMENT RECEIPT</h2>
                <p className="opacity-90">University of Excellence</p>
              </div>
              <div className="text-right">
                <p><span className="opacity-80">Receipt No:</span> {receiptId}</p>
                <p><span className="opacity-80">Date:</span> {formatDate(currentDate)}</p>
              </div>
            </div>
          </div>
          
          {/* Student Details */}
          <div className="p-6 bg-secondary/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-muted-foreground">STUDENT NAME</h3>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">STUDENT ID</h3>
                <p className="font-medium">{student.id || "ST-" + Math.floor(10000 + Math.random() * 90000)}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">CLASS</h3>
                <p className="font-medium">{student.class || "Computer Science"}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground">ACADEMIC YEAR</h3>
                <p className="font-medium">{currentDate.getFullYear()} - {currentDate.getFullYear() + 1}</p>
              </div>
            </div>
          </div>
          
          {/* Fee Details */}
          <div className="p-6">
            <h3 className="font-semibold mb-4">Fee Details</h3>
            <div className="space-y-3">
              {feeDetails.map((fee, index) => (
                <div key={index} className="flex justify-between">
                  <span>{fee.item}</span>
                  <span className="font-medium">{formatCurrency(fee.amount)}</span>
                </div>
              ))}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">PAYMENT METHOD</h3>
                  <p className="font-medium">Online Payment</p>
                </div>
                <div className="text-right">
                  <h3 className="text-sm text-muted-foreground mb-1">TRANSACTION ID</h3>
                  <p className="font-medium">TXN-{Math.floor(100000000 + Math.random() * 900000000)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-muted-foreground">
              <p>This is a computer-generated receipt and does not require a signature.</p>
              <p className="text-xs mt-1">For any queries, please contact the Accounts Department.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
