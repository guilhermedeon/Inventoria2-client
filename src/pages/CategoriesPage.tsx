import { useState } from 'react';
import { useCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../hooks/use-categories';
import type { CreateCategoryDto } from '../types';

export function CategoriesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
  });

  const { data: categories, isLoading, error } = useCategoriesQuery();
  const createMutation = useCreateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    
    const userId = localStorage.getItem('userId') || '';
    
    const dto: CreateCategoryDto = {
      userId,
      name: formData.name,
      slug: formData.slug,
      parentId: formData.parentId || undefined,
    };

    try {
      await createMutation.mutateAsync(dto);
      setFormData({ name: '', slug: '', parentId: '' });
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create category:', err);
      setActionError('Failed to create category. Please check your input.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setActionError(null);
    
    const userId = localStorage.getItem('userId') || '';
    try {
      await deleteMutation.mutateAsync({ id, userId });
    } catch (err) {
      console.error('Failed to delete category:', err);
      setActionError('Failed to delete category.');
    }
  };

  if (isLoading) return <div className="loading">Loading categories...</div>;
  if (error) return <div className="error">Error loading categories: {String(error)}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Categories</h1>
        <button onClick={() => setIsCreating(true)} className="btn-primary">
          Add Category
        </button>
      </div>

      {actionError && <div className="error">{actionError}</div>}

      {isCreating && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="parentId">Parent Category</label>
              <select
                id="parentId"
                value={formData.parentId}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              >
                <option value="">None</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Category'}
              </button>
              <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Parent</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>
                  {category.parentId
                    ? categories.find((c) => c.id === category.parentId)?.name
                    : '-'}
                </td>
                <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="btn-danger"
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
