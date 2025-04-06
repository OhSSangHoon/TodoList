"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white flex justify-between items-center h-16 border-b border-[#E2E8F0]">
      <div className="mx-auto w-[75rem]">
        <Link href="/">
          <img
            src="/Size=Large.svg"
            alt="로고"
            className="hidden sm:block h-10"
          />
          <img
            src="/logo.png"
            alt="로고" 
            className="block sm:hidden h-10"
          />
        </Link>
      </div>
    </header>
  );
}