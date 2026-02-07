import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteContent } from '../hooks/useSiteContent';

export default function AboutPage() {
  const { getSection } = useSiteContent();

  useEffect(() => {
    document.title = 'About Us - Innovation Public School';
  }, []);

  const visionSection = getSection('about-vision');
  const principalSection = getSection('about-principal');
  const valuesSection = getSection('about-values');
  const historySection = getSection('about-history');
  const managementSection = getSection('about-management');

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">About Us</h1>
          <p className="text-lg text-muted-foreground">
            Learn more about our institution, values, and leadership
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{visionSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {visionSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{principalSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {principalSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{valuesSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {valuesSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{historySection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {historySection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{managementSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {managementSection.body}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
