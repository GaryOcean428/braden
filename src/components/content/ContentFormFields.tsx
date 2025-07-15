import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ContentFormValues } from './schema/contentFormSchema';

interface ContentFormFieldsProps {
  form: UseFormReturn<ContentFormValues>;
}

export function ContentFormFields({ form }: ContentFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...form.register('title')}
          className="mt-1 w-full"
          placeholder="Page Title"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          {...form.register('slug')}
          className="mt-1 w-full"
          placeholder="page-slug"
        />
        {form.formState.errors.slug && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.slug.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="meta_description">Meta Description</Label>
        <Textarea
          id="meta_description"
          {...form.register('meta_description')}
          className="mt-1 w-full"
          placeholder="Page description for SEO purposes"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="content">Content (JSON)</Label>
        <Textarea
          id="content"
          {...form.register('content')}
          className="mt-1 w-full font-mono"
          placeholder='{"blocks": []}'
          rows={10}
        />
        {form.formState.errors.content && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="additional_field">Additional Field</Label>
        <Input
          id="additional_field"
          {...form.register('additional_field')}
          className="mt-1 w-full"
          placeholder="Additional Field"
        />
        {form.formState.errors.additional_field && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.additional_field.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_published"
          checked={form.watch('is_published')}
          onCheckedChange={(checked) => form.setValue('is_published', checked)}
        />
        <Label htmlFor="is_published">Publish this page</Label>
      </div>
    </div>
  );
}
