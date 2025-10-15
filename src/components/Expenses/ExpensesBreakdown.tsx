interface StatCardProps {
  title: string;
  value: number | string;
  valueColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, valueColor }) => {
  return (
    <div className="flex flex-col justify-center items-center border border-gray-200 rounded-lg shadow-sm p-5 min-w-[110px] min-h-[100px]">
      <p className="text-lg text-gray-700  font-medium">{title}</p>
      <p className={`text-lg font-bold ${valueColor ?? "text-black"}`}>
        {value}
      </p>
      <p className={`text-lg  ${valueColor ?? "text-black"}`}>0 expenses</p>
    </div>
  );
};

const ExpensesBreakdown: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mt-6">
      <div className="p-6">
        <h1 className="text-lg font-semibold text-gray-900">
          Expense Breakdown by Category
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Current month expense distribution
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          <StatCard title="Labor" value={"$0"} />
          <StatCard title="Materials" value={"$0"} />
          <StatCard title="Equipment" value={"$0"} />
          <StatCard title="Utilities" value={"$0"} />
          <StatCard title="Admin" value={"$0"} />
        </div>
      </div>
    </div>
  );
};

export default ExpensesBreakdown;
