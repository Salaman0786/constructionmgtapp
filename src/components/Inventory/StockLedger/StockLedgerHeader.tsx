import React from "react";

const StockLedgerHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1 px-2">
      <div>
        <h1 className="text-lg font-semibold text-[#1E293B]">
          Stock Ledger
        </h1>
        <p className="text-sm text-[#64748B]">
          Track inventory movements and stock levels
        </p>
      </div>
    </div>
  );
};

export default StockLedgerHeader;
