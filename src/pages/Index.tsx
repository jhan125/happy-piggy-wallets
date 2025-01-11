import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiggyBank, Plus, Settings, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletCard } from "@/components/WalletCard";
import { ExpenseOverview } from "@/components/ExpenseOverview";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, UserCircle, HelpCircle, FileText, Mail } from "lucide-react";

interface Wallet {
  id: number;
  name: string;
  balance: number;
  type: string;
  budget: number;
  budgetProgress: number;
  last30Days: number;
  last7Days: number;
  transactions?: Transaction[];
  theme: string;
}

interface Transaction {
  id: string;
  type: "expense" | "income";
  amount: number;
  category: string;
  date: string;
  merchant: string;
}

interface ExportOptions {
  dateRange: { from: Date; to: Date };
  includeExpenses: boolean;
  includeIncome: boolean;
}

export default function Index() {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [total30Days, setTotal30Days] = useState(0);
  const [total7Days, setTotal7Days] = useState(0);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    dateRange: { from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date() },
    includeExpenses: true,
    includeIncome: true,
  });

  useEffect(() => {
    // Initialize default wallets if none exist
    const storedWallets = localStorage.getItem("wallets");
    if (!storedWallets) {
      const defaultWallets: Wallet[] = [
        {
          id: 1,
          name: "Personal",
          balance: 2500,
          type: "personal",
          budget: 3000,
          budgetProgress: 83,
          last30Days: 2000,
          last7Days: 500,
          transactions: [
            {
              id: "1",
              type: "income",
              amount: 3000,
              category: "salary",
              date: new Date().toISOString(),
              merchant: "Company Inc"
            },
            {
              id: "2",
              type: "expense",
              amount: 500,
              category: "food",
              date: new Date().toISOString(),
              merchant: "Grocery Store"
            }
          ],
          theme: "orange"
        },
        {
          id: 2,
          name: "Business",
          balance: 5000,
          type: "business",
          budget: 8000,
          budgetProgress: 63,
          last30Days: 3000,
          last7Days: 1000,
          transactions: [
            {
              id: "3",
              type: "income",
              amount: 6000,
              category: "sales",
              date: new Date().toISOString(),
              merchant: "Client A"
            },
            {
              id: "4",
              type: "expense",
              amount: 1000,
              category: "office",
              date: new Date().toISOString(),
              merchant: "Office Supplies Co"
            }
          ],
          theme: "green"
        }
      ];
      localStorage.setItem("wallets", JSON.stringify(defaultWallets));
      setWallets(defaultWallets);
    } else {
      setWallets(JSON.parse(storedWallets));
    }
  }, []);

  useEffect(() => {
    // Calculate totals
    const balanceTotal = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    const days30Total = wallets.reduce((sum, wallet) => sum + wallet.last30Days, 0);
    const days7Total = wallets.reduce((sum, wallet) => sum + wallet.last7Days, 0);
    setTotalBalance(balanceTotal);
    setTotal30Days(days30Total);
    setTotal7Days(days7Total);
  }, [wallets]);

  // Combine all transactions from all wallets
  const allTransactions = wallets.reduce((acc, wallet) => {
    return [...acc, ...(wallet.transactions || [])];
  }, [] as Transaction[]);

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    if (storedWallets) {
      const parsedWallets = JSON.parse(storedWallets);

      // Calculate real-time data
      const walletsWithRealTimeData = parsedWallets.map((wallet: Wallet) => {
        const transactions = wallet.transactions || [];
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

        // Calculate recent 30 days expenses
        const last30DaysExpenses = transactions
          .filter((t: Transaction) =>
            t.type === "expense" &&
            new Date(t.date) >= thirtyDaysAgo
          )
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

        // Calculate recent 7 days expenses
        const last7DaysExpenses = transactions
          .filter((t: Transaction) =>
            t.type === "expense" &&
            new Date(t.date) >= sevenDaysAgo
          )
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

        // Calculate current month expenses
        const currentMonthExpenses = transactions
          .filter((t: Transaction) =>
            t.type === "expense" &&
            new Date(t.date).getMonth() === now.getMonth()
          )
          .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

        const budgetProgress = wallet.budget > 0
          ? Math.round((currentMonthExpenses / wallet.budget) * 100)
          : 0;

        return {
          ...wallet,
          last30Days: last30DaysExpenses,
          last7Days: last7DaysExpenses,
          budgetProgress
        };
      });

      setWallets(walletsWithRealTimeData);
    }
  }, []);

  const exportToCSV = async () => {
    try {
      const filteredTransactions = allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate >= exportOptions.dateRange.from &&
          transactionDate <= exportOptions.dateRange.to &&
          ((exportOptions.includeExpenses && transaction.type === "expense") ||
            (exportOptions.includeIncome && transaction.type === "income"))
        );
      });

      const csvContent = [
        ["Date", "Type", "Amount", "Category", "Merchant"].join(","),
        ...filteredTransactions.map(t =>
          [
            new Date(t.date).toLocaleDateString(),
            t.type,
            t.amount,
            t.category,
            t.merchant
          ].join(",")
        )
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `WalletData_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({
        title: "Success",
        description: "Your wallet data has been successfully exported to a CSV file."
      });
    } catch (error) {
      toast({
        title: "Failed",
        description: "An error occurred during export, please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome to Happy Piggy Wallets!</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Download className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Wallet Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Date Range</label>
                  <DateRangePicker
                    value={exportOptions.dateRange}
                    onChange={(range) =>
                      setExportOptions(prev => ({
                        ...prev,
                        dateRange: {
                          from: range.from || new Date(),
                          to: range.to || new Date()
                        }
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Type</label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={exportOptions.includeExpenses}
                        onCheckedChange={(checked) =>
                          setExportOptions(prev => ({
                            ...prev,
                            includeExpenses: !!checked
                          }))
                        }
                      />
                      <label>Expenses</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={exportOptions.includeIncome}
                        onCheckedChange={(checked) =>
                          setExportOptions(prev => ({
                            ...prev,
                            includeIncome: !!checked
                          }))
                        }
                      />
                      <label>Income</label>
                    </div>
                  </div>
                </div>
                <Button onClick={exportToCSV} className="w-full">
                  Export CSV
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account & Support">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Account & Support</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/signup")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Sign Up</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  navigate("/");
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Support & Help</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/terms")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Terms and Conditions</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/privacy")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/help")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/support")}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Contact Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="p-6 mb-8 bg-primary text-primary-foreground">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold opacity-50 text-black">${totalBalance.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last 30 days</p>
            <p className="text-2xl font-bold opacity-50 text-black">${total30Days.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last 7 days</p>
            <p className="text-2xl font-bold opacity-50 text-black">${total7Days.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {wallets && wallets.length > 0 ? (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              onClick={() => navigate(`/wallet/${wallet.id}`)}
              className="cursor-pointer"
            >
              <WalletCard
                wallet={{
                  name: wallet.name,
                  balance: wallet.balance,
                  theme: wallet.theme,
                  budget: wallet.budget,
                  budgetProgress: wallet.budgetProgress,
                  last30Days: wallet.last30Days,
                  last7Days: wallet.last7Days,
                }}
              />
            </div>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p>No Wallets Data Found</p>
          </Card>
        )}

        <div className="space-y-4 mb-8">
          <Button
            onClick={() => navigate("/add-wallet")}
            variant="outline"
            className="w-full py-8 border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add wallet
          </Button>
        </div>

      </div>

      <div className="space-y-4 mt-4">
        <ExpenseOverview transactions={allTransactions} />
      </div>
    </div>
  );
}
