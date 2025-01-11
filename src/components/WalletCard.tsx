import { PiggyBank } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import BudgetProgressBar from './BudgetProgressBar';
import { Button } from "./ui/button";

interface WalletCardProps {
  wallet: {
    name: string;
    balance: number;
    theme: string;
    budget: number;
    budgetProgress: number;
    last30Days: number;
    last7Days: number;
  };
}

export function WalletCard({ wallet }: WalletCardProps) {
  const getThemeClasses = (themeId: string) => {
    switch (themeId) {
      case 'yellow':
        return 'border-yellow-500 bg-yellow-50';
      case 'orange':
        return 'border-orange-500 bg-orange-50';
      case 'green':
        return 'border-green-500 bg-green-50';
      case 'blue':
        return 'border-blue-500 bg-blue-50';
      case 'purple':
        return 'border-purple-500 bg-purple-50';
      case 'pink':
        return 'border-pink-500 bg-pink-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getIconColor = (themeId: string) => {
    switch (themeId) {
      case 'yellow':
        return 'text-yellow-500';
      case 'orange':
        return 'text-orange-500';
      case 'green':
        return 'text-green-500';
      case 'blue':
        return 'text-blue-500';
      case 'purple':
        return 'text-purple-500';
      case 'pink':
        return 'text-pink-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={`p-6 border-2 ${getThemeClasses(wallet.theme)} hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold">{wallet.name}</h3>
          <p className="text-sm text-muted-foreground">Balance</p>
        </div>
        <PiggyBank className={`w-8 h-8 ${getIconColor(wallet.theme)}`} />
      </div>
      
      <div className="mb-6">
        <span className="text-3xl font-bold">$ {wallet.balance.toLocaleString()}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
          <p className="font-medium">${wallet.last30Days.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Last 7 days</p>
          <p className="font-medium">${wallet.last7Days.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Budget Usage</span>
        </div>
        <BudgetProgressBar progress={wallet.budgetProgress} />
      </div>
    </Card>
  );
}