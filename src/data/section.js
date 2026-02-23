import screenshotIMG from "../assets/screenshot.png";

export const sections = {
    info: {
        label: "Personal Info",
        sub: "Contact & Bio",
        content: {
            name: "Dylan Wanten",
            role: ["React Front-End Developer", "Node.js Back-End Developer", "Full-Stack Developer"],
            email: "dylan.wanten.dev@gmail.com",
            location: "Brussels, Belgium",
            availability: "Open to remote opportunities worldwide",
            bio: "I build clean, interactive interfaces with React. I care about usability, accessibility, and UI polish.",
        },
    },

    education: {
        label: "Education",
        sub: "Training & Background",
        content: {
            items: [
                { title: "Meta Front-End Developer Professional Certificate", meta: "Coursera • 2025" },
                { title: "Google Cybersecurity Professional Certificate", meta: "Coursera • 2025" },
                { title: "Full-Stack Developer Bootcamp : Dr Angela Yu.", meta: "Udemy • 2023" },
                { title: "Bachelor in Business Administration / Ku Leuven", meta: "2020 – 2024 (Graduation Pending)" },
                { title: "High School Diploma, Specialization in Computer Science / Institut Diderot", meta: "2012 – 2017" },
            ],
        },
    },

    skills: {
        label: "Skills",
        sub: "Click to explore",
        content: {
            technical: [
                "HTML",
                "React",
                "JavaScript",
                "TypeScript",
                "Hooks",
                "Context API",
                "React Router",
                "APIs",
                "Forms & Validation",
                "Accessibility",
                "Testing (RTL/Jest)",
                "Tailwind / CSS",
                "Git",
                "Debugging",
                "Unit Testing",
                "User Interface and User Experience (UI/UX) Design",
                "User Research",
                "Web Content Accessibility Guidelines",
                "User Interface (UI)",
                "Usability",
                "Pseudocode",
                "Software Versioning",
                "Event-Driven Programming",
                "User Experience",
                "User Experience Design",
                "Software Visualization",
                "Design Research",
                "Linux Commands",
                "Application Programming Interface (API)",
            ],
            soft: ["Communication", "Collaboration", "Problem Solving", "Adaptability"],
        },
    },

    Tools: {
        label: "Tools",
        sub: "Familiar With",
        content: {
            development: [
                "Postman",
                "",],
            databases: [
                "MongoDB",
                "MySQL",
                "PostgreSQL",
                "SQLite",
            ],
            versionControl: [
                "Git",
                "GitHub",
            ],
            deployment: [
                "Vercel",
                "Heroku",
                "AWS",
            ],
            testing: [
                "Jest",
                "React Testing Library",
            ],
            design_and_analytics: [
                "Figma (Wireframing & Prototyping)",
                "Google Analytics",
                "SEO Tools (Yoast)",
                "Responsive UI/UX Design",
            ],
        },
    },

    work: {
        label: "Work Experience",
        sub: "Projects & Roles",
        content: {
            items: [
                {
                    title: "Front-End Developer",
                    meta: "Company • 2024 – Present",
                    bullets: [
                        "Built responsive UI components and reusable patterns.",
                        "Integrated APIs with loading/error states and caching strategies.",
                        "Collaborated with designers to ship polished UI quickly.",
                    ],
                },
            ],
        },
    },
};

export const certificates = [
    {
        title: "Meta Front-End Developer Professional Certificate",
        issuer: "Coursera / Meta",
        image: screenshotIMG,
        link: "#",
    },
    {
        title: "Advanced React",
        issuer: "Coursera / Meta",
        image: "/certificate-placeholder.png",
        link: "#",
    },
    {
        title: "Version Control",
        issuer: "Coursera / Meta",
        image: "/certificate-placeholder.png",
        link: "#",
    },
    {
        title: "Version Control",
        issuer: "Coursera / Meta",
        image: "/certificate-placeholder.png",
        link: "#",
    },
];

export const socials = [
    { label: "LinkedIn", href: "#", icon: "in" },
    { label: "GitHub", href: "#", icon: "gh" },
    { label: "Projects", href: "#", icon: "↗" },
];
