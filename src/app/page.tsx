'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Wrapper from '@/components/componentdesktop/Wrapper';

const RevisedUpload = dynamic(
    () => import('@/components/componentdesktop/RevisedUpload'),
    { ssr: false }
);
const Upload = dynamic(() => import('@/components/componentmobile/Upload'), {
    ssr: false,
});
const Header = dynamic(() => import('@/components/componentmobile/Header'), {
    ssr: false,
});
const Navbar = dynamic(() => import('@/components/componentmobile/Navbar'), {
    ssr: false,
});

export default function Home() {
    const [isMobile, setIsMobile] = useState(false);
    const [hydrated, setHydrated] = useState(false); // Flag to track hydration

    useEffect(() => {
        setHydrated(true); // Now we are on the client
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Only render the real components once we are hydrated
    if (!hydrated) {
        return null; // Render nothing or a fallback during SSR
    }

    return (
        <>
            {isMobile ? (
                <div className="flex flex-col justify-center items-center w-full h-dvh">
                    <Header />
                    <main className="flex flex-grow flex-col justify-center items-center w-full">
                        <Upload />
                    </main>
                    <Navbar />
                </div>
            ) : (
                <Wrapper>
                    <main className="flex flex-grow overflow-auto">
                        <RevisedUpload />
                    </main>
                </Wrapper>
            )}
        </>
    );
}
