import { useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

export default function RecruiterPanel() {
    const { mode, selectedSkills, clearSkills } = usePortfolio();
    const [expanded, setExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (mode !== "recruiter") return null;

    const summary =
        selectedSkills.length > 0
            ? `Based on your selection, I match teams needing ${selectedSkills.join(", ")}.\n` +
              `I can build clean, accessible React UI with strong state patterns and production-ready polish.`
            : null;

    // On mobile leave room for the flip button (bottom-right)
    const panelW = isMobile ? "calc(100vw - 134px)" : 300;

    return (
        <div
            className="anim-fadeUp"
            style={{
                position: "fixed",
                left: 18,
                bottom: 18,
                zIndex: 80,
                width: panelW,
            }}
        >
            {/* Expanded content — grows upward */}
            {expanded && (
                <div
                    style={{
                        ...s.glass,
                        borderRadius: 16,
                        padding: 14,
                        marginBottom: 8,
                        maxHeight: "55vh",
                        overflowY: "auto",
                    }}
                >
                    {summary ? (
                        <>
                            <div style={s.title}>Custom Summary</div>
                            <div style={{ ...s.body, whiteSpace: "pre-line" }}>{summary}</div>
                            <div style={s.chips}>
                                {selectedSkills.map((sk) => (
                                    <span key={sk} style={s.chip}>{sk}</span>
                                ))}
                            </div>
                            <div style={s.actions}>
                                <button style={s.actionBtn} onClick={() => navigator.clipboard.writeText(summary)}>
                                    Copy
                                </button>
                                <button style={{ ...s.actionBtn, opacity: 0.9 }} onClick={clearSkills}>
                                    Clear
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={s.body}>Click skills in the Skills card to build a tailored summary.</div>
                    )}
                </div>
            )}

            {/* Toggle bar */}
            <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                style={{
                    ...s.glass,
                    width: "100%",
                    borderRadius: 12,
                    padding: "10px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                }}
            >
                <span style={{ fontSize: 12.5, color: "rgba(199,210,254,0.95)", fontWeight: 600 }}>
                    Recruiter
                    {selectedSkills.length > 0 && (
                        <span style={{ marginLeft: 8, color: "rgba(99,102,241,0.95)", fontWeight: 800 }}>
                            ({selectedSkills.length})
                        </span>
                    )}
                </span>
                <span style={{ fontSize: 11, color: "rgba(148,163,184,0.80)" }}>
                    {expanded ? "▼" : "▲"}
                </span>
            </button>
        </div>
    );
}

const s = {
    glass: {
        background: "rgba(2,6,23,0.55)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        color: "rgba(226,232,240,0.88)",
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
