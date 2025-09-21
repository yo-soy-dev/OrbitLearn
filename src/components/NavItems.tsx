'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // utility for conditional classNames

// Define nav items
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Companions', href: '/companions' },
  { label: 'My Journey', href: '/my-journey' },
];

const NavItems = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4">
      {navItems.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            pathname === href && 'text-primary font-semibold',
            'hover:text-primary transition-colors'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default NavItems;
