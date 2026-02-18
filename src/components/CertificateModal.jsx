import { useEffect, useMemo, useRef, useState } from "react";

export default function CertificateModal({ certificate, onClose }) {
    const frameRef = useRef(null);

    const [rot, setRot] = useState({ rx: 0, ry: 0 });
    const rotRef = useRef({ rx: 0, ry: 0 });
    const velRef = useRef({ vx: 0, vy: 0 });
    const draggingRef = useRef(false);
    const pendingRef = useRef(false);
    const pointerIdRef = useRef(null);
    const startRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

    const [holo, setHolo] = useState({ x: 0, y: 0, intensity: 0 });
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const DRAG_THRESHOLD = 6;

    useEffect(() => {
        let raf = 0;
        const tick = () => {
            if (draggingRef.current) {
                raf = requestAnimationFrame(tick);
                return;
            }
            const k = 0.14, c = 0.80;

            let { rx, ry } = rotRef.current;
            let { vx, vy } = velRef.current;

            vx = (vx + (-k * rx)) * c;
            vy = (vy + (-k * ry)) * c;

            rx += vx;
            ry += vy;

            if (Math.abs(rx) < 0.02 && Math.abs(ry) < 0.02 && Math.abs(vx) < 0.02 && Math.abs(vy) < 0.02) {
                rx = 0; ry = 0; vx = 0; vy = 0;
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
        return !!target.closest("button,a,input,textarea,select,[role='button']");
    };

    const onPointerDown = (e) => {
        if (isInteractiveTarget(e.target)) return;

        pendingRef.current = true;
        draggingRef.current = false;
        pointerIdRef.current = e.pointerId;

        startRef.current = { x: e.clientX, y: e.clientY, rx: rotRef.current.rx, ry: rotRef.current.ry };
    };

    const onPointerMove = (e) => {
        if (pointerIdRef.current !== e.pointerId) return;
        if (!pendingRef.current && !draggingRef.current) return;

        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;

        if (pendingRef.current && !draggingRef.current) {
            if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
            pendingRef.current = false;
            draggingRef.current = true;
            frameRef.current?.setPointerCapture(e.pointerId);
        }

        if (!draggingRef.current) return;

        const ry = clamp(startRef.current.ry + dx * 0.09, -12, 12);
        const rx = clamp(startRef.current.rx - dy * 0.08, -10, 10);

        rotRef.current = { rx, ry };
        setRot({ rx, ry });

        const rect = frameRef.current?.getBoundingClientRect();
        if (rect) {
            const hx = e.clientX - rect.left;
            const hy = e.clientY - rect.top;
            const intensity = clamp((Math.abs(rx) + Math.abs(ry)) / 16, 0, 1);
            setHolo({ x: hx, y: hy, intensity });
        }
    };

    const endPointer = () => {
        pendingRef.current = false;
        draggingRef.current = false;
        pointerIdRef.current = null;
    };

    const holoStyle = useMemo(() => {
        const i = holo.intensity;
        return {
            radial: `radial-gradient(circle 520px at ${holo.x}px ${holo.y}px, rgba(99,102,241,${0.12 + i * 0.22}), transparent 60%)`,
            sweep: `linear-gradient(120deg, transparent 25%, rgba(167,139,250,${0.10 + i * 0.22}) 52%, transparent 80%)`,
            shine: `linear-gradient(to right, transparent 0%, rgba(255,255,255,${0.14 + i * 0.25}) ${50 + rot.ry * 3}%, transparent 100%)`,
        };
    }, [holo.x, holo.y, holo.intensity, rot.ry]);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 140,
                background: "rgba(2,6,23,0.55)",
                backdropFilter: "blur(14px)",
                display: "grid",
                placeItems: "center",
                padding: 18,
            }}
        >
            <div
                ref={frameRef}
                className="anim-popIn"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endPointer}
                onPointerCancel={endPointer}
                style={{
                    width: "min(720px, 92vw)",
                    borderRadius: 16,
                    background: "#ffffff",
                    boxShadow: "var(--shadowHeavy)",
                    transform: `rotateX(${rot.rx}deg) rotateY(${rot.ry}deg)`,
                    transformStyle: "preserve-3d",
                    transition: draggingRef.current ? "none" : "transform 160ms ease-out",
                    position: "relative",
                    overflow: "hidden",
                    cursor: draggingRef.current ? "grabbing" : "grab",
                    userSelect: "none",
                }}
            >
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holoStyle.radial }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holoStyle.sweep, opacity: 0.75 }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holoStyle.shine, opacity: 0.65 }} />

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose?.();
                    }}
                    aria-label="Close"
                    style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        border: "1px solid rgba(15,23,42,0.10)",
                        background: "rgba(255,255,255,0.82)",
                        cursor: "pointer",
                        fontSize: 18,
                        zIndex: 2,
                    }}
                >
                    ×
                </button>

                <div style={{ position: "relative", zIndex: 1, padding: 26 }}>
                    <div style={{ fontSize: 12, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(15,23,42,0.55)" }}>
                        Certificate
                    </div>
                    <div style={{ marginTop: 6, fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>
                        {certificate.title}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13.5, color: "rgba(15,23,42,0.55)" }}>
                        {certificate.issuer}
                    </div>

                    <div
                        style={{
                            marginTop: 18,
                            height: 340,
                            borderRadius: 12,
                            background: "linear-gradient(135deg, rgba(2,6,23,0.08), rgba(99,102,241,0.10))",
                            border: "1px dashed rgba(15,23,42,0.25)",
                            display: "grid",
                            placeItems: "center",
                            color: "rgba(15,23,42,0.55)",
                            fontSize: 13,
                        }}
                    >
                        <img src={certificate.image} alt={`${certificate.title} credential`} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} />
                    </div>

                    <a
                        href={certificate.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: "inline-block",
                            marginTop: 18,
                            padding: "10px 14px",
                            borderRadius: 12,
                            background: "rgba(99,102,241,0.12)",
                            border: "1px solid rgba(99,102,241,0.25)",
                            color: "rgba(15,23,42,0.85)",
                            textDecoration: "none",
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        View credential →
                    </a>
                </div>
            </div>
        </div>
    );
}
