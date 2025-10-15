import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

export interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: { images: string[] };
  status: "Active" | "Pending" | "Cancel" | string;
  budget: string;
}

type Align = "start" | "center" | "end";

export type ColumnConfig = {
  header: string;
  /** Either provide `key` for simple field OR `render` for custom cell */
  key?: keyof Order;
  render?: (row: Order, rowIndex: number) => React.ReactNode;
  align?: Align;
  headerClassName?: string;
  cellClassName?: string;
  widthClassName?: string;
};

type Props = {
  data: Order[];
  columns?: ColumnConfig[];      // optional: override columns
  className?: string;
  headerRowClassName?: string;
  bodyRowClassName?: string;
  bordered?: boolean;
};

const alignToTW = (align?: Align) =>
  align === "center" ? "text-center" : align === "end" ? "text-right" : "text-start";

/** ✅ SAME NAME: BasicTableOne — now reusable via props */
export default function BasicTableOne({
  data,
  columns,
  className,
  headerRowClassName,
  bodyRowClassName,
  bordered = true,
}: Props) {
  // ---- Default columns (used if no custom columns passed) ----
  const defaultColumns: ColumnConfig[] = [
    {
      header: "User",
      widthClassName: "min-w-[220px]",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img width={40} height={40} src={row.user.image} alt={row.user.name} />
          </div>
          <div>
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {row.user.name}
            </span>
            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
              {row.user.role}
            </span>
          </div>
        </div>
      ),
      align: "start",
    },
    { header: "Project Name", key: "projectName", align: "start" },
    {
      header: "Team",
      render: (row) => (
        <div className="flex -space-x-2">
          {row.team.images.map((img, i) => (
            <div
              key={i}
              className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
            >
              <img width={24} height={24} src={img} alt={`Team ${i + 1}`} className="w-full size-6" />
            </div>
          ))}
        </div>
      ),
      align: "start",
    },
    {
      header: "Status",
      render: (row) => (
        <Badge
          size="sm"
          color={
            row.status === "Active"
              ? "success"
              : row.status === "Pending"
              ? "warning"
              : "error"
          }
        >
          {row.status}
        </Badge>
      ),
      align: "start",
    },
    { header: "Budget", key: "budget", align: "start" },
  ];

  const cols = columns ?? defaultColumns;
  const borderCls = bordered ? "border border-gray-200 dark:border-white/[0.05]" : "";

  return (
    <div className={`overflow-hidden rounded-xl bg-white dark:bg-white/[0.03] ${borderCls} ${className ?? ""}`}>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow className={headerRowClassName}>
              {cols.map((col, i) => (
                <TableCell
                  key={i}
                  isHeader
                  className={`px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400 ${alignToTW(col.align)} ${col.headerClassName ?? ""} ${col.widthClassName ?? ""}`}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {data.map((row, rIdx) => (
              <TableRow key={rIdx} className={bodyRowClassName}>
                {cols.map((col, cIdx) => {
                  const content =
                    col.render
                      ? col.render(row, rIdx)
                      : col.key
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ? String((row as any)[col.key] ?? "")
                      : null;

                  return (
                    <TableCell
                      key={`${rIdx}-${cIdx}`}
                      className={`px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 ${alignToTW(col.align)} ${col.cellClassName ?? ""} ${col.widthClassName ?? ""}`}
                    >
                      {content}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
