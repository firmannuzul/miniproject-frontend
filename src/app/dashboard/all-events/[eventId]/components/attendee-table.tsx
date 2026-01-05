"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { attendeeColumns } from "./columns";

type Props = {
  eventId: number;
};

export default function AttendeeTable({ eventId }: Props) {
  const { data: session } = useSession();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event-attendees", eventId],
    enabled: !!session?.user?.accessToken && Number.isInteger(eventId),
    queryFn: async () => {
      const res = await axiosInstance.get(`/events/${eventId}/attendees`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`,
        },
      });
      return res.data;
    },
  });

  const table = useReactTable({
    data,
    columns: attendeeColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p className="p-6">Loading attendees...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load attendees</p>;

  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <Table className="min-w-[900px]">
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={attendeeColumns.length}
                className="text-center"
              >
                No attendees yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
