import { useState } from 'react';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useGetAllEnquiries,
  useMarkEnquiryAsRead,
  useDeleteEnquiry,
} from '../../../hooks/useQueries';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../utils/errorMessage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Enquiry } from '../../../backend';

export default function EnquiriesManager() {
  const { data: enquiries = [] } = useGetAllEnquiries();
  const markAsRead = useMarkEnquiryAsRead();
  const deleteEnquiry = useDeleteEnquiry();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync(id);
      toast.success('Enquiry marked as read');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      await deleteEnquiry.mutateAsync(id);
      toast.success('Enquiry deleted successfully');
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const sortedEnquiries = [...enquiries].sort((a, b) => {
    return Number(b.submittedAt - a.submittedAt);
  });

  return (
    <>
      <div className="space-y-4">
        {sortedEnquiries.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">No enquiries yet</p>
          </div>
        ) : (
          sortedEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className={`rounded-lg border p-4 transition-colors hover:bg-accent/50 cursor-pointer ${
                !enquiry.isRead ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => {
                setSelectedEnquiry(enquiry);
                if (!enquiry.isRead) {
                  handleMarkAsRead(enquiry.id);
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{enquiry.name}</h3>
                    {!enquiry.isRead && <Badge variant="default">New</Badge>}
                    <Badge variant="outline">{enquiry.enquiryType}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{enquiry.email}</p>
                  <p className="text-sm font-medium mt-1">{enquiry.subject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {enquiry.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDate(enquiry.submittedAt)}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {enquiry.isRead ? (
                    <MailOpen className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Mail className="h-5 w-5 text-primary" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(enquiry.id);
                    }}
                    disabled={deleteEnquiry.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
            <DialogDescription>
              {selectedEnquiry && formatDate(selectedEnquiry.submittedAt)}
            </DialogDescription>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg">{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{selectedEnquiry.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <p className="text-lg">{selectedEnquiry.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <Badge variant="outline">{selectedEnquiry.enquiryType}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap text-lg">{selectedEnquiry.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
