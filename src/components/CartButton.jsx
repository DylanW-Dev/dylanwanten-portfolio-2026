import { usePortfolio } from "../context/PortfolioContext";

export default function CartButton({ onClick }) {
    const { mode, selectedSkills } = usePortfolio();
    if (mode !== "recruiter") return null;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Open recruiter cart"
            style={{
                position: "fixed",
                right: 18,
                bottom: 18,
                zIndex: 120,
                width: 54,
                height: 54,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(2,6,23,0.55)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
                cursor: "pointer",
                display: "grid",
                placeItems: "center",
                color: "rgba(255,255,255,0.92)",
            }}
        >
            {/* cart glyph */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6l-2-2H2" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
            </svg>

            {selectedSkills.length > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: 7,
                        right: 7,
                        minWidth: 18,
                        height: 18,
                        padding: "0 6px",
                        borderRadius: 999,
                        background: "rgba(99,102,241,0.95)",
                        color: "white",
                        fontSize: 11,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                    }}
                >
                    {selectedSkills.length}
                </div>
            )}
        </button>
    );
}
