import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ContactFormValues } from './types';

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
}

export const ContactFormFields = ({ form }: ContactFormFieldsProps) => {
  if (!form || !form.control) {
    console.error('Form or form.control is undefined in ContactFormFields');
    return <div className="text-red-500">Form configuration error</div>;
  }

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-braden-navy font-heading">
              Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Your name"
                {...field}
                className="bg-braden-light-gold font-body"
              />
            </FormControl>
            <FormMessage className="font-body" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-braden-navy font-heading">
              Email
            </FormLabel>
            <FormControl>
              <Input
                placeholder="your.email@example.com"
                type="email"
                {...field}
                className="bg-braden-light-gold font-body"
              />
            </FormControl>
            <FormMessage className="font-body" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-braden-navy font-heading">
              Phone
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Your phone number"
                type="tel"
                {...field}
                className="bg-braden-light-gold font-body"
              />
            </FormControl>
            <FormMessage className="font-body" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-braden-navy font-heading">
              Company
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Your company name"
                {...field}
                className="bg-braden-light-gold font-body"
              />
            </FormControl>
            <FormMessage className="font-body" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="serviceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-braden-navy font-heading">
              Service Interest
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-braden-light-gold font-body">
                  <SelectValue placeholder="Select a service you're interested in" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="font-body">
                <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
                <SelectItem value="traineeship">Traineeship</SelectItem>
                <SelectItem value="recruitment">Recruitment</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="mentoring">Mentoring</SelectItem>
                <SelectItem value="future_services">Future Services</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="font-body" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-braden-navy font-heading">
              Message
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about your specific needs and requirements"
                className="min-h-[120px] bg-braden-light-gold font-body"
                {...field}
              />
            </FormControl>
            <FormMessage className="font-body" />
          </FormItem>
        )}
      />
    </>
  );
};
