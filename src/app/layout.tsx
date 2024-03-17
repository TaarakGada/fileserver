import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Client from 'pocketbase';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'File Server',
    description: 'Temp File Server',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`dark h-screen ${inter.className || ''}`}>
                <Toaster position="bottom-left" />
                {children}
            </body>
        </html>
    );
}
