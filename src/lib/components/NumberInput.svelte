<script lang="ts">
  // Page variables
  export let value: string = '';
  export let label: string = '';
  export let id: string = '';
  export let placeholder: string = '';
  export let min: number = 0;
  export let max: number = 100;
  export let required: boolean = false;

  function isValid(): boolean {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  }
</script>

<div class="number-input">
  <label for={id}>{label}</label>
  <input
    id={id}
    type="number"
    bind:value
    min={min}
    max={max}
    placeholder={placeholder}
    {required}
  />
  {#if value && !isValid()}
    <p>Please enter a value between {min} and {max}.</p>
  {/if}
</div>

