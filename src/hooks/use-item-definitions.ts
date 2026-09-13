import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemDefinitionApi } from '../api/item-definitions';
import type { CreateItemDefinitionDto, UpdateItemDefinitionDto } from '../types';

export const useItemDefinitionsQuery = () => {
  return useQuery({
    queryKey: ['item-definitions'],
    queryFn: itemDefinitionApi.getAll,
  });
};

export const useItemDefinitionQuery = (id: string) => {
  return useQuery({
    queryKey: ['item-definitions', id],
    queryFn: () => itemDefinitionApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateItemDefinitionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateItemDefinitionDto) => itemDefinitionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-definitions'] });
    },
  });
};

export const useUpdateItemDefinitionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemDefinitionDto }) =>
      itemDefinitionApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['item-definitions'] });
      queryClient.invalidateQueries({ queryKey: ['item-definitions', variables.id] });
    },
  });
};

export const useDeleteItemDefinitionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      itemDefinitionApi.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-definitions'] });
    },
  });
};
