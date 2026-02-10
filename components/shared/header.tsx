/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { countries } from "../../lib/db/countres";
import { ModeToggle } from "../provider/modde-toggle";
import Link from "next/link";
import { Button } from "../ui/button";


export default function Header() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // 1. LocalStorage'dan kullanıcı adını al (Kullanıcı kayıt olduğunda set etmiş olmalısın)
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      // 2. DB'den tüm bilgileri (ülke vs.) çek
      fetch(`/api/user/${storedUsername}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setUser(data);
          }
        })
        .catch((err) => console.error("Header Fetch Error:", err));
    }
  }, []);

  const userFlag = countries.find((c) => c.code === user?.country)?.flag || "🏳️";

  return (
    <header  className={`fixed top-0 right-0 z-50 transition-all duration-300 px-6 flex items-center justify-between
          bg-primary-foreground
        left-0 md:left-64 
        ${isScrolled 
          ? "h-16 bg-background/80 backdrop-blur-xl border-b shadow-sm" 
          : "h-20 bg-background"
        }`}>
      
      {/* Sayfa İsmi */}
      {/* <div>
        <img src="logo1.png" alt="" className="w-20" />
      </div> */}
      <div className="text-xl flex h-full items-center gap-1  font-black tracking-tighter text-black  dark:text-slate-200 uppercase">
          <Link href={"/"}><img src="logo1.png" alt="" className="w-20" /></Link> 
        {pathname.split("/").filter(Boolean).pop() || "Overview"}
      </div>

      {/* Kullanıcı Bilgisi */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right leading-none">
              <p className="text-sm font-bold dark:text-white mb-1">
                {user.username}
              </p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                {user.country}
              </p>
            </div>
            
            <Button className="w-10 h-10 border flex items-center justify-center bg-primary-accent rounded-xl bordertext-xl shadow-sm">
              {userFlag}
            </Button><ModeToggle />
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">Guest Mode</div>
        )}
      </div>
    </header>
  );
}