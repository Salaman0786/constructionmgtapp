import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Investors from "./components/Finance&CRM/Investors/Investors";
import Vendors from "./components/Finance&CRM/vendors/Vendors";
import Invoices from "./components/Finance&CRM/Invoices/Invoices";

import Expenses from "./components/Expenses/Expenses";
import Units from "./components/Finance&CRM/Units/Units";
import Inventory from "./components/Inventory/Inventory";
import Reports from "./components/Reports/Reports";
import BOQ from "./components/ProjectControl/BOQ/BOQ";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminLogin from "./pages/AuthPages/AdminLogin";
import SiteDiary from "./components/ProjectControl/SiteDiary/SiteDiary";
import TaskAssignment from "./components/ProjectControl/TaskAssignment/TaskAssignment";

import Payments from "./components/Finance&CRM/Payments/Payments";

import Project from "./components/ProjectControl/Project/Project";
import GanttScheduling from "./components/ProjectControl/GanttScheduling/GanttScheduling";
import CashFlowProjection from "./components/Finance&CRM/CashFlowProjection/CashFlowProjection";
import BudgetActual from "./components/Finance&CRM/Budget&Actual/BudgetActual";

import PurchaseRequest from "./components/Procurement/PurchaseRequest/PurchaseRequest";
import RequestForQuotation from "./components/Procurement/RequestForQuotation/RequestForQuotation";
import PurchaseOrders from "./components/Procurement/PurchaseOrders/PurchaseOrders";
import GoodsReceivedNote from "./components/Procurement/GoodsReceivedNote/GoodsReceivedNote";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Dashboard />} />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/admin_panel" element={<AdminPanel />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/units" element={<Units />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />
            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />
            {/* Project Control */}
            <Route path="/boq" element={<BOQ />} />
            <Route path="/gantt-scheduling" element={<GanttScheduling />} />
            <Route path="/project" element={<Project />} />
            <Route path="/site-diary" element={<SiteDiary />} />
            <Route path="/task-assignment" element={<TaskAssignment />} />
            {/* Project Control */}
            <Route path="/investors" element={<Investors />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/units" element={<Units />} />
            <Route
              path="/cash-flow-projection"
              element={<CashFlowProjection />}
            />
            <Route path="/budget-actual" element={<BudgetActual />} />
            {/*  Procurement */}
            <Route path="/purchase-request" element={<PurchaseRequest />} />
            <Route
              path="/request-for-quotation"
              element={<RequestForQuotation />}
            />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route
              path="/goods-received-note"
              element={<GoodsReceivedNote />}
            />
            feature/Procurement-Module
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

          {/* Auth Layout */}
          <Route path="/signin" element={<AdminLogin />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
