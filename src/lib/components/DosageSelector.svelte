<script lang="ts">
  // Components
  import NumberInput from '$lib/components/NumberInput.svelte';

  // Page variables
  export let dosage: string = '';
  export let minDosage: number = 0;
  export let maxDosage: number = 60;
</script>

<h3>Enter Stabilisation Details</h3>

<NumberInput
  bind:value={dosage}
  label="Dosage (ml)"
  id="dosage-input"
  placeholder="Enter dosage"
  min={minDosage}
  max={maxDosage}
  required
/>

