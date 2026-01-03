import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useFinance } from "./hooks/useFinance";
import TransactionList from "./components/TransactionList/TransactionList";
import EntryModal from "./components/EntryModal/EntryModal";
import BudgetPlanner from "./components/BudgetPlanner/BudgetPlanner";
import type { FinanceType } from "./types/types";
import { FinanceStats } from "./components/FinanceStats/FinanceStats";
import { NewTransactionModal } from "./components/NewTransactionModal";
import TabButton from "./components/TabButton";
import BilanceBreakdown from "./components/BilanceBreakdown/BilanceBreakdown";
import { DateSelector } from "../UI/DateSelector";

export default function Finance() {
  const {
    transactions,
    categories,
    budgets,
    isLoading,
    addTransaction,
    deleteTransaction,
    saveBudget,
    toggleCategory,
  } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FinanceType>("expense");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState("budget");

  // most people use budgeting monthly rather than weekly/daily, so will we
  const monthTransactions = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [transactions, selectedDate]);

  const stats = useMemo(() => {
    return monthTransactions.reduce(
      (acc, t) => {
        if (t.type === "income") acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [monthTransactions]);

  const totalBudget = useMemo(() => {
    // we sum overall budget here, the specific categories
    // will be summed in BudgetPlanner
    return budgets.reduce((acc, b) => acc + (b.amount || 0), 0);
  }, [budgets]);

  const categorySpending = useMemo(() => {
    return monthTransactions.reduce((acc, t) => {
      if (t.category_id) {
        acc[t.category_id] = (acc[t.category_id] || 0) + t.amount;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [monthTransactions]);

  const moneyLeft = totalBudget - stats.expense;

  const handleOpenModal = (type: FinanceType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6 lg:p-8 mx-auto space-y-3 xl:h-[calc(100vh)]"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          format="month"
        />

        <div className="flex gap-3">
          <NewTransactionModal
            handleOpenModal={handleOpenModal}
            incOrExp="expense"
          />
          <NewTransactionModal
            handleOpenModal={handleOpenModal}
            incOrExp="income"
          />
        </div>
      </div>

      <FinanceStats
        stats={stats}
        moneyLeft={moneyLeft}
        totalBudget={totalBudget}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="">
          <div className="flex items-end lg:justify-end">
            {/* // bg-brand-neutral-dark/40 border border-brand-depth rounded-2xl p-6 */}
            <h2
              className="bg-brand-neutral-dark/50 text-xl font-bold text-brand-neutral-light border border-brand-depth 
                          rounded-t-xl py-2 px-4"
            >
              Historia
            </h2>
          </div>
          <div
            className="flex-grow overflow-y-auto max-h-[86vh] lg:max-h-[57vh] bg-brand-neutral-dark/40 border border-brand-depth 
                        rounded-b-2xl rounded-tr-2xl lg:rounded-tr-none lg:rounded-tl-2xl p-4 sm:pb-8 lg:py-4 md:px-6"
          >
            <TransactionList
              transactions={monthTransactions}
              isLoading={isLoading}
              onDelete={deleteTransaction}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TabButton
                label="Budżet"
                value="budget"
                isSelected={selectedTab === "budget"}
                setSelectedTab={setSelectedTab}
              />
              <TabButton
                label="Zestawienie"
                value="stats"
                isSelected={selectedTab === "stats"}
                setSelectedTab={setSelectedTab}
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-[86vh] lg:max-h-[57vh] bg-brand-neutral-dark/40 border border-brand-depth rounded-b-2xl rounded-tr-2xl p-4 md:px-6">
            {selectedTab === "budget" ? (
              <BudgetPlanner
                categories={categories}
                budgets={budgets}
                onSaveBudget={saveBudget}
                categorySpending={categorySpending}
                onToggleCategory={toggleCategory}
              />
            ) : (
              <BilanceBreakdown
                categories={categories}
                categorySpending={categorySpending}
              />
            )}
          </div>
        </div>
      </div>

      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTransaction}
        categories={categories}
        initialType={modalType}
      />
    </motion.div>
  );
}
