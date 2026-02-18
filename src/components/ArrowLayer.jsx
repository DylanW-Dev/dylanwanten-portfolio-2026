export default function ArrowLayer({ fromEl, cardRect, id }) {
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

    const ctrl1 = { x: from.x + (cardOnRight ? 120 : -120), y: from.y };
    const ctrl2 = { x: to.x + (cardOnRight ? -120 : 120), y: to.y };
    const d = `M ${from.x} ${from.y} C ${ctrl1.x} ${ctrl1.y}, ${ctrl2.x} ${ctrl2.y}, ${to.x} ${to.y}`;

    const markerId = `arrowHead-${id}`;

    return (
        <svg
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 200, // make sure it's above CV/cards
            }}
        >
            <defs>
                <marker
                    id={markerId}
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                >
                    <path d="M 0 0 L 12 6 L 0 12 z" fill="#6366f1" />
                </marker>
            </defs>

            {/* Tail dot */}
            <circle cx={from.x} cy={from.y} r="4.5" fill="#6366f1" opacity="0.95" />
            <circle cx={from.x} cy={from.y} r="8" fill="rgba(99,102,241,0.20)" />

            {/* White outline */}
            <path
                d={d}
                fill="none"
                stroke="rgba(255,255,255,0.72)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="1200"
                strokeDashoffset="1200"
                style={{ animation: "drawLine 520ms ease-out forwards" }}
            />

            {/* Main line */}
            <path
                d={d}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.6"
                strokeLinecap="round"
                markerEnd={`url(#${markerId})`}
                strokeDasharray="1200"
                strokeDashoffset="1200"
                style={{
                    animation: "drawLine 520ms ease-out forwards",
                    filter: "drop-shadow(0 0 12px rgba(99,102,241,0.85))",
                }}
            />
        </svg>
    );
}
