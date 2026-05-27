import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const payload = await req.json().catch(() => ({}));
        console.log("Internal Proxy: Forwarding Mobile SOS to State Engine...");
        
        await fetch('http://localhost:3000/api/trigger-sos', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return NextResponse.json({ success: true, message: "Proxied to Command Center" });
    } catch(e) {
        console.error("Internal Proxy Error", e);
        return NextResponse.json({ success: false });
    }
}
