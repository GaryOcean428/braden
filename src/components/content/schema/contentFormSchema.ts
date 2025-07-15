import * as z from 'zod';

// Form schema validation
export const contentFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  meta_description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  is_published: z.boolean().default(false),
  additional_field: z.string().optional(),
});

export type ContentFormValues = z.infer<typeof contentFormSchema>;
