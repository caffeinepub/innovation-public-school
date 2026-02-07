import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSubmitEnquiry } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { Enquiry } from '../../backend';

interface EnquiryFormProps {
  type: 'admission' | 'contact';
}

export default function EnquiryForm({ type }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const submitEnquiry = useSubmitEnquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const enquiry: Enquiry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      email: formData.email,
      subject: formData.subject || (type === 'admission' ? 'Admission Enquiry' : 'General Enquiry'),
      message: formData.message,
      enquiryType: type,
      submittedAt: BigInt(Date.now() * 1000000),
      isRead: false,
    };

    try {
      await submitEnquiry.mutateAsync(enquiry);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast.success('Your enquiry has been submitted successfully!');
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      toast.error('Failed to submit enquiry. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-950">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600 dark:text-green-400" />
        <h3 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-100">
          Thank You!
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Your enquiry has been submitted successfully. We will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={submitEnquiry.isPending}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={submitEnquiry.isPending}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          type="text"
          placeholder={type === 'admission' ? 'Admission for Class...' : 'Subject of your enquiry'}
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          disabled={submitEnquiry.isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          placeholder="Please provide details about your enquiry..."
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          disabled={submitEnquiry.isPending}
          required
        />
      </div>

      <Button type="submit" disabled={submitEnquiry.isPending} size="lg" className="w-full rounded-full sm:w-auto">
        {submitEnquiry.isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Enquiry'
        )}
      </Button>
    </form>
  );
}
