import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllGalleryItems } from '../hooks/useQueries';

const categories = ['All', 'Events', 'Classrooms', 'Sports', 'Cultural Programs'];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: galleryItems = [] } = useGetAllGalleryItems();

  useEffect(() => {
    document.title = 'Gallery - Innovation Public School';
  }, []);

  const activeItems = galleryItems.filter((item) => item.isActive);
  const filteredItems =
    selectedCategory === 'All'
      ? activeItems
      : activeItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Gallery</h1>
          <p className="text-lg text-muted-foreground">
            Explore moments and memories from Innovation Public School
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 lg:w-auto lg:grid-cols-5">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              {filteredItems.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-lg shadow-md transition-transform hover:scale-105"
                    >
                      <img
                        src={item.image.getDirectURL()}
                        alt={item.title}
                        className="h-72 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-lg font-semibold">{item.title}</p>
                          <p className="text-sm opacity-90">{item.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-12 text-center">
                  <p className="text-lg text-muted-foreground">
                    No images available in this category yet.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
