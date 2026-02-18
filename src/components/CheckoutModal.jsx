import { useMemo, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

function encodeMailto(s) {
    return encodeURIComponent(s).replace(/%20/g, " ");
}

export default function CheckoutModal({ onClose }) {
    const { selectedSkills, clearSkills } = usePortfolio();

    const [recruiterEmail, setRecruiterEmail] = useState("");
    const [subject, setSubject] = useState("Recruiter interest — Frontend role");
    const [customMessage, setCustomMessage] = useState("");
    const [mode, setMode] = useState("preset"); // 'preset' | 'custom'

    const skillsList = useMemo(() => {
        if (!selectedSkills?.length) return "- (none)";
        return selectedSkills.map((s) => `- ${s}`).join("\n");
    }, [selectedSkills]);

    const presetBody = useMemo(() => {
        return (
            `Hi,\n\n` +
            `I am a recruiter and I was interested in the following skills:\n` +
            `${skillsList}\n\n` +
            `Contact me via: ${recruiterEmail || "[your email here]"}\n\n` +
            `Best regards,\n` +
            `[Recruiter Name]`
        );
    }, [skillsList, recruiterEmail]);

    const customBody = useMemo(() => {
        return (
            `${customMessage || "[Write your message here]"}\n\n` +
            `Skills I liked:\n${skillsList}\n\n` +
            `My email: ${recruiterEmail || "[your email here]"}`
        );
    }, [customMessage, skillsList, recruiterEmail]);

    // TODO: put your email here
    const YOUR_EMAIL = "your.email@example.com";

    const mailtoPreset = `mailto:${YOUR_EMAIL}?subject=${encodeMailto(subject)}&body=${encodeMailto(presetBody)}`;
    const mailtoCustom = `mailto:${YOUR_EMAIL}?subject=${encodeMailto(subject)}&body=${encodeMailto(customBody)}`;

    const canCheckout = selectedSkills.length > 0;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 160,
                background: "rgba(2,6,23,0.55)",
                backdropFilter: "blur(14px)",
                display: "grid",
                placeItems: "center",
                padding: 18,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="anim-popIn"
                style={{
                    width: "min(720px, 94vw)",
                    borderRadius: 18,
                    background: "rgba(15,23,42,0.92)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "var(--shadowHeavy)",
                    padding: 18,
                    color: "rgba(226,232,240,0.92)",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(199,210,254,0.95)" }}>
                        Recruiter Checkout
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            width: 38,
                            height: 38,
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(2,6,23,0.35)",
                            color: "rgba(255,255,255,0.90)",
                            cursor: "pointer",
                            fontSize: 18,
                        }}
                    >
                        ×
                    </button>
                </div>

                <div style={{ height: 1, margin: "12px 0", background: "rgba(255,255,255,0.08)" }} />

                <div style={{ display: "grid", gap: 12 }}>
                    <label style={{ fontSize: 12.5, color: "rgba(148,163,184,0.95)" }}>
                        Subject
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={inputStyle}
                        />
                    </label>

                    <label style={{ fontSize: 12.5, color: "rgba(148,163,184,0.95)" }}>
                        Your email (recruiter)
                        <input
                            value={recruiterEmail}
                            onChange={(e) => setRecruiterEmail(e.target.value)}
                            placeholder="name@company.com"
                            style={inputStyle}
                        />
                    </label>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button
                            type="button"
                            onClick={() => setMode("preset")}
                            style={mode === "preset" ? tabActive : tab}
                        >
                            Preset email
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("custom")}
                            style={mode === "custom" ? tabActive : tab}
                        >
                            Custom email
                        </button>
                    </div>

                    {mode === "custom" && (
                        <label style={{ fontSize: 12.5, color: "rgba(148,163,184,0.95)" }}>
                            Your message
                            <textarea
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                rows={6}
                                placeholder="Write your message..."
                                style={{ ...inputStyle, resize: "vertical" }}
                            />
                        </label>
                    )}

                    <div
                        style={{
                            padding: 12,
                            borderRadius: 14,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(255,255,255,0.06)",
                        }}
                    >
                        <div style={{ fontSize: 12, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(199,210,254,0.95)" }}>
                            Selected skills
                        </div>
                        <pre style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(226,232,240,0.90)", whiteSpace: "pre-wrap" }}>
                            {skillsList}
                        </pre>
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                        <a
                            href={mode === "preset" ? mailtoPreset : mailtoCustom}
                            onClick={(e) => {
                                if (!canCheckout) e.preventDefault();
                            }}
                            style={{
                                flex: 1,
                                textAlign: "center",
                                padding: "12px 14px",
                                borderRadius: 14,
                                textDecoration: "none",
                                fontWeight: 700,
                                background: canCheckout
                                    ? "linear-gradient(135deg, rgba(99,102,241,0.75), rgba(167,139,250,0.35))"
                                    : "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.10)",
                                color: canCheckout ? "white" : "rgba(148,163,184,0.85)",
                                cursor: canCheckout ? "pointer" : "not-allowed",
                            }}
                        >
                            Open email app →
                        </a>

                        <button
                            type="button"
                            onClick={() => {
                                clearSkills();
                                onClose?.();
                            }}
                            style={{
                                width: 140,
                                padding: "12px 14px",
                                borderRadius: 14,
                                border: "1px solid rgba(255,255,255,0.10)",
                                background: "rgba(255,255,255,0.06)",
                                color: "rgba(226,232,240,0.92)",
                                cursor: "pointer",
                                fontWeight: 700,
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    marginTop: 6,
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.35)",
    color: "rgba(226,232,240,0.92)",
    outline: "none",
};

const tab = {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(226,232,240,0.90)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
};

const tabActive = {
    ...tab,
    background: "linear-gradient(135deg, rgba(99,102,241,0.40), rgba(167,139,250,0.18))",
    border: "1px solid rgba(99,102,241,0.45)",
    color: "white",
};
