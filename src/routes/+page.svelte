<script lang="ts">
  // Components
  import DaySelector from '$lib/components/DaySelector.svelte';
  import PrescriptionTypeSelector from '$lib/components/PrescriptionTypeSelector.svelte';
  import DosageSelector from '$lib/components/DosageSelector.svelte';
  import TitrationQuestions from '$lib/components/TitrationQuestions.svelte';
  import SubmitButton from '$lib/components/SubmitButton.svelte';

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

  function handleSubmit() {
  // nothing as yet...
  }
</script>


<form on:submit|preventDefault={handleSubmit}>
  <!-- Days Selector -->
  <DaySelector
    bind:days
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
</form>