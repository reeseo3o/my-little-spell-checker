import { NextResponse } from 'next/server';


function encodeFormData(data: Record<string, string>): string {
    return Object.entries(data)
        .map(([key, value]) => 
            encodeURIComponent(key) + '=' + encodeURIComponent(value)
        )
        .join('&');
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const text = data.text || '';

        if (text === "") {
            return NextResponse.json({ errors: [] });
        }

        const response = await fetch("http://speller.cs.pusan.ac.kr/results", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: encodeFormData({ text1: text.replace(/\n/g, "\r") })
        });

        const responseText = await response.text();
        const startIndex = responseText.indexOf("data = [{");
        const nextIndex = responseText.indexOf("}];");
        const rawData = responseText.substring(startIndex + 7, nextIndex + 2);
        const errorData = JSON.parse(rawData);

        const errors = errorData[0]?.errInfo?.map((match: any) => ({
            start: match.start,
            end: match.end,
            help: match.help,
            candWord: match.candWord,
            orgStr: match.orgStr
        })) || [];

        return NextResponse.json({ errors });
    } catch (error) {
        console.error('Spell check error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 