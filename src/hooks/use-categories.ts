import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../api/categories';
import type { CreateCategoryDto, UpdateCategoryDto } from '../types';

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  });
};

export const useCategoryQuery = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => categoryApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      categoryApi.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
