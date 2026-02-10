import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getErrorMessage } from '../utils/errorMessage';
import type { ContentSection, GalleryItem, Enquiry, ContactDetails, UserProfile } from '../backend';

// Content Sections
export function useGetAllContentSections() {
  const { actor, isFetching } = useActor();

  return useQuery<ContentSection[]>({
    queryKey: ['contentSections'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContentSections();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateContentSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: ContentSection) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.createContentSection(section);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
    },
  });
}

export function useUpdateContentSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      body,
      isPublished,
    }: {
      id: string;
      title: string;
      body: string;
      isPublished: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        const section: ContentSection = { id, title, body, isPublished };
        await actor.updateContentSection(id, section);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
    },
  });
}

export function useDeleteContentSection() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.deleteContentSection(id);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentSections'] });
    },
  });
}

// Gallery Items
export function useGetAllGalleryItems() {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGalleryItemsByCategory(category: string) {
  const { actor, isFetching } = useActor();

  return useQuery<GalleryItem[]>({
    queryKey: ['galleryItems', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGalleryItemsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useCreateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: GalleryItem) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.createGalleryItem(item);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}

export function useUpdateGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      category,
      isActive,
      image,
    }: {
      id: string;
      title: string;
      category: string;
      isActive: boolean;
      image?: GalleryItem['image'];
    }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        // Fetch the current item to get the image if not provided
        const currentItems = await actor.getAllGalleryItems();
        const currentItem = currentItems.find((item) => item.id === id);
        
        if (!currentItem) {
          throw new Error('Gallery item not found');
        }

        const updatedItem: GalleryItem = {
          id,
          title,
          category,
          isActive,
          image: image || currentItem.image,
        };

        await actor.updateGalleryItem(id, updatedItem);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}

export function useDeleteGalleryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.deleteGalleryItem(id);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryItems'] });
    },
  });
}

// Enquiries
export function useGetAllEnquiries() {
  const { actor, isFetching } = useActor();

  return useQuery<Enquiry[]>({
    queryKey: ['enquiries'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllEnquiries();
      } catch (error) {
        // If unauthorized, return empty array instead of throwing
        const errorMsg = getErrorMessage(error);
        if (errorMsg.includes('permission') || errorMsg.includes('admin')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitEnquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (enquiry: Enquiry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitEnquiry(enquiry);
    },
  });
}

export function useMarkEnquiryAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.markEnquiryAsRead(id);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    },
  });
}

export function useDeleteEnquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.deleteEnquiry(id);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    },
  });
}

// Contact Details
export function useGetContactDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<ContactDetails>({
    queryKey: ['contactDetails'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContactDetails();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useUpdateContactDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: ContactDetails) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.updateContactDetails(details);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactDetails'] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
