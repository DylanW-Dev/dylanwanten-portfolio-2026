import useDraggable from "../hooks/useDraggable";

export default function FloatingCard({
    title,
    initial,
    onClose,
    onRectChange,
    children,
    disabled = false,
}) {
    const size = { w: 440, h: 360 };

    const { pos, bind } = useDraggable({
        initial,
        size,
        disabled,
        onChange: (p) => onRectChange?.({ x: p.x, y: p.y, w: size.w, h: size.h }),
    });

    return (
        <div
            className="anim-popIn"
            style={{
                position: "fixed",
                left: pos?.x ?? 12,
                top: pos?.y ?? 12,
                width: size.w,
                minHeight: size.h,
                zIndex: 65,
                background: "var(--card)",
                border: "1px solid var(--cardBorder)",
                borderRadius: 18,
                boxShadow: "var(--shadowCard)",
                backdropFilter: "blur(14px)",
                overflow: "hidden",

                // ✅ if disabled, don't let this card steal pointer streams
                pointerEvents: disabled ? "none" : "auto",
            }}
        >
            {/* HEADER = DRAG HANDLE */}
            <div
                {...bind}
                style={{
                    padding: "14px 14px",
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
                    }}
                >
                    {title}
                </div>

                <button
                    type="button"
                    // pointerdown is more reliable than click when pointer capture exists elsewhere
                    onPointerDown={(e) => {
                        e.stopPropagation();
                        onClose?.();
                    }}
                    aria-label="Close"
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(2,6,23,0.35)",
                        color: "rgba(255,255,255,0.9)",
                        cursor: "pointer",
                        fontSize: 18,

                        // If parent pointerEvents is none, this won't fire anyway.
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ padding: 14, maxHeight: 300, overflow: "auto" }}>{children}</div>

            <div
                style={{
                    padding: "0 14px 14px",
                    fontSize: 11,
                    color: "rgba(148,163,184,0.85)",
                }}
            >
                Drag from header • Click inside normally
            </div>
        </div>
    );
}
