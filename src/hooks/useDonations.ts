import { useQuery } from '@tanstack/react-query';
import { mockDonations } from '../data/mockData';
import type { Donation } from '../types';

const fetchDonations = async (): Promise<Donation[]> => {
  await new Promise((r) => setTimeout(r, 500));
  return mockDonations;
};

export function useDonations(donorId?: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['donations', donorId],
    queryFn: fetchDonations,
    staleTime: 1000 * 60 * 2,
  });

  const donations = donorId
    ? (data ?? []).filter((d) => d.donorId === donorId)
    : (data ?? []);

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const completedCount = donations.filter((d) => d.deliveryStatus === 'delivered_verified').length;

  return { donations, totalDonated, completedCount, isLoading };
}
