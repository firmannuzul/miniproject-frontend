// types/attendee.ts
export type AttendeeRow = {
  transaction_item_id: number;
  quantity: number;
  ticketType: {
    name: string;
  };
  transaction: {
    transaction_date: string;
    final_amount: string;
    user: {
      name: string;
      email: string;
    };
  };
};
