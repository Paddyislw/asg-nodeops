import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const attestationId = searchParams.get('id');

    if (!attestationId) {
      return Response.json({ error: 'Attestation ID is required' }, { status: 400 });
    }

    const response = await fetch(
      `https://iris-api-sandbox.circle.com/v1/attestations/${attestationId}`
    );

    // Check if response is ok and content-type is JSON
    if (!response.ok) {
      const text = await response.text();
      return Response.json({
        error: `API request failed with status ${response.status}`,
        details: text.substring(0, 200)
      }, { status: response.status });
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      return Response.json({
        error: 'API returned non-JSON response',
        contentType,
        details: text.substring(0, 200)
      }, { status: 502 });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}