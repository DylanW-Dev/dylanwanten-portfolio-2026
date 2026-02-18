import { usePortfolio } from "../context/PortfolioContext";

export default function ModeToggle() {
    const { mode, setMode } = usePortfolio();

    return (
        <div style={styles.wrap} className="anim-fadeUp">
            <button
                onClick={() => setMode("developer")}
                style={{ ...styles.btn, ...(mode === "developer" ? styles.active : {}) }}
                aria-pressed={mode === "developer"}
            >
                Developer
            </button>
            <button
                onClick={() => setMode("recruiter")}
                style={{ ...styles.btn, ...(mode === "recruiter" ? styles.active : {}) }}
                aria-pressed={mode === "recruiter"}
            >
                Recruiter
            </button>
            <div style={styles.hint}>
                {mode === "recruiter" ? "Select skills to generate a tailored summary." : "Explore sections and details."}
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        position: "fixed",
        top: 18,
        right: 18,
        zIndex: 80,
        padding: 10,
        borderRadius: 14,
        background: "rgba(2,6,23,0.55)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        display: "grid",
        gap: 8,
        minWidth: 260,
    },
    btn: {
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(15,23,42,0.55)",
        color: "rgba(229,231,235,0.85)",
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
        transition: "transform 120ms ease, background 120ms ease, border 120ms ease",
        textAlign: "left",
    },
    active: {
        background: "linear-gradient(135deg, rgba(99,102,241,0.55), rgba(167,139,250,0.25))",
        border: "1px solid rgba(99,102,241,0.55)",
        color: "#fff",
    },
    hint: {
        fontSize: 12,
        color: "rgba(148,163,184,0.92)",
        lineHeight: 1.3,
        paddingTop: 2,
    },
};
