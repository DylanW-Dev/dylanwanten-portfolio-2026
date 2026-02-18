import { usePortfolio } from "../context/PortfolioContext";

export default function RecruiterPanel() {
    const { mode, selectedSkills, clearSkills } = usePortfolio();

    if (mode !== "recruiter") return null;

    if (selectedSkills.length === 0) {
        return (
            <div style={styles.wrap} className="anim-fadeUp">
                <div style={styles.title}>Recruiter Mode</div>
                <div style={styles.body}>Click skills to build a tailored summary.</div>
            </div>
        );
    }

    const summary =
        `Based on your selection, I match teams needing ${selectedSkills.join(", ")}.\n` +
        `I can build clean, accessible React UI with strong state patterns and production-ready polish.`;

    return (
        <div style={styles.wrap} className="anim-fadeUp">
            <div style={styles.title}>Custom Summary</div>

            <div style={{ ...styles.body, whiteSpace: "pre-line" }}>
                {summary}
            </div>

            <div style={styles.chips}>
                {selectedSkills.map((s) => (
                    <span key={s} style={styles.chip}>
                        {s}
                    </span>
                ))}
            </div>

            <div style={styles.actions}>
                <button
                    style={styles.actionBtn}
                    onClick={() => navigator.clipboard.writeText(summary)}
                >
                    Copy
                </button>
                <button
                    style={{ ...styles.actionBtn, opacity: 0.9 }}
                    onClick={clearSkills}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        position: "fixed",
        left: 18,
        bottom: 18,
        zIndex: 80,
        width: 360,
        padding: 14,
        borderRadius: 16,
        background: "rgba(2,6,23,0.55)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
    },
    title: {
        fontSize: 13,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(199,210,254,0.95)",
        marginBottom: 8,
    },
    body: {
        fontSize: 12.5,
        lineHeight: 1.4,
        color: "rgba(226,232,240,0.88)",
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 10,
    },
    chip: {
        fontSize: 11,
        padding: "6px 8px",
        borderRadius: 999,
        background: "rgba(99,102,241,0.18)",
        border: "1px solid rgba(99,102,241,0.35)",
        color: "rgba(199,210,254,0.95)",
    },
    actions: {
        display: "flex",
        gap: 10,
        marginTop: 12,
    },
    actionBtn: {
        flex: 1,
        cursor: "pointer",
        borderRadius: 12,
        padding: "10px 12px",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(15,23,42,0.55)",
        color: "rgba(255,255,255,0.92)",
        transition: "transform 120ms ease",
    },
};
