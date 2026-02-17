import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

const MAX_TEXT_LENGTH = 2000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text')?.trim();

  if (!text) {
    return NextResponse.json(
      { error: 'Missing required parameter: "text". Use ?text=your-link-or-message', code: 'MISSING_TEXT' },
      { status: 400 }
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `text must be at most ${MAX_TEXT_LENGTH} characters`, code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  try {
    const sizeParam = searchParams.get('size');
    const width = sizeParam ? Math.min(512, Math.max(128, parseInt(sizeParam, 10) || 256)) : 256;

    const png = await QRCode.toBuffer(text, {
      type: 'png',
      margin: 2,
      width,
      errorCorrectionLevel: 'M',
    });

    return new NextResponse(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('QR generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate QR code', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body?.text === 'string' ? body.text.trim() : '';

    if (!text) {
      return NextResponse.json(
        { error: 'Missing required field: "text". Send { "text": "your-link-or-message" }', code: 'MISSING_TEXT' },
        { status: 400 }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: `text must be at most ${MAX_TEXT_LENGTH} characters`, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const width = typeof body?.width === 'number' ? Math.min(512, Math.max(128, body.width)) : 256;

    const png = await QRCode.toBuffer(text, {
      type: 'png',
      margin: 2,
      width,
      errorCorrectionLevel: 'M',
    });

    return new NextResponse(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body', code: 'PARSE_ERROR' },
        { status: 400 }
      );
    }
    console.error('QR generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate QR code', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
