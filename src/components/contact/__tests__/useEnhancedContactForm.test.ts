import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEnhancedContactForm } from '../useEnhancedContactForm';
import { renderHook, act } from '@testing-library/react-hooks';
import { supabase } from '@/integrations/supabase/client';
import { sendLeadConfirmationEmail } from '@/lib/email/emailService';
import { createFollowUpTask, getStaffDetails } from '@/lib/tasks/taskService';
import { sendStaffNotificationEmail } from '@/lib/email/emailService';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    rpc: vi.fn().mockReturnThis(),
  }
}));

vi.mock('@/lib/email/emailService', () => ({
  sendLeadConfirmationEmail: vi.fn().mockResolvedValue({ success: true }),
  sendStaffNotificationEmail: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('@/lib/tasks/taskService', () => ({
  createFollowUpTask: vi.fn().mockResolvedValue({ success: true, taskId: 'task-123' }),
  ensureTaskTablesExist: vi.fn().mockResolvedValue({ success: true }),
  getStaffDetails: vi.fn().mockResolvedValue({ id: 'staff-123', email: 'staff@example.com', name: 'Staff Member' })
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useEnhancedContactForm', () => {
  const mockFormValues = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    company: 'Test Company',
    serviceType: 'recruitment',
    message: 'This is a test message'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful Supabase responses
    supabase.from = vi.fn().mockReturnThis();
    supabase.insert = vi.fn().mockReturnThis();
    supabase.select = vi.fn().mockResolvedValue({
      data: [{ id: 'lead-123' }],
      error: null
    });
  });

  it('should initialize task tables on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEnhancedContactForm());
    
    await waitForNextUpdate();
    
    expect(result.current.isInitialized).toBe(true);
  });

  it('should handle form submission successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEnhancedContactForm());
    
    await waitForNextUpdate();
    
    await act(async () => {
      await result.current.onSubmit(mockFormValues);
    });
    
    // Verify Supabase calls
    expect(supabase.from).toHaveBeenCalledWith('leads');
    expect(supabase.from).toHaveBeenCalledWith('clients');
    
    // Verify email sending
    expect(sendLeadConfirmationEmail).toHaveBeenCalledWith(
      mockFormValues.email,
      mockFormValues.name,
      mockFormValues.serviceType
    );
    
    // Verify task creation
    expect(createFollowUpTask).toHaveBeenCalledWith(
      'lead-123',
      mockFormValues.serviceType
    );
    
    // Verify staff notification
    expect(sendStaffNotificationEmail).toHaveBeenCalled();
    
    // Verify success toast
    expect(toast.success).toHaveBeenCalled();
  });

  it('should handle errors during form submission', async () => {
    // Mock Supabase error
    supabase.select = vi.fn().mockResolvedValue({
      data: null,
      error: new Error('Database error')
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useEnhancedContactForm());
    
    await waitForNextUpdate();
    
    await act(async () => {
      await result.current.onSubmit(mockFormValues);
    });
    
    // Verify error toast
    expect(toast.error).toHaveBeenCalled();
  });
});
