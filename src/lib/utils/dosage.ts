// Data
import { bankHolidays } from '$lib/data/bankHolidays';

// Types
import type { Day, DosageDay, DosageResult } from '$lib/types/types';

// generateDosagePlan
// 1. Creates a 14 day dispense schedule via generateDosageDaysSchedule
// 2. Uses that schedule to calculate dispense dosages
//    for that 14 day period via calculateDosagePlan
// Return structure:
// [{
//    date: '2025-01-01',
//    dosage: '10',
//    dateString: 'Wednesday 1 January',
//    isBankHoliday: 'No'
// },...]
export function generateDosagePlan(
  days: Day[],
  selectedPrescriptionType: string,
  dosage: string,
  initialDose: string,
  doseChange: string,
  changeFrequency: string
) {
  const dosageDaysSchedule = generateDosageDaysSchedule(days);
  return calculateDosagePlan(
    dosageDaysSchedule,
    selectedPrescriptionType,
    dosage,
    initialDose,
    doseChange,
    changeFrequency
  );
}

// generateDosageDaysSchedule
// 1. Generates a 14 day dispense schedule starting from
//    today
// 2. Indicates if day is a bank holiday
// 3. Based on bank holiday and selected dispense days states
//    if each day is a dispending day
// Return structure:
// [{
//    date: '2025-01-01',
//    dispenseDay: 'Yes',
//    dateString: 'Wednesday 1 January',
//    isBankHoliday: 'No'
// },...]
export function generateDosageDaysSchedule(days: Day[]) {
  const dosageDaysSchedule: DosageDay[] = [];

  const todayDate = new Date();

  // Loop through the next 14 days
  for (let i = 0; i < 14; i++) {
    // Set the current date depending on how many times
    // we have cycled through this for loop
    const currentDate = new Date(todayDate);
    currentDate.setDate(todayDate.getDate() + i);

    // Convert the date into a string - YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Convert the date into 3 letter day code - e.g Mon
    const dayShortName = currentDate.toDateString().slice(0, 3);

    // Convert the date into a human readable string - e.g Monday 4th May
    const dateString = currentDate.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });

    // Check whether this was selected as a pickup day
    const isPickupDay = days.some(day => day.code === dayShortName && day.selected);

    // Check whether the date is a bank holiday this year
    const year = formattedDate.substring(0, 4);
    const isBankHoliday = bankHolidays[year]?.includes(formattedDate) ?? false;

    dosageDaysSchedule.push({
      date: formattedDate,
      dispenseDay: (!isBankHoliday && isPickupDay) ? 'Yes' : 'No',
      dateString: dateString,
      isBankHoliday: isBankHoliday ? 'Yes' : 'No'

    });
  }
  return dosageDaysSchedule;
}

// calculateDosagePlan
// 1. Creates 14 day dispense dosages
// 2. Calls internal helper functions based on select prescription type
// Return structure:
// [{
//    date: '2025-01-01',
//    dosage: '10',
//    dateString: 'Wednesday 1 January',
//    isBankHoliday: 'No'
// },...]
export function calculateDosagePlan(
  dosageDaysSchedule: DosageDay[],
  selectedPrescriptionType: string,
  dosage: string,
  initialDose: string,
  doseChange: string,
  changeFrequency: string
) {
  let result: DosageResult[] = [];

  if (selectedPrescriptionType === 'Stabilisation') {
    result = _calculateStabilisationDosagePlan(dosageDaysSchedule, dosage);
  }
  if (selectedPrescriptionType === 'Reducing') {
    result = _calculateReductionDosagePlan(dosageDaysSchedule, initialDose, doseChange, changeFrequency);
  }
  if (selectedPrescriptionType === 'Titration') {
    result = _calculateTitrationDosagePlan(dosageDaysSchedule, initialDose, doseChange, changeFrequency);
  }
  return result;
}

// _calculateStabilisationDosagePlan
// 1. Creates 14 day dispense dosages for stabilisation prescription types
// Return structure:
// [{
//    date: '2025-01-01',
//    dosage: '10',
//    dateString: 'Wednesday 1 January',
//    isBankHoliday: 'No'
// },...]
export function _calculateStabilisationDosagePlan(
  dosageDaysSchedule: DosageDay[],
  dosage: string
) {
  const fixedDosage = parseFloat(dosage);
  const result: DosageResult[] = [];

  for (let i = 0; i < dosageDaysSchedule.length; i++) {
    const day = dosageDaysSchedule[i];

    if (day.dispenseDay === 'Yes') {
      let extraDays = 0;
      // While we're not past the end of the 14 day schedule loop
      // and the next day isn't a dispensing day, add another days
      // worth of dosage to dispense ahead of time
      while (
        i + extraDays + 1 < dosageDaysSchedule.length &&
        dosageDaysSchedule[i + extraDays + 1].dispenseDay === 'No'
      ) {
        extraDays++;
      }

      // Calculate the day's dosage by accounting for the proceeding
      // non dispensing days
      const totalDosage = fixedDosage * (1 + extraDays);

      result.push({
        date: day.date,
        dosage: totalDosage,
        dateString: day.dateString,
        isBankHoliday: day.isBankHoliday
      });
    } else {
      result.push({
        date: day.date,
        dosage: 0,
        dateString: day.dateString,
        isBankHoliday: day.isBankHoliday
      });
    }
  }
  return result;
}

// _calculateReductionDosagePlan
// 1. Creates 14 day dispense dosages for reducing prescription types
// Return structure:
// [{
//    date: '2025-01-01',
//    dosage: '10',
//    dateString: 'Wednesday 1 January',
//    isBankHoliday: 'No'
// },...]
export function _calculateReductionDosagePlan(
  dosageDaysSchedule: DosageDay[],
  initialDose: string,
  doseChange: string,
  changeFrequency: string
) {
  let currentDose = parseFloat(initialDose);
  let reductionAmount = parseFloat(doseChange);
  let frequency = parseInt(changeFrequency);
  let daysSinceLastReduction = 0;
  let result: DosageResult[] = [];

  for (let i = 0; i < dosageDaysSchedule.length; i++) {
    const day = dosageDaysSchedule[i];
    let totalDosage = 0;

    daysSinceLastReduction++;
    // If we've had enough days to trigger the drop in dose
    // reduce the current dose by the reduction rate
    if (daysSinceLastReduction > frequency) {
      currentDose = Math.max(0, currentDose - reductionAmount);
      daysSinceLastReduction = 1;
    }

    if (day.dispenseDay === 'Yes') {
      totalDosage += currentDose;

      let tempDose = currentDose;
      let tempDaysSinceLastReduction = daysSinceLastReduction;

      // While we're not past the end of the 14 day schedule loop
      // and the next day isn't a dispensing day, add another days
      // worth of dosage to dispense ahead of time
      for (let j = i + 1; j < dosageDaysSchedule.length; j++) {
        const futureDay = dosageDaysSchedule[j];

        tempDaysSinceLastReduction++;
        // Reduce the dosage if we've had more days than the change frequency
        if (tempDaysSinceLastReduction > frequency) {
          tempDose = Math.max(0, tempDose - reductionAmount);
          tempDaysSinceLastReduction = 1;
        }

        if (futureDay.dispenseDay === 'Yes') break;

        totalDosage += tempDose;
      }

      result.push({
        date: day.date,
        dosage: totalDosage,
        dateString: day.dateString,
        isBankHoliday: day.isBankHoliday
      });
    } else {
      result.push({
        date: day.date,
        dosage: 0,
        dateString: day.dateString,
        isBankHoliday: day.isBankHoliday
      });
    }
  }

  return result;
}

// _calculateTitrationDosagePlan
// 1. Creates 14 day dispense dosages for titrating prescription types
// Return structure:
// [{
//    date: '2025-01-01',
//    dosage: '10',
//    dateString: 'Wednesday 1 January',
//    isBankHoliday: 'No'
// },...]
export function _calculateTitrationDosagePlan(
  dosageDaysSchedule: DosageDay[],
  initialDose: string,
  doseChange: string,
  changeFrequency: string,
  maxDose: number = 60
) {
  let currentDose = parseFloat(initialDose);
  let titrationAmount = parseFloat(doseChange);
  let frequency = parseInt(changeFrequency);
  let daysSinceLastTitration = 0;
  let result: DosageResult[] = [];

  for (let i = 0; i < dosageDaysSchedule.length; i++) {
    const day = dosageDaysSchedule[i];
    let totalDosage = 0;

    daysSinceLastTitration++;
    // If we've had enough days to trigger the increase in dose
    // increase the current dose by the increase rate
    if (daysSinceLastTitration > frequency) {
      currentDose = Math.min(maxDose, currentDose + titrationAmount);
      daysSinceLastTitration = 1;
    }

    if (day.dispenseDay === 'Yes') {
      totalDosage += currentDose;

      let tempDose = currentDose;
      let tempDaysSinceLastTitration = daysSinceLastTitration;

      // While we're not past the end of the 14 day schedule loop
      // and the next day isn't a dispensing day, add another days
      // worth of dosage to dispense ahead of time
      for (let j = i + 1; j < dosageDaysSchedule.length; j++) {
        const futureDay = dosageDaysSchedule[j];

        tempDaysSinceLastTitration++;
        // Increase the dosage if we've had more days than the change frequency
        if (tempDaysSinceLastTitration > frequency) {
          tempDose = Math.min(maxDose, tempDose + titrationAmount);
          tempDaysSinceLastTitration = 1;
        }

        if (futureDay.dispenseDay === 'Yes') break;

        totalDosage += tempDose;
      }

      result.push({
        date: day.date,
        dosage: totalDosage,
        dateString: day.dateString,
        isBankHoliday: day.isBankHoliday
      });
    } else {
      result.push({
        date: day.date,
        dosage: 0,
        dateString: day.dateString,
        isBankHoliday: day.isBankHoliday
      });
    }
  }

  return result;
}



