import { Link } from '@tanstack/react-router';
import { GraduationCap, Users, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteContent } from '../hooks/useSiteContent';
import GalleryPreview from '../components/home/GalleryPreview';
import { useEffect } from 'react';

const features = [
  {
    icon: GraduationCap,
    title: 'Smart Classrooms',
    description: 'State-of-the-art technology-enabled learning environments for interactive education.',
  },
  {
    icon: Users,
    title: 'Qualified Teachers',
    description: 'Experienced and dedicated faculty committed to student success and growth.',
  },
  {
    icon: Shield,
    title: 'Safe Campus',
    description: 'Secure and monitored premises ensuring the safety and well-being of every student.',
  },
  {
    icon: TrendingUp,
    title: 'Holistic Growth',
    description: 'Comprehensive development focusing on academics, sports, arts, and character building.',
  },
];

const programs = [
  {
    title: 'Pre-Primary',
    description: 'Nursery to UKG - Building strong foundations through play-based learning',
    ageGroup: 'Ages 3-5',
  },
  {
    title: 'Primary',
    description: 'Classes I to V - Developing core skills and fostering curiosity',
    ageGroup: 'Ages 6-10',
  },
  {
    title: 'Secondary',
    description: 'Classes VI to XII - Preparing for excellence in academics and beyond',
    ageGroup: 'Ages 11-17',
  },
];

const testimonials = [
  {
    name: 'Mrs. Sharma',
    role: 'Parent of Class VIII Student',
    content: 'Innovation Public School has been instrumental in my child\'s development. The teachers are caring and the facilities are excellent.',
  },
  {
    name: 'Mr. Patel',
    role: 'Parent of Class V Student',
    content: 'The holistic approach to education here is remarkable. My daughter has grown not just academically but also in confidence and creativity.',
  },
  {
    name: 'Mrs. Reddy',
    role: 'Parent of Class X Student',
    content: 'The school\'s focus on both academics and extracurricular activities has helped my son discover his true potential. Highly recommended!',
  },
];

export default function HomePage() {
  const { getSection } = useSiteContent();

  useEffect(() => {
    document.title = 'Innovation Public School - Shaping Tomorrow\'s Leaders';
  }, []);

  const heroTitle = getSection('home-hero-title');
  const heroTagline = getSection('home-hero-tagline');
  const aboutSection = getSection('home-about');
  const achievementsSection = getSection('home-achievements');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {heroTitle.body}
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl">
                {heroTagline.body}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/admissions">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-school-banner.dim_1920x900.png"
                alt="Innovation Public School Campus"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">{aboutSection.title}</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {aboutSection.body}
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground">
              Excellence in education through innovation and dedication
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Programs */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Programs</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive education from early years to senior secondary
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {programs.map((program, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription className="text-primary">{program.ageGroup}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
              {achievementsSection.title}
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="whitespace-pre-line text-lg leading-relaxed">
                  {achievementsSection.body}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <GalleryPreview />

      {/* Testimonials */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Parent Testimonials</h2>
            <p className="text-lg text-muted-foreground">
              Hear what our parents have to say about us
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardContent className="pt-6">
                  <p className="mb-4 italic text-muted-foreground">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Admissions Open 2026</h2>
          <p className="mb-8 text-lg opacity-90">
            Join our community of learners and leaders. Limited seats available!
          </p>
          <Button asChild size="lg" variant="secondary" className="rounded-full">
            <Link to="/admissions">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
