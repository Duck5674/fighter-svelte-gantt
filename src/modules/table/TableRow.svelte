<script lang="ts">
    import { createEventDispatcher, getContext, onMount } from 'svelte';

    import TableTreeCell from './TableTreeCell.svelte';
    import type { TableHeader } from './tableHeader';
    import type { SvelteRow } from '../../core/row';
    import type { GanttDataStore } from '../../core/store';
    import FighterCell from './FighterCell.svelte';
    import InputCell from './InputCell.svelte';
    import ColorSelect from './ColorSelect.svelte';
    import { v4 as uuidv4 } from '../../../../../node_modules/uuid';
    import { RowFactory } from '../../core/row';

    export let headers: TableHeader[] = null;
    export let row: SvelteRow = null;

    // const { rowHeight } = getContext('options');
    const { hoveredRow, selectedRow } = getContext('gantt');
    const { rowStore } = getContext('dataStore') as GanttDataStore;
    const rowFactory = new RowFactory();
    $: {
        rowFactory.rowHeight = row.height;
    } //$rowHeight;
    let initialMouseY;
    let initialRowHeight;
    let minRowHeight = 25;

    const dispatch = createEventDispatcher();

    let treeIndentationStyle = '';
    $: {
        treeIndentationStyle = row.parent ? `padding-left: ${row.childLevel * 3}em;` : '';
    }

    onMount(() => {
        if (row.model.expanded == false) dispatch('rowCollapsed', { row });
    });

    function addRow(e) {
        e.stopPropagation();
        let newRowModel = {
            id: uuidv4(),
            callsign: '',
            puck: 'Builder',
            type: 'fighter',
            displayOrder: row.model.displayOrder
        };

        const newRow = rowFactory.createRows([newRowModel])[0];

        rowStore.upsert(newRow);
    }

    function startResize(e) {
        initialMouseY = e.clientY;
        initialRowHeight = row.height;
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    }

    function handleResize(e) {
        let newRowHeight = initialRowHeight + e.clientY - initialMouseY;
        $rowStore.entities[row.model.id].height =
            newRowHeight >= minRowHeight ? newRowHeight : minRowHeight;
    }

    function stopResize(e) {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        initialMouseY = undefined;
    }
</script>

<div
    data-row-id={row.model.id}
    style="height:{row.height}px"
    class="sg-table-row {row.model.classes || ''}"
    class:sg-row-expanded={row.expanded}
    class:sg-hover={$hoveredRow == row.model.id}
    class:sg-selected={$selectedRow == row.model.id}
>
    {#each headers as header}
        <div class="sg-table-body-cell sg-table-cell" style="width:{header.width}px">
            {#if header.type == 'tree'}
                <TableTreeCell on:rowCollapsed on:rowExpanded {row}>
                    {#if row.model.iconClass}
                        <div class="sg-table-icon">
                            <i class={row.model.iconClass} />
                        </div>
                    {/if}
                    <InputCell {row}></InputCell>
                    <!-- {#if row.model.headerHtml}
                        {@html row.model.headerHtml}
                    {:else if header.renderer}
                        {@html header.renderer(row)}
                    {:else}
                        {row.model[header.property]}
                    {/if} -->
                </TableTreeCell>
            {:else if (header.type = 'fighter')}
                <FighterCell on:rowCollapsed on:rowExpand {row}>
                    {#if row.model.iconClass}
                        <div class="sg-table-icon">
                            <i class={row.model.iconClass} />
                        </div>
                    {/if}
                </FighterCell>
                <ColorSelect {row}></ColorSelect>
            {:else}
                {#if row.model.iconClass}
                    <div class="sg-table-icon">
                        <i class={row.model.iconClass} />
                    </div>
                {/if}

                {#if row.model.headerHtml}
                    {@html row.model.headerHtml}
                {:else if header.renderer}
                    {@html header.renderer(row)}
                {:else if header.type === 'resourceInfo'}
                    <img class="sg-resource-image" src={row.model.imageSrc} alt="" />
                    <div class="sg-resource-title">
                        {row.model[header.property]}
                    </div>
                {:else}
                    {row.model[header.property]}
                {/if}
            {/if}
        </div>
    {/each}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="sg-add-row-container"
        on:pointerdown={startResize}
        style={`top: ${row.height - 6}px`}
    >
        <div class="add-row-line">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="bi bi-plus-circle"
                viewBox="0 0 16 16"
                on:click={addRow}
            >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
                />
            </svg>
        </div>
    </div>
</div>

<style>
    .sg-add-row-container {
        position: absolute;
        height: 12px;
        width: 150px; /*Same as callsign width*/
        transition: opacity 0.5s ease;
        z-index: 2;
        opacity: 0;
        user-select: none;
    }

    .add-row-line {
        height: 2px;
        top: 4px;
        width: 150px;
        position: absolute;
        background-color: #4291ff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sg-add-row-container:hover {
        opacity: 1;
        cursor: n-resize;
    }

    .bi-plus-circle {
        opacity: 0;
        transition: opacity 0.2s;
        background-color: white;
        color: #4291ff;
        border-radius: 20px;
        height: 20px;
        width: 20px;
        cursor: pointer;
    }

    .sg-add-row-container:hover .bi-plus-circle {
        opacity: 1;
    }

    .sg-table-row {
        display: inline-flex;
        min-width: 100%;
        align-items: stretch;

        position: relative;

        font-weight: 400;
        font-size: 14px;
    }

    .sg-table-cell {
        border-left: 1px solid #eee;
    }

    .sg-table-body-cell {
        border-bottom: #efefef 1px solid;
        /* background-color: #fff; */
        font-weight: bold;
    }

    .sg-resource-image {
        width: 2.4em;
        height: 2.4em;
        border-radius: 50%;
        margin-right: 0.6em;

        background: #047c69;
    }

    .sg-resource-info {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .sg-table-icon {
        margin-right: 0.5em;
    }
</style>
