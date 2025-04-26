<script lang="ts">
  // Components
  import NumberInput from '$lib/components/NumberInput.svelte';

  // Page variables
  export let dosage: string = '';
  export let minDosage: number = 0;
  export let maxDosage: number = 60;
</script>

<NumberInput
  bind:value={dosage}
  label="Enter Dosage (ml)"
  id="dosage-input"
  placeholder="Enter dosage"
  min={minDosage}
  max={maxDosage}
  required
/>

