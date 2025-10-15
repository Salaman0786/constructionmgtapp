import AccountsPayDashboard from "./AccountsPayDashboard";
import { AccountsPayTable } from "./AccountsPayTable";

const AccountsPay = () => {
  return (
    <div className="p-6">
      <AccountsPayDashboard />
      <AccountsPayTable />
    </div>
  );
};

export default AccountsPay;
