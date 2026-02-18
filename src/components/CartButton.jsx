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
            {/* mail glyph */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
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
