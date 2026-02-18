import { useEffect, useMemo, useRef, useState } from "react";
import { sections, certificates } from "../data/section";
import { usePortfolio } from "../context/PortfolioContext";

import ModeToggle from "./ModeToggle";
import CVPanel from "./CVPanel";
import FloatingCard from "./FloatingCard";
import ArrowLayer from "./ArrowLayer";
import CertificateModal from "./CertificateModal";
import CheckoutModal from "./CheckoutModal";
import SocialNav from "./SocialNav";

export default function PortfolioLayout() {
    const { mode, toggleSkill, selectedSkills, isFlipped, setIsFlipped } = usePortfolio();

    // MULTI OPEN: openKeys is an array of section keys in open order
    const [openKeys, setOpenKeys] = useState([]);
    // cardRects map: { [key]: {x,y,w,h} }
    const [cardRects, setCardRects] = useState({});
    const [activeCert, setActiveCert] = useState(null);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    const rowRefs = useRef({});
    const sectionEntries = useMemo(() => Object.entries(sections), []);
    const isRecruiter = mode === "recruiter";

    const modalOpen = Boolean(activeCert) || checkoutOpen;

    const closeSectionCard = (key) => {
        setOpenKeys((prev) => prev.filter((k) => k !== key));
        setCardRects((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const closeAllCards = () => {
        setOpenKeys([]);
        setCardRects({});
    };

    // auto-close section cards + certificate modal + checkout on flip
    useEffect(() => {
        closeAllCards();
        setActiveCert(null);
        setCheckoutOpen(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFlipped]);

    const placeCard = (key, index) => {
        const el = rowRefs.current[key];
        const w = Math.min(440, window.innerWidth - 24);
        const h = 380;

        // On mobile: stack cards centered at the top
        if (window.innerWidth < 640) {
            const x = Math.max(0, Math.floor((window.innerWidth - w) / 2));
            const y = Math.max(80, 80 + index * (h + 12));
            return { x, y, w, h };
        }

        // Desktop: alternate left / right of the CV
        const gap = 26;
        const preferRight = index % 2 === 0;

        let baseY = 170;
        if (el) {
            const r = el.getBoundingClientRect();
            baseY = r.top - 40;
        }

        const stackSlot = Math.floor(index / 2);
        const stackedY = baseY + stackSlot * (h + 18);
        const y = Math.max(12, Math.min(stackedY, window.innerHeight - h - 12));

        const cvCenterX = window.innerWidth / 2;
        let xRight = Math.min(window.innerWidth - w - 12, cvCenterX + 330);
        let xLeft = Math.max(12, cvCenterX - 330 - w);

        void gap;

        const x = preferRight ? xRight : xLeft;
        return { x, y, w, h };
    };

    const onSectionClick = (key) => {
        // Optional: if modal open, don't open cards behind it
        if (modalOpen) return;

        setOpenKeys((prev) => {
            if (prev.includes(key)) return prev; // already open (keep it)
            const next = [...prev, key];

            // ensure we create an initial rect immediately for arrow + card placement
            setCardRects((rects) => ({
                ...rects,
                [key]: placeCard(key, next.length - 1),
            }));

            return next;
        });
    };

    const onRectChange = (key, rect) => {
        setCardRects((prev) => ({ ...prev, [key]: rect }));
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                padding: 24,
                paddingTop: 90,
                perspective: "1500px",
            }}
        >
            <ModeToggle />
            <SocialNav visible={isRecruiter} onMailClick={() => setCheckoutOpen(true)} selectedSkillsCount={selectedSkills.length} />

            {/* Flip button */}
            <button
                onClick={() => setIsFlipped((f) => !f)}
                style={{
                    position: "fixed",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 160,
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
                    gap: 8,
                    whiteSpace: "nowrap",
                }}
            >
                <span style={{ opacity: 0.9 }}>{isFlipped ? "Show CV" : "Flip page"}</span>
                <span style={{ color: "rgba(199,210,254,0.95)" }}>↻</span>
            </button>

            {/* CV Panel */}
            <CVPanel
                isFlipped={isFlipped}
                disabled={modalOpen}   // ✅ critical fix
                childrenFront={
                    <div>
                        <div style={{ borderBottom: "1px solid rgba(15,23,42,0.10)", paddingBottom: 18, marginBottom: 22 }}>
                            <div style={{ fontSize: 30, fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                                Your Name
                            </div>
                            <div style={{ marginTop: 6, color: "var(--muted)", fontSize: 14 }}>
                                React Front-End Developer
                            </div>
                            <div style={{ marginTop: 10, fontSize: 12.5, color: "rgba(15,23,42,0.60)" }}>
                                Drag background to rotate • Click sections to open multiple cards
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: 14 }}>
                            {sectionEntries.map(([key, s]) => {
                                const active = openKeys.includes(key);

                                return (
                                    <button
                                        key={key}
                                        ref={(el) => (rowRefs.current[key] = el)}
                                        type="button"
                                        onClick={() => onSectionClick(key)}
                                        style={{
                                            textAlign: "left",
                                            width: "100%",
                                            borderRadius: 16,
                                            border: "1px solid rgba(15,23,42,0.10)",
                                            background: active
                                                ? "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(167,139,250,0.08))"
                                                : "rgba(255,255,255,0.78)",
                                            padding: "20px 18px",
                                            cursor: "pointer",
                                            boxShadow: active ? "0 10px 30px rgba(99,102,241,0.12)" : "none",
                                        }}
                                        aria-expanded={active}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                                            <div>
                                                <div style={{ color: "var(--ink)", fontWeight: 750, fontSize: 15 }}>
                                                    {s.label}
                                                    {isRecruiter && key === "skills" ? (
                                                        <span style={{ marginLeft: 10, fontSize: 11, color: "rgba(99,102,241,0.9)" }}>
                                                            (selectable)
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div style={{ marginTop: 5, fontSize: 13, color: "rgba(15,23,42,0.55)" }}>{s.sub}</div>
                                            </div>

                                            <div style={{ color: active ? "rgba(99,102,241,0.95)" : "rgba(15,23,42,0.35)", fontSize: 16 }}>
                                                {active ? "●" : "›"}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {isRecruiter ? (
                            <div style={{ marginTop: 18, fontSize: 12.5, color: "rgba(15,23,42,0.55)" }}>
                                Recruiter Mode: select skills in the Skills card → use the mail icon to contact.
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
                        <div style={{ borderBottom: "1px solid rgba(15,23,42,0.10)", paddingBottom: 18, marginBottom: 22 }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)" }}>Certificates</div>
                            <div style={{ marginTop: 6, color: "rgba(15,23,42,0.55)", fontSize: 13.5 }}>
                                Click to preview in holographic frame.
                            </div>
                        </div>

                        <div style={{ display: "grid", gap: 12 }}>
                            {certificates.map((c) => (
                                <button
                                    key={c.title}
                                    type="button"
                                    onClick={() => setActiveCert(c)}
                                    style={{
                                        textAlign: "left",
                                        width: "100%",
                                        borderRadius: 16,
                                        border: "1px solid rgba(15,23,42,0.10)",
                                        background: "rgba(255,255,255,0.78)",
                                        padding: "18px 16px",
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

            {/* ARROWS: one per open card */}
            {openKeys.map((key) => {
                const rect = cardRects[key];
                const rowEl = rowRefs.current[key];
                if (!rect || !rowEl) return null;
                return <ArrowLayer key={`arrow-${key}`} fromEl={rowEl} cardRect={rect} id={key} />;
            })}

            {/* CARDS: multiple open at once */}
            {openKeys.map((key) => {
                const rect = cardRects[key];
                if (!rect) return null;

                const s = sections[key];

                return (
                    <FloatingCard
                        key={`card-${key}`}
                        title={s.label}
                        initial={{ x: rect.x, y: rect.y }}
                        onClose={() => closeSectionCard(key)}
                        onRectChange={(r) => onRectChange(key, r)}
                        disabled={modalOpen} // ✅ recommended to prevent pointer capture conflicts
                    >
                        {key === "skills" ? (
                            <div>
                                <div style={{ fontSize: 12.5, color: "rgba(148,163,184,0.92)", marginBottom: 10 }}>
                                    {isRecruiter ? "Click to add/remove skills → then use the mail icon to contact." : "Skills overview."}
                                </div>

                                <div style={{ fontSize: 12, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(199,210,254,0.95)", marginBottom: 8 }}>
                                    Technical
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                                    {s.content.technical.map((skill) => {
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
                                    {s.content.soft.map((skill) => (
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
                        ) : key === "info" ? (
                            <div>
                                <div style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 6 }}>{s.content.name}</div>
                                <div style={{ color: "rgba(199,210,254,0.90)", marginBottom: 10 }}>{s.content.role}</div>
                                <div style={{ color: "rgba(226,232,240,0.86)", marginBottom: 12 }}>{s.content.bio}</div>
                                <div style={{ display: "grid", gap: 8, fontSize: 13 }}>
                                    <div>📧 {s.content.email}</div>
                                    <div>📍 {s.content.location}</div>
                                </div>
                            </div>
                        ) : key === "education" ? (
                            <div style={{ display: "grid", gap: 12 }}>
                                {s.content.items.map((it) => (
                                    <div key={it.title} style={{ padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        <div style={{ fontWeight: 800 }}>{it.title}</div>
                                        <div style={{ color: "rgba(148,163,184,0.92)", marginTop: 4, fontSize: 12.5 }}>{it.meta}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: "grid", gap: 12 }}>
                                {s.content.items.map((it) => (
                                    <div key={it.title} style={{ padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                                        <div style={{ fontWeight: 800 }}>{it.title}</div>
                                        <div style={{ color: "rgba(148,163,184,0.92)", marginTop: 4, fontSize: 12.5 }}>{it.meta}</div>
                                        <ul style={{ marginTop: 10, paddingLeft: 18, color: "rgba(226,232,240,0.88)" }}>
                                            {it.bullets.map((b) => (
                                                <li key={b} style={{ marginBottom: 6 }}>
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </FloatingCard>
                );
            })}

            {/* certificate modal */}
            {activeCert ? <CertificateModal certificate={activeCert} onClose={() => setActiveCert(null)} /> : null}

            {/* checkout modal */}
            {checkoutOpen ? <CheckoutModal onClose={() => setCheckoutOpen(false)} /> : null}
        </div>
    );
}
