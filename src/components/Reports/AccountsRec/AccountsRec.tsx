import AccountsDashboard from "./AccountsDashboard";
import { AccountsTable } from "./AccountsTable";

const AccountsRec = () => {
  return (
    <div className="p-6">
      <AccountsDashboard />
      <AccountsTable />
    </div>
  );
};

export default AccountsRec;
