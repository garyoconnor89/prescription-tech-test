<script lang="ts">
  // Components
  import DaySelector from '$lib/components/DaySelector.svelte';
  import PrescriptionTypeSelector from '$lib/components/PrescriptionTypeSelector.svelte';
  import DosageSelector from '$lib/components/DosageSelector.svelte';
  import TitrationQuestions from '$lib/components/TitrationQuestions.svelte';
  import SubmitButton from '$lib/components/SubmitButton.svelte';

  // Functions
  import { generateDosagePlan } from '$lib/utils/dosage';

  // Types
  import type { DosageResult } from '$lib/types/types';

  // Data
  // Data imports in readonly format
  import { days as readOnlyDays } from '$lib/data/days';
  import { prescriptionTypes as readOnlyPrescriptionTypes } from '$lib/data/prescriptionTypes';
  // Create writable data structures
  let days = [...readOnlyDays];
  let prescriptionTypes = [...readOnlyPrescriptionTypes];

  // Page variables
  let selectedPrescriptionType: string = '';
  let dosage: string = '';
  let initialDose: string = '';
  let doseChange: string = '';
  let changeFrequency: string = '';
  let attemptedSubmit = false;
  let isSubmitted = false;
  let dosagePlan: DosageResult[] = []; // Holds the dosage plan
  let formError: string | null = null;

  const todayString = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  function handleSubmit() {
    attemptedSubmit = true;
    formError = null;
    // Validate the day checkboxes as a group on submit to avoid
    // validation on page land
    if (!days.some(day => day.selected)) {
      formError = "Please select at least one pickup day.";
      return;
    }

    const todayShortName = new Date().toDateString().slice(0, 3);
    const todayIsPickup = days.some(day => day.code === todayShortName && day.selected);
    // Validate to ensure we start on a pickup day as we are treating this
    // as an isolated 14 day script
    if (!todayIsPickup) {
      formError = "Please make sure today is selected as a pickup day.";
      return;
    }

    // Check all mandatory fields have a value, this is a second check as
    // the required attribute is used in all elements
    if (!selectedPrescriptionType) {
      formError = "Please select a prescription type.";
      return;
    }

    if (!dosage && selectedPrescriptionType === 'Stabilisation') {
      formError = "Please enter the stabilisation dosage.";
      return;
    }

    if ((!initialDose || !doseChange || !changeFrequency) &&
      (selectedPrescriptionType === 'Reducing' || selectedPrescriptionType === 'Titration')) {
      formError = "Please fill out all dosage change fields.";
      return;
    }

    dosagePlan = generateDosagePlan(
      days,
      selectedPrescriptionType,
      dosage,
      initialDose,
      doseChange,
      changeFrequency
    );

    isSubmitted = true;
  }
</script>


<form on:submit|preventDefault={handleSubmit}>

  <p>Today is {todayString}</p>

  <!-- Days Selector -->
  <DaySelector
    bind:days
    {attemptedSubmit}
  />

  <!-- Prescription Type Selector -->
  <PrescriptionTypeSelector
    {prescriptionTypes}
    bind:selectedPrescriptionType
  />

  <!-- Stabilisation Questions -->
  {#if selectedPrescriptionType === 'Stabilisation'}
    <DosageSelector
      bind:dosage
    />
  {/if}

  <!-- Dose Change Questions -->
  {#if selectedPrescriptionType === 'Reducing' || selectedPrescriptionType === 'Titration'}
    <TitrationQuestions
      bind:initialDose
      bind:doseChange
      bind:changeFrequency
      selectedPrescriptionType={selectedPrescriptionType}
    />
  {/if}

  <!-- Submit Button -->
  <SubmitButton />

  {#if formError}
    <div style="color: red;">
      {formError}
    </div>
  {/if}

    <!-- Dispensing Table -->
    <!-- Display on initial submit and update on subsequent submits -->
    {#if isSubmitted}
    <h3>Pickup Dates</h3>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Dosage (ml)</th>
          <th>Bank Holiday</th>
        </tr>
      </thead>
      <tbody>
        {#each dosagePlan as { dateString, dosage, isBankHoliday }}
          <tr>
            <td>{dateString}</td>
            <td>{dosage}</td>
            <td>{isBankHoliday}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    {/if}
</form>