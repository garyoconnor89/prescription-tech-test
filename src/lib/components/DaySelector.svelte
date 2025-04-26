<script lang="ts">
  // Page variables
  export let days: { name: string; selected: boolean }[];
</script>

<h3>Select Available Days</h3>
<div class="days-selection">
  {#each days as day, index}
    <label class="day-checkbox" for="day-{index}">
      <input id="day-{index}" type="checkbox" bind:checked={day.selected} />
      {day.name}
    </label>
  {/each}
</div>

