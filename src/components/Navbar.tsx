"use client";

import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="navbar shadow-sm border-b border-green-200">
    {/* // <nav className="navbar shadow-sm border-b border-green-200"> */}
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14">
            <Image src="/images/logo.png" alt="logo"
              //  width={46} height={44}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-4 sm:gap-8 flex-wrap justify-end max-sm:text-sm">
        <NavItems />
        <SignedOut>
          <SignInButton>
            <button className="btn-signin">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
