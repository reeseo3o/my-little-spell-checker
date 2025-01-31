import { NextResponse } from 'next/server';


function encodeFormData(data: Record<string, string>): string {
    return Object.entries(data)
        .map(([key, value]) => {
            // 특수 문자 및 유니코드 문자 처리
            const encodedValue = value
                .replace(/\n/g, "\r")  // 줄바꿈 문자 변환
                .replace(/[\uFFFD]/g, '') // U+FFFD 문자 제거
                .replace(/[\u{10000}-\u{10FFFF}]/gu, ''); // 특수 유니코드 문자 제거
                
            return `${encodeURIComponent(key)}=${encodeURIComponent(encodedValue)}`;
        })
        .join('&');
}

interface SpellError {
    start: number;
    end: number;
    help: string;
    candWord: string;
    orgStr: string;
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
        
        // 맞춤법 오류를 찾지 못한 경우 체크
        if (responseText.includes('맞춤법과 문법 오류를 찾지 못했습니다')) {
            return NextResponse.json({ errors: [] });
        }
        
        // 데이터 추출을 위한 정규식 패턴
        const dataPattern = /data\s*=\s*(\[[\s\S]*?\])\s*;/;
        const match = responseText.match(dataPattern);
        
        if (!match) {
            console.log('데이터 패턴 매칭 실패');
            console.log('Response Text:', responseText);
            return NextResponse.json({ errors: [] });
        }

        try {
            const errorData = JSON.parse(match[1]);
            const errors = errorData[0]?.errInfo?.map((match: SpellError) => ({
                start: match.start,
                end: match.end,
                help: match.help,
                candWord: match.candWord,
                orgStr: match.orgStr
            })) || [];

            return NextResponse.json({ errors });
        } catch (parseError) {
            console.error('JSON 파싱 에러:', parseError);
            return NextResponse.json({ errors: [] });
        }
    } catch (error) {
        console.error('Spell check error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 