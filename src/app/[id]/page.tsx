'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Wrapper from '@/components/componentdesktop/Wrapper';

const RevisedFileView = dynamic(
    () => import('@/components/componentdesktop/RevisedFileView'),
    { ssr: false }
);
const ShowCodeMob = dynamic(
    () => import('@/components/componentdesktop/ShowCodeMob'),
    { ssr: false }
);
const Header = dynamic(() => import('@/components/componentmobile/Header'), {
    ssr: false,
});
const Navbar = dynamic(() => import('@/components/componentmobile/Navbar'), {
    ssr: false,
});
const Recieve = dynamic(() => import('@/components/componentmobile/Recieve'), {
    ssr: false,
});

export default function GetFiles({ params }: { params: { id: string } }) {
    const { id } = params;
    const [isMobile, setIsMobile] = useState(false);
    const [hydrated, setHydrated] = useState(false); // New state to track hydration

    useEffect(() => {
        setHydrated(true); // Hydration is complete once we are on the client

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check on initial load
        checkMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkMobile);

        // Cleanup event listener
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Render nothing until hydration is complete
    if (!hydrated) {
        return null; // You can return a fallback UI like a loading spinner here if needed
    }

    const isShowCode = id.startsWith('show-');
    const uniqueId = isShowCode ? id.replace('show-', '') : id;

    return (
        <>
            {isMobile ? (
                <div className="flex flex-col justify-center items-center w-full h-dvh">
                    <Header />
                    <main className="flex flex-grow flex-col justify-center items-center w-full">
                        {isShowCode ? (
                            <ShowCodeMob unique={uniqueId} />
                        ) : (
                            <Recieve />
                        )}
                    </main>
                    <Navbar />
                </div>
            ) : (
                <Wrapper>
                    {isShowCode ? (
                        <ShowCodeMob unique={uniqueId} />
                    ) : (
                        <RevisedFileView code={uniqueId} />
                    )}
                </Wrapper>
            )}
        </>
    );
}
