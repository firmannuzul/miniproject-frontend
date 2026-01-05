import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type EventRow = {
  event_id: number;
  name_price: string;
  image: string;
  location: string;
  category: string;
  start_date: string;
  end_date: string;
  is_paid: boolean;
};

export const columns: ColumnDef<EventRow>[] = [
  {
    accessorKey: "image",
    header: "Thumbnail",
    cell: ({ row }) => (
      <Image
        src={row.original.image}
        alt="event"
        width={60}
        height={40}
        className="rounded-md object-cover"
      />
    ),
  },
  {
    accessorKey: "name_price",
    header: "Title",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name_price}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => format(new Date(row.original.start_date), "dd MMM yyyy"),
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => format(new Date(row.original.end_date), "dd MMM yyyy"),
  },
  {
    accessorKey: "is_paid",
    header: "Type",
    cell: ({ row }) =>
      row.original.is_paid ? (
        <Badge>Paid</Badge>
      ) : (
        <Badge variant="secondary">Free</Badge>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/dashboard/all-events/${row.original.event_id}/attendees`}>
        <Button variant="outline" size="sm">
          Participants
        </Button>
      </Link>
    ),
  },
];
