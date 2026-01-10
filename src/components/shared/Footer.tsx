"use client";

import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
// 👇 1. IMPORT IMAGE
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            {/* 👇 2. GANTI LOGO TEKS DENGAN GAMBAR */}
            <div className="mb-4">
               <Image 
                 src="/logoevent.png" 
                 alt="Event Logo" 
                 width={160} 
                 height={50} 
                 className="object-contain brightness-0 invert" 
                 // ^^^ TRICK: brightness-0 invert membuat logo jadi PUTIH jika logo aslinya hitam.
                 // Jika logo Anda aslinya Oranye (sudah bagus di background gelap), HAPUS className ini.
                 style={{ height: "40px", width: "auto" }} // Menjaga rasio
               />
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              Platform manajemen event terbaik untuk menemukan pengalaman baru dan mengelola acara Anda dengan mudah.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="text-white font-bold mb-4">Gunakan Eventbrite</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/create-event" className="hover:text-orange-500 transition-colors">Buat Event</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Harga</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Platform Organiser</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="text-white font-bold mb-4">Jelajahi</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Konser Musik</Link></li>
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Seminar & Workshop</Link></li>
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Olahraga</Link></li>
              <li><Link href="/" className="hover:text-orange-500 transition-colors">Event Online</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-white font-bold mb-4">Ikuti Kami</h3>
            <div className="flex gap-4">
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="bg-slate-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; 2024 Eventbrite Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}