<script lang="ts">
    import type { SvelteRow } from '../../core/row';
    import { v4 as uuidv4 } from '../../../../../node_modules/uuid';
    import { getContext } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    import moment from 'moment';
    import DragElement from '../../core/drag/DragElement.svelte';

    let gantt = getContext('gantt');

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
        <div>PN11</div>
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
