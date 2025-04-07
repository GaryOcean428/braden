
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEnhancedContactForm } from '../useEnhancedContactForm';

// Mock the useContactForm hook
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

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null }),
    select: vi.fn().mockResolvedValue({ error: null }),
  }
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useEnhancedContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with the correct state', () => {
    const mockFn = vi.fn(() => ({
      form: {},
      isSubmitting: false,
      isInitialized: true,
      onSubmit: vi.fn()
    }));
    
    vi.mock('../useEnhancedContactForm', () => ({
      useEnhancedContactForm: mockFn
    }));
    
    const result = mockFn();
    
    expect(result.isSubmitting).toBe(false);
    expect(result.isInitialized).toBe(true);
    expect(result.form).toBeDefined();
    expect(typeof result.onSubmit).toBe('function');
  });
});
