import { useState } from 'react';
import { useItemDefinitionsQuery, useCreateItemDefinitionMutation, useDeleteItemDefinitionMutation } from '../hooks/use-item-definitions';
import { useCategoriesQuery } from '../hooks/use-categories';
import type { CreateItemDefinitionDto } from '../types';

export function ItemDefinitionsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    manufacturer: '',
    model: '',
    sku: '',
    categoryId: '',
  });

  const { data: itemDefinitions, isLoading, error } = useItemDefinitionsQuery();
  const { data: categories } = useCategoriesQuery();
  const createMutation = useCreateItemDefinitionMutation();
  const deleteMutation = useDeleteItemDefinitionMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId') || '';
    
    const dto: CreateItemDefinitionDto = {
      userId,
      name: formData.name,
      description: formData.description || undefined,
      brand: formData.brand || undefined,
      manufacturer: formData.manufacturer || undefined,
      model: formData.model || undefined,
      sku: formData.sku || undefined,
      categoryId: formData.categoryId || undefined,
    };

    try {
      await createMutation.mutateAsync(dto);
      setFormData({
        name: '',
        description: '',
        brand: '',
        manufacturer: '',
        model: '',
        sku: '',
        categoryId: '',
      });
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create item definition:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item definition?')) return;
    
    const userId = localStorage.getItem('userId') || '';
    try {
      await deleteMutation.mutateAsync({ id, userId });
    } catch (err) {
      console.error('Failed to delete item definition:', err);
    }
  };

  if (isLoading) return <div className="loading">Loading item definitions...</div>;
  if (error) return <div className="error">Error loading item definitions: {String(error)}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Item Definitions</h1>
        <button onClick={() => setIsCreating(true)} className="btn-primary">
          Add Item Definition
        </button>
      </div>

      {isCreating && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="manufacturer">Manufacturer</label>
                <input
                  type="text"
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU</label>
                <input
                  type="text"
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
                {createMutation.isPending ? 'Creating...' : 'Create Item Definition'}
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
              <th>Brand</th>
              <th>Model</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {itemDefinitions?.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.brand || '-'}</td>
                <td>{item.model || '-'}</td>
                <td>{item.sku || '-'}</td>
                <td>
                  {item.categoryId
                    ? categories?.find((c) => c.id === item.categoryId)?.name
                    : '-'}
                </td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
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
