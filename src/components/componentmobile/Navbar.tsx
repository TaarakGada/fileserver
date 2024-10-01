'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

function Navbar() {
    const pathname = usePathname();
    return (
        <div className="w-full flex justify-center items-center bg-card">
            <Link
                href="/"
                passHref
                className={clsx(
                    'h-12 text-lg font-semibold rounded-lg flex items-center justify-center m-2 w-full',
                    pathname === '/'
                        ? 'text-black bg-primary'
                        : 'text-white hover:text-primary hover:bg-gray-100/10'
                )}
            >
                Send
            </Link>
            <div className="w-[2px] h-3/5 bg-white/30" />
            <Link
                href="/get"
                passHref
                className={clsx(
                    'h-12 text-lg font-semibold rounded-lg flex items-center justify-center m-2 w-full',
                    pathname === '/get'
                        ? 'text-black bg-primary'
                        : 'text-white hover:text-primary hover:bg-gray-100/10'
                )}
            >
                Recieve
            </Link>
        </div>
    );
}

export default Navbar;
