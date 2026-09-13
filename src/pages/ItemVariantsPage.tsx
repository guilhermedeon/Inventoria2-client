import { useState } from 'react';
import { useItemVariants, useCreateItemVariant, useUpdateItemVariant, useDeleteItemVariant } from '../hooks/use-item-variants';
import { useItemDefinitions } from '../hooks/use-item-definitions';
import type { ItemVariant } from '../types';

export const ItemVariantsPage = () => {
  const { data: variants, isLoading, error } = useItemVariants();
  const { data: itemDefinitions } = useItemDefinitions();
  const createVariant = useCreateItemVariant();
  const updateVariant = useUpdateItemVariant();
  const deleteVariant = useDeleteItemVariant();

  const [isCreating, setIsCreating] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(null);
  const [formData, setFormData] = useState({
    itemDefinitionId: '',
    name: '',
    description: '',
    sku: '',
    barcode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId') || '';

    try {
      if (editingVariant) {
        await updateVariant.mutateAsync({
          id: editingVariant.id,
          data: { ...formData, userId },
        });
      } else {
        await createVariant.mutateAsync({ ...formData, userId });
      }
      setFormData({ itemDefinitionId: '', name: '', description: '', sku: '', barcode: '' });
      setIsCreating(false);
      setEditingVariant(null);
    } catch (error) {
      console.error('Failed to save variant:', error);
    }
  };

  const handleEdit = (variant: ItemVariant) => {
    setEditingVariant(variant);
    setFormData({
      itemDefinitionId: variant.itemDefinitionId,
      name: variant.name,
      description: variant.description || '',
      sku: variant.sku || '',
      barcode: variant.barcode || '',
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      await deleteVariant.mutateAsync(id);
    }
  };

  const handleCancel = () => {
    setFormData({ itemDefinitionId: '', name: '', description: '', sku: '', barcode: '' });
    setIsCreating(false);
    setEditingVariant(null);
  };

  if (isLoading) return <div className="loading">Loading variants...</div>;
  if (error) return <div className="error">Error loading variants</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Item Variants</h1>
        {!isCreating && (
          <button onClick={() => setIsCreating(true)} className="btn-primary">
            Create Variant
          </button>
        )}
      </div>

      {isCreating && (
        <div className="form-container">
          <h2>{editingVariant ? 'Edit Variant' : 'Create New Variant'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="itemDefinitionId">Item Definition</label>
              <select
                id="itemDefinitionId"
                value={formData.itemDefinitionId}
                onChange={(e) => setFormData({ ...formData, itemDefinitionId: e.target.value })}
                required
              >
                <option value="">Select an item definition</option>
                {itemDefinitions?.map((def) => (
                  <option key={def.id} value={def.id}>
                    {def.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Variant Name</label>
              <input
                id="name"
                type="text"
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
                <label htmlFor="sku">SKU</label>
                <input
                  id="sku"
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="barcode">Barcode</label>
                <input
                  id="barcode"
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={createVariant.isPending || updateVariant.isPending}>
                {editingVariant ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
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
              <th>Item Definition</th>
              <th>SKU</th>
              <th>Barcode</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants?.map((variant) => {
              const itemDef = itemDefinitions?.find((d) => d.id === variant.itemDefinitionId);
              return (
                <tr key={variant.id}>
                  <td>{variant.name}</td>
                  <td>{itemDef?.name || variant.itemDefinitionId}</td>
                  <td>{variant.sku || '-'}</td>
                  <td>{variant.barcode || '-'}</td>
                  <td>{new Date(variant.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(variant)} className="btn-secondary" style={{ marginRight: '0.5rem' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(variant.id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
