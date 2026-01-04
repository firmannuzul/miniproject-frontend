import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DataTableTicket } from "./components/ticket";

function Tickets() {
  return (
    <div>
      {/* <Navbar /> */}
      <DataTableTicket />
      <Footer />
    </div>
  );
}

export default Tickets;
