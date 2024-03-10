"use client";
import { FileView } from "@/components/component/FileView";
import { Upload } from "@/components/component/Upload";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Home() {
    return (

        <main className="flex flex-col items-center justify-between">
            <FileView />
        </main>
    );
}
