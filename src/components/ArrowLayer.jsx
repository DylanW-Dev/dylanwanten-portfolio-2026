export default function ArrowLayer({ fromEl, cardRect, visibleKey }) {
    if (!fromEl || !cardRect) return null;

    const rowRect = fromEl.getBoundingClientRect();
    const cardOnRight = cardRect.x > rowRect.x;

    const from = {
        x: cardOnRight ? rowRect.right : rowRect.left,
        y: rowRect.top + rowRect.height / 2,
    };

    const to = {
        x: cardOnRight ? cardRect.x : cardRect.x + cardRect.w,
        y: cardRect.y + cardRect.h / 2,
    };

    const ctrl1 = { x: from.x + (cardOnRight ? 110 : -110), y: from.y };
    const ctrl2 = { x: to.x + (cardOnRight ? -110 : 110), y: to.y };
    const d = `M ${from.x} ${from.y} C ${ctrl1.x} ${ctrl1.y}, ${ctrl2.x} ${ctrl2.y}, ${to.x} ${to.y}`;

    return (
        <svg
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 90, // ABOVE the CV and BELOW cards if you want
            }}
        >
            <defs>
                <marker id="arrowHead" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
                    <path d="M 0 0 L 12 6 L 0 12 z" fill="#6366f1" />
                </marker>
            </defs>

            {/* Outline for contrast on any background */}
            <path
                key={`outline-${visibleKey}`}
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.70)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                style={{ animation: "drawLine 520ms ease-out forwards" }}
            />

            {/* Main line */}
            <path
                key={`main-${visibleKey}`}
                d={d}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
                markerEnd="url(#arrowHead)"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                style={{
                    animation: "drawLine 520ms ease-out forwards",
                    filter: "drop-shadow(0 0 10px rgba(99,102,241,0.85))",
                }}
            />
        </svg>
    );
}
