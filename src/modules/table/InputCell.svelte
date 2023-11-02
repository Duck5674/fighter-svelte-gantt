<script>
    export let placeHolder = 'Enter Callsign';
    export let row;
    let puckLabel = '';
    import { getContext } from 'svelte';
    const { rowStore } = getContext('dataStore');

    function notifyCallsignChange(e) {
        row.model.callsign = e.target.value;
        rowStore.update(row);
    }
</script>

<input
    placeholder={placeHolder}
    class="sg-input"
    on:input={notifyCallsignChange}
    value={row.model.callsign}
/>

<style>
    .sg-input {
        width: 100%;
    }
</style>
