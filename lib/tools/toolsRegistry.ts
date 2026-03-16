import type { ToolDefinition } from '@/lib/tools/types';

export const toolsRegistry: ToolDefinition[] = [
  // Image
  {
    slug: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image size while keeping great quality.',
    category: 'Image',
    kind: 'file',
    icon: 'Shrink',
    href: '/tools/image-compressor',
    accept: 'image/*',
    maxSizeMb: 25
  },
  {
    slug: 'image-background-remover',
    title: 'Background Remover',
    description: 'Remove backgrounds with a pluggable AI provider.',
    category: 'Image',
    kind: 'file',
    icon: 'ImageDown',
    href: '/tools/image-background-remover',
    accept: 'image/*',
    maxSizeMb: 25,
    featureFlag: 'ENABLE_BG_REMOVAL'
  },
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize to custom width & height.',
    category: 'Image',
    kind: 'file',
    icon: 'FileImage',
    href: '/tools/image-resizer',
    accept: 'image/*',
    maxSizeMb: 25
  },
  {
    slug: 'image-converter',
    title: 'Image Converter',
    description: 'Convert PNG / JPG / WebP instantly.',
    category: 'Image',
    kind: 'file',
    icon: 'Images',
    href: '/tools/image-converter',
    accept: 'image/*',
    maxSizeMb: 25
  },

  // Video
  {
    slug: 'video-compressor',
    title: 'Video Compressor',
    description: 'Compress MP4 / MOV / WEBM with FFmpeg.',
    category: 'Video',
    kind: 'file',
    icon: 'FileVideo',
    href: '/tools/video-compressor',
    accept: 'video/*',
    maxSizeMb: 250,
    featureFlag: 'ENABLE_FFMPEG'
  },
  {
    slug: 'video-to-gif',
    title: 'Video to GIF',
    description: 'Convert short clips to GIF.',
    category: 'Video',
    kind: 'file',
    icon: 'Film',
    href: '/tools/video-to-gif',
    accept: 'video/*',
    maxSizeMb: 250,
    featureFlag: 'ENABLE_FFMPEG'
  },
  {
    slug: 'video-trimmer',
    title: 'Video Trimmer',
    description: 'Cut and trim video by timestamps.',
    category: 'Video',
    kind: 'file',
    icon: 'Scissors',
    href: '/tools/video-trimmer',
    accept: 'video/*',
    maxSizeMb: 250,
    featureFlag: 'ENABLE_FFMPEG'
  },
  {
    slug: 'video-converter',
    title: 'Video Converter',
    description: 'Convert MP4 / MOV / WEBM formats.',
    category: 'Video',
    kind: 'file',
    icon: 'Clapperboard',
    href: '/tools/video-converter',
    accept: 'video/*',
    maxSizeMb: 250,
    featureFlag: 'ENABLE_FFMPEG'
  },

  // PDF
  {
    slug: 'pdf-compressor',
    title: 'PDF Compressor',
    description: 'Best-effort optimize PDFs (placeholder for true compression).',
    category: 'PDF',
    kind: 'file',
    icon: 'Shrink',
    href: '/tools/pdf-compressor',
    accept: 'application/pdf',
    maxSizeMb: 50
  },
  {
    slug: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one.',
    category: 'PDF',
    kind: 'file',
    icon: 'Combine',
    href: '/tools/merge-pdf',
    accept: 'application/pdf',
    maxSizeMb: 50
  },
  {
    slug: 'split-pdf',
    title: 'Split PDF',
    description: 'Split a PDF into separate pages.',
    category: 'PDF',
    kind: 'file',
    icon: 'Split',
    href: '/tools/split-pdf',
    accept: 'application/pdf',
    maxSizeMb: 50
  },
  {
    slug: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Convert PDF to DOCX (placeholder).',
    category: 'PDF',
    kind: 'file',
    icon: 'FileType2',
    href: '/tools/pdf-to-word',
    accept: 'application/pdf',
    maxSizeMb: 50,
    featureFlag: 'ENABLE_PDF_TO_WORD'
  },

  // Utilities
  {
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    description: 'Generate QR codes for URLs and text.',
    category: 'Utilities',
    kind: 'utility',
    icon: 'QrCode',
    href: '/tools/qr-code-generator'
  },
  {
    slug: 'password-generator',
    title: 'Password Generator',
    description: 'Generate strong passwords with options.',
    category: 'Utilities',
    kind: 'utility',
    icon: 'KeyRound',
    href: '/tools/password-generator'
  },
  {
    slug: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters, and reading time.',
    category: 'Utilities',
    kind: 'utility',
    icon: 'TextQuote',
    href: '/tools/word-counter'
  }
];

export function getTool(slug: string) {
  return toolsRegistry.find((t) => t.slug === slug) ?? null;
}

