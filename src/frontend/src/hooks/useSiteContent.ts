import { useMemo } from 'react';
import { useGetAllContentSections } from './useQueries';
import { defaultContent } from '../content/defaultContent';
import type { ContentSection } from '../backend';

export function useSiteContent() {
  const { data: sections = [], isLoading } = useGetAllContentSections();

  const getSection = useMemo(() => {
    return (sectionId: string): ContentSection => {
      const backendSection = sections.find((s) => s.id === sectionId && s.isPublished);
      if (backendSection) {
        return backendSection;
      }
      return defaultContent[sectionId] || { id: sectionId, title: '', body: '', isPublished: true };
    };
  }, [sections]);

  const getSectionsByPrefix = useMemo(() => {
    return (prefix: string): ContentSection[] => {
      const backendSections = sections.filter((s) => s.id.startsWith(prefix) && s.isPublished);
      if (backendSections.length > 0) {
        return backendSections;
      }
      return Object.keys(defaultContent)
        .filter((key) => key.startsWith(prefix))
        .map((key) => defaultContent[key]);
    };
  }, [sections]);

  return {
    getSection,
    getSectionsByPrefix,
    isLoading,
    allSections: sections,
  };
}
