import { useEffect, useMemo, useRef, useState } from "react";
import ModalPortal from "./ModalPortal";

export default function CertificateModal({ certificate, onClose }) {
    const frameRef = useRef(null);
    const [tilt, setTilt] = useState({ rx: 0, ry: 0, hx: 0, hy: 0, i: 0 });

    // Lock scroll
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    const onMove = (e) => {
        const el = frameRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        if (!inside) return;

        const px = (x - r.left) / r.width;   // 0..1
        const py = (y - r.top) / r.height;  // 0..1

        const ry = clamp((px - 0.5) * 18, -10, 10);
        const rx = clamp(-(py - 0.5) * 14, -8, 8);

        const i = clamp((Math.abs(rx) + Math.abs(ry)) / 16, 0, 1);

        setTilt({
            rx,
            ry,
            hx: x - r.left,
            hy: y - r.top,
            i,
        });
    };

    const reset = () => {
        setTilt((p) => ({ ...p, rx: 0, ry: 0, i: 0 }));
    };

    const holo = useMemo(() => {
        const i = tilt.i;
        return {
            radial: `radial-gradient(circle 560px at ${tilt.hx}px ${tilt.hy}px, rgba(99,102,241,${0.10 + i * 0.26}), transparent 62%)`,
            sweep: `linear-gradient(120deg, transparent 25%, rgba(167,139,250,${0.08 + i * 0.24}) 52%, transparent 82%)`,
            shine: `linear-gradient(to right, transparent 0%, rgba(255,255,255,${0.10 + i * 0.30}) ${55 + tilt.ry * 3}%, transparent 100%)`,
        };
    }, [tilt.hx, tilt.hy, tilt.i, tilt.ry]);

    return (
        <ModalPortal>
            <div
                // Backdrop: click anywhere outside closes
                onPointerDown={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 2147483647, // max safe
                    background: "rgba(2,6,23,0.62)",
                    backdropFilter: "blur(16px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 18,
                    overflowY: "auto",
                    isolation: "isolate",
                }}
            >
                <div
                    // Prevent backdrop close when interacting inside
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                        width: "min(820px, 100%)",
                        maxHeight: "92vh",
                        overflow: "hidden",
                        overflowY: "auto",
                        borderRadius: 20,
                        position: "relative",
                        background: "rgba(255,255,255,0.94)",
                        boxShadow: "var(--shadowHeavy)",
                        flexShrink: 0,
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="cert-modal-title"
                >
                    {/* TOP BAR (NOT TILTING) — always clickable */}
                    <div
                        style={{
                            position: "relative",
                            zIndex: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                            padding: "14px 14px 12px",
                            borderBottom: "1px solid rgba(15,23,42,0.10)",
                            background: "rgba(255,255,255,0.95)",
                        }}
                    >
                        <div style={{ minWidth: 0 }}>
                            <div
                                style={{
                                    fontSize: 11,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    color: "rgba(15,23,42,0.55)",
                                }}
                            >
                                Certificate
                            </div>
                            <div
                                id="cert-modal-title"
                                style={{
                                    marginTop: 6,
                                    fontSize: 18,
                                    fontWeight: 850,
                                    color: "var(--ink)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {certificate.title}
                            </div>
                            <div style={{ marginTop: 4, fontSize: 13, color: "rgba(15,23,42,0.55)" }}>
                                {certificate.issuer}
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                            <a
                                href={certificate.link}
                                target="_blank"
                                rel="noreferrer"
                                // pointerdown so it works even if something else messes with click
                                onPointerDown={(e) => e.stopPropagation()}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "10px 12px",
                                    borderRadius: 12,
                                    background: "rgba(99,102,241,0.12)",
                                    border: "1px solid rgba(99,102,241,0.25)",
                                    color: "rgba(15,23,42,0.86)",
                                    textDecoration: "none",
                                    fontSize: 13,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                }}
                            >
                                View credential →
                            </a>

                            <button
                                type="button"
                                aria-label="Close"
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    onClose?.();
                                }}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 14,
                                    border: "1px solid rgba(15,23,42,0.10)",
                                    background: "rgba(255,255,255,0.92)",
                                    cursor: "pointer",
                                    fontSize: 18,
                                }}
                            >
                                ×
                            </button>
                        </div>
                    </div>

                    {/* TILTING FRAME AREA */}
                    <div
                        style={{
                            padding: 14,
                            background: "linear-gradient(135deg, rgba(2,6,23,0.02), rgba(99,102,241,0.05))",
                        }}
                    >
                        <div
                            style={{
                                perspective: "1400px",
                            }}
                        >
                            <div
                                ref={frameRef}
                                onPointerMove={onMove}
                                onPointerLeave={reset}
                                style={{
                                    borderRadius: 18,
                                    background: "#ffffff",
                                    border: "1px solid rgba(15,23,42,0.12)",
                                    boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
                                    overflow: "hidden",
                                    transformStyle: "preserve-3d",
                                    willChange: "transform",
                                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                                    transition: tilt.i > 0 ? "none" : "transform 220ms ease-out",
                                    position: "relative",
                                }}
                            >
                                {/* holo overlays */}
                                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holo.radial }} />
                                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holo.sweep, opacity: 0.75 }} />
                                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: holo.shine, opacity: 0.65 }} />

                                {/* image area */}
                                <div
                                    style={{
                                        height: "min(520px, 45vh)",
                                        display: "grid",
                                        placeItems: "center",
                                        background: "rgba(15,23,42,0.02)",
                                    }}
                                >
                                    <img
                                        src={certificate.image}
                                        alt={`${certificate.title} credential`}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            padding: 18,
                                            pointerEvents: "none",
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: 10, fontSize: 12, color: "rgba(15,23,42,0.55)" }}>
                                Hover the certificate frame to tilt.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
