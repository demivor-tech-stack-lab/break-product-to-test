import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MaxPeopleStepScreen from 'd:/crash-apk-1/src/screens/product-registration/cafe-food/MaxPeopleStepScreen';
import { useRegistrationFlow } from 'd:/crash-apk-1/src/screens/product-registration/useRegistrationFlow';
import { useTravelProductStep } from 'd:/crash-apk-1/src/screens/product-registration/register-my-trip/useTravelProductStep';

// Mock the hooks and dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: () => ({ params: { draftId: 'draft-123' } }),
}));

jest.mock('d:/crash-apk-1/src/screens/product-registration/useRegistrationFlow', () => ({
  useRegistrationFlow: jest.fn(),
}));

jest.mock('d:/crash-apk-1/src/screens/product-registration/register-my-trip/useTravelProductStep', () => {
  const actual = jest.requireActual('d:/crash-apk-1/src/screens/product-registration/register-my-trip/useTravelProductStep');
  return {
    ...actual,
    useTravelProductStep: jest.fn(),
  };
});

// Mock UI components
jest.mock('d:/crash-apk-1/src/components/ui/StepperRow', () => {
  const { Text, View, TouchableOpacity } = require('react-native');
  return ({ label, value, onChange }: any) => (
    <View testID="stepper-mock">
      <Text>{label}</Text>
      <Text testID="stepper-value">{value}</Text>
      <TouchableOpacity testID="stepper-inc" onPress={() => onChange(value + 1)}>
        <Text>+</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="stepper-dec" onPress={() => onChange(Math.max(1, value - 1))}>
        <Text>-</Text>
      </TouchableOpacity>
    </View>
  );
});

describe('MaxPeopleStepScreen', () => {
  const mockPatch = jest.fn();
  const mockFlush = jest.fn();
  const mockGoNext = jest.fn();
  const mockTemporarySave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useRegistrationFlow as jest.Mock).mockReturnValue({
      timeline: { current: 3, total: 5 },
      goNext: mockGoNext,
    });

    (useTravelProductStep as jest.Mock).mockReturnValue({
      data: { reservationMaxPeople: 4 },
      status: 'ready',
      patch: mockPatch,
      flush: mockFlush,
      handleTemporarySave: mockTemporarySave,
    });
  });

  it('renders correctly and initializes with drafted maxPeople', () => {
    const { getByText, getByTestId } = render(<MaxPeopleStepScreen />);
    
    expect(getByText('최대 인원을 설정해 주세요.')).toBeTruthy();
    expect(getByText('총 인원')).toBeTruthy();
    
    // Should initialize with 4 (from mocked draft data)
    expect(getByTestId('stepper-value').props.children).toBe(4);
  });

  it('updates capacity when interacting with StepperRow and patches draft on Next', async () => {
    const { getByTestId, getByText } = render(<MaxPeopleStepScreen />);
    
    const incrementBtn = getByTestId('stepper-inc');
    fireEvent.press(incrementBtn);
    
    // Value should now be 5
    expect(getByTestId('stepper-value').props.children).toBe(5);

    const nextBtn = getByText('다음');
    fireEvent.press(nextBtn);

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith({ reservationMaxPeople: 5 });
      expect(mockFlush).toHaveBeenCalled();
      expect(mockGoNext).toHaveBeenCalledWith('draft-123');
    });
  });

  it('handles temporary save correctly', async () => {
    const { getByText, getByTestId } = render(<MaxPeopleStepScreen />);
    
    // Change value
    fireEvent.press(getByTestId('stepper-inc')); // To 5
    
    const tempSaveBtn = getByText('임시 저장');
    fireEvent.press(tempSaveBtn);

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith({ reservationMaxPeople: 5 });
      expect(mockTemporarySave).toHaveBeenCalled();
    });
  });

  it('enforces MIN_PEOPLE restriction', () => {
    (useTravelProductStep as jest.Mock).mockReturnValue({
      data: { reservationMaxPeople: 0 }, // Invalid low value
      status: 'ready',
      patch: mockPatch,
      flush: mockFlush,
      handleTemporarySave: mockTemporarySave,
    });

    const { getByTestId } = render(<MaxPeopleStepScreen />);
    
    // The screen should default to MIN_PEOPLE (1) when 0 is passed
    expect(getByTestId('stepper-value').props.children).toBe(1);
  });
});
