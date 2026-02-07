import { useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetContactDetails } from '../hooks/useQueries';
import EnquiryForm from '../components/forms/EnquiryForm';

export default function ContactPage() {
  const { data: contactDetails } = useGetContactDetails();

  useEffect(() => {
    document.title = 'Contact Us - Innovation Public School';
  }, []);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with us for any queries or information
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      {contactDetails?.address || 'B-80, South Extension – II, New Delhi- 110049'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">
                      {contactDetails?.phone || '+91 98115 14808'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">
                      {contactDetails?.email || 'admissioninfo@innovationedu.in'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            {contactDetails?.displayMap && contactDetails?.mapEmbed && (
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <iframe
                      src={contactDetails.mapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="School Location"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <EnquiryForm type="contact" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
