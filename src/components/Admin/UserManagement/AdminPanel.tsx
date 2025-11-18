import AdminPanelHeader from "./AdminPanelHeader";
import { UsersTable } from "./UsersTable";

const AdminPanel = () => {
  return (
    <div>
      <AdminPanelHeader />
      <UsersTable />
    </div>
  );
};

export default AdminPanel;
