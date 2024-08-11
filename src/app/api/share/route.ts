// app/api/share/route.js (for Next.js App Router)
// or pages/api/share.js (for Next.js Pages Router)


import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';


function generateUniqueCode() {
    const alphabets = 'abcdefghijkmnopqrstuvwxyz';
    const twoAlphabets = alphabets[Math.floor(Math.random() * 25)] + alphabets[Math.floor(Math.random() * 25)];
    const twoNumbers = Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10);
    return twoAlphabets + twoNumbers;
}


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const pb = new PocketBase('https://sujal.pockethost.io');

        let newUnique;
        do {
            newUnique = generateUniqueCode();
        } while (await pb.collection('files').getFirstListItem(`unique="${newUnique}"`).catch(() => null));
        formData.append('unique', newUnique);
        await pb.collection('files').create(formData);
        return NextResponse.redirect("https://fs.sujal.xyz/show-" + newUnique);

    } catch (error: any) {
        console.error('Error handling shared content:', error?.message);
        return NextResponse.redirect('https://fs.sujal.xyz/');
    }
}
