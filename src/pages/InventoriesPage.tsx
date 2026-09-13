import { useState } from 'react';
import { useInventoriesQuery, useCreateInventoryMutation, useDeleteInventoryMutation } from '../hooks/use-inventories';
import { useCategoriesQuery } from '../hooks/use-categories';
import type { CreateInventoryDto } from '../types';

export function InventoriesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    parentInventoryId: '',
  });

  const { data: inventories, isLoading, error } = useInventoriesQuery();
  const { data: categories } = useCategoriesQuery();
  const createMutation = useCreateInventoryMutation();
  const deleteMutation = useDeleteInventoryMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId') || '';
    
    const dto: CreateInventoryDto = {
      userId,
      name: formData.name,
      description: formData.description || undefined,
      categoryId: formData.categoryId || undefined,
      parentInventoryId: formData.parentInventoryId || undefined,
    };

    try {
      await createMutation.mutateAsync(dto);
      setFormData({ name: '', description: '', categoryId: '', parentInventoryId: '' });
      setIsCreating(false);
    } catch (err) {
      console.error('Failed to create inventory:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory?')) return;
    
    const userId = localStorage.getItem('userId') || '';
    try {
      await deleteMutation.mutateAsync({ id, userId });
    } catch (err) {
      console.error('Failed to delete inventory:', err);
    }
  };

  if (isLoading) return <div className="loading">Loading inventories...</div>;
  if (error) return <div className="error">Error loading inventories: {String(error)}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Inventories</h1>
        <button onClick={() => setIsCreating(true)} className="btn-primary">
          Add Inventory
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

            <div className="form-group">
              <label htmlFor="parentInventoryId">Parent Inventory</label>
              <select
                id="parentInventoryId"
                value={formData.parentInventoryId}
                onChange={(e) => setFormData({ ...formData, parentInventoryId: e.target.value })}
              >
                <option value="">None</option>
                {inventories?.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Inventory'}
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
              <th>Description</th>
              <th>Category</th>
              <th>Parent</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventories?.map((inventory) => (
              <tr key={inventory.id}>
                <td>{inventory.name}</td>
                <td>{inventory.description || '-'}</td>
                <td>
                  {inventory.categoryId
                    ? categories?.find((c) => c.id === inventory.categoryId)?.name
                    : '-'}
                </td>
                <td>
                  {inventory.parentInventoryId
                    ? inventories.find((i) => i.id === inventory.parentInventoryId)?.name
                    : '-'}
                </td>
                <td>{new Date(inventory.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(inventory.id)}
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
