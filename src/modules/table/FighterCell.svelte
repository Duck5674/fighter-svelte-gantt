<script lang="ts">
    import type { SvelteRow } from '../../core/row';
    import { v4 as uuidv4 } from '../../../../../node_modules/uuid';
    import { createEventDispatcher } from 'svelte';
    import moment from 'moment';
    import DragElement from '../../core/drag/DragElement.svelte';

    let dragLabel = 'Draggable';

    function time(input) {
        return moment(input, 'HH:mm');
    }

    export let row: SvelteRow;

    const dispatch = createEventDispatcher();

    function onExpandToggle() {
        if (row.expanded) {
            dispatch('rowCollapsed', { row });
        } else {
            dispatch('rowExpanded', { row });
        }
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

    $: {
        if (row.model.callsign) {
            dragLabel = makePuckLabel(row.model.callsign);
        } else {
            dragLabel = '-';
        }
    }
</script>

<div class="sg-cell-inner" style="padding-left: {row.childLevel * 3}em">
    {#if row.children}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="sg-tree-expander" on:click={onExpandToggle}>
            {#if row.expanded}
                <i class="fas fa-angle-down" />
            {:else}
                <i class="fas fa-angle-right" />
            {/if}
        </div>
    {/if}
    <DragElement {row}>
        <div>{dragLabel}</div>
    </DragElement>
    <slot />
</div>

<style>
    .sg-tree-expander {
        cursor: pointer;
        min-width: 1.4em;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .sg-cell-inner {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
