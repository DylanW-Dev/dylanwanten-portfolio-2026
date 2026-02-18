import { useEffect, useMemo, useRef, useState } from "react";
import { sections, certificates } from "../data/section";
import { usePortfolio } from "../context/PortfolioContext";

import ModeToggle from "./ModeToggle";
import RecruiterPanel from "./RecruiterPanel";
import CVPanel from "./CVPanel";
import FloatingCard from "./FloatingCard";
import ArrowLayer from "./ArrowLayer";
import CertificateModal from "./CertificateModal";
import CartButton from "./CartButton";
import CheckoutModal from "./CheckoutModal";

export default function PortfolioLayout() {
    const { mode, toggleSkill, selectedSkills, isFlipped, setIsFlipped } = usePortfolio();

    const [openKey, setOpenKey] = useState(null);
    const [cardRect, setCardRect] = useState(null);
    const [activeCert, setActiveCert] = useState(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const rowRefs = useRef({});
    const sectionEntries = useMemo(() => Object.entries(sections), []);
    const openSection = openKey ? sections[openKey] : null;

    const closeCard = () => {
        setOpenKey(null);
        setCardRect(null);
    };

    const placeCardNearRow = (key) => {
        const el = rowRefs.current[key];
        const w = 440, h = 360, gap = 24;

        if (!el) return { x: Math.min(window.innerWidth - (w + 12), 760), y: 170, w, h };

        const r = el.getBoundingClientRect();
        const rightX = r.right + gap;
        const leftX = r.left - gap - w;

        const x = rightX + w < window.innerWidth - 12 ? rightX : Math.max(12, leftX);
        const y = Math.max(12, Math.min(r.top - 40, window.innerHeight - h - 12));
        return { x, y, w, h };
    };

    const onSectionClick = (key) => {
        setOpenKey(key);
        setCardRect(placeCardNearRow(key));
    };

    // ✅ auto-close section card + certificate modal when flipping
    useEffect(() => {
        closeCard();
        setActiveCert(null);
        setCheckoutOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFlipped]);

    const isRecruiter = mode === "recruiter";

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                padding: 24,
                perspective: "1500px",
            }}
        >
            <ModeToggle />
            <RecruiterPanel />

            {/* Flip button */}
            <button
                onClick={() => setIsFlipped((f) => !f)}
                style={{
                    position: "fixed",
                    bottom: 18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 110,
                    padding: "10px 16px",
                    borderRadius: 999,
                    cursor: "pointer",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(2,6,23,0.55)",
                    backdropFilter: "blur(12px)",
                    color: "rgba(255,255,255,0.92)",
                    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span style={{ opacity: 0.9 }}>{isFlipped ? "Show CV" : "Flip page"}</span>
                <span style={{ color: "rgba(199,210,254,0.95)" }}>↻</span>
            </button>

            {/* Cart button (recruiter only) */}
            <CartButton onClick={() => setCheckoutOpen(true)} />

            {/* CV Panel */}
            <CVPanel
                isFlipped={isFlipped}
                childrenFront={
                    <div>
                        <div style={{ borderBottom: "1px solid rgba(15,23,42,0.10)", paddingBottom: 14, marginBottom: 18 }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                                Your Name
                            </div>
                            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 14 }}>
                                React Front-End Developer
                            </div>
                            <div style={{ marginTop: 10, fontSize: 12.5, color: "rgba(15,23,42,0.60)" }}>
                                Drag paper background to rotate • Click sections for details
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: 10 }}>
                            {sectionEntries.map(([key, s]) => {
                                const active = openKey === key;

                                return (
                                    <button
                                        key={key}
                                        ref={(el) => (rowRefs.current[key] = el)}
                                        type="button"
                                        onClick={() => onSectionClick(key)}
                                        style={{
                                            textAlign: "left",
                                            width: "100%",
                                            borderRadius: 14,
                                            border: "1px solid rgba(15,23,42,0.10)",
                                            background: active
                                                ? "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(167,139,250,0.08))"
                                                : "rgba(255,255,255,0.78)",
                                            padding: "14px 14px",
                                            cursor: "pointer",
                                            transition: "transform 120ms ease, box-shadow 120ms ease, background 120ms ease",
                                            boxShadow: active ? "0 10px 30px rgba(99,102,241,0.12)" : "none",
                                            outline: "none",
                                        }}
                                        aria-expanded={active}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                                            <div>
                                                <div style={{ color: "var(--ink)", fontWeight: 750, fontSize: 14 }}>
                                                    {s.label}
                                                    {isRecruiter && key === "skills" ? (
                                                        <span style={{ marginLeft: 10, fontSize: 11, color: "rgba(99,102,241,0.9)" }}>
                                                            (tap to select)
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div style={{ marginTop: 4, fontSize: 12.5, color: "rgba(15,23,42,0.55)" }}>{s.sub}</div>
                                            </div>
                                            <div style={{ color: active ? "rgba(99,102,241,0.95)" : "rgba(15,23,42,0.35)", fontSize: 16 }}>
                                                ›
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {isRecruiter ? (
                            <div style={{ marginTop: 18, fontSize: 12.5, color: "rgba(15,23,42,0.55)" }}>
                                Recruiter Mode: select skills, then use the cart to email me.
                                {selectedSkills.length > 0 ? (
                                    <span style={{ marginLeft: 10, color: "rgba(99,102,241,0.95)", fontWeight: 800 }}>
                                        Selected: {selectedSkills.length}
                                    </span>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                }
                childrenBack={
                    <div>
                        <div style={{ borderBottom: "1px solid rgba(15,23,42,0.10)", paddingBottom: 14, marginBottom: 18 }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)" }}>Certificates</div>
                            <div style={{ marginTop: 6, color: "rgba(15,23,42,0.55)", fontSize: 13.5 }}>
                                Click to preview in holographic frame.
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: 10 }}>
                            {certificates.map((c) => (
                                <button
                                    key={c.title}
                                    type="button"
                                    onClick={() => setActiveCert(c)}
                                    style={{
                                        textAlign: "left",
                                        width: "100%",
                                        borderRadius: 14,
                                        border: "1px solid rgba(15,23,42,0.10)",
                                        background: "rgba(255,255,255,0.78)",
                                        padding: "14px 14px",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ color: "var(--ink)", fontWeight: 750, fontSize: 14 }}>{c.title}</div>
                                    <div style={{ marginTop: 4, fontSize: 12.5, color: "rgba(15,23,42,0.55)" }}>{c.issuer}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                }
            />

            {/* Arrow tracking */}
            {openKey && cardRect && rowRefs.current[openKey] ? (
                <ArrowLayer
                    fromEl={rowRefs.current[openKey]}
                    cardRect={cardRect}
                    visibleKey={`${openKey}-${Math.round(cardRect.x)}-${Math.round(cardRect.y)}`}
                />
            ) : null}

            {/* Floating card */}
            {openSection && cardRect ? (
                <FloatingCard
                    title={openSection.label}
                    initial={{ x: cardRect.x, y: cardRect.y }}
                    onClose={closeCard}
                    onRectChange={setCardRect}
                >
                    {openKey === "skills" ? (
                        <div>
                            <div style={{ fontSize: 12.5, color: "rgba(148,163,184,0.92)", marginBottom: 10 }}>
                                {isRecruiter ? "Click to add/remove skills → then use the cart." : "Skills overview."}
                            </div>

                            <div style={{ fontSize: 12, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(199,210,254,0.95)", marginBottom: 8 }}>
                                Technical
                            </div>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                                {openSection.content.technical.map((skill) => {
                                    const selected = selectedSkills.includes(skill);
                                    return (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => isRecruiter && toggleSkill(skill)}
                                            style={{
                                                borderRadius: 999,
                                                padding: "8px 10px",
                                                fontSize: 12.5,
                                                cursor: isRecruiter ? "pointer" : "default",
                                                border: selected ? "1px solid rgba(99,102,241,0.65)" : "1px solid rgba(255,255,255,0.10)",
                                                background: selected
                                                    ? "linear-gradient(135deg, rgba(99,102,241,0.70), rgba(167,139,250,0.28))"
                                                    : "rgba(255,255,255,0.06)",
                                                color: selected ? "#fff" : "rgba(226,232,240,0.92)",
                                            }}
                                            title={isRecruiter ? "Select skill" : undefined}
                                        >
                                            {skill}
                                        </button>
                                    );
                                })}
                            </div>

                            <div style={{ fontSize: 12, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(199,210,254,0.95)", marginBottom: 8 }}>
                                Soft
                            </div>

                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {openSection.content.soft.map((skill) => (
                                    <span
                                        key={skill}
                                        style={{
                                            borderRadius: 999,
                                            padding: "8px 10px",
                                            fontSize: 12.5,
                                            border: "1px solid rgba(255,255,255,0.10)",
                                            background: "rgba(255,255,255,0.06)",
                                            color: "rgba(226,232,240,0.90)",
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : openKey === "info" ? (
                        <div>
                            <div style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>{openSection.content.name}</div>
                            <div style={{ color: "rgba(199,210,254,0.90)", marginBottom: 10 }}>{openSection.content.role}</div>
                            <div style={{ color: "rgba(226,232,240,0.86)", marginBottom: 12 }}>{openSection.content.bio}</div>
                            <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
                                <div>📧 {openSection.content.email}</div>
                                <div>📍 {openSection.content.location}</div>
                            </div>
                        </div>
                    ) : openKey === "education" ? (
                        <div style={{ display: "grid", gap: 10 }}>
                            {openSection.content.items.map((it) => (
                                <div key={it.title} style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <div style={{ fontWeight: 800 }}>{it.title}</div>
                                    <div style={{ color: "rgba(148,163,184,0.92)", marginTop: 4, fontSize: 12.5 }}>{it.meta}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: "grid", gap: 12 }}>
                            {openSection.content.items.map((it) => (
                                <div key={it.title} style={{ padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                    <div style={{ fontWeight: 800 }}>{it.title}</div>
                                    <div style={{ color: "rgba(148,163,184,0.92)", marginTop: 4, fontSize: 12.5 }}>{it.meta}</div>
                                    <ul style={{ marginTop: 10, paddingLeft: 18, color: "rgba(226,232,240,0.88)" }}>
                                        {it.bullets.map((b) => (
                                            <li key={b} style={{ marginBottom: 6 }}>{b}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </FloatingCard>
            ) : null}

            {/* Certificate modal */}
            {activeCert ? <CertificateModal certificate={activeCert} onClose={() => setActiveCert(null)} /> : null}

            {/* Checkout modal */}
            {checkoutOpen ? <CheckoutModal onClose={() => setCheckoutOpen(false)} /> : null}
        </div>
    );
}
