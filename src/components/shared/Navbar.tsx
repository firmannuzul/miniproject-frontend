"use client";

import Link from "next/link";
// 👇 1. TAMBAHKAN IMPORT IMAGE
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Menu,
  X,
  Ticket,
  PlusCircle,
  User,
  LogOut,
  CalendarDays, // CalendarDays bisa dihapus jika tidak dipakai lagi di file ini
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // --- SIMULASI LOGIN STATE ---
  const isLoggedIn = true;
  // ----------------------------

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled ? "shadow-md py-2 sm:py-3" : "border-b border-gray-100 py-3 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">

          {/* 👇 2. BAGIAN LOGO DIGANTI DENGAN GAMBAR */}
          <Link href="/" className="flex items-center shrink-0">
             <Image
                src="/logoevent.png" // Mengambil dari folder public
                alt="Eventbrite Logo"
                width={150} // Lebar dasar
                height={40} // Tinggi dasar
                priority // Prioritas loading tinggi karena di atas lipatan
                className="h-8 w-auto sm:h-10 object-contain" // Responsif: tinggi 8 unit di HP, 10 unit di tablet ke atas
             />
          </Link>

          {/* 3. Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari event..."
              className="pl-9 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 rounded-full h-10 transition-all"
            />
          </div>

          {/* 4. Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/organizer/events/create" className="text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-1">
              <PlusCircle className="w-4 h-4" /> Buat Event
            </Link>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-gray-200 hover:bg-orange-50">
                    <User className="w-5 h-5 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/transaction-events")}>
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>Tiket Saya</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>Dashboard Organizer</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold text-gray-700 hover:text-orange-600">Masuk</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full px-6">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-lg absolute w-full">
           <div className="flex flex-col gap-4">
              <Input placeholder="Cari event..." className="bg-gray-50" />
              <Link href="/organizer/events/create" className="flex items-center gap-2 text-gray-700 font-medium py-2">
                <PlusCircle className="w-4 h-4" /> Buat Event
              </Link>
              {isLoggedIn ? (
                <>
                  <Link href="/transaction-events" className="flex items-center gap-2 text-gray-700 font-medium py-2">
                    <Ticket className="w-4 h-4" /> Tiket Saya
                  </Link>
                  <div className="h-px bg-gray-100 my-1" />
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium py-2 text-left">
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="outline" className="w-full">Masuk</Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Daftar</Button>
                  </Link>
                </div>
              )}
           </div>
        </div>
      )}
    </header>
  );
}