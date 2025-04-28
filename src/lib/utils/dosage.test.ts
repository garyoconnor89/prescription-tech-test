import { describe, it, expect } from 'vitest';

// Functions
import {
  generateDosagePlan,
  generateDosageDaysSchedule,
  calculateDosagePlan,
  _calculateStabilisationDosagePlan,
  _calculateReductionDosagePlan,
  _calculateTitrationDosagePlan
} from '$lib/utils/dosage';

// Types
import type { Day, DosageDay, DosageResult } from '$lib/types/types';

const mockDays: Day[] = [
  { name: 'Monday', selected: true, code: 'Mon' },
  { name: 'Tuesday', selected: false, code: 'Tue' },
  { name: 'Wednesday', selected: true, code: 'Wed' },
  { name: 'Thursday', selected: false, code: 'Thu' },
  { name: 'Friday', selected: true, code: 'Fri' },
  { name: 'Saturday', selected: false, code: 'Sat' },
  { name: 'Sunday', selected: false, code: 'Sun' }
];

const mockDosageDays: DosageDay[] = [
  { date: '2025-01-01', dispenseDay: 'Yes', dateString: 'Wednesday 1 January', isBankHoliday: 'No' },
  { date: '2025-01-02', dispenseDay: 'No',  dateString: 'Thursday 2 January', isBankHoliday: 'No' },
  { date: '2025-01-03', dispenseDay: 'No',  dateString: 'Friday 3 January', isBankHoliday: 'No' },
  { date: '2025-01-04', dispenseDay: 'Yes', dateString: 'Saturday 4 January', isBankHoliday: 'No' },
  { date: '2025-01-05', dispenseDay: 'No',  dateString: 'Sunday 5 January', isBankHoliday: 'No' },
  { date: '2025-01-06', dispenseDay: 'Yes', dateString: 'Monday 6 January', isBankHoliday: 'No' },
  { date: '2025-01-07', dispenseDay: 'Yes', dateString: 'Tuesday 7 January', isBankHoliday: 'No' },
  { date: '2025-01-08', dispenseDay: 'No',  dateString: 'Wednesday 8 January', isBankHoliday: 'No' },
  { date: '2025-01-09', dispenseDay: 'No',  dateString: 'Thursday 9 January', isBankHoliday: 'No' },
  { date: '2025-01-10', dispenseDay: 'Yes', dateString: 'Friday 10 January', isBankHoliday: 'No' },
  { date: '2025-01-11', dispenseDay: 'No',  dateString: 'Saturday 11 January', isBankHoliday: 'No' },
  { date: '2025-01-12', dispenseDay: 'No',  dateString: 'Sunday 12 January', isBankHoliday: 'No' },
  { date: '2025-01-13', dispenseDay: 'Yes', dateString: 'Monday 13 January', isBankHoliday: 'No' },
  { date: '2025-01-14', dispenseDay: 'No',  dateString: 'Tuesday 14 January', isBankHoliday: 'No' }
];

describe('generateDosagePlan', () => {
  it('should return 14 results', () => {
    const result = generateDosagePlan(
      mockDays,
      'Stabilisation',
      '10',
      '10',
      '1',
      '3'
    );

    expect(result.length).toBe(14);
  });

  it('should include expected keys', () => {
    const result = generateDosagePlan(
      mockDays,
      'Stabilisation',
      '10',
      '10',
      '1',
      '3'
    );

    result.forEach(day => {
      expect(day).toHaveProperty('date');
      expect(day).toHaveProperty('dosage');
      expect(day).toHaveProperty('dateString');
      expect(day).toHaveProperty('isBankHoliday');
    });
  });
});

describe('generateDosageDaysSchedule', () => {
  it('should generate a 14 day schedule', () => {
    const result = generateDosageDaysSchedule(mockDays);
    expect(result.length).toBe(14);
  });

  it('each day should have required fields', () => {
    const result = generateDosageDaysSchedule(mockDays);

    for (const day of result) {
      expect(day).toHaveProperty('date');
      expect(day).toHaveProperty('dispenseDay');
      expect(day).toHaveProperty('dateString');
      expect(day).toHaveProperty('isBankHoliday');
    }
  });

  it('isBankHoliday should be "Yes" or "No"', () => {
    const result = generateDosageDaysSchedule(mockDays);

    for (const day of result) {
      expect(['Yes', 'No']).toContain(day.isBankHoliday);
    }
  });

  it('dispenseDay should be "Yes" or "No"', () => {
    const result = generateDosageDaysSchedule(mockDays);

    for (const day of result) {
      expect(['Yes', 'No']).toContain(day.dispenseDay);
    }
  });
});

describe('calculateDosagePlan', () => {
  it('should return a dosage plan with the correct number of entries', () => {
    const schedule = generateDosageDaysSchedule(mockDays);
    const result = calculateDosagePlan(
      schedule,
      'Stabilisation',
      '10',
      '10',
      '1',
      '3'
    );

    expect(result.length).toBe(14);
  });
});

describe('_calculateStabilisationDosagePlan', () => {
  it('should allocate extra dosage for following non-dispense days', () => {
    const result: DosageResult[] = _calculateStabilisationDosagePlan(mockDosageDays, '5');

    expect(result[0].dosage).toBe(15);
    expect(result[1].dosage).toBe(0);
    expect(result[2].dosage).toBe(0);
    expect(result[3].dosage).toBe(10);
    expect(result[4].dosage).toBe(0);
    expect(result[5].dosage).toBe(5);
    expect(result[6].dosage).toBe(15);
    expect(result[7].dosage).toBe(0);
    expect(result[8].dosage).toBe(0);
    expect(result[9].dosage).toBe(15);
    expect(result[10].dosage).toBe(0);
    expect(result[11].dosage).toBe(0);
    expect(result[12].dosage).toBe(10);
    expect(result[13].dosage).toBe(0);
  });
});

describe('_calculateReductionDosagePlan', () => {
  it('should reduce dose every 2 days', () => {
    const result: DosageResult[] = _calculateReductionDosagePlan(
      mockDosageDays,
      '20',
      '1',
      '2'
    );

    expect(result[0].dosage).toBe(59);
    expect(result[1].dosage).toBe(0);
    expect(result[2].dosage).toBe(0);
    expect(result[3].dosage).toBe(37);
    expect(result[4].dosage).toBe(0);
    expect(result[5].dosage).toBe(18);
    expect(result[6].dosage).toBe(50);
    expect(result[7].dosage).toBe(0);
    expect(result[8].dosage).toBe(0);
    expect(result[9].dosage).toBe(46);
    expect(result[10].dosage).toBe(0);
    expect(result[11].dosage).toBe(0);
    expect(result[12].dosage).toBe(28);
    expect(result[13].dosage).toBe(0);
  });
});

describe('_calculateTitrationDosagePlan', () => {
  it('should increase dose every 2 days', () => {
    const result: DosageResult[] = _calculateTitrationDosagePlan(
      mockDosageDays,
      '5',
      '3',
      '2',
      60
    );

    expect(result[0].dosage).toBe(18);
    expect(result[1].dosage).toBe(0);
    expect(result[2].dosage).toBe(0);
    expect(result[3].dosage).toBe(19);
    expect(result[4].dosage).toBe(0);
    expect(result[5].dosage).toBe(11);
    expect(result[6].dosage).toBe(45);
    expect(result[7].dosage).toBe(0);
    expect(result[8].dosage).toBe(0);
    expect(result[9].dosage).toBe(57);
    expect(result[10].dosage).toBe(0);
    expect(result[11].dosage).toBe(0);
    expect(result[12].dosage).toBe(46);
    expect(result[13].dosage).toBe(0);
  });
});