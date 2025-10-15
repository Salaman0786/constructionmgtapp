import ExpensesBreakdown from "./ExpensesBreakdown";
import ExpensesHeader from "./ExpensesHeader";
import { ExpensesTab } from "./ExpensesTab";

const Expenses = () => {
  return (
    <div>
      <ExpensesHeader />
      <ExpensesBreakdown />
      <ExpensesTab />
    </div>
  );
};

export default Expenses;
