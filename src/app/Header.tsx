"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white text-black p-4 flex justify-between items-center mx-auto w-[75rem]">
      <Link href="/">
        <img src="/Size=Large.svg" alt="로고" className="h-10" />
      </Link>
    </header>
  );
}
