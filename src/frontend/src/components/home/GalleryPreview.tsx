import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllGalleryItems } from '../../hooks/useQueries';

export default function GalleryPreview() {
  const { data: galleryItems = [] } = useGetAllGalleryItems();
  const activeItems = galleryItems.filter((item) => item.isActive).slice(0, 6);

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Gallery</h2>
          <p className="text-lg text-muted-foreground">
            Glimpses of life at Innovation Public School
          </p>
        </div>

        {activeItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
              >
                <img
                  src={item.image.getDirectURL()}
                  alt={item.title}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm opacity-90">{item.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="overflow-hidden rounded-lg shadow-md">
                <img
                  src="/assets/generated/gallery-set-8.dim_1600x900.png"
                  alt={`Gallery preview ${i}`}
                  className="h-64 w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/gallery">
              View Full Gallery
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
