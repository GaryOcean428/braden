import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import Hero from '../Hero';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => ({
            data: { file_path: 'test-path.jpg' },
            error: null
          }))
        }))
      }))
    })),
    storage: {
      from: vi.fn(() => ({
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: 'test-url.jpg' }
        }))
      }))
    }
  }
}));

vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn()
  }
}));

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHero = () => {
    return render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderHero();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderHero();
    expect(screen.getByLabelText('Loading content')).toBeInTheDocument();
  });

  it('handles successful image load', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockResolvedValue({
          data: { file_path: 'test-path.jpg' },
          error: null
        })
      })
    });

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: mockSelect
    }));

    renderHero();

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading content')).not.toBeInTheDocument();
    });
  });

  it('handles image load error', async () => {
    const mockSelect = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: vi.fn().mockRejectedValue(new Error('Failed to load'))
      })
    });

    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: mockSelect
    }));

    renderHero();

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading content')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('navigates on button click', () => {
    renderHero();
    
    fireEvent.click(screen.getByText('Start Hiring'));
    expect(toast.info).toHaveBeenCalledWith('Redirecting to hiring portal...');
    
    fireEvent.click(screen.getByText('Find Opportunities'));
    expect(toast.info).toHaveBeenCalledWith('Exploring opportunities...');
  });
});