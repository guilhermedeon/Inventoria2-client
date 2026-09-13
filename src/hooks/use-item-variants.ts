import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemVariantsApi } from '../api/item-variants';
import type { CreateItemVariantDto, UpdateItemVariantDto } from '../types';

export const useItemVariants = () => {
  return useQuery({
    queryKey: ['item-variants'],
    queryFn: itemVariantsApi.getAll,
  });
};

export const useItemVariant = (id: string) => {
  return useQuery({
    queryKey: ['item-variants', id],
    queryFn: () => itemVariantsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateItemVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemVariantDto) => itemVariantsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-variants'] });
    },
  });
};

export const useUpdateItemVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemVariantDto }) =>
      itemVariantsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-variants'] });
    },
  });
};

export const useDeleteItemVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemVariantsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-variants'] });
    },
  });
};
