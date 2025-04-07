import { renderHook, act } from '@testing-library/react-hooks';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEnhancedContactForm } from '../useEnhancedContactForm';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
  }
}));

vi.mock('../useContactForm', () => ({
  useContactForm: vi.fn().mockReturnValue({
    form: {
      handleSubmit: vi.fn(cb => data => cb(data)),
      reset: vi.fn(),
      control: {},
      formState: { errors: {} },
      watch: vi.fn(),
      setValue: vi.fn(),
      register: vi.fn()
    },
    isSubmitting: false,
    onSubmit: vi.fn()
  })
}));

describe('useEnhancedContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useEnhancedContactForm());
    
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isInitialized).toBe(false);
    expect(result.current.form).toBeDefined();
    expect(typeof result.current.onSubmit).toBe('function');
  });

  it('should set isInitialized to true after initialization', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useEnhancedContactForm());
    
    await waitForNextUpdate();
    
    expect(result.current.isInitialized).toBe(true);
  });

  it('should handle form submission successfully', async () => {
    const mockSupabaseInsert = vi.fn().mockResolvedValue({ error: null });
    const mockSupabaseFrom = vi.fn().mockReturnValue({
      insert: mockSupabaseInsert,
      select: vi.fn().mockResolvedValue({ error: null })
    });
    
    const supabaseMock = {
      from: mockSupabaseFrom
    };
    
    vi.mock('@/integrations/supabase/client', () => ({
      supabase: supabaseMock
    }));
    
    const { result } = renderHook(() => useEnhancedContactForm());
    
    const mockFormData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      company: 'Test Company',
      serviceType: 'apprenticeship',
      message: 'Test message'
    };
    
    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });
    
    expect(toast.success).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should handle form submission errors', async () => {
    const mockSupabaseInsert = vi.fn().mockResolvedValue({ 
      error: new Error('Database error') 
    });
    
    const mockSupabaseFrom = vi.fn().mockReturnValue({
      insert: mockSupabaseInsert,
      select: vi.fn().mockResolvedValue({ error: null })
    });
    
    const supabaseMock = {
      from: mockSupabaseFrom
    };
    
    vi.mock('@/integrations/supabase/client', () => ({
      supabase: supabaseMock
    }));
    
    const { result } = renderHook(() => useEnhancedContactForm());
    
    const mockFormData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      company: 'Test Company',
      serviceType: 'apprenticeship',
      message: 'Test message'
    };
    
    await act(async () => {
      await result.current.onSubmit(mockFormData);
    });
    
    expect(toast.error).toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
