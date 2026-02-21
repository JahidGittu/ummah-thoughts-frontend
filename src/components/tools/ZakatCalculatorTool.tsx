import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Calculator, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { toBengaliNumerals } from '@/lib/dateUtils';

interface Props {
  onClose: () => void;
}

export const ZakatCalculatorTool = ({ onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === 'bn';

  // Asset values
  const [cash, setCash] = useState('');
  const [bankBalance, setBankBalance] = useState('');
  const [gold, setGold] = useState('');
  const [silver, setSilver] = useState('');
  const [investments, setInvestments] = useState('');
  const [businessInventory, setBusinessInventory] = useState('');
  const [receivables, setReceivables] = useState('');
  
  // Liabilities
  const [debts, setDebts] = useState('');

  // Nisab values (approximate in BDT)
  const goldNisab = 87.48; // grams (7.5 tola)
  const goldPricePerGram = 9500; // BDT approximate
  const silverNisab = 612.36; // grams (52.5 tola)
  const silverPricePerGram = 110; // BDT approximate
  
  const nisabGold = goldNisab * goldPricePerGram;
  const nisabSilver = silverNisab * silverPricePerGram;
  const nisab = Math.min(nisabGold, nisabSilver); // Use lower value

  const parseValue = (val: string) => parseFloat(val) || 0;

  const calculations = useMemo(() => {
    const goldValue = parseValue(gold) * goldPricePerGram;
    const silverValue = parseValue(silver) * silverPricePerGram;
    
    const totalAssets = 
      parseValue(cash) +
      parseValue(bankBalance) +
      goldValue +
      silverValue +
      parseValue(investments) +
      parseValue(businessInventory) +
      parseValue(receivables);

    const totalLiabilities = parseValue(debts);
    const netWorth = totalAssets - totalLiabilities;
    const isEligible = netWorth >= nisab;
    const zakatAmount = isEligible ? netWorth * 0.025 : 0;

    return {
      goldValue,
      silverValue,
      totalAssets,
      totalLiabilities,
      netWorth,
      isEligible,
      zakatAmount,
    };
  }, [cash, bankBalance, gold, silver, investments, businessInventory, receivables, debts, nisab]);

  const formatCurrency = (amount: number) => {
    const formatted = amount.toLocaleString('en-BD', { maximumFractionDigits: 0 });
    return isBengali ? `৳${toBengaliNumerals(parseInt(formatted.replace(/,/g, '')))}` : `৳${formatted}`;
  };

  const inputFields = [
    { id: 'cash', label: isBengali ? 'নগদ টাকা' : 'Cash on Hand', value: cash, setter: setCash, unit: '৳' },
    { id: 'bank', label: isBengali ? 'ব্যাংক ব্যালেন্স' : 'Bank Balance', value: bankBalance, setter: setBankBalance, unit: '৳' },
    { id: 'gold', label: isBengali ? 'স্বর্ণ (গ্রাম)' : 'Gold (grams)', value: gold, setter: setGold, unit: 'g' },
    { id: 'silver', label: isBengali ? 'রৌপ্য (গ্রাম)' : 'Silver (grams)', value: silver, setter: setSilver, unit: 'g' },
    { id: 'investments', label: isBengali ? 'বিনিয়োগ' : 'Investments', value: investments, setter: setInvestments, unit: '৳' },
    { id: 'business', label: isBengali ? 'ব্যবসায়িক পণ্য' : 'Business Inventory', value: businessInventory, setter: setBusinessInventory, unit: '৳' },
    { id: 'receivables', label: isBengali ? 'পাওনা টাকা' : 'Receivables', value: receivables, setter: setReceivables, unit: '৳' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" size="sm" onClick={onClose} className="mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('tools.backToTools')}
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {t('tools.zakatCalculator.name')}
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              {t('tools.zakatCalculator.desc')}
            </p>
          </motion.div>

          {/* Nisab Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 mb-6"
          >
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">
                  {isBengali ? 'নিসাব (যাকাতের ন্যূনতম সীমা)' : 'Nisab (Minimum Threshold)'}
                </p>
                <p className="text-muted-foreground">
                  {isBengali 
                    ? `স্বর্ণ: ${toBengaliNumerals(87.48)} গ্রাম = ${formatCurrency(nisabGold)} | রৌপ্য: ${toBengaliNumerals(612.36)} গ্রাম = ${formatCurrency(nisabSilver)}`
                    : `Gold: 87.48g = ${formatCurrency(nisabGold)} | Silver: 612.36g = ${formatCurrency(nisabSilver)}`
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Assets Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 mb-6"
          >
            <h2 className="font-medium text-foreground mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              {isBengali ? 'সম্পদ প্রবেশ করুন' : 'Enter Your Assets'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inputFields.map((field) => (
                <div key={field.id}>
                  <Label htmlFor={field.id} className="text-sm">
                    {field.label}
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id={field.id}
                      type="number"
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder="0"
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {field.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Debts */}
            <div className="mt-6 pt-4 border-t border-border">
              <Label htmlFor="debts" className="text-sm">
                {isBengali ? 'ঋণ / দেনা' : 'Debts / Liabilities'}
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="debts"
                  type="number"
                  value={debts}
                  onChange={(e) => setDebts(e.target.value)}
                  placeholder="0"
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  ৳
                </span>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h2 className="font-medium text-foreground mb-4">
              {isBengali ? 'হিসাবের ফলাফল' : 'Calculation Results'}
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">
                  {isBengali ? 'মোট সম্পদ' : 'Total Assets'}
                </span>
                <span className="text-sm font-medium">{formatCurrency(calculations.totalAssets)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">
                  {isBengali ? 'মোট দায়' : 'Total Liabilities'}
                </span>
                <span className="text-sm font-medium text-destructive">-{formatCurrency(calculations.totalLiabilities)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">
                  {isBengali ? 'নিট সম্পদ' : 'Net Worth'}
                </span>
                <span className="text-sm font-medium">{formatCurrency(calculations.netWorth)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">
                  {isBengali ? 'নিসাব' : 'Nisab'}
                </span>
                <span className="text-sm font-medium">{formatCurrency(nisab)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  {isBengali ? 'যাকাত প্রযোজ্য?' : 'Zakat Applicable?'}
                </span>
                <span className={`text-sm font-medium ${calculations.isEligible ? 'text-primary' : 'text-muted-foreground'}`}>
                  {calculations.isEligible 
                    ? (isBengali ? 'হ্যাঁ' : 'Yes') 
                    : (isBengali ? 'না' : 'No')
                  }
                </span>
              </div>
            </div>

            {/* Zakat Amount */}
            <div className={`mt-6 p-4 rounded-lg ${calculations.isEligible ? 'bg-primary/10' : 'bg-muted'}`}>
              <p className="text-sm text-muted-foreground mb-1">
                {isBengali ? 'প্রদেয় যাকাত (২.৫%)' : 'Zakat Due (2.5%)'}
              </p>
              <p className={`font-display text-2xl font-bold ${calculations.isEligible ? 'text-primary' : 'text-muted-foreground'}`}>
                {formatCurrency(calculations.zakatAmount)}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
