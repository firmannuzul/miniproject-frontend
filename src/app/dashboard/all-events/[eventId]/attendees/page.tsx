// import { AttendeeTable } from "../components/attendee-table";

import AttendeeTable from "../components/attendee-table";

// export default function AttendeesPage({
//   params,
// }: {
//   params: { eventId: string };
// }) {
//   return (
//     <div className="w-6xl">
//       <h1 className="text-3xl mb-6">Attendee List</h1>
//       <AttendeeTable eventId={Number(params.eventId)} />
//     </div>
//   );
// }



// app/dashboard/events/[eventId]/attendees/page.tsx
// export default function AttendeesPage({
//   params,
// }: {
//   params: { eventId: string };
// }) {
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">
//         Attendees Event {params.eventId}
//       </h1>
//     </div>
//   );
// }


// import AttendeeTable from "../components/attendee-table";

// type PageProps = {
//   params: {
//     eventId: string;
//   };
// };

// export default async function AttendeesPage({ params }: PageProps) {
//   const eventId = Number(params.eventId);

//   if (Number.isNaN(eventId)) {
//     return <p className="p-6">Invalid event ID</p>;
//   }

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-semibold">Attendee List</h1>
//       <AttendeeTable eventId={eventId} />
//     </div>
//   );
// }


export default async function AttendeesPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params; // ✅ WAJIB
  const id = Number(eventId);

  if (Number.isNaN(id)) {
    return <p className="p-6">Invalid event ID</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Attendee List</h1>
      <AttendeeTable eventId={id} />
    </div>
  );
}

