import { useEffect, useMemo, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import ModalPortal from "./ModalPortal";

// No signup required — Formsubmit sends directly to your email.
// First submission triggers a one-time activation email to this address.
const ENDPOINT = "https://formsubmit.co/ajax/dylan.wanten.dev@gmail.com";

// Mailto fallback shown when POST fails
const YOUR_EMAIL = "dylan.wanten.dev@gmail.com";

function encodeMailto(s) {
    return encodeURIComponent(s).replace(/%20/g, " ");
}

export default function CheckoutModal({ onClose }) {
    const { selectedSkills, clearSkills } = usePortfolio();

    const [recruiterEmail, setRecruiterEmail] = useState("");
    const [subject, setSubject]               = useState("Recruiter interest — Frontend role");
    const [customMessage, setCustomMessage]   = useState("");
    const [emailMode, setEmailMode]           = useState("custom"); // 'custom' | 'preset'

    const [sent, setSent]               = useState(false);
    const [submitting, setSubmitting]   = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const skillsList = useMemo(() => {
        if (!selectedSkills?.length) return null;
        return selectedSkills.map((sk) => `- ${sk}`).join("\n");
    }, [selectedSkills]);

    const presetBody = useMemo(() => {
        const skills = skillsList ? `I was interested in the following skills:\n${skillsList}\n\n` : "";
        return (
            `Hi,\n\n` +
            `I am a recruiter and I'd like to connect.\n\n` +
            `${skills}` +
            `Contact me via: ${recruiterEmail || "[your email here]"}\n\n` +
            `Best regards,\n[Recruiter Name]`
        );
    }, [skillsList, recruiterEmail]);

    const customBody = useMemo(() => {
        const skills = skillsList ? `\n\nSkills I liked:\n${skillsList}` : "";
        return (
            `${customMessage || "[Write your message here]"}` +
            `${skills}` +
            `\n\nMy email: ${recruiterEmail || "[your email here]"}`
        );
    }, [customMessage, skillsList, recruiterEmail]);

    const body = emailMode === "preset" ? presetBody : customBody;

    const mailtoHref = `mailto:${YOUR_EMAIL}?subject=${encodeMailto(subject)}&body=${encodeMailto(body)}`;

    const handleSend = async () => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({
                    _subject: subject,
                    email: recruiterEmail || "no-reply@recruiter.com",
                    message: body,
                    selected_skills: skillsList ?? "none",
                    _captcha: "false",
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success === "true") {
                clearSkills();
                setSent(true);
            } else {
                setSubmitError(data?.message ?? "Submission failed. Use the email fallback below.");
            }
        } catch {
            setSubmitError("Network error. Use the email fallback below.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ModalPortal>
        <div onPointerDown={onClose} style={s.backdrop}>
            <div
                onPointerDown={(e) => e.stopPropagation()}
                className="anim-popIn"
                style={s.panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="checkout-title"
            >
                {/* ── Header ── */}
                <div style={s.header}>
                    <div id="checkout-title" style={s.panelTitle}>Recruiter Checkout</div>
                    <button type="button" onClick={onClose} aria-label="Close dialog" style={s.closeBtn}>
                        ×
                    </button>
                </div>

                <div style={s.divider} />

                {sent ? (
                    /* ── Success state ── */
                    <div style={s.successWrap}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(99,102,241,0.9)" strokeWidth="1.5" aria-hidden="true">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M2 7l10 7 10-7" />
                        </svg>
                        <div style={{ fontSize: 17, fontWeight: 700, color: "rgba(226,232,240,0.97)" }}>
                            Message sent!
                        </div>
                        <div style={{ fontSize: 13.5, color: "rgba(148,163,184,0.90)", lineHeight: 1.65, maxWidth: 340 }}>
                            Your message has been submitted. I'll get back to you as soon as possible.
                        </div>
                        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                        <button type="button" onClick={onClose} autoFocus style={{ ...s.submitBtn, maxWidth: 160, width: "100%" }}>
                            Done
                        </button>
                    </div>
                ) : (
                    /* ── Form ── */
                    <div style={s.form}>

                        <label style={s.label} htmlFor="checkout-subject">
                            Subject
                            <input
                                id="checkout-subject"
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                style={s.input}
                            />
                        </label>

                        <label style={s.label} htmlFor="checkout-email">
                            Your email (recruiter)
                            <input
                                id="checkout-email"
                                value={recruiterEmail}
                                onChange={(e) => setRecruiterEmail(e.target.value)}
                                placeholder="name@company.com"
                                type="email"
                                style={s.input}
                            />
                        </label>

                        {/* Template tabs */}
                        <div role="group" aria-label="Email template">
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <button
                                    type="button"
                                    onClick={() => setEmailMode("custom")}
                                    style={emailMode === "custom" ? s.tabActive : s.tab}
                                    aria-pressed={emailMode === "custom"}
                                >
                                    Custom
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEmailMode("preset")}
                                    style={emailMode === "preset" ? s.tabActive : s.tab}
                                    aria-pressed={emailMode === "preset"}
                                >
                                    Preset
                                </button>
                            </div>
                            {emailMode === "preset" && (
                                <div style={s.helperText} role="note">
                                    Sends a preformatted message including any skills you selected on the CV.
                                </div>
                            )}
                        </div>

                        {emailMode === "custom" && (
                            <label style={s.label} htmlFor="checkout-message">
                                Message
                                <textarea
                                    id="checkout-message"
                                    value={customMessage}
                                    onChange={(e) => setCustomMessage(e.target.value)}
                                    rows={5}
                                    placeholder="Write your message…"
                                    style={{ ...s.input, resize: "vertical", lineHeight: 1.55 }}
                                />
                            </label>
                        )}

                        {/* Skills preview */}
                        <div style={s.skillsBox}>
                            <div style={s.skillsLabel} id="skills-label">Selected skills</div>
                            <pre
                                aria-labelledby="skills-label"
                                style={{ margin: "8px 0 0", fontSize: 12.5, color: "rgba(226,232,240,0.88)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                            >
                                {skillsList ?? "none — skills are optional"}
                            </pre>
                        </div>

                        {/* Error */}
                        {submitError && (
                            <div style={s.errorBox} role="alert">
                                {submitError}
                                {" "}
                                <a href={mailtoHref} style={s.fallbackLink}>Open email app →</a>
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                            <button
                                type="button"
                                onClick={handleSend}
                                disabled={submitting}
                                style={{
                                    ...s.submitBtn,
                                    opacity: submitting ? 0.55 : 1,
                                    cursor: submitting ? "wait" : "pointer",
                                }}
                            >
                                {submitting ? "Sending…" : "Send →"}
                            </button>
                            <button
                                type="button"
                                onClick={() => { clearSkills(); onClose?.(); }}
                                style={s.clearBtn}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </ModalPortal>
    );
}

const s = {
    backdrop: {
        position: "fixed",
        inset: 0,
        zIndex: 160,
        background: "rgba(2,6,23,0.60)",
        backdropFilter: "blur(16px)",
        display: "grid",
        placeItems: "center",
        padding: 20,
    },
    panel: {
        width: "min(600px, 96vw)",
        maxHeight: "92vh",
        overflowY: "auto",
        borderRadius: 22,
        background: "rgba(15,23,42,0.94)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "var(--shadowHeavy)",
        padding: 28,
        color: "rgba(226,232,240,0.92)",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    panelTitle: {
        fontSize: 13,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "rgba(199,210,254,0.95)",
        fontWeight: 600,
    },
    closeBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.06)",
        color: "rgba(255,255,255,0.80)",
        cursor: "pointer",
        fontSize: 20,
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
        lineHeight: 1,
    },
    divider: {
        height: 1,
        margin: "18px 0",
        background: "rgba(255,255,255,0.07)",
    },
    setupBanner: {
        padding: "12px 16px",
        borderRadius: 14,
        background: "rgba(253,186,116,0.08)",
        border: "1px solid rgba(253,186,116,0.25)",
        fontSize: 12.5,
        color: "rgba(253,186,116,0.90)",
        lineHeight: 1.55,
        marginBottom: 20,
    },
    successWrap: {
        padding: "32px 0 8px",
        textAlign: "center",
        display: "grid",
        gap: 16,
        justifyItems: "center",
    },
    form: {
        display: "grid",
        gap: 18,
    },
    label: {
        fontSize: 13,
        fontWeight: 500,
        color: "rgba(148,163,184,0.95)",
        display: "grid",
        gap: 8,
    },
    input: {
        width: "100%",
        padding: "12px 14px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(2,6,23,0.50)",
        color: "rgba(226,232,240,0.92)",
        outline: "none",
        fontSize: 13.5,
        boxSizing: "border-box",
        fontFamily: "inherit",
    },
    tab: {
        padding: "10px 18px",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.06)",
        color: "rgba(226,232,240,0.80)",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 13,
    },
    get tabActive() {
        return {
            ...this.tab,
            background: "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(167,139,250,0.15))",
            border: "1px solid rgba(99,102,241,0.50)",
            color: "rgba(226,232,240,0.97)",
        };
    },
    helperText: {
        marginTop: 10,
        fontSize: 12.5,
        color: "rgba(148,163,184,0.80)",
        lineHeight: 1.55,
        paddingLeft: 2,
    },
    skillsBox: {
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.03)",
    },
    skillsLabel: {
        fontSize: 11,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        color: "rgba(199,210,254,0.70)",
        fontWeight: 600,
    },
    errorBox: {
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px solid rgba(239,68,68,0.30)",
        background: "rgba(239,68,68,0.08)",
        color: "rgba(252,165,165,0.95)",
        fontSize: 13,
        lineHeight: 1.55,
    },
    submitBtn: {
        flex: 1,
        textAlign: "center",
        padding: "14px 16px",
        borderRadius: 14,
        fontWeight: 700,
        fontSize: 14,
        background: "linear-gradient(135deg, rgba(99,102,241,0.85), rgba(167,139,250,0.45))",
        border: "1px solid rgba(99,102,241,0.50)",
        color: "white",
        cursor: "pointer",
        display: "block",
    },
    clearBtn: {
        width: 110,
        padding: "14px 16px",
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.05)",
        color: "rgba(226,232,240,0.80)",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 13,
    },
    fallbackLink: {
        fontSize: 12,
        color: "rgba(148,163,184,0.70)",
        textDecoration: "none",
        borderBottom: "1px solid rgba(148,163,184,0.20)",
        paddingBottom: 1,
    },
};
