import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useOptionAvailability } from 'd:/crash-apk-1/src/screens/option-booking/useOptionAvailability';
import * as apiProduct from 'd:/crash-apk-1/src/services/api/product';
import * as alertStore from 'd:/crash-apk-1/src/store/useAlertStore';

jest.mock('d:/crash-apk-1/src/services/api/product', () => ({
  getOptionAvailability: jest.fn(),
}));

jest.mock('d:/crash-apk-1/src/store/useAlertStore', () => ({
  toast: jest.fn(),
}));

describe('useOptionAvailability', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not load if range is missing', () => {
    const { result } = renderHook(() => useOptionAvailability('prod-1', 'opt-1', null));
    
    expect(result.current.loaded).toBe(true);
    expect(result.current.reserved.size).toBe(0);
    expect(apiProduct.getOptionAvailability).not.toHaveBeenCalled();
  });

  it('fetches availability on mount and when range changes', async () => {
    const mockData = {
      reserved: [
        { date: '2026-10-08', time: '10:00', seats: 2 },
      ],
    };
    (apiProduct.getOptionAvailability as jest.Mock).mockResolvedValueOnce(mockData);

    const range = { from: '2026-10-01', to: '2026-10-31' };
    const { result } = renderHook(() => useOptionAvailability('prod-1', 'opt-1', range));
    
    // Initially loaded should be false while fetching
    expect(result.current.loaded).toBe(false);

    await waitFor(() => {
      expect(result.current.loaded).toBe(true);
    });

    expect(apiProduct.getOptionAvailability).toHaveBeenCalledWith('prod-1', 'opt-1', '2026-10-01', '2026-10-31');
    expect(result.current.reserved.get('2026-10-08|10:00')).toBe(2);
  });

  it('shows toast on fetch failure', async () => {
    (apiProduct.getOptionAvailability as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    const range = { from: '2026-10-01', to: '2026-10-31' };
    const { result } = renderHook(() => useOptionAvailability('prod-1', 'opt-1', range));
    
    await waitFor(() => {
      expect(alertStore.toast).toHaveBeenCalledWith('예약 현황을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    });
    
    // Remains unloaded to prevent advancing the booking
    expect(result.current.loaded).toBe(false);
  });

  it('can be manually reloaded', async () => {
    (apiProduct.getOptionAvailability as jest.Mock).mockResolvedValue({ reserved: [] });
    
    const range = { from: '2026-10-01', to: '2026-10-31' };
    const { result } = renderHook(() => useOptionAvailability('prod-1', 'opt-1', range));

    await waitFor(() => {
      expect(result.current.loaded).toBe(true);
    });
    
    act(() => {
      result.current.reload();
    });

    // Should fetch again
    await waitFor(() => {
      expect(apiProduct.getOptionAvailability).toHaveBeenCalledTimes(2);
    });
  });
});
