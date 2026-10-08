import {
  getCafeFoodCapacity,
  getCafeFoodDaySlots,
  isCafeFoodDaySelectable,
  CAFE_FOOD_SEAT_CAPACITY,
  type CafeFoodData,
  type BookingWindow,
  type ReservedSeats,
} from 'd:/crash-apk-1/src/screens/option-booking/optionBookingLogic';

describe('Cafe/Food optionBookingLogic', () => {
  const mockNow = new Date('2026-10-07T10:00:00Z');
  
  const mockData: CafeFoodData = {
    menusEnabled: true,
    menus: [],
    serviceHours: {
      startTime: '09:00',
      endTime: '22:00',
      availableWeekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    },
    reservation: {
      enabled: true,
      intervalMinutes: 60,
    },
    maxPeople: 0,
  };

  const mockWindow: BookingWindow = {
    first: { year: 2026, month: 10, day: 7, weekday: 3 }, // Wednesday
    last: { year: 2026, month: 12, day: 31, weekday: 4 },
    weekdays: new Set([1, 2, 3, 4, 5]),
  };

  const mockDay = { year: 2026, month: 10, day: 8, weekday: 4 };

  describe('getCafeFoodCapacity', () => {
    it('returns configured maxPeople if > 0', () => {
      const data = { ...mockData, maxPeople: 10 };
      expect(getCafeFoodCapacity(data)).toBe(10);
    });

    it('returns CAFE_FOOD_SEAT_CAPACITY fallback if maxPeople <= 0', () => {
      expect(getCafeFoodCapacity(mockData)).toBe(CAFE_FOOD_SEAT_CAPACITY);
    });
  });

  describe('getCafeFoodDaySlots', () => {
    it('returns correct time slots based on capacity and reserved seats', () => {
      const data = { ...mockData, maxPeople: 12 };
      const reserved: ReservedSeats = new Map([
        ['2026-10-08|09:00', 4],
        ['2026-10-08|10:00', 12],
      ]);
      
      const slots = getCafeFoodDaySlots(data, mockDay, reserved, mockNow);
      
      const slot9am = slots.find((s) => s.time === '09:00');
      expect(slot9am?.remaining).toBe(8); // 12 - 4
      expect(slot9am?.closed).toBe(false);

      const slot10am = slots.find((s) => s.time === '10:00');
      expect(slot10am?.remaining).toBe(0); // 12 - 12
      expect(slot10am?.closed).toBe(true);
    });
  });

  describe('isCafeFoodDaySelectable', () => {
    it('returns false if day is not in service window', () => {
      const weekendDay = { year: 2026, month: 10, day: 10, weekday: 6 }; // Saturday
      const reserved = new Map();
      expect(isCafeFoodDaySelectable(mockWindow, mockData, weekendDay, reserved, mockNow)).toBe(false);
    });

    it('returns true if day is selectable and has available slots', () => {
      const reserved = new Map();
      expect(isCafeFoodDaySelectable(mockWindow, mockData, mockDay, reserved, mockNow)).toBe(true);
    });

    it('returns false if day is selectable but all slots are fully booked', () => {
      const data = { ...mockData, maxPeople: 2 };
      // Fully book every slot from 09:00 to 22:00
      const reserved = new Map();
      let hour = 9;
      while (hour <= 22) {
        reserved.set(`2026-10-08|${hour < 10 ? '0' : ''}${hour}:00`, 2);
        hour++;
      }
      expect(isCafeFoodDaySelectable(mockWindow, data, mockDay, reserved, mockNow)).toBe(false);
    });
  });
});
