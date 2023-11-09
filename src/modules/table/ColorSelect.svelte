<script>
    import { getContext } from 'svelte';
    import ColorChange from './ColorChange.svelte';
    const { rowStore } = getContext('dataStore');
    const colors = getContext('colors');
    export let row;
    let selectedColor = 0;

    function updateRow() {
        row.model.color = colors[selectedColor];
        rowStore.update(row);
    }
</script>

<div class="color-container">
    <select class={colors[selectedColor].name} bind:value={selectedColor} on:change={updateRow}>
        {#each colors as color, colorIndex}
            <option class={color.name} value={colorIndex}>{color.displayName}</option>
        {/each}
    </select>
</div>

<style>
    .color-container {
        width: 100px;
    }

    select {
        text-align: center;
        font-weight: bold;
        border: 1px solid black;
    }
</style>
