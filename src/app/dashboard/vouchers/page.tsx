import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DataTableVoucher } from "./components/voucher";

function Vouchers() {
  return (
    <div>
      {/* <Navbar /> */}
      <DataTableVoucher />
      <Footer />
    </div>
  );
}

export default Vouchers;
