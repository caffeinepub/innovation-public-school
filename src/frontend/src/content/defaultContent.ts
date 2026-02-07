import type { ContentSection } from '../backend';

export const defaultContent: Record<string, ContentSection> = {
  // Home Page
  'home-hero-title': {
    id: 'home-hero-title',
    title: 'Hero Title',
    body: 'Innovation Public School',
    isPublished: true,
  },
  'home-hero-tagline': {
    id: 'home-hero-tagline',
    title: 'Hero Tagline',
    body: 'Shaping Tomorrow\'s Leaders',
    isPublished: true,
  },
  'home-about': {
    id: 'home-about',
    title: 'About the School',
    body: 'Innovation Public School is a premier educational institution committed to nurturing young minds and fostering holistic development. With state-of-the-art facilities, experienced faculty, and a student-centric approach, we provide an environment where every child can thrive academically, socially, and emotionally.',
    isPublished: true,
  },
  'home-achievements': {
    id: 'home-achievements',
    title: 'Achievements & Highlights',
    body: '• 100% Pass Rate in Board Examinations\n• National Award for Excellence in Education 2025\n• State Champions in Inter-School Sports Meet\n• 50+ Students Selected for National Level Competitions\n• ISO 9001:2015 Certified Institution',
    isPublished: true,
  },

  // About Page
  'about-vision': {
    id: 'about-vision',
    title: 'Vision & Mission',
    body: 'Our Vision: To be a center of excellence in education, nurturing responsible global citizens who are equipped with knowledge, skills, and values to make a positive impact on society.\n\nOur Mission: To provide quality education that empowers students to achieve their full potential through innovative teaching methods, character building, and holistic development in a safe and supportive environment.',
    isPublished: true,
  },
  'about-principal': {
    id: 'about-principal',
    title: 'Principal\'s Message',
    body: 'Dear Parents and Students,\n\nWelcome to Innovation Public School! It is my privilege to lead an institution that stands for excellence, integrity, and innovation. Our dedicated team of educators works tirelessly to create a nurturing environment where every student can discover their unique talents and reach their highest potential.\n\nWe believe in the holistic development of our students, focusing not just on academic excellence but also on character building, critical thinking, and creativity. Together, let us shape a brighter future for our children.\n\nWarm regards,\nDr. Priya Sharma\nPrincipal',
    isPublished: true,
  },
  'about-values': {
    id: 'about-values',
    title: 'Our Values',
    body: '• Excellence: We strive for the highest standards in everything we do\n• Integrity: We uphold honesty, transparency, and ethical conduct\n• Innovation: We embrace creativity and forward-thinking approaches\n• Respect: We value diversity and treat everyone with dignity\n• Responsibility: We foster accountability and social consciousness\n• Collaboration: We believe in teamwork and community partnership',
    isPublished: true,
  },
  'about-history': {
    id: 'about-history',
    title: 'School History',
    body: 'Founded in 1995, Innovation Public School began with a vision to provide quality education accessible to all. Starting with just 50 students, we have grown into a thriving institution serving over 2,000 students from Pre-Primary to Senior Secondary levels.\n\nOver the years, we have consistently maintained our commitment to academic excellence while adapting to modern educational needs. Our journey has been marked by numerous achievements, infrastructure development, and the introduction of innovative teaching methodologies that prepare students for the challenges of the 21st century.',
    isPublished: true,
  },
  'about-management': {
    id: 'about-management',
    title: 'Management Team',
    body: 'Our school is guided by an experienced management team:\n\n• Dr. Rajesh Kumar - Chairman, Education Trust\n• Mrs. Anjali Verma - Vice Chairperson\n• Dr. Priya Sharma - Principal\n• Mr. Suresh Patel - Vice Principal (Academics)\n• Ms. Meera Singh - Vice Principal (Administration)\n• Mr. Arun Desai - Coordinator (Primary Section)\n• Mrs. Kavita Reddy - Coordinator (Secondary Section)',
    isPublished: true,
  },

  // Academics Page
  'academics-curriculum': {
    id: 'academics-curriculum',
    title: 'Curriculum',
    body: 'We follow the CBSE curriculum, designed to provide a comprehensive and balanced education. Our curriculum emphasizes:\n\n• Strong foundation in core subjects (Mathematics, Science, Languages, Social Studies)\n• Integration of technology in learning\n• Focus on conceptual understanding rather than rote learning\n• Regular assessments and continuous evaluation\n• Alignment with national education standards',
    isPublished: true,
  },
  'academics-subjects': {
    id: 'academics-subjects',
    title: 'Subjects Offered',
    body: 'Primary Level: English, Hindi, Mathematics, Environmental Studies, Computer Science, Art & Craft, Physical Education\n\nSecondary Level: English, Hindi, Mathematics, Science (Physics, Chemistry, Biology), Social Studies, Computer Science, Physical Education\n\nSenior Secondary: Science Stream (PCM/PCB), Commerce Stream, Humanities Stream with multiple elective options',
    isPublished: true,
  },
  'academics-teaching': {
    id: 'academics-teaching',
    title: 'Teaching Methods',
    body: 'Our innovative teaching approaches include:\n\n• Interactive and experiential learning\n• Smart classroom technology integration\n• Project-based learning and group activities\n• Hands-on laboratory experiments\n• Regular field trips and educational excursions\n• Guest lectures by industry experts\n• Personalized attention and remedial classes\n• Use of audio-visual aids and digital resources',
    isPublished: true,
  },
  'academics-exams': {
    id: 'academics-exams',
    title: 'Exams & Assessment',
    body: 'We follow a comprehensive assessment system:\n\n• Continuous and Comprehensive Evaluation (CCE)\n• Periodic tests and unit assessments\n• Half-yearly and annual examinations\n• Project work and practical assessments\n• Regular parent-teacher meetings\n• Detailed progress reports\n• Focus on both scholastic and co-scholastic areas',
    isPublished: true,
  },
  'academics-cocurricular': {
    id: 'academics-cocurricular',
    title: 'Co-curricular Activities',
    body: 'We offer a wide range of activities for holistic development:\n\n• Sports: Cricket, Football, Basketball, Athletics, Yoga\n• Arts: Music, Dance, Drama, Painting, Craft\n• Clubs: Science Club, Math Club, Literary Club, Eco Club, Robotics Club\n• Competitions: Debates, Quiz, Elocution, Essay Writing\n• Cultural Programs and Annual Day celebrations\n• Community service and social awareness programs',
    isPublished: true,
  },

  // Admissions Page
  'admissions-process': {
    id: 'admissions-process',
    title: 'Admission Process',
    body: 'Step 1: Fill out the online enquiry form or visit the school office\nStep 2: Collect the admission form and prospectus\nStep 3: Submit the completed form with required documents\nStep 4: Attend the interaction/assessment (for applicable classes)\nStep 5: Await admission confirmation\nStep 6: Complete fee payment and formalities\nStep 7: Receive admission confirmation and welcome kit',
    isPublished: true,
  },
  'admissions-eligibility': {
    id: 'admissions-eligibility',
    title: 'Eligibility Criteria',
    body: 'Pre-Primary (Nursery): Minimum age 3 years as on March 31st\nPre-Primary (LKG): Minimum age 4 years as on March 31st\nPre-Primary (UKG): Minimum age 5 years as on March 31st\nClass I: Minimum age 6 years as on March 31st\n\nFor higher classes: Age-appropriate admission with transfer certificate from previous school. Assessment may be conducted for Classes II onwards.',
    isPublished: true,
  },
  'admissions-documents': {
    id: 'admissions-documents',
    title: 'Required Documents',
    body: '• Birth Certificate (original for verification)\n• Aadhar Card of child and parents\n• Recent passport-size photographs (4 copies)\n• Transfer Certificate (for Classes II and above)\n• Previous year\'s report card\n• Caste certificate (if applicable)\n• Address proof (Electricity bill/Ration card)\n• Medical fitness certificate\n• Blood group certificate',
    isPublished: true,
  },
};
