import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getExportFileName } from "./helpers";

export const exportToCSV = (rows: any[], filePrefix: string) => {
  if (!rows || rows.length === 0) return;

  const header = Object.keys(rows[0]).join(",");
  const data = rows.map((obj) => Object.values(obj).join(","));
  const csv = [header, ...data].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filePrefix}_${getExportFileName("csv")}`;
  link.click();
};

export const exportToExcel = (rows: any[], filePrefix: string) => {
  if (!rows || rows.length === 0) return;

  const sheet = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Data");

  XLSX.writeFile(wb, `${filePrefix}_${getExportFileName("xlsx")}`);
};

export const exportToPDF = (rows: any[], filePrefix: string) => {
  if (!rows || rows.length === 0) return;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });

  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => Object.values(r));

  autoTable(doc, {
    head: [headers],
    body,
    startY: 30,
    margin: { left: 20, right: 20 },

    // 🔥 THIS IS THE FIX
    tableWidth: "auto",
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: "linebreak",
      cellWidth: "auto",
      valign: "middle",
      halign: "center",
    },

    headStyles: {
      fillColor: [75, 0, 130],
      textColor: 255,
      fontStyle: "bold",
    },

    didParseCell: function (data) {
      // 🔥 prevent vertical splitting
      if (data.section === "body") {
        data.cell.styles.minCellHeight = 18;
      }
    },

    pageBreak: "auto",
  });

  doc.save(`${filePrefix}_${getExportFileName("pdf")}`);
};
