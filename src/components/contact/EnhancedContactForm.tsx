
import React from "react";
import { ContactForm } from "../ContactForm";
import { useEnhancedContactForm } from "./useEnhancedContactForm";
import { Card, CardContent } from "@/components/ui/card";

export function EnhancedContactForm() {
  const { form, isSubmitting, onSubmit, isInitialized } = useEnhancedContactForm();

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        {isInitialized ? (
          <ContactForm 
            form={form} 
            isSubmitting={isSubmitting} 
            onSubmit={onSubmit} 
          />
        ) : (
          <div className="flex justify-center items-center py-8">
            <div className="spinner w-8 h-8 border-4 border-t-[#ab233a] border-[#cbb26a] rounded-full animate-spin"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default EnhancedContactForm;
