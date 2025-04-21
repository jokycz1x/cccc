# Řešení problému s uploadu PDF do Supabase

Problém: **PDF parsování nepodporuje ukládání do Supabase Storage z prohlížeče**

## Implementované řešení

Vytvořili jsme komplexní řešení, které řeší problém omezení CORS a přímého přístupu k Supabase z prohlížeče:

### 1. Serverová proxy pro upload souborů

Soubor: `/app/api/upload/route.ts`

```typescript
// Přijímá soubor od klienta
const file = formData.get('file') as File;
const path = formData.get('path') as string;

// Nahraje soubor do Supabase pomocí server-side klíče
const { data, error } = await supabase.storage
  .from('bonds')
  .upload(storagePath, fileBuffer, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: true,
  });

// Vrátí veřejnou URL a cestu k souboru
return NextResponse.json({
  success: true,
  filePath: data.path,
  url: publicUrlData.publicUrl,
});
```

### 2. Serverové parsování PDF

Soubor: `/app/api/pdf-parse/route.ts`

```typescript
// Přijímá PDF soubor od klienta
const file = formData.get('pdf') as File;

// Získá data souboru a parsuje je na serveru
const fileBuffer = await file.arrayBuffer();
const bondData = await parsePDFServer(fileBuffer);

// Vrátí extrahovaná data
return NextResponse.json({
  success: true,
  data: bondData
});
```

### 3. Server-side PDF parser

Soubor: `/lib/pdf-parser-server.ts`

```typescript
// Používá canvas polyfill pro Node.js
global.Path2D = require('path2d-polyfill');
global.CanvasRenderingContext2D = require('canvas').CanvasRenderingContext2D;
global.HTMLCanvasElement = createCanvas(1, 1).constructor;
```

### 4. Upravený formulář komponenta

Soubor: `/components/BondForm.tsx`

```typescript
// Pokud client-side parsing selže, použije server-side
try {
  // Parse PDF client-side
  const extractedData = await parsePDF(file);
  // ...
} catch (clientError) {
  // Fall back to server-side parsing
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await fetch('/api/pdf-parse', {
    method: 'POST',
    body: formData,
  });
  // ...
}

// Pro upload PDF při submitu formuláře
if (data.pdf && data.pdf[0]) {
  const fileFormData = new FormData();
  fileFormData.append('file', pdfFile);
  fileFormData.append('path', 'bonds');
  
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: fileFormData,
  });
  // ...
}
```

## Tok dat

1. **Parsování PDF**:
   - Klient se pokusí parsovat PDF lokálně
   - Pokud to selže, pošle soubor na server
   - Server parsuje PDF pomocí Node.js implementace a vrátí data
   - Formulář se vyplní extrahovanými daty

2. **Upload souboru při odeslání formuláře**:
   - Formulář pošle PDF soubor na `/api/upload` endpoint
   - Server nahraje soubor do Supabase Storage
   - Server vrátí URL a cestu k souboru
   - Formulář pokračuje v odesílání dat včetně URL k PDF

## Výhody

1. **Zabezpečení** - API klíče jsou pouze na serveru, nikdy v prohlížeči
2. **Spolehlivost** - Funguje i když client-side parsing selže
3. **Kompatibilita** - Funguje ve všech prohlížečích
4. **Efektivita** - Veškeré zpracování probíhá na serveru

## Požadované závislosti

```bash
npm install canvas pdfjs-dist path2d-polyfill --save
```

Toto řešení komplexně řeší problém ukládání a zpracování PDF souborů v Supabase, a to způsobem, který je zabezpečený a spolehlivý jak pro produkční prostředí, tak i pro vývoj.