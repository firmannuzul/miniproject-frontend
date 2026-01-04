"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

/* =========================
   TYPES
========================= */
type TransactionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

type Transaction = {
  transaction_id: number;
  status: TransactionStatus;
  transaction_date: string;
  total_amount: number;
  final_amount: number;
  user: {
    name: string;
    email: string;
  };
  event: {
    name_price: string;
  };
};

/* =========================
   PAGE
========================= */
export default function TransactionPage() {
  const queryClient = useQueryClient();

  /* =========================
     FETCH TRANSACTIONS
  ========================= */
  const { data, isLoading, error } = useQuery<Transaction[]>({
    queryKey: ["organizer-transactions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/transactions/organizer");
      return res.data;
    },
  });

  /* =========================
     ACCEPT TRANSACTION
  ========================= */
  const acceptMutation = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.patch(`/transactions/${id}/accept`),
    onSuccess: () => {
      toast.success("Transaction accepted");
      queryClient.invalidateQueries({ queryKey: ["organizer-transactions"] });
    },
    onError: () => {
      toast.error("Failed to accept transaction");
    },
  });

  /* =========================
     REJECT TRANSACTION
  ========================= */
  const rejectMutation = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.patch(`/transactions/${id}/reject`),
    onSuccess: () => {
      toast.success("Transaction rejected & rolled back");
      queryClient.invalidateQueries({ queryKey: ["organizer-transactions"] });
    },
    onError: () => {
      toast.error("Failed to reject transaction");
    },
  });

  /* =========================
     RENDER STATES
  ========================= */
  if (isLoading) return <p className="p-6">Loading transactions...</p>;
  if (error) return <p className="p-6">Failed to load transactions</p>;
  if (!data || data.length === 0)
    return <p className="p-6">No transactions yet</p>;

  /* =========================
     UI
  ========================= */
  return (
    <div className="w-full px-6 py-6">
      <h1 className="text-3xl font-bold mb-6">Transaction Management</h1>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((trx) => (
              <TableRow key={trx.transaction_id}>
                <TableCell>{trx.transaction_id}</TableCell>
                <TableCell>{trx.event.name_price}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{trx.user.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {trx.user.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  Rp {Number(trx.final_amount).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <StatusBadge status={trx.status} />
                </TableCell>
                <TableCell>
                  {new Date(trx.transaction_date).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>
                  {trx.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          acceptMutation.mutate(trx.transaction_id)
                        }
                        disabled={acceptMutation.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          rejectMutation.mutate(trx.transaction_id)
                        }
                        disabled={rejectMutation.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No action
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* =========================
   STATUS BADGE
========================= */
function StatusBadge({ status }: { status: TransactionStatus }) {
  if (status === "PENDING")
    return <Badge variant="outline">Pending</Badge>;
  if (status === "ACCEPTED")
    return <Badge className="bg-green-600">Accepted</Badge>;
  if (status === "REJECTED")
    return <Badge className="bg-red-600">Rejected</Badge>;
  return null;
}
