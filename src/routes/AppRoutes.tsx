import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ScrollToTop } from "../components/common/ScrollToTop";
import AdminLogin from "../pages/AuthPages/AdminLogin";
import ForgotPassword from "../pages/AuthPages/ForgotPassword";
import SendOtp from "../pages/AuthPages/SendOtp";
import ResetPassword from "../pages/AuthPages/ResetPassword";
import AppLayout from "../layout/AppLayout";
import Dashboard from "../components/Dashboard/Dashboard";
import UserProfiles from "../pages/UserProfiles";
import Blank from "../pages/Blank";
import Investors from "../components/Finance&CRM/Investors/Investors";
import Vendors from "../components/Finance&CRM/vendors/Vendors";
import Invoices from "../components/Finance&CRM/Invoices/Invoices";
import Payments from "../components/Finance&CRM/Payments/Payments";
import Expenses from "../components/Expenses/Expenses";
import Units from "../components/Finance&CRM/Units/Units";
import Reports from "../components/Reports/Reports";
import FormElements from "../pages/Forms/FormElements";
import BasicTables from "../pages/Tables/BasicTables";
import BOQ from "../components/ProjectControl/BOQ/BOQ";
import GanttScheduling from "../components/ProjectControl/GanttScheduling/GanttScheduling";
import Project from "../components/ProjectControl/Project/Project";
import SiteDiary from "../components/ProjectControl/SiteDiary/SiteDiary";
import TaskAssignment from "../components/ProjectControl/TaskAssignment/TaskAssignment";
import CashFlowProjection from "../components/Finance&CRM/CashFlowProjection/CashFlowProjection";
import BudgetActual from "../components/Finance&CRM/Budget&Actual/BudgetActual";
import ProjectCostControl from "../components/Finance&CRM/ProjectCostControl/ProjectCostControl";
import PurchaseRequest from "../components/Procurement/PurchaseRequest/PurchaseRequest";
import RequestForQuotation from "../components/Procurement/RequestForQuotation/RequestForQuotation";
import PurchaseOrders from "../components/Procurement/PurchaseOrders/PurchaseOrders";
import GoodsReceivedNote from "../components/Procurement/GoodsReceivedNote/GoodsReceivedNote";
import AdminPanel from "../components/Admin/UserManagement/AdminPanel";
import RolesAndPermissions from "../components/Admin/Roles&Permissions/RolesAndPermissions";
import CompanySetting from "../components/Admin/CompanySetting/CompanySetting";
import Alerts from "../pages/UiElements/Alerts";
import Avatars from "../pages/UiElements/Avatars";
import Badges from "../pages/UiElements/Badges";
import Buttons from "../pages/UiElements/Buttons";
import Images from "../pages/UiElements/Images";
import Videos from "../pages/UiElements/Videos";
import LineChart from "../pages/Charts/LineChart";
import BarChart from "../pages/Charts/BarChart";

import RoleProtectedRoute from "../components/common/RoleProtectedRoute";
import NotAuthorized from "../components/common/NotAuthorized";

import StockLedger from "../components/Inventory/StockLedger/StockLedger";
import MaterialIssue from "../components/Inventory/MaterialIssue/MaterialIssue";
import InventoryForecast from "../components/Inventory/InventoryForecast/InventoryForecast";
import ReorderAlerts from "../components/Inventory/ReorderAlerts/ReorderAlerts";
import DrawingsRevisions from "../components/Documents&Control/Drawings&Revisions/DrawingsRevisions";
import Submittals from "../components/Documents&Control/Submittals/Submittals";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<AdminLogin />} />
        <Route path="/signin/forgot-password" element={<ForgotPassword />} />
        <Route path="/signin/forgot-password/send-otp" element={<SendOtp />} />
        <Route
          path="/signin/forgot-password/send-otp/reset-password"
          element={<ResetPassword />}
        />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            path="/"
            element={
              <RoleProtectedRoute
                allowedRoles={["SUPER_ADMIN", "MANAGER", "INVESTOR"]}
              >
                <Dashboard />
              </RoleProtectedRoute>
            }
          />
          {/* Others Page */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/units" element={<Units />} />
          <Route path="/reports" element={<Reports />} />
          {/* Forms */}
          <Route path="/form-elements" element={<FormElements />} />
          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />
          {/* Project Control */}
          <Route
            path="/boq"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <BOQ />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/gantt-scheduling"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <GanttScheduling />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/project"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <Project />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/site-diary"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <SiteDiary />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/task-assignment"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <TaskAssignment />
              </RoleProtectedRoute>
            }
          />
          {/* Project Control */}
          <Route
            path="/investors"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <Investors />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <Vendors />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "INVESTOR"]}>
                <Invoices />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "INVESTOR"]}>
                <Payments />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <Expenses />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/units"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "INVESTOR"]}>
                <Units />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/cash-flow-projection"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <CashFlowProjection />{" "}
              </RoleProtectedRoute>
            }
          />

          <Route
            path="/budget-actual"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <BudgetActual />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/project-cost-control"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <ProjectCostControl />
              </RoleProtectedRoute>
            }
          />
          {/*  Procurement */}
          <Route
            path="/purchase-request"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <PurchaseRequest />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/request-for-quotation"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <RequestForQuotation />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <PurchaseOrders />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/goods-received-note"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <GoodsReceivedNote />
              </RoleProtectedRoute>
            }
          />

          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/goods-received-note" element={<GoodsReceivedNote />} />
          {/* Inventory */}
          <Route path="/stock-ledger" element={<StockLedger />} />
          <Route path="/material-issue" element={<MaterialIssue />} />
          <Route path="/inventory-forecast" element={<InventoryForecast />} />
          <Route path="/reorder-alerts" element={<ReorderAlerts />} />
          {/* Documents and drawings */}
          <Route
            path="/drawings-revisions"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <DrawingsRevisions />
              </RoleProtectedRoute>
            }
          />
            <Route
            path="/submittals"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN", "MANAGER"]}>
                <Submittals />
              </RoleProtectedRoute>
            }
          />
          {/*  Admin */}
          <Route
            path="/user-management"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <AdminPanel />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/roles-and-permissions"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <RolesAndPermissions />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/company-setting"
            element={
              <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <CompanySetting />
              </RoleProtectedRoute>
            }
          />
          {/* <Route
              path="/tally-integration"
              element={<TallyIntegration />}
            /> */}

          {/* Ui Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

// Optional: Create a simple NotFound component inside routes folder
function NotFound() {
  const navigate = useNavigate();
  const handleNotFound = () => {
    navigate("/signin");
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center flex-col"
      style={{
        backgroundImage: "url('/backgroundImage.jpg')",
      }}
    >
      <h1 className="text-3xl font-bold mb-3 bg-[#f0f0f0] py-2 px-4 rounded-lg">
        404 - Page Not Found
      </h1>
      <div
        className="text-blue-600 cursor-pointer hover:underline text-lg bg-[#f0f0f0] py-2 px-4 rounded-lg"
        onClick={handleNotFound}
      >
        Go to Login page
      </div>
    </div>
  );
}
