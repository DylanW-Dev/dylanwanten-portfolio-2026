import { useEffect, useRef, useState } from "react";

export default function useDraggable({
    initial,
    onChange,
    clampToViewport = true,
    size = { w: 420, h: 340 },
    dragThreshold = 5,
}) {
    const [pos, setPos] = useState(initial);

    const stateRef = useRef({
        pending: false,
        dragging: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        ox: 0,
        oy: 0,
    });

    useEffect(() => {
        onChange?.(pos);
    }, [pos, onChange]);

    const clamp = (x, y) => {
        if (!clampToViewport) return { x, y };
        const pad = 12;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const nx = Math.max(pad, Math.min(x, vw - size.w - pad));
        const ny = Math.max(pad, Math.min(y, vh - size.h - pad));
        return { x: nx, y: ny };
    };

    const onPointerDown = (e) => {
        // Don't start dragging from interactive things
        const t = e.target;
        if (t instanceof HTMLElement && t.closest("button,a,input,textarea,select,[role='button']")) {
            return;
        }

        stateRef.current.pending = true;
        stateRef.current.dragging = false;
        stateRef.current.pointerId = e.pointerId;

        stateRef.current.startX = e.clientX;
        stateRef.current.startY = e.clientY;

        stateRef.current.ox = e.clientX - pos.x;
        stateRef.current.oy = e.clientY - pos.y;
    };

    const onPointerMove = (e) => {
        if (stateRef.current.pointerId !== e.pointerId) return;
        if (!stateRef.current.pending && !stateRef.current.dragging) return;

        const dx = e.clientX - stateRef.current.startX;
        const dy = e.clientY - stateRef.current.startY;

        if (stateRef.current.pending && !stateRef.current.dragging) {
            if (Math.hypot(dx, dy) < dragThreshold) return;

            stateRef.current.pending = false;
            stateRef.current.dragging = true;
            e.currentTarget.setPointerCapture(e.pointerId);
        }

        if (!stateRef.current.dragging) return;

        const x = e.clientX - stateRef.current.ox;
        const y = e.clientY - stateRef.current.oy;
        setPos(clamp(x, y));
    };

    const onPointerUp = (e) => {
        if (stateRef.current.pointerId !== e.pointerId) return;
        stateRef.current.pending = false;
        stateRef.current.dragging = false;
        stateRef.current.pointerId = null;
    };

    return {
        pos,
        setPos,
        bind: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
    };
}
