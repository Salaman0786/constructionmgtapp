// import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne, { Order } from "../../components/tables/BasicTables/BasicTableOne";

const tableData: Order[] = [

];

export default function BasicTables() {
  return (
    <>
      <PageMeta title="USER" description="User View" />
      {/* <PageBreadcrumb pageTitle="User Tables" /> */}
      <div className="space-y-6">
        <ComponentCard title="">
          {/* Default columns */}
          <BasicTableOne data={tableData} />

          {/* OR — custom columns example (optional) */}
          {/* 
          <BasicTableOne
            data={tableData}
            columns={[
              { header: "Project", key: "projectName" },
              { header: "Budget", key: "budget", align: "end" },
            ]}
          />
          */}
        </ComponentCard>
      </div>
    </>
  );
}
