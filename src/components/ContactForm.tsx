"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  serviceType: z.enum(['apprenticeship', 'traineeship', 'recruitment', 'technology', 'compliance', 'mentoring', 'future_services'], {
    required_error: "Please select a service type.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: undefined,
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      
      // Create a new lead
      const { error: leadError } = await supabase
        .from('leads')
        .insert([{
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          service_type: values.serviceType,
        }]);

      if (leadError) throw leadError;

      // Create a new client
      const { error: clientError } = await supabase
        .from('clients')
        .insert([{
          name: values.company,
          email: values.email,
          phone: values.phone,
          service_type: values.serviceType,
        }]);

      if (clientError) throw clientError;

      toast.success("Thank you for your message. We'll be in touch soon!");
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} className="bg-gray-50" />
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
              <FormLabel className="text-gray-700">Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" type="email" {...field} className="bg-gray-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Phone</FormLabel>
              <FormControl>
                <Input placeholder="Your phone number" type="tel" {...field} className="bg-gray-50" />
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
              <FormLabel className="text-gray-700">Company</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" {...field} className="bg-gray-50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Service Interest</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select a service you're interested in" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="apprenticeship">Apprenticeship</SelectItem>
                  <SelectItem value="traineeship">Traineeship</SelectItem>
                  <SelectItem value="recruitment">Recruitment</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="mentoring">Mentoring</SelectItem>
                  <SelectItem value="future_services">Future Services</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your specific needs and requirements"
                  className="min-h-[120px] bg-gray-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-brand-primary hover:bg-brand-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  )
}