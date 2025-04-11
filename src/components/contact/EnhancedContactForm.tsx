
import React from "react";
import { ContactForm } from "../ContactForm";
import { useEnhancedContactForm } from "./useEnhancedContactForm";
import { Card, CardContent } from "@/components/ui/card";

export function EnhancedContactForm() {
  const { form, isSubmitting, onSubmit, isInitialized } = useEnhancedContactForm();

  if (!isInitialized) {
    return (
      <Card className="shadow-md border-braden-light-gold/20">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-8">
            <div className="spinner w-8 h-8 border-4 border-t-braden-red border-braden-gold rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-braden-light-gold/20">
      <CardContent className="pt-6">
        {form && (
          <ContactForm 
            form={form} 
            isSubmitting={isSubmitting} 
            onSubmit={onSubmit} 
          />
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedContactForm;
