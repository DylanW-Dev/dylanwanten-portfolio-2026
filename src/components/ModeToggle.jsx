import { useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

export default function ModeToggle() {
    const { mode, setMode } = usePortfolio();
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const hint = mode === "recruiter"
        ? "Select skills to generate a tailored summary."
        : "Explore sections and details.";

    return (
        <div
            className="anim-fadeUp"
            role="group"
            aria-label="View mode"
            style={{
                ...styles.wrap,
                minWidth: isMobile ? 0 : 260,
                padding: isMobile ? "8px 10px" : 10,
            }}
        >
            <div style={isMobile ? styles.btnRowMobile : styles.btnRow}>
                <button
                    onClick={() => setMode("developer")}
                    style={{
                        ...styles.btn,
                        ...(mode === "developer" ? styles.active : {}),
                        ...(isMobile ? styles.btnMobile : {}),
                    }}
                    aria-pressed={mode === "developer"}
                >
                    Visitor
                </button>
                <button
                    onClick={() => setMode("recruiter")}
                    style={{
                        ...styles.btn,
                        ...(mode === "recruiter" ? styles.active : {}),
                        ...(isMobile ? styles.btnMobile : {}),
                    }}
                    aria-pressed={mode === "recruiter"}
                >
                    Recruiter
                </button>
            </div>

            {!isMobile && (
                <div style={styles.hint}>{hint}</div>
            )}
        </div>
    );
}

const styles = {
    wrap: {
        position: "fixed",
        top: 18,
        right: 18,
        zIndex: 80,
        borderRadius: 14,
        background: "rgba(2,6,23,0.55)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
        display: "grid",
        gap: 8,
    },
    btnRow: {
        display: "grid",
        gap: 8,
    },
    btnRowMobile: {
        display: "flex",
        gap: 6,
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
    btnMobile: {
        padding: "8px 12px",
        fontSize: 13,
        borderRadius: 10,
        flex: 1,
        textAlign: "center",
        whiteSpace: "nowrap",
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
