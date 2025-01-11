import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function AddWallet() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walletName, setWalletName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("blue");

  const themeOptions = [
    { id: 'pink', name: 'Pink', class: 'bg-pink-100 border-pink-500' },
    { id: 'yellow', name: 'Yellow', class: 'bg-yellow-100 border-yellow-500' },
    { id: 'orange', name: 'Orange', class: 'bg-orange-100 border-orange-500' },
    { id: 'green', name: 'Green', class: 'bg-green-100 border-green-500' },
    { id: 'blue', name: 'Blue', class: 'bg-blue-100 border-blue-500' },
    { id: 'purple', name: 'Purple', class: 'bg-purple-100 border-purple-500' },
   
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const existingWallets = JSON.parse(localStorage.getItem("wallets") || "[]");
    
    const newWallet = {
      id: Date.now(),
      name: walletName,
      balance: parseFloat(initialBalance) || 0,
      type: "custom",
      theme: selectedTheme,
      budget: 1000,
      budgetProgress: 0,
      last30Days: 0,
      last7Days: 0
    };
    
    localStorage.setItem("wallets", JSON.stringify([...existingWallets, newWallet]));
    
    toast({
      title: "Success",
      description: "Wallet created successfully!",
    });
    
    navigate("/");
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Wallet</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Wallet Name
            </label>
            <Input
              required
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="e.g., Travel Fund, Business Expenses"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Initial Balance
            </label>
            <Input
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="0.00"
              className="w-full"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">
              Wallet Theme
            </label>
            <RadioGroup
              value={selectedTheme}
              onValueChange={setSelectedTheme}
              className="grid grid-cols-6 gap-1"
            >
              {themeOptions.map((theme) => (
                <div key={theme.id} className="flex items-center">
                  <RadioGroupItem
                    value={theme.id}
                    id={theme.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={theme.id}
                    className={`w-full px-2 py-1.5 text-sm border-2 rounded-lg cursor-pointer text-center ${theme.class} ${
                      selectedTheme === theme.id ? 'ring-2 ring-offset-1' : ''
                    }`}
                  >
                    {theme.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full text-white bg-black">
            Create Wallet
          </Button>
        </form>
      </Card>
    </div>
  );
}