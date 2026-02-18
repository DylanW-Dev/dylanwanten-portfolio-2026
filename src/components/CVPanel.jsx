import { useEffect, useMemo, useRef, useState } from "react";

/**
 * White paper CV with drag-to-rotate spring physics + holographic layers.
 * IMPORTANT: drag will NOT steal clicks (threshold + ignore interactive targets).
 */
export default function CVPanel({ isFlipped, childrenFront, childrenBack }) {
    const wrapRef = useRef(null);

    const [rot, setRot] = useState({ rx: 0, ry: 0 });
    const rotRef = useRef({ rx: 0, ry: 0 });
    const velRef = useRef({ vx: 0, vy: 0 });

    const pendingRef = useRef(false);       // pointer down but not yet dragging
    const draggingRef = useRef(false);      // actively dragging
    const pointerIdRef = useRef(null);
    const startRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

    const [holo, setHolo] = useState({ x: 0, y: 0, intensity: 0 });

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const DRAG_THRESHOLD = 6; // px

    // spring back to 0
    useEffect(() => {
        let raf = 0;
        const tick = () => {
            if (draggingRef.current) {
                raf = requestAnimationFrame(tick);
                return;
            }

            const k = 0.12; // spring
            const c = 0.82; // damping

            let { rx, ry } = rotRef.current;
            let { vx, vy } = velRef.current;

            const ax = -k * rx;
            const ay = -k * ry;

            vx = (vx + ax) * c;
            vy = (vy + ay) * c;

            rx = rx + vx;
            ry = ry + vy;

            if (
                Math.abs(rx) < 0.02 &&
                Math.abs(ry) < 0.02 &&
                Math.abs(vx) < 0.02 &&
                Math.abs(vy) < 0.02
            ) {
                rx = 0;
                ry = 0;
                vx = 0;
                vy = 0;
            }

            rotRef.current = { rx, ry };
            velRef.current = { vx, vy };
            setRot({ rx, ry });

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, []);

    const isInteractiveTarget = (target) => {
        if (!(target instanceof HTMLElement)) return false;
        return !!target.closest("button, a, input, textarea, select, [role='button']");
    };

    const onPointerDown = (e) => {
        // If user pressed on an interactive element, do NOT start drag logic
        if (isInteractiveTarget(e.target)) return;

        pendingRef.current = true;
        draggingRef.current = false;
        pointerIdRef.current = e.pointerId;

        startRef.current = {
            x: e.clientX,
            y: e.clientY,
            rx: rotRef.current.rx,
            ry: rotRef.current.ry,
        };
    };

    const onPointerMove = (e) => {
        // Only respond to the active pointer
        if (pointerIdRef.current !== e.pointerId) return;

        if (!pendingRef.current && !draggingRef.current) return;

        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;

        // If we haven't started dragging yet, wait for threshold
        if (pendingRef.current && !draggingRef.current) {
            if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

            // start dragging now
            pendingRef.current = false;
            draggingRef.current = true;

            // capture pointer now (so clicks still work)
            wrapRef.current?.setPointerCapture(e.pointerId);
        }

        if (!draggingRef.current) return;

        const ry = clamp(startRef.current.ry + dx * 0.08, -10, 10);
        const rx = clamp(startRef.current.rx - dy * 0.07, -8, 8);

        rotRef.current = { rx, ry };
        setRot({ rx, ry });

        const rect = wrapRef.current?.getBoundingClientRect();
        if (rect) {
            const hx = e.clientX - rect.left;
            const hy = e.clientY - rect.top;
            const intensity = clamp((Math.abs(rx) + Math.abs(ry)) / 14, 0, 1);
            setHolo({ x: hx, y: hy, intensity });
        }
    };

    const endPointer = () => {
        pendingRef.current = false;
        draggingRef.current = false;
        pointerIdRef.current = null;
    };

    const transform = useMemo(() => {
        return `rotateX(${rot.rx}deg) rotateY(${rot.ry + (isFlipped ? 180 : 0)}deg)`;
    }, [rot.rx, rot.ry, isFlipped]);

    const holoStyle = useMemo(() => {
        const i = holo.intensity;
        const glow = 0.10 + i * 0.20;
        const sheen = 0.08 + i * 0.22;

        return {
            radial: `radial-gradient(circle 520px at ${holo.x}px ${holo.y}px, rgba(99,102,241,${glow}), transparent 62%)`,
            sweep: `linear-gradient(115deg, transparent 20%, rgba(167,139,250,${sheen}) 50%, transparent 80%)`,
            shine: `linear-gradient(to right, transparent 0%, rgba(255,255,255,${0.12 + i * 0.22}) ${50 + rot.ry * 3}%, transparent 100%)`,
        };
    }, [holo.x, holo.y, holo.intensity, rot.ry]);

    return (
        <div
            ref={wrapRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            style={{
                width: "min(560px, 90vw)",
                aspectRatio: "210 / 297",
                transform,
                transformStyle: "preserve-3d",
                transition: draggingRef.current ? "none" : "transform 180ms ease-out",
                borderRadius: 8,
                boxShadow: "var(--shadowHeavy)",
                position: "relative",
                cursor: draggingRef.current ? "grabbing" : "grab",
                userSelect: "none",
                background: "transparent",
            }}
            aria-label="CV paper"
        >
            {/* FRONT */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "#ffffff",
                    borderRadius: 8,
                    backfaceVisibility: "hidden",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holoStyle.radial }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holoStyle.sweep, opacity: 0.70 }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holoStyle.shine, opacity: 0.65 }} />

                <div style={{ position: "relative", height: "100%", padding: 44 }}>
                    {childrenFront}
                </div>
            </div>

            {/* BACK */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "#ffffff",
                    borderRadius: 8,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holoStyle.radial, opacity: 0.70 }} />
                <div style={{ position: "relative", height: "100%", padding: 44 }}>
                    {childrenBack}
                </div>
            </div>
        </div>
    );
}
