<script lang="ts">
  // Types
  import type { Day } from '$lib/types/types';

  // Page variables
  export let days: Day[];
  export let attemptedSubmit: boolean = false;

  // Check if no days are selected
  $: noDaySelected = !days.some(day => day.selected);
</script>

<h3>Select Available Pickup Days</h3>
<div class="days-selection">
  {#each days as day, index}
    <label class="day-checkbox" for="day-{index}">
      <input id="day-{index}" type="checkbox" bind:checked={day.selected} />
      {day.name}
    </label>
  {/each}
</div>

{#if attemptedSubmit && noDaySelected}
  <p>Please select at least one day.</p>
{/if}

