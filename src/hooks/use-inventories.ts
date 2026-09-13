import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventories';
import type { CreateInventoryDto, UpdateInventoryDto } from '../types';

export const useInventoriesQuery = () => {
  return useQuery({
    queryKey: ['inventories'],
    queryFn: inventoryApi.getAll,
  });
};

export const useInventoryQuery = (id: string) => {
  return useQuery({
    queryKey: ['inventories', id],
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateInventoryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateInventoryDto) => inventoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
    },
  });
};

export const useUpdateInventoryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryDto }) =>
      inventoryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
      queryClient.invalidateQueries({ queryKey: ['inventories', variables.id] });
    },
  });
};

export const useDeleteInventoryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      inventoryApi.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
    },
  });
};
