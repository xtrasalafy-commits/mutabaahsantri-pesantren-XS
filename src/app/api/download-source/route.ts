import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const FILES = [
  'src/app/layout.tsx',
  'src/app/globals.css',
  'src/app/page.tsx',
  'src/app/actions.ts',
  'src/app/(aplikasi)/layout.tsx',
  'src/app/(aplikasi)/dashboard/page.tsx',
  'src/app/(aplikasi)/setoran/page.tsx',
  'src/app/(aplikasi)/murajaah/page.tsx',
  'src/app/(aplikasi)/progress/page.tsx',
  'src/app/(aplikasi)/laporan/page.tsx',
  'src/app/(aplikasi)/master-data/page.tsx',
  'src/app/(aplikasi)/pengaturan/page.tsx',
  'src/app/(aplikasi)/portal-wali/page.tsx',
  'src/app/(aplikasi)/santri/[id]/page.tsx',
  'src/app/masuk/page.tsx',
  'src/app/lupa-kata-sandi/page.tsx',
  'src/app/donasi/page.tsx',
  'src/app/docs/page.tsx',
  'src/app/api/health/route.ts',
  'src/components/app-shell.tsx',
  'src/components/submission-form.tsx',
  'src/components/progress-chart.tsx',
  'src/components/report-export.tsx',
  'src/components/master-data-manager.tsx',
  'src/components/settings-manager.tsx',
  'src/components/shared.tsx',
  'src/components/trakteer-donation-widget.tsx',
  'src/lib/auth.ts',
  'src/lib/data.ts',
  'src/lib/utils.ts',
  'src/db/index.ts',
  'src/db/schema.ts',
  'src/db/seed.ts',
  'next.config.ts',
  'drizzle.config.json',
  'package.json',
  'tsconfig.json',
  'README.md',
];

export async function GET() {
  const zip = new JSZip();
  const root = process.cwd();

  for (const relPath of FILES) {
    const absolutePath = join(root, relPath);
    if (existsSync(absolutePath)) {
      const content = readFileSync(absolutePath, 'utf8');
      zip.file(relPath, content);
    }
  }

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="mutabaahsantri-source-code.zip"',
    },
  });
}
