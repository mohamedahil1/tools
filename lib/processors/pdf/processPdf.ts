import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export async function mergePdfs(buffers: Buffer[]) {
  const merged = await PDFDocument.create();
  for (const buf of buffers) {
    const src = await PDFDocument.load(buf);
    const pages = await merged.copyPages(src, src.getPageIndices());
    for (const p of pages) merged.addPage(p);
  }
  const bytes = await merged.save();
  return Buffer.from(bytes);
}

export async function splitPdfToZip(buffer: Buffer) {
  const src = await PDFDocument.load(buffer);
  const zip = new JSZip();
  const pageCount = src.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const doc = await PDFDocument.create();
    const [page] = await doc.copyPages(src, [i]);
    doc.addPage(page);
    const bytes = await doc.save();
    zip.file(`page-${i + 1}.pdf`, bytes);
  }

  const zipBuf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  return zipBuf;
}

export async function optimizePdfPlaceholder(buffer: Buffer) {
  const doc = await PDFDocument.load(buffer);
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

