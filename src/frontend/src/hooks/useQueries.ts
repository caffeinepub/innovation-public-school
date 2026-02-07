import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
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
      return actor.createContentSection(section);
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
      return actor.updateContentSection(id, title, body, isPublished);
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
      return actor.deleteContentSection(id);
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
      return actor.createGalleryItem(item);
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
    }: {
      id: string;
      title: string;
      category: string;
      isActive: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateGalleryItem(id, title, category, isActive);
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
      return actor.deleteGalleryItem(id);
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
      return actor.getAllEnquiries();
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
      return actor.markEnquiryAsRead(id);
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
      return actor.deleteEnquiry(id);
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
  });
}

export function useUpdateContactDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (details: ContactDetails) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContactDetails(details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactDetails'] });
    },
  });
}

export function useToggleMapDisplay() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleMapDisplay();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactDetails'] });
    },
  });
}

export function useUpdateMapEmbed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mapLink: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMapEmbed(mapLink);
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
  });
}
