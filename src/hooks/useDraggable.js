import { useEffect, useRef, useState } from "react";

export default function useDraggable({
    initial,
    onChange,
    clampToViewport = true,
    size = { w: 420, h: 340 },
    dragThreshold = 5,
    disabled = false,
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
        captured: false,
    });

    useEffect(() => {
        onChange?.(pos);
    }, [pos, onChange]);

    // Keep internal pos in sync if caller changes initial
    useEffect(() => {
        if (!initial) return;
        setPos(initial);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initial?.x, initial?.y]);

    const clamp = (x, y) => {
        if (!clampToViewport) return { x, y };
        const pad = 12;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const nx = Math.max(pad, Math.min(x, vw - size.w - pad));
        const ny = Math.max(pad, Math.min(y, vh - size.h - pad));
        return { x: nx, y: ny };
    };

    const isInteractiveTarget = (target) => {
        if (!(target instanceof HTMLElement)) return false;
        return !!target.closest("button,a,input,textarea,select,[role='button']");
    };

    const releaseCapture = (el) => {
        const s = stateRef.current;
        if (!s.captured || s.pointerId == null) return;
        try {
            el?.releasePointerCapture?.(s.pointerId);
        } catch (_) {
            // ignore
        }
        s.captured = false;
    };

    const reset = (el) => {
        const s = stateRef.current;
        releaseCapture(el);
        s.pending = false;
        s.dragging = false;
        s.pointerId = null;
    };

    const onPointerDown = (e) => {
        if (disabled) return;

        // Only left click / primary pointer
        if (e.button != null && e.button !== 0) return;

        // Don't start dragging from interactive things
        if (isInteractiveTarget(e.target)) return;

        const s = stateRef.current;
        s.pending = true;
        s.dragging = false;
        s.pointerId = e.pointerId;

        s.startX = e.clientX;
        s.startY = e.clientY;

        s.ox = e.clientX - pos.x;
        s.oy = e.clientY - pos.y;
    };

    const onPointerMove = (e) => {
        if (disabled) return;

        const s = stateRef.current;
        if (s.pointerId !== e.pointerId) return;
        if (!s.pending && !s.dragging) return;

        const dx = e.clientX - s.startX;
        const dy = e.clientY - s.startY;

        if (s.pending && !s.dragging) {
            if (Math.hypot(dx, dy) < dragThreshold) return;

            s.pending = false;
            s.dragging = true;

            // Capture pointer only when actually dragging
            try {
                e.currentTarget.setPointerCapture(e.pointerId);
                s.captured = true;
            } catch (_) {
                s.captured = false;
            }
        }

        if (!s.dragging) return;

        const x = e.clientX - s.ox;
        const y = e.clientY - s.oy;
        setPos(clamp(x, y));
    };

    const onPointerUp = (e) => {
        const s = stateRef.current;
        if (s.pointerId !== e.pointerId) return;
        reset(e.currentTarget);
    };

    const onPointerCancel = (e) => {
        const s = stateRef.current;
        if (s.pointerId !== e.pointerId) return;
        reset(e.currentTarget);
    };

    // If disabled flips true mid-drag, force reset
    useEffect(() => {
        if (!disabled) return;
        stateRef.current.pending = false;
        stateRef.current.dragging = false;
        stateRef.current.pointerId = null;
        stateRef.current.captured = false;
    }, [disabled]);

    return {
        pos,
        setPos,
        bind: disabled
            ? {}
            : {
                onPointerDown,
                onPointerMove,
                onPointerUp,
                onPointerCancel,
            },
    };
}
