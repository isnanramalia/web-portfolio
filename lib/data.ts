export const education = [
  {
    degree: "Bachelor of Computer Science",
    institution: "Dian Nuswantoro University",
    period: "2022 - expected 2026",
    description: "Focused on Software Engineering and Web Development",
  },
];

export const socialMedia = [
  {
    name: "GitHub",
    url: "https://github.com/isnanramalia",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/isnanramalia",
    icon: "linkedin",
  },
  {
    name: "Medium",
    url: "https://medium.com/@isnanramalia",
    icon: "medium",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/isnanramalia/",
    icon: "instagram",
  },
];

export interface WorkRole {
  title: string;
  period: string;
  shortDescription: string;
  fullDescription: string;
}

export interface WorkExperience {
  company: string;
  logo: string;
  website: string;
  roles: WorkRole[];
}

export const workExperience: WorkExperience[] = [
  {
    company: "SRLand Properties",
    logo: "/logo/srland.png",
    website: "https://srland.id/",
    roles: [
      {
        title: "Full Stack Developer (Internship)",
        period: "Nov 2025 - Feb 2026",
        shortDescription:
          "Developed internal CMS features including face recognition attendance, overtime tracking, leave requests, and leasing plan management.",
        fullDescription: `At SRLand Properties, I collaborated with my manager to develop and enhance the company's internal CMS platform. My key contributions included:
  • Building an HRIS attendance feature with face recognition for employee clock-in/out
  • Developing overtime calculation logic based on actual clock-out time records
  • Implementing a leave request module for employee absence and permission management
  • Creating a leasing plan feature with full CRUD functionality and statistical dashboards for the leasing team`,
      },
    ],
  },
  {
    company: "Teknik Elektro – Universitas Dian Nuswantoro",
    logo: "/logo/udinus.png",
    website: "https://elektro.dinus.ac.id",
    roles: [
      {
        title: "Full Stack Developer",
        period: "Oct 2025 - Nov 2025",
        shortDescription:
          "Led full stack development of SICAPA, an academic grading system based on CPL and CPMK frameworks.",
        fullDescription: `As a Full Stack Developer, I led the end-to-end development of SICAPA — an academic measurement platform for the Electrical Engineering department. My contributions included:
  • Leading the brainstorming and system planning process from ideation to delivery
  • Designing the Entity Relationship Diagram (ERD) and system architecture
  • Creating UI/UX wireframes in Figma to align the team before development
  • Developing the full stack application using Laravel, React.js, and Tailwind CSS
  • Building role-based access for Kaprodi, Koordinator, and Dosen
  • Implementing CPL and CPMK mapping per course and grade component
  • Developing weighted grade calculation across Tugas & Quiz, UTS, UAS, and Praktikum
  • Delivering rekap nilai per CPMK and CPL with class average overview and CSV export`,
      },
    ],
  },
  {
    company: "Leolit Games",
    logo: "/logo/leolit-games.png",
    website: "https://leolitgames.com",
    roles: [
      {
        title: "Frontend Web Developer (Internship)",
        period: "Jan 2025 - May 2025",
        shortDescription:
          "Developed a responsive and modern company profile website using Next.js and Tailwind.",
        fullDescription: `At Leolit Games, I worked as a Frontend Developer to build the company's official profile website. My key responsibilities included:

• Developing the company profile website with Next.js, Tailwind CSS, Bun, ShadCN, and Framer Motion
• Focusing on frontend development with server components for clean, fast, and SEO-friendly output
• Collaborating with the backend developer to integrate APIs and ensure smooth data handling
• Implementing modern animations and interactions to create an engaging user experience`,
      },
    ],
  },
  {
    company: "Bengkel Koding",
    logo: "/logo/bengkelkoding.png",
    website: "https://bengkelkoding.dinus.id/",
    roles: [
      {
        title: "Frontend Web Developer",
        period: "Jan 2025 - Jul 2025",
        shortDescription:
          "Built the alumni website for the Computer Science program at Dian Nuswantoro University.",
        fullDescription: `As a Frontend Developer intern at Bengkel Koding, I developed the "Website for Computer Science Alumni" project. This platform was built to manage alumni data and support accreditation needs. My contributions included:

• Developing the alumni website using Next.js, Tailwind CSS, Laravel, and ShadCN
• Building responsive UI and implementing reusable components for scalability
• Collaborating with backend developers to integrate APIs and manage alumni data effectively
• Optimizing frontend performance to deliver fast load times and seamless user experience
• Supporting features such as alumni CV generation, job postings, and alumni tracking`,
      },
      {
        title: "Web Developer Teaching Assistant – Bimbingan Karir",
        period: "May 2025 - Jul 2025",
        shortDescription:
          "Mentored students in building a hospital appointment system as part of a project-based learning program.",
        fullDescription: `As a teaching assistant, I supported students in developing a hospital appointment system project. My responsibilities included:

• Mentoring 25 students in frontend development using React.js
• Conducting code reviews and providing feedback to improve project quality
• Assisting in evaluating assignments and offering technical guidance in debugging and deployment`,
      },
      {
        title: "Web Developer Teaching Assistant",
        period: "Feb 2025 - Jul 2025",
        shortDescription:
          "Guided students in building a digital polyclinic system project and provided technical assistance.",
        fullDescription: `As a teaching assistant, I collaborated with a team to guide students in developing a digital polyclinic system. My contributions included:

• Supporting 24 students in small teams to build web applications
• Assisting in frontend design and integration with backend systems
• Providing technical support on coding practices, debugging, and project documentation`,
      },
    ],
  },
];

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  credentialId?: string;
  logoUrl?: string;
  category: "qa" | "frontend" | "design" | "other";
}

const BOARD_INFINITY_LOGO =
  "https://coursera-university-assets.s3.amazonaws.com/57/ffbfe7f4734ca18bf05a41df254dc9/Frame-11-2-.png";
const IBM_LOGO =
  "https://static.vecteezy.com/system/resources/previews/021/514/722/non_2x/ibm-brand-symbol-software-computer-logo-design-illustration-free-vector.jpg";
const NVIDIA_LOGO =
  "https://iprsoftwaremedia.com/219/files/202512/692f50553d6332b453bbc5c2_nvidia-logo-vert-blk/nvidia-logo-vert-blk_thmb.png";

export const certificates: Certificate[] = [
  {
    title: "Practical Software Testing",
    issuer: "Board Infinity",
    date: "Apr 2026",
    category: "qa",
    logoUrl: BOARD_INFINITY_LOGO,
    credentialId: "CTXRVA6K4EG6",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/CTXRVA6K4EG6",
  },
  {
    title: "Advanced Quality and Capstone Project",
    issuer: "Board Infinity",
    date: "Mar 2026",
    category: "qa",
    logoUrl: BOARD_INFINITY_LOGO,
    credentialId: "31RJZ9KFTVY1",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/31RJZ9KFTVY1",
  },
  {
    title: "Automation and Modern Testing Tools",
    issuer: "Board Infinity",
    date: "Mar 2026",
    category: "qa",
    logoUrl: BOARD_INFINITY_LOGO,
    credentialId: "9UY7WZLUQFVN",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/9UY7WZLUQFVN",
  },
  {
    title: "Introduction to Software Quality Assurance",
    issuer: "Board Infinity",
    date: "Mar 2026",
    category: "qa",
    logoUrl: BOARD_INFINITY_LOGO,
    credentialId: "1FMZKBH1UIEW",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/1FMZKBH1UIEW",
  },
  {
    title: "Developing Front-End Apps with React",
    issuer: "IBM",
    date: "Jan 2025",
    category: "frontend",
    logoUrl: IBM_LOGO,
    credentialId: "9KU8K3JTHH3A",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/9KU8K3JTHH3A",
  },
  {
    title: "Getting Started with Deep Learning",
    issuer: "NVIDIA",
    date: "Jan 2024",
    category: "other",
    logoUrl: NVIDIA_LOGO,
    credentialId: "M0S7oiZMQcO9R966P9O6-Q",
    credentialUrl:
      "https://learn.nvidia.com/certificates?id=M0S7oiZMQcO9R966P9O6-Q",
  },
];

export const skillsData = [
  {
    name: "React",
    logo: "/icons/react.png",
  },
  {
    name: "Next.js",
    logo: "/icons/next-js.svg",
  },
  {
    name: "TypeScript",
    logo: "/icons/typescript.png",
  },
  {
    name: "JavaScript",
    logo: "/icons/javascript.png",
  },
  {
    name: "Tailwind CSS",
    logo: "/icons/tailwind.png",
  },
  {
    name: "Bootstrap",
    logo: "/icons/bootstrap.png",
  },
  {
    name: "Laravel",
    logo: "/icons/laravel.png",
  },
  {
    name: "PHP",
    logo: "/icons/php.png",
  },
  {
    name: "MySQL",
    logo: "/icons/mysql.webp",
  },
  {
    name: "Postgres",
    logo: "/icons/postgres.png",
  },
  {
    name: "CodeIgniter",
    logo: "/icons/codeigniter.png",
  },
  {
    name: "Python",
    logo: "/icons/python.png",
  },
];

export type ProjectCategory = "web" | "mobile" | "qa";

export interface Project {
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  techStack: string[];
  features?: string[];
  githubFe?: string;
  githubBe?: string;
  website?: string;
  category: ProjectCategory;
}

export const projects: Project[] = [
  {
    title: "Website for Computer Science Alumni",
    description:
      "A web platform for alumni of Dian Nuswantoro University's IT program, providing CV generation, job postings, and alumni tracking.",
    longDescription:
      "The Alumni Website is a sub-application of the School of Information Technology at Dian Nuswantoro University. It is designed to track alumni data for accreditation purposes, while also giving alumni benefits such as CV generation and access to job postings. Built with Next.js, Laravel, Tailwind CSS, and ShadCN, the website features a responsive interface, role-based access, and seamless integration with the backend.",
    image: "/project/alumni.png",
    techStack: ["Next.js", "Laravel", "Tailwind CSS", "ShadCN"],
    features: [
      "Alumni CV generation system",
      "Job posting and application module",
      "Alumni tracking dashboard for coordinators",
      "Role-based access for alumni, students, partners, and coordinators",
      "Responsive and accessible UI design",
    ],
    website: "https://dev-sti.dinus.id/alumni",
    category: "web",
  },
  {
    title: "Leolit Games - Company Profile Website",
    description:
      "A modern and responsive company profile website for Leolit Games, showcasing services, games, and company updates.",
    longDescription:
      "The Leolit Games Company Profile Website was built to present the company's identity, portfolio, and services in a professional and engaging way. Using Next.js with server components, Tailwind CSS, Bun, ShadCN, and Framer Motion, the website delivers a clean, fast, and SEO-friendly experience. The project was a collaboration with the backend developer to integrate APIs and ensure smooth data management, while the frontend emphasizes interactivity and modern design.",
    image: "/project/leolit.png",
    techStack: ["Next.js", "Tailwind CSS", "Bun", "ShadCN", "Framer Motion"],
    features: [
      "Responsive company profile website",
      "Interactive animations using Framer Motion",
      "Showcase of games, services, and news",
      "Server components for SEO optimization and performance",
      "Collaborative API integration with backend systems",
    ],
    website: "https://leolitgames.com",
    category: "web",
  },
  {
    title: "DNCC Official Website",
    description:
      "A comprehensive website for DNCC, providing information on events, organizational structure, and activities.",
    longDescription:
      "The DNCC Official Website was developed to serve as the central hub for the Dian Nuswantoro Computer Club (DNCC). The platform provides details on events, organizational structure, and activities, with a strong focus on responsive design and user-friendly navigation. Built with CodeIgniter, the website ensures maintainability and scalability for the student organization.",
    image: "/project/dncc.jpg",
    techStack: ["CodeIgniter", "Bootstrap", "MySQL"],
    features: [
      "Event and activity information management",
      "Organizational structure display",
      "Responsive and user-friendly design",
      "Content management system for administrators",
      "Deployed on dnccudinus.org",
    ],
    githubFe: "https://github.com/dnccsemarang/dncc-apps",
    website: "https://dnccudinus.org",
    category: "web",
  },
  {
    title: "Registration Web – BTNG 2023",
    description:
      "A registration platform for BTNG 2023, an event organized by DNCC to facilitate new student recruitment.",
    longDescription:
      "The Registration Web for BTNG 2023 was developed to streamline the registration process for students joining DNCC during the annual recruitment event at UDINUS. Built with React.js, the platform emphasizes modern UI design, responsive navigation, and ease of use for new members. The project successfully supported hundreds of new student registrations during the event.",
    image: "/project/btng-2023.jpg",
    techStack: ["React.js", "Tailwind CSS", "Firebase"],
    features: [
      "Student registration management",
      "Modern and responsive UI design",
      "Smooth navigation and usability",
      "Event-specific data handling",
      "Deployed on btng.dnccudinus.org",
    ],
    githubFe: "https://github.com/dnccsemarang/btng2023",
    website: "https://btng.dnccudinus.org",
    category: "web",
  },
  {
    title: "DevLearn",
    description:
      "Contributed to the development of DevLearn, an educational platform built with Laravel and Tailwind CSS that helps users learn effectively through proven techniques such as the Pomodoro Technique and Feynman Technique.",
    image: "/project/devlearn.png",
    techStack: ["Laravel", "Tailwind"],
    category: "web",
  },
  {
    title: "DINACOM 2023",
    description:
      "Collaborated with the team to create a registration website for the Dinus Application Competition (DINACOM), a technology competition organized by DNCC. The platform allows participants to register their web, mobile, and desktop applications for the competition. Deploy on dinacom.dnccudinus.org.",
    image: "/project/dinacom-2023.jpg",
    techStack: ["Laravel", "Tailwind"],
    githubFe: "https://github.com/dnccsemarang/dinacom2023",
    website: "https://dinacom.dnccudinus.org",
    category: "web",
  },
  {
    title: "Registration Web – BTNG 2024",
    description:
      "Served as Project Manager for BTNG 2024, overseeing the project by adding details from the team leader, fixing bugs, monitoring the development team to prevent errors during GitHub pushes, and deploying the application to CPanel. Deploy on btng.dnccudinus.org",
    image: "/project/btng-2024.jpg",
    techStack: ["React.js", "Tailwind CSS"],
    githubFe: "https://github.com/dnccsemarang/btng2024",
    website: "https://btng.dnccudinus.org",
    category: "web",
  },
  {
    title: "SKINKER ECOMMERCE",
    description:
      "Developed Skinker, an e-commerce platform for skincare products, as an early college project. Initially built with vanilla HTML and CSS, then migrated and rebuilt using Laravel framework with Tailwind CSS. Integrated RajaOngkir API to provide real-time shipping cost calculations, enabling accurate delivery pricing based on user location across Indonesia.",
    image: "/project/skinker.png",
    techStack: ["Laravel", "CSS", "MySQL"],
    githubFe: "https://github.com/isnanramalia/skinkerEcommerce",
    category: "web",
  },
  {
    title: "SICAPA – Academic Performance Measurement System",
    description:
      "A web-based academic grading system that objectively measures student performance based on CPL (Graduate Learning Outcomes) and CPMK (Course Learning Outcomes).",
    longDescription:
      "SICAPA is an academic measurement platform designed to eliminate subjective grading by connecting course-level assessments to structured learning outcome frameworks. The system maps each grade component to CPMK and CPL, calculates weighted scores across assignments, quizzes, midterms, finals, and practicum, then aggregates results into objective, competency-based evaluations. It supports multiple roles — Kaprodi, Koordinator, and Dosen — each with scoped access to dashboards, grade input, and recap features. SICAPA bridges the gap between raw scores and actual student competencies, making academic accountability transparent and data-driven.",
    image: "/project/sicapa.jpg",
    techStack: ["Laravel", "MySQL", "Tailwind"],
    features: [
      "Role-based access for Kaprodi, Koordinator, and Dosen",
      "CPL and CPMK mapping per course and grade component",
      "Weighted grade input across Tugas & Quiz, UTS, UAS, and Praktikum",
      "Automated N-Way grade calculation based on component weights",
      "Rekap nilai per CPMK and CPL with class average overview",
      "Student grade table with search, column toggle, compact view, and CSV export",
    ],
    githubFe: "https://github.com/IAmNotGod-core/GLO_web",
    category: "web",
  },
  {
    title: "Triva – Group Trip Expense Splitter",
    description:
      "A mobile app for managing and splitting group trip expenses fairly, featuring AI-powered receipt scanning and natural language input.",
    longDescription:
      "Triva is a group expense management app designed to eliminate financial conflicts during trips with friends, family, or communities. Users can create trips, add members (including guests without an account), and record expenses either manually or via AI-powered Smart Add — which supports OCR receipt scanning and natural language prompts. Expenses are split flexibly using an N-Way Splitter algorithm, and settlement instructions are generated automatically so everyone knows exactly who pays whom.",
    image: "/project/triva.jpeg",
    techStack: ["Flutter", "Laravel", "MySQL", "n8n", "AI/NLP", "OCR"],
    features: [
      "Create and manage group trips with member roles (Admin, Member, Guest)",
      "Smart Add: AI-powered expense entry via receipt photo or natural language prompt",
      "Flexible split options: equal, shares, adjustment, and itemized",
      "N-Way Splitter algorithm for automatic and simplified settlement calculation",
      "Guest support — no app required, settlements shared via WhatsApp",
      "Trip summary export as PDF/CSV and shareable public link",
    ],
    githubFe: "https://github.com/isnanramalia/triva_app",
    githubBe: "https://github.com/isnanramalia/triva_api",
    category: "mobile",
  },
  {
    title: "Manual Testing – Saucedemo (Swag Labs)",
    description:
      "Full-cycle manual QA on a demo e-commerce app: Test Plan, 30+ test cases across Login/Product/Cart/Checkout flows, and 4 formal bug reports with Severity & Priority classification.",
    longDescription:
      "As part of my SQA learning journey, I conducted comprehensive manual testing on Saucedemo — a demo e-commerce platform built for QA practice. The project follows a complete STLC cycle: Test Plan with scope, objectives, and entry/exit criteria; Test Scenarios and 30+ Test Cases executed across three user types (standard_user, problem_user, locked_out_user); and a formal Defect List. Key findings include a Critical ID-mapping bug causing wrong product images and broken navigation, a High-severity 'Remove' button failure, and multiple UI issues. All documentation is structured to meet professional QA standards.",
    image: "/project/saucedemo-tc.png",
    techStack: [
      "Manual Testing",
      "Test Planning",
      "Bug Reporting",
      "STLC",
      "Google Sheets",
    ],
    features: [
      "Test Plan with scope, objectives, and entry/exit criteria",
      "Multi-user testing: standard_user, problem_user, locked_out_user",
      "30+ test cases covering Login, Product, Cart, and Checkout flows",
      "4 formal bug reports (1 Critical, 2 High, 1 Low) with full documentation",
      "Risk-based test prioritization using Severity & Priority matrix",
      "Defect tracking: Steps to Reproduce, Expected vs Actual Results, Notes/Evidence",
    ],
    website:
      "https://docs.google.com/spreadsheets/d/1tjPYjxccj84tfwsshMwptOSUyIUZo1tYta4Eaul9mrI/edit?usp=sharing",
    category: "qa",
  },
];
