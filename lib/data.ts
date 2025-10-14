export const education = [
  {
    degree: "Bachelor of Computer Science",
    institution: "Dian Nuswantoro University",
    period: "2022 - expected 2026",
    description: "Focused on Software Engineering and Web Development",
  },
  // {
  //   // degree: "",
  //   institution: "SMA N 1 Sinorojo",
  //   period: "2019",
  //   description:
  //     "Intensive program covering React, Node.js, and modern web technologies",
  // },
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

export const workExperience = [
  {
    title: "Frontend Web Developer (Internship)",
    company: "Leolit Games",
    period: "Jan 2025 - May 2025",
    logo: "/logo/leolit-games.png?height=40&width=40&text=LG",
    website: "https://leolitgames.com",
    shortDescription:
      "Developed a responsive and modern company profile website using Next.js and Tailwind.",
    fullDescription: `At Leolit Games, I worked as a Frontend Developer to build the company’s official profile website. My key responsibilities included:

• Developing the company profile website with Next.js, Tailwind CSS, Bun, ShadCN, and Framer Motion
• Focusing on frontend development with server components for clean, fast, and SEO-friendly output
• Collaborating with the backend developer to integrate APIs and ensure smooth data handling
• Implementing modern animations and interactions to create an engaging user experience`,
  },
  {
    title: "Frontend Web Developer (Internship)",
    company: "Bengkel Koding",
    period: "Jan 2025 - Present",
    logo: "/logo/bengkelkoding.png?height=40&width=40&text=BK",
    website: "https://bengkelkoding.dinus.id/",
    shortDescription:
      "Built the alumni website for the Computer Science program at Dian Nuswantoro University.",
    fullDescription: `As a Frontend Developer intern at Bengkel Koding, I developed the “Website for Computer Science Alumni” project. This platform was built to manage alumni data and support accreditation needs. My contributions included:

• Developing the alumni website using Next.js, Tailwind CSS, Laravel, and ShadCN
• Building responsive UI and implementing reusable components for scalability
• Collaborating with backend developers to integrate APIs and manage alumni data effectively
• Optimizing frontend performance to deliver fast load times and seamless user experience
• Supporting features such as alumni CV generation, job postings, and alumni tracking`,
  },
  {
    title: "Web Developer Teaching Assistant – Career Guidance Program",
    company: "Bengkel Koding",
    period: "May 2025 - Jul 2025",
    logo: "/logo/bengkelkoding.png?height=40&width=40&text=BK",
    website: "https://bengkelkoding.dinus.id/",
    shortDescription:
      "Mentored students in building a hospital appointment system as part of a project-based learning program.",
    fullDescription: `As a teaching assistant, I supported students in developing a hospital appointment system project. My responsibilities included:

• Mentoring 25 students in frontend development using React.js
• Conducting code reviews and providing feedback to improve project quality
• Assisting in evaluating assignments and offering technical guidance in debugging and deployment`,
  },
  {
    title: "Web Developer Teaching Assistant – Bengkel Koding",
    company: "Bengkel Koding",
    period: "Feb 2025 - Jul 2025",
    logo: "/logo/bengkelkoding.png?height=40&width=40&text=BK",
    website: "https://bengkelkoding.dinus.id/",
    shortDescription:
      "Guided students in building a digital polyclinic system project and provided technical assistance.",
    fullDescription: `As a teaching assistant, I collaborated with a team to guide students in developing a digital polyclinic system. My contributions included:

• Supporting 24 students in small teams to build web applications
• Assisting in frontend design and integration with backend systems
• Providing technical support on coding practices, debugging, and project documentation`,
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

export const projects = [
  {
    title: "Website for Computer Science Alumni",
    description:
      "A web platform for alumni of Dian Nuswantoro University’s IT program, providing CV generation, job postings, and alumni tracking.",
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
  },
  {
    title: "Leolit Games - Company Profile Website",
    description:
      "A modern and responsive company profile website for Leolit Games, showcasing services, games, and company updates.",
    longDescription:
      "The Leolit Games Company Profile Website was built to present the company’s identity, portfolio, and services in a professional and engaging way. Using Next.js with server components, Tailwind CSS, Bun, ShadCN, and Framer Motion, the website delivers a clean, fast, and SEO-friendly experience. The project was a collaboration with the backend developer to integrate APIs and ensure smooth data management, while the frontend emphasizes interactivity and modern design.",
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
    github: "https://github.com/dnccsemarang/dncc-apps",
    website: "https://dnccudinus.org",
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
    github: "https://github.com/dnccsemarang/btng2023",
    website: "https://btng.dnccudinus.org",
  },
  {
    title: "DevLearn",
    description:
      "Contributed to the development of DevLearn, an educational platform built with Laravel and Tailwind CSS that helps users learn effectively through proven techniques such as the Pomodoro Technique and Feynman Technique.",
    // longDescription:
    //   "The Registration Web for BTNG 2023 was developed to streamline the registration process for students joining DNCC during the annual recruitment event at UDINUS. Built with React.js, the platform emphasizes modern UI design, responsive navigation, and ease of use for new members. The project successfully supported hundreds of new student registrations during the event.",
    image: "/project/devlearn.png",
    techStack: ["Laravel", "Tailwind"],
    // features: [
    //   "Student registration management",
    //   "Modern and responsive UI design",
    //   "Smooth navigation and usability",
    //   "Event-specific data handling",
    //   "Deployed on btng.dnccudinus.org",
    // ],
    // github: "https://github.com/dnccsemarang/devlearn",
    // website: "https://dinacom.dnccudinus.org",
  },
  {
    title: "DINACOM 2023",
    description:
      "Collaborated with the team to create a registration website for the Dinus Application Competition (DINACOM), a technology competition organized by DNCC. The platform allows participants to register their web, mobile, and desktop applications for the competition. Deploy on dinacom.dnccudinus.org.",
    // longDescription:
    //   "The Registration Web for BTNG 2023 was developed to streamline the registration process for students joining DNCC during the annual recruitment event at UDINUS. Built with React.js, the platform emphasizes modern UI design, responsive navigation, and ease of use for new members. The project successfully supported hundreds of new student registrations during the event.",
    image: "/project/dinacom-2023.jpg",
    techStack: ["Laravel", "Tailwind"],
    // features: [
    //   "Student registration management",
    //   "Modern and responsive UI design",
    //   "Smooth navigation and usability",
    //   "Event-specific data handling",
    //   "Deployed on btng.dnccudinus.org",
    // ],
    github: "https://github.com/dnccsemarang/dinacom2023",
    website: "https://dinacom.dnccudinus.org",
  },
  {
    title: "Registration Web – BTNG 2024",
    description:
      "Served as Project Manager for BTNG 2024, overseeing the project by adding details from the team leader, fixing bugs, monitoring the development team to prevent errors during GitHub pushes, and deploying the application to CPanel. Deploy on btng.dnccudinus.org",
    // longDescription:
    //   "The Registration Web for BTNG 2023 was developed to streamline the registration process for students joining DNCC during the annual recruitment event at UDINUS. Built with React.js, the platform emphasizes modern UI design, responsive navigation, and ease of use for new members. The project successfully supported hundreds of new student registrations during the event.",
    image: "/project/btng-2024.jpg",
    techStack: ["React.js", "Tailwind CSS"],
    // features: [
    //   "Student registration management",
    //   "Modern and responsive UI design",
    //   "Smooth navigation and usability",
    //   "Event-specific data handling",
    //   "Deployed on btng.dnccudinus.org",
    // ],
    github: "https://github.com/dnccsemarang/btng2024",
    website: "https://btng.dnccudinus.org",
  },
  {
    title: "SKINKER ECOMMERCE",
    description:
      "Developed Skinker, an e-commerce platform for skincare products, as an early college project. Initially built with vanilla HTML and CSS, then migrated and rebuilt using Laravel framework with Tailwind CSS. Integrated RajaOngkir API to provide real-time shipping cost calculations, enabling accurate delivery pricing based on user location across Indonesia.",
    // longDescription:
    //   "The Registration Web for BTNG 2023 was developed to streamline the registration process for students joining DNCC during the annual recruitment event at UDINUS. Built with React.js, the platform emphasizes modern UI design, responsive navigation, and ease of use for new members. The project successfully supported hundreds of new student registrations during the event.",
    image: "/project/skinker.png",
    techStack: ["Laravel", "CSS", "MySQL"],
    // features: [
    //   "Student registration management",
    //   "Modern and responsive UI design",
    //   "Smooth navigation and usability",
    //   "Event-specific data handling",
    //   "Deployed on btng.dnccudinus.org",
    // ],
    github: "https://github.com/isnanramalia/skinkerEcommerce",
    // website: "https://btng.dnccudinus.org",
  },
];
