"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { HiOutlineMenu } from "react-icons/hi";
import { Button } from "./ui/button";

function Navbar() {
  const session = useSession();
  return (
    <div className="container mx-auto flex justify-between items-center py-2 px-4">
      <img
        src="/logoevent.png"
        alt="logo"
        className="w-[140px] h-[30px] md:h-[30px] md:w-40"
      />

      <div className="hidden md:flex gap-4 text-xl">
        <Link href="/">Dashboard</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/all-events">All Events</Link>
        <Link href="/tickets">Tickets</Link>
        <Link href="/vouchers">Vouchers</Link>
        <Link href="/settings">Settings</Link>
      </div>

      {/* <button className="hidden md:block border border-[#F05537] px-8 py-4 text-[#F05537] rounded-4xl font-bold">
        Create Event
      </button> */}

      <HiOutlineMenu className="block md:hidden text-2xl" />

      {session.status === "unauthenticated" ? (
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      ) : (
        <Button variant="destructive" onClick={() => signOut()}>
          Sign Out
        </Button>
      )}
    </div>
  );
}

export default Navbar;
