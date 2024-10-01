import { NextResponse } from 'next/server';

export async function GET() {
  // Clear the admin session or token (this would be specific to your authentication mechanism)
  // For example, remove cookies or session storage

  return NextResponse.redirect('/admin');
}
