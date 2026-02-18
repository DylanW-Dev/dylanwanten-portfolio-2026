import { useEffect, useState } from "react";
import useDraggable from "../hooks/useDraggable";

function getCardWidth() {
    return Math.min(440, window.innerWidth - 24);
}

export default function FloatingCard({
    title,
    initial,
    onClose,
    onRectChange,
    children,
    disabled = false,
}) {
    const [cardW, setCardW] = useState(getCardWidth);

    useEffect(() => {
        const onResize = () => setCardW(getCardWidth());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const size = { w: cardW, h: 380 };

    const { pos, bind } = useDraggable({
        initial,
        size,
        disabled,
        onChange: (p) => onRectChange?.({ x: p.x, y: p.y, w: size.w, h: size.h }),
    });

    return (
        <div
            className="anim-popIn"
            role="region"
            aria-label={title}
            style={{
                position: "fixed",
                left: pos?.x ?? 12,
                top: pos?.y ?? 12,
                width: size.w,
                minHeight: size.h,
                zIndex: 65,
                background: "var(--card)",
                border: "1px solid var(--cardBorder)",
                borderRadius: 22,
                boxShadow: "var(--shadowCard)",
                backdropFilter: "blur(14px)",
                overflow: "hidden",
                pointerEvents: disabled ? "none" : "auto",
            }}
        >
            {/* HEADER = DRAG HANDLE */}
            <div
                {...bind}
                style={{
                padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: disabled ? "default" : "grab",
                    userSelect: "none",
                    background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(167,139,250,0.10))",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                <div
                    style={{
                        fontSize: 13,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(199,210,254,0.95)",
                        fontWeight: 600,
                    }}
                >
                    {title}
                </div>

                <button
                    type="button"
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onClose?.();
                    }}
                    aria-label="Close"
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(2,6,23,0.35)",
                        color: "rgba(255,255,255,0.9)",
                        cursor: "pointer",
                        fontSize: 18,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                    }}
                >
                    ×
                </button>
            </div>

            {/* CONTENT */}
            <div style={{ padding: "20px 22px", maxHeight: 340, overflowY: "auto" }}>
                {children}
            </div>

            {/* FOOTER HINT */}
            <div
                style={{
                    padding: "0 22px 18px",
                    fontSize: 11,
                    color: "rgba(148,163,184,0.55)",
                }}
            >
                Drag from header · Click inside normally
            </div>
        </div>
    );
}
