"use client";

import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";

const Footer: FC = () => {

   const socials = [
    { icon: Facebook, href: "https://www.facebook.com/yourpage" },
    { icon: Instagram, href: "https://www.instagram.com/yourprofile" },
    { icon: Twitter, href: "https://x.com/soy_yo_dev40?t=ScXHQU4i0wCgiPWgRLYJjQ&s=09" }, // X (formerly Twitter)
    { icon: Github, href: "https://github.com/yo-soy-dev" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/yo-soy-dev" },
  ]; 

  return (
    // <footer className="mt-20 bg-background border-t">
     <footer 
      className="
         mt-20 
         bg-gradient-to-b from-[#e8fbe8] via-[#d5f9d5] to-[#c1f0c1] 
         border-t border-green-200
         text-gray-800
     ">
      {/* Gradient Top Line */}
      {/* <div className="h-1 w-full bg-gradient-to-r from-primary/80 via-pink-500 to-purple-600"></div> */}

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 flex flex-col gap-16">

        {/* Main Footer Grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-4 
          gap-12
        ">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  fill
                  className="object-contain"
                /> 
              </div>
              <span className="text-xl font-semibold hidden sm:block">
                OrbitLearn
              </span>
            </Link>

            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              Smarter learning with AI-powered study buddies and personalized journeys.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 mt-5">
              {socials.map(({ icon: Icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    hover:text-primary transition 
                    hover:-translate-y-1 
                    duration-300
                  "
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/companions" className="hover:text-primary">Study Buddies</Link></li>
              <li><Link href="/my-journey" className="hover:text-primary">My Journey</Link></li>
              <li><Link href="/quiz" className="hover:text-primary">Challenge</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="/" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/" className="hover:text-primary">Report Issue</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground border-t pt-6">
          © {new Date().getFullYear()} Soy_Yo Dev — All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
