"use client";
import { FileView } from '@/components/component/FileView';
import Wrapper from '@/components/component/Wrapper';

export default function GetFiles({ params }: { params: { id: string } }) {
    const { id } = params;
    return (
        <Wrapper>
            <FileView code={id} />
        </Wrapper>
    );
}