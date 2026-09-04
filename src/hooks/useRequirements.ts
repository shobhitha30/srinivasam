import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockRequirements } from '../data/mockData';
import type { FilterState, Requirement } from '../types';

const fetchRequirements = async (): Promise<Requirement[]> => {
  await new Promise((r) => setTimeout(r, 600));
  return mockRequirements;
};

export function useRequirements(filters?: Partial<FilterState>) {
  const { data, isLoading } = useQuery({
    queryKey: ['requirements'],
    queryFn: fetchRequirements,
    staleTime: 1000 * 60 * 5,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    let result = [...data];

    if (filters?.category && filters.category !== 'All') {
      result = result.filter((r) => r.category === filters.category);
    }
    if (filters?.city) {
      result = result.filter((r) =>
        r.orphanageCity.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }
    if (filters?.status && filters.status !== 'All') {
      result = result.filter((r) => r.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.orphanageName.toLowerCase().includes(q) ||
          r.orphanageCity.toLowerCase().includes(q)
      );
    }
    return result;
  }, [data, filters]);

  return { requirements: filtered, allRequirements: data ?? [], isLoading };
}
