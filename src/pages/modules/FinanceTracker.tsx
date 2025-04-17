
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownCircle, ArrowUpCircle, DollarSign, Wallet, Calendar, 
  PlusCircle, PieChart, TrendingUp, TrendingDown, BookOpen, Receipt
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const mockTransactions = [
  { id: 1, description: "Groceries", amount: -84.32, date: "2025-04-15", category: "Food" },
  { id: 2, description: "Salary", amount: 2840.50, date: "2025-04-10", category: "Income" },
  { id: 3, description: "Restaurant", amount: -52.75, date: "2025-04-08", category: "Food" },
  { id: 4, description: "Gas", amount: -45.00, date: "2025-04-05", category: "Transport" },
  { id: 5, description: "Internet Bill", amount: -79.99, date: "2025-04-03", category: "Utilities" },
  { id: 6, description: "Freelance Work", amount: 350.00, date: "2025-04-01", category: "Income" },
];

const mockExpensesByCategory = [
  { category: "Food", amount: 584.32, percentage: 35 },
  { category: "Transport", amount: 245.00, percentage: 15 },
  { category: "Utilities", amount: 329.99, percentage: 20 },
  { category: "Entertainment", amount: 180.50, percentage: 11 },
  { category: "Shopping", amount: 315.75, percentage: 19 },
];

const mockSavingGoals = [
  { name: "Emergency Fund", target: 10000, current: 6500, date: "2025-12-31" },
  { name: "Vacation", target: 3000, current: 1200, date: "2025-08-15" },
];

const FinanceTracker = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("transactions");
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    category: "Food"
  });

  // Calculate total balance
  const calculateBalance = () => {
    return mockTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Transaction added",
      description: "Your transaction has been recorded successfully"
    });

    // Reset form
    setNewTransaction({
      description: "",
      amount: "",
      category: "Food"
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Finance & Budget Tracker</h1>
        <p className="text-muted-foreground">
          Manage expenses, track income, and get AI-powered saving suggestions
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <h3 className="text-3xl font-bold">{formatCurrency(calculateBalance())}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <Wallet className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <h3 className="text-3xl font-bold">{formatCurrency(3190.50)}</h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <ArrowDownCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                <h3 className="text-3xl font-bold">{formatCurrency(1655.56)}</h3>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full">
                <ArrowUpCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
        
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-500" />
                Recent Transactions
              </CardTitle>
              <CardDescription>History of your income and expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="col-span-1 md:col-span-2 space-y-4">
                  {mockTransactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.amount >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {transaction.amount >= 0 ? (
                            <ArrowDownCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <ArrowUpCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Add Transaction</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input 
                          placeholder="e.g. Groceries" 
                          value={newTransaction.description}
                          onChange={e => setNewTransaction({...newTransaction, description: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="number" 
                            className="pl-8" 
                            placeholder="0.00"
                            value={newTransaction.amount}
                            onChange={e => setNewTransaction({...newTransaction, amount: e.target.value})}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Use negative for expenses</p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select 
                          defaultValue={newTransaction.category}
                          onValueChange={value => setNewTransaction({...newTransaction, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Food">Food</SelectItem>
                            <SelectItem value="Transport">Transport</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Entertainment">Entertainment</SelectItem>
                            <SelectItem value="Shopping">Shopping</SelectItem>
                            <SelectItem value="Income">Income</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleAddTransaction}>
                        Add Transaction
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald-500" />
                Monthly Budget
              </CardTitle>
              <CardDescription>Track your spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium mb-4">Expenses by Category</h3>
                  <div className="space-y-6">
                    {mockExpensesByCategory.map(item => (
                      <div key={item.category}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.category}</span>
                            <Badge variant="outline">
                              {item.percentage}%
                            </Badge>
                          </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-4">Budget Analysis</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                        Budget Status
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        You're currently 12% under your monthly budget. Great job at controlling your expenses!
                      </p>
                    </div>
                    
                    <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-yellow-500" />
                        Spending Alert
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your food spending is 15% higher than last month. Consider setting a stricter budget for this category.
                      </p>
                    </div>
                    
                    <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        AI Suggestion
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on your spending patterns, you could save approximately $120 monthly by reducing entertainment expenses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="savings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                Savings Goals
              </CardTitle>
              <CardDescription>Track progress towards your financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium mb-4">Current Goals</h3>
                  <div className="space-y-6">
                    {mockSavingGoals.map(goal => (
                      <div key={goal.name} className="bg-secondary/40 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{goal.name}</h4>
                          <Badge variant="outline">
                            Due {new Date(goal.date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span>{formatCurrency(goal.current)}</span>
                          <span className="text-muted-foreground">of {formatCurrency(goal.target)}</span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500" 
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {Math.round((goal.current / goal.target) * 100)}% complete
                        </p>
                      </div>
                    ))}
                    
                    <Button className="w-full">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Goal
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-4">Saving Suggestions</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <PlusCircle className="h-4 w-4 text-emerald-500" />
                        Round-Up Savings
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Round up each transaction to the nearest dollar and save the difference. This could add $15-30 monthly to your savings.
                      </p>
                    </div>
                    
                    <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Automate Savings
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Set up automatic transfers of $50 weekly to your savings account on payday. This habit could help you save $2,600 annually.
                      </p>
                    </div>
                    
                    <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-yellow-500" />
                        Spending Reduction
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Reducing dining out to once weekly could save approximately $120 monthly, helping you reach your vacation goal 2 months earlier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Financial Insights
              </CardTitle>
              <CardDescription>AI-powered analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Monthly Summary</h3>
                <p className="text-muted-foreground">
                  Based on your spending patterns and income, here's an AI analysis of your financial health.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                        Income Utilization
                      </h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="w-32 h-32 rounded-full border-8 border-emerald-500 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold">52%</div>
                            <div className="text-xs text-muted-foreground">of income</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <div className="text-sm">52% - Expenses</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="text-sm">15% - Savings</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <div className="text-sm">33% - Remaining</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Financial Calendar
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        Upcoming bills: Internet ($79.99) due in 5 days, Rent ($1200) due in 14 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium">AI Recommendations</h4>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="mt-1">•</div>
                          <span>Consider increasing your emergency fund contributions by $50 monthly to reach your goal faster.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1">•</div>
                          <span>You could save $25 monthly by switching to a different internet provider based on current offers.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1">•</div>
                          <span>Your transportation expenses increased by 18% this month. Check for alternative commuting options.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      Get Personalized Financial Plan
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      Export Financial Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceTracker;
