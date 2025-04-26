<script lang="ts">
  // Components
  import NumberInput from '$lib/components/NumberInput.svelte';

  // Page variables
  export let initialDose: string = '';
  export let doseChange: string = '';
  export let changeFrequency: string = '';
  export let selectedPrescriptionType: string = '';

  // Fetch whether we're increasing or decreasing dose from the Prescription Type field
  $: doseChangeType = selectedPrescriptionType === 'Reducing' ? 'Decrease' : 'Increase';
</script>

<h3>Enter {selectedPrescriptionType} Details</h3>

<NumberInput
  bind:value={initialDose}
  label="Initial Daily Dose (ml)"
  id="initial-dose"
  placeholder="Enter initial dose"
  min={0}
  max={60}
/>

<NumberInput
  bind:value={doseChange}
  label="{doseChangeType} (ml)"
  id="dose-change"
  placeholder="Enter {doseChangeType}"
  min={0}
  max={60}
/>

<NumberInput
  bind:value={changeFrequency}
  label="Change Frequency (days)"
  id="change-frequency"
  placeholder="How often (in days)"
  min={1}
  max={14}
/>


