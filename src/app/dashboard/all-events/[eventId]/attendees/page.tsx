import AttendeeTable from "../components/attendee-table";

export default async function AttendeesPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
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
