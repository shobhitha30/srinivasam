import { useQuery } from '@tanstack/react-query';
import { mockOrphanages } from '../data/mockData';
import type { Orphanage } from '../types';

const fetchShelters = async (): Promise<Orphanage[]> => {
  await new Promise((r) => setTimeout(r, 400));
  return mockOrphanages;
};

export function useShelters() {
  const { data, isLoading } = useQuery({
    queryKey: ['shelters'],
    queryFn: fetchShelters,
    staleTime: 1000 * 60 * 5,
  });
  return { shelters: data ?? [], isLoading };
}

export function useShelterById(id: string) {
  const { shelters, isLoading } = useShelters();
  return { shelter: shelters.find((s) => s.id === id), isLoading };
}
