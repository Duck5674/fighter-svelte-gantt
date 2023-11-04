<script>
    export let placeHolder = 'Enter Callsign';
    export let row;
    let puckLabel = '';
    import { getContext } from 'svelte';
    const { rowStore } = getContext('dataStore');

    function notifyCallsignChange(e) {
        row.model.callsign = e.target.value;
        row.model.puckLabel = makePuckLabel(e.target.value);
        rowStore.update(row);
    }

    function makePuckLabel(callsign) {
        const words = callsign.split(' ');
        let result = '';

        words.forEach((word, index) => {
            if (index > 0) {
                result += ' '; // Add a space between words (except the first word).
            }
            if (/^\d{1,2}$/.test(word)) {
                // If the word is a 1 or 2-digit number, add it as is.
                result += word;
            } else {
                // For words, add the first and last letter.
                const firstLetter = word[0] ? word[0] : '';
                const lastLetter = word[word.length - 1] ? word[word.length - 1] : '';
                result += `${firstLetter}${lastLetter}`;
            }
        });

        return result.toUpperCase();
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
