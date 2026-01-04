import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const attendeeColumns: ColumnDef<any>[] = [
  {
    header: "Name",
    cell: ({ row }) => row.original.transaction.user.name,
  },
  {
    header: "Email",
    cell: ({ row }) => row.original.transaction.user.email,
  },
  {
    header: "Ticket",
    cell: ({ row }) => row.original.ticketType.name,
  },
  {
    header: "Quantity",
    cell: ({ row }) => row.original.quantity,
  },
  {
    header: "Total Paid",
    cell: ({ row }) =>
      `Rp ${Number(row.original.transaction.final_amount).toLocaleString("id-ID")}`,
  },
  {
    header: "Transaction Date",
    cell: ({ row }) =>
      format(
        new Date(row.original.transaction.transaction_date),
        "dd MMM yyyy HH:mm"
      ),
  },
];
