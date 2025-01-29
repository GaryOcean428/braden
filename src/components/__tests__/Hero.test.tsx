import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import Hero from '../Hero';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn()
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
    info: vi.fn()
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
    const mockData = { file_path: 'test-path.jpg' };
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: mockData, error: null })
        })
      })
    }));

    renderHero();

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading content')).not.toBeInTheDocument();
    });
  });

  it('handles image load error', async () => {
    vi.spyOn(supabase, 'from').mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.reject(new Error('Failed to load'))
        })
      })
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