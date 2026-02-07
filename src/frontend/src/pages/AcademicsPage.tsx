import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSiteContent } from '../hooks/useSiteContent';

export default function AcademicsPage() {
  const { getSection } = useSiteContent();

  useEffect(() => {
    document.title = 'Academics - Innovation Public School';
  }, []);

  const curriculumSection = getSection('academics-curriculum');
  const subjectsSection = getSection('academics-subjects');
  const teachingSection = getSection('academics-teaching');
  const examsSection = getSection('academics-exams');
  const cocurricularSection = getSection('academics-cocurricular');

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Academics</h1>
          <p className="text-lg text-muted-foreground">
            Excellence in education through innovative teaching and comprehensive curriculum
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{curriculumSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {curriculumSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{subjectsSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {subjectsSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{teachingSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {teachingSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{examsSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {examsSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{cocurricularSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {cocurricularSection.body}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
