
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useImageUpload } from '@/hooks/useImageUpload';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function EnhancedContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [attachment, setAttachment] = React.useState<File | null>(null);
  const [attachmentUrl, setAttachmentUrl] = React.useState<string | null>(null);
  const { uploadImage, uploading } = useImageUpload('media');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    let fileUrl = null;

    try {
      // Upload attachment if present
      if (attachment) {
        fileUrl = await uploadImage(attachment);
        if (!fileUrl) {
          throw new Error("Failed to upload attachment");
        }
        setAttachmentUrl(fileUrl);
      }

      // Insert into leads table
      const { error } = await supabase.from('leads').insert([
        {
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          company: values.company || null,
          service_type: 'Contact Form',
          attachment_url: fileUrl
        }
      ]);

      if (error) throw error;

      // Send success message
      toast.success("Thank you for your message", {
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form
      form.reset();
      setAttachment(null);
      setAttachmentUrl(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Form submission failed", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-braden-navy font-montserrat">Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} className="font-opensans" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-braden-navy font-montserrat">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} type="email" className="font-opensans" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-braden-navy font-montserrat">Phone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} className="font-opensans" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-braden-navy font-montserrat">Company (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Your company" {...field} className="font-opensans" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-braden-navy font-montserrat">Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How can we help you?"
                  rows={5}
                  {...field}
                  className="font-opensans"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel className="text-braden-navy font-montserrat">Attachment (Optional)</FormLabel>
          <Input
            type="file"
            onChange={handleFileChange}
            className="font-opensans"
            accept="image/*,.pdf,.doc,.docx"
          />
          {attachment && (
            <p className="text-sm text-gray-500">
              Selected file: {attachment.name}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || uploading}
          className="w-full bg-braden-red hover:bg-braden-dark-red text-white font-montserrat transition-colors"
        >
          {isSubmitting || uploading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  );
}
