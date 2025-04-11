
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "./types";

interface ContactFormFieldsProps {
  form: UseFormReturn<ContactFormValues>;
}

export const ContactFormFields = ({ form }: ContactFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-montserrat">Name</FormLabel>
            <FormControl>
              <Input placeholder="Your name" {...field} className="bg-gray-50 font-inter" />
            </FormControl>
            <FormMessage className="font-inter" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-montserrat">Email</FormLabel>
            <FormControl>
              <Input placeholder="your.email@example.com" type="email" {...field} className="bg-gray-50 font-inter" />
            </FormControl>
            <FormMessage className="font-inter" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-montserrat">Phone</FormLabel>
            <FormControl>
              <Input placeholder="Your phone number" type="tel" {...field} className="bg-gray-50 font-inter" />
            </FormControl>
            <FormMessage className="font-inter" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-montserrat">Company</FormLabel>
            <FormControl>
              <Input placeholder="Your company name" {...field} className="bg-gray-50 font-inter" />
            </FormControl>
            <FormMessage className="font-inter" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="serviceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-montserrat">Service Interest</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-gray-50 font-inter">
                  <SelectValue placeholder="Select a service you're interested in" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="font-inter">
                <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
                <SelectItem value="traineeship">Traineeship</SelectItem>
                <SelectItem value="recruitment">Recruitment</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="mentoring">Mentoring</SelectItem>
                <SelectItem value="future_services">Future Services</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="font-inter" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-montserrat">Message</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your specific needs and requirements"
                className="min-h-[120px] bg-gray-50 font-inter"
                {...field}
              />
            </FormControl>
            <FormMessage className="font-inter" />
          </FormItem>
        )}
      />
    </>
  );
};
