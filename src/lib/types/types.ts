export type Day = {
  name: string;
  selected: boolean;
  code: string;
};

export type DosageDay = {
  date: string;
  dispenseDay: 'Yes' | 'No';
  dateString: string;
  isBankHoliday: 'Yes' | 'No';
};

export type DosageResult = {
  date: string;
  dosage: number;
  dateString: string;
  isBankHoliday: 'Yes' | 'No';
};