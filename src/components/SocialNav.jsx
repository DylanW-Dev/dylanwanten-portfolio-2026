import { useState, useEffect } from "react";
import { socials } from "../data/section";

// TODO: replace with the actual path to your CV file in /public
const CV_PATH = "/cv.pdf";

const glass = {
    background: "rgba(2,6,23,0.55)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
};

// Opaque variant for mobile — readable over any background
const glassSolid = {
    background: "rgba(2,6,23,0.94)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
};

const iconSpan = {
    width: 20,
    height: 20,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, rgba(99,102,241,0.55), rgba(167,139,250,0.22))",
    border: "1px solid rgba(99,102,241,0.35)",
    fontSize: 12,
    color: "#fff",
};

const linkStyle = {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(226,232,240,0.92)",
    fontWeight: 700,
    fontSize: 13,
};

function MailButton({ onClick, count }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label="Open recruiter mail"
            style={{
                position: "relative",
                display: "grid",
                placeItems: "center",
                width: 42,
                height: 42,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.06)",
                cursor: "pointer",
                color: "rgba(226,232,240,0.92)",
                flexShrink: 0,
            }}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 7l10 7 10-7" />
            </svg>
            {count > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        minWidth: 16,
                        height: 16,
                        padding: "0 4px",
                        borderRadius: 999,
                        background: "rgba(99,102,241,0.95)",
                        color: "white",
                        fontSize: 10,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 700,
                        pointerEvents: "none",
                    }}
                >
                    {count}
                </div>
            )}
        </button>
    );
}

function SocialLink({ s, onClick }) {
    return (
        <a
            href={s.href}
            target={s.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={s.href.startsWith("mailto:") ? undefined : "noreferrer"}
            onClick={onClick}
            style={linkStyle}
            title={s.label}
        >
            <span style={iconSpan}>{s.icon}</span>
            <span style={{ opacity: 0.95 }}>{s.label}</span>
        </a>
    );
}

function CvDownload({ onClick }) {
    return (
        <a
            href={CV_PATH}
            download="CV.pdf"
            onClick={onClick}
            style={linkStyle}
            title="Download CV"
        >
            <span style={iconSpan}>↓</span>
            <span style={{ opacity: 0.95 }}>CV</span>
        </a>
    );
}

export default function SocialNav({ visible, onMailClick, selectedSkillsCount = 0, isFlipped, onFlip }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Desktop with no recruiter mode → nothing to show
    if (!visible && !isMobile) return null;

    if (isMobile) {
        return (
            <div
                className="anim-fadeUp"
                style={{ position: "fixed", top: 18, left: 18, zIndex: 130 }}
                role="navigation"
                aria-label="Social links"
            >
                {/* Top row: burger (recruiter only) + mail (recruiter only) + flip (always) */}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {visible && (
                        <button
                            type="button"
                            aria-label={menuOpen ? "Close menu" : "Open social links"}
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((o) => !o)}
                            style={{
                                ...glassSolid,
                                width: 42,
                                height: 42,
                                borderRadius: 14,
                                display: "grid",
                                placeItems: "center",
                                cursor: "pointer",
                                color: "rgba(255,255,255,0.92)",
                            }}
                        >
                            {menuOpen ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M3 6h18M3 12h18M3 18h18" />
                                </svg>
                            )}
                        </button>
                    )}

                    {visible && (
                        <div style={{ ...glassSolid, borderRadius: 14, padding: 0 }}>
                            <MailButton onClick={onMailClick} count={selectedSkillsCount} />
                        </div>
                    )}

                    {/* Flip button — always visible on mobile */}
                    <button
                        type="button"
                        onClick={onFlip}
                        aria-label={isFlipped ? "Show CV" : "Show certificates"}
                        style={{
                            ...glassSolid,
                            width: 42,
                            height: 42,
                            borderRadius: 14,
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer",
                            color: isFlipped ? "rgba(199,210,254,0.95)" : "rgba(255,255,255,0.92)",
                        }}
                    >
                        {isFlipped ? (
                            /* Back arrow — return to CV front */
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <path d="M10 9l-4 3 4 3" />
                                <path d="M6 12h8" />
                            </svg>
                        ) : (
                            /* Forward arrow — flip to certificates */
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <path d="M14 9l4 3-4 3" />
                                <path d="M18 12h-8" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Dropdown — recruiter mode only */}
                {visible && menuOpen && (
                    <div
                        style={{
                            ...glassSolid,
                            position: "absolute",
                            top: "calc(100% + 8px)",
                            left: 0,
                            padding: 10,
                            borderRadius: 16,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            minWidth: 190,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 12,
                                letterSpacing: "0.10em",
                                textTransform: "uppercase",
                                color: "rgba(199,210,254,0.95)",
                                paddingLeft: 4,
                                marginBottom: 2,
                            }}
                        >
                            Connect
                        </div>
                        {socials.map((s) => (
                            <SocialLink key={s.label} s={s} onClick={() => setMenuOpen(false)} />
                        ))}
                        <CvDownload onClick={() => setMenuOpen(false)} />
                    </div>
                )}
            </div>
        );
    }

    // Desktop layout
    return (
        <div
            className="anim-fadeUp"
            style={{
                position: "fixed",
                top: 18,
                left: 18,
                zIndex: 130,
                padding: 10,
                borderRadius: 16,
                ...glass,
                display: "flex",
                gap: 8,
                alignItems: "center",
            }}
            role="navigation"
            aria-label="Social links"
        >
            <div
                style={{
                    fontSize: 12,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    color: "rgba(199,210,254,0.95)",
                    marginRight: 6,
                }}
            >
                Connect
            </div>

            {socials.map((s) => (
                <SocialLink key={s.label} s={s} />
            ))}

            <CvDownload />

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.12)", margin: "0 2px" }} />

            {/* Mail button */}
            <MailButton onClick={onMailClick} count={selectedSkillsCount} />
        </div>
    );
}
