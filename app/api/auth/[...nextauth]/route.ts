import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Přidáme logování
console.log('=== Inicializace NextAuth handleru ===');

// Použijeme nakonfigurované authOptions z lib/auth.ts
const handler = NextAuth(authOptions);

// Obalíme handler do funkcí s logováním
export async function GET(req: Request, ...args: any[]) {
  console.log('=== NextAuth GET handler ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', Object.fromEntries([...req.headers.entries()]));

  try {
    return await handler(req, ...args);
  } catch (error) {
    console.error('Chyba v NextAuth GET handleru:', error);
    throw error;
  }
}

export async function POST(req: Request, ...args: any[]) {
  console.log('=== NextAuth POST handler ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', Object.fromEntries([...req.headers.entries()]));

  try {
    // Zkopírujeme request, abychom mohli přečíst body
    const reqClone = req.clone();
    const body = await reqClone.text().catch(() => '{}');
    console.log('Body:', body);

    return await handler(req, ...args);
  } catch (error) {
    console.error('Chyba v NextAuth POST handleru:', error);
    throw error;
  }
}