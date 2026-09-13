import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packDefinitionsApi } from '../api/pack-definitions';
import type { CreatePackDefinitionDto, UpdatePackDefinitionDto } from '../types';

export const usePackDefinitions = () => {
  return useQuery({
    queryKey: ['pack-definitions'],
    queryFn: packDefinitionsApi.getAll,
  });
};

export const usePackDefinition = (id: string) => {
  return useQuery({
    queryKey: ['pack-definitions', id],
    queryFn: () => packDefinitionsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePackDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePackDefinitionDto) => packDefinitionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pack-definitions'] });
    },
  });
};

export const useUpdatePackDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePackDefinitionDto }) =>
      packDefinitionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pack-definitions'] });
    },
  });
};

export const useDeletePackDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => packDefinitionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pack-definitions'] });
    },
  });
};
