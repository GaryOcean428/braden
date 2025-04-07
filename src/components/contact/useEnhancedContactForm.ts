import { useContactForm } from "./useContactForm";
import { sendLeadConfirmationEmail } from "@/lib/email/emailService";
import { createFollowUpTask, ensureTaskTablesExist, getStaffDetails } from "@/lib/tasks/taskService";
import { sendStaffNotificationEmail } from "@/lib/email/emailService";
import { supabase } from "@/integrations/supabase/client";
import { ContactFormValues } from "./types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useEnhancedContactForm = () => {
  const baseForm = useContactForm();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize task tables on component mount
  useEffect(() => {
    const initializeTables = async () => {
      try {
        await ensureTaskTablesExist();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing task tables:", error);
        // Continue anyway as tables might already exist
        setIsInitialized(true);
      }
    };
    
    initializeTables();
  }, []);
  
  const enhancedSubmit = async (values: ContactFormValues) => {
    try {
      // First, submit the form data to Supabase (original functionality)
      baseForm.form.handleSubmit(async () => {
        try {
          baseForm.setIsSubmitting(true);
          
          // Create a new lead
          const { data: leadData, error: leadError } = await supabase
            .from('leads')
            .insert([{
              name: values.name,
              email: values.email,
              phone: values.phone,
              company: values.company,
              service_type: values.serviceType,
              message: values.message,
            }])
            .select();
            
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
          
          // Send confirmation email to the lead
          await sendLeadConfirmationEmail(
            values.email,
            values.name,
            values.serviceType
          );
          
          // Create follow-up task for staff
          const leadId = leadData?.[0]?.id;
          if (leadId) {
            const { success: taskSuccess, taskId } = await createFollowUpTask(
              leadId,
              values.serviceType
            );
            
            if (taskSuccess && taskId) {
              // Get assigned staff details
              const { data: taskData } = await supabase
                .from('tasks')
                .select('assigned_to')
                .eq('id', taskId)
                .single();
                
              if (taskData?.assigned_to) {
                const staffDetails = await getStaffDetails(taskData.assigned_to);
                
                if (staffDetails?.email) {
                  // Send notification email to assigned staff
                  await sendStaffNotificationEmail(
                    staffDetails.email,
                    {
                      ...values,
                      leadId,
                      taskId,
                    }
                  );
                }
              }
            }
          }
          
          toast.success("Thank you for your message. We'll be in touch soon!");
          baseForm.form.reset();
        } catch (error) {
          console.error('Error submitting form:', error);
          toast.error("There was an error submitting your message. Please try again.");
        } finally {
          baseForm.setIsSubmitting(false);
        }
      })();
    } catch (error) {
      console.error('Error in enhanced submit:', error);
    }
  };
  
  return {
    ...baseForm,
    isInitialized,
    onSubmit: baseForm.form.handleSubmit(enhancedSubmit),
  };
};
