import type { ZodTypeAny } from 'zod';

export type ToolCategory = 'Image' | 'Video' | 'PDF' | 'Utilities' | 'AI';

export type ToolKind = 'file' | 'utility';

export type ToolDefinition<TOptionsSchema extends ZodTypeAny = ZodTypeAny> = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
  kind: ToolKind;
  icon: string;
  href: string;
  accept?: string;
  maxSizeMb?: number;
  optionsSchema?: TOptionsSchema;
  featureFlag?: string;
};

