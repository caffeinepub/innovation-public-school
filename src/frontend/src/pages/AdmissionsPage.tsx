import { useEffect } from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '../hooks/useSiteContent';
import EnquiryForm from '../components/forms/EnquiryForm';

export default function AdmissionsPage() {
  const { getSection } = useSiteContent();

  useEffect(() => {
    document.title = 'Admissions - Innovation Public School';
  }, []);

  const processSection = getSection('admissions-process');
  const eligibilitySection = getSection('admissions-eligibility');
  const documentsSection = getSection('admissions-documents');

  const handleDownloadProspectus = () => {
    const link = document.createElement('a');
    link.href = '/assets/innovation-prospectus.pdf';
    link.download = 'Innovation-Public-School-Prospectus.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Admissions</h1>
          <p className="text-lg text-muted-foreground">
            Join our community of learners - Admissions Open for 2026
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{processSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {processSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{eligibilitySection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {eligibilitySection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{documentsSection.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
                {documentsSection.body}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Download Prospectus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Download our detailed prospectus to learn more about our programs, facilities, and admission process.
              </p>
              <Button onClick={handleDownloadProspectus} size="lg" className="rounded-full">
                <Download className="mr-2 h-5 w-5" />
                Download Prospectus (PDF)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Online Enquiry Form</CardTitle>
            </CardHeader>
            <CardContent>
              <EnquiryForm type="admission" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
