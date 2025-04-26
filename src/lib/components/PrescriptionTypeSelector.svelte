<script lang="ts">
  // Page variables
  export let prescriptionTypes: { value: string; label: string }[] = [];
  export let selectedPrescriptionType: string = '';
</script>

<h3>Select Prescription Type</h3>
<select bind:value={selectedPrescriptionType}>
  <option value="" disabled selected>Select a type...</option>
  {#each prescriptionTypes as { value, label }}
    <option value={value}>{label}</option>
  {/each}
</select>

