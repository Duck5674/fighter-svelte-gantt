<script>
    import { getContext, onMount, onDestroy } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';
    import { getRelativePos } from '../../utils/dom';
    const { hoveredRow, mainContainer } = getContext('gantt');
    const { dndManager } = getContext('services');

    let dragEl;
    let dragContainer;
    let initialOffset = { x: null, y: null };
    let pointerId = null;
    let resourceId = null;
    let isDragging = false;

    export let row;

    function overDropArea(event) {
        if (!mainContainer) {
            return false;
        }
        let elements = document.elementsFromPoint(event.x, event.y);
        return elements.includes(mainContainer);
    }

    function mouseDown(e) {
        let offset = getRelativePos(dragContainer, e);
        initialOffset.x = offset.x;
        initialOffset.y = offset.y;
        isDragging = true;
        pointerId = e.pointerId;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('keyup', stopDragging);
        //Set the cursor on body or document
        //Body wasn't covering the whole page (fix with height = 100%)
        //Adjust cursor to show no drop except on gantt chart
        //Only allow dorps in the same lane?
    }

    function stopDragging(event) {
        if (event.isComposing || event.keyCode === '229') {
            return;
        }
        if (event.key === 'Escape') {
            resetDrag();
        }
    }

    function resetDrag() {
        if (dragEl) {
            dragEl.releasePointerCapture(pointerId);
            dragEl.remove();
        }
        dragEl = null;
        initialOffset = { x: null, y: null };
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('keyup', resetDrag);
    }

    function onMouseMove(e) {
        e.preventDefault();
        // mouseup
        if (!isDragging) {
            return;
        }

        if (!dragEl) {
            dragEl = dragContainer.cloneNode(true);

            isDragging = true;
            let dragElStyles = {
                opacity: '0.5',
                position: 'absolute',
                cursor: 'grabbing',
                zIndex: '3'
            };
            Object.assign(dragEl.style, dragElStyles);
            document.body.appendChild(dragEl);

            dragEl.setPointerCapture(pointerId);
        }

        dragEl.style.top = e.y - initialOffset.y + 'px';
        dragEl.style.left = e.x + 'px';

        const targetRow = dndManager.getTarget('row', e);
        if (targetRow && overDropArea(e)) {
            $hoveredRow = targetRow.model.id;
            dragEl.style.cursor = 'copy';
        } else {
            $hoveredRow = null;
            dragEl.style.cursor = 'grabbing';
        }
    }

    function onMouseUp(event) {
        if (!isDragging) {
            return;
        }

        const targetRow = dndManager.getTarget('row', event);
        let date;
        if (targetRow && overDropArea(event)) {
            const mousePos = getRelativePos(gantt.getRowContainer(), event);
            date = gantt.utils.getDateByPosition(mousePos.x);

            gantt.updateTask({
                id: uuidv4(),
                label: `Task Row ${row.model.callsign}`,
                from: date,
                to: date + 1 * 60 * 60 * 1000,
                resourceId: targetRow.model.id
            });
        }
        resetDrag();
    }

    onMount(() => {
        resourceId = row.model.id;
    });

    onDestroy(() => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('keyup', resetDrag);
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={dragContainer}
    on:pointermove={onMouseMove}
    on:pointerup={onMouseUp}
    on:pointerdown={mouseDown}
    class="sg-external-indicator"
>
    <slot />
</div>

<style>
    .player-drag {
        font-weight: 200;
        cursor: grab;
    }

    .sg-external-indicator {
        border: 1px solid green;
        background-color: green;
        width: 5em;
        cursor: grab;
        padding: 0.1em;
        text-align: center;
        user-select: none;
    }
</style>
