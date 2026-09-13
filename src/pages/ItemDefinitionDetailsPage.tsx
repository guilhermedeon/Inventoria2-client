import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItemDefinitionQuery } from '../hooks/use-item-definitions';
import { useItemVariants, useCreateItemVariant, useUpdateItemVariant, useDeleteItemVariant } from '../hooks/use-item-variants';
import type { ItemVariant } from '../types';

export const ItemDefinitionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: itemDefinition, isLoading: isLoadingDef, error: errorDef } = useItemDefinitionQuery(id!);
  const { data: allVariants, isLoading: isLoadingVariants, error: errorVariants } = useItemVariants();
  
  const createVariant = useCreateItemVariant();
  const updateVariant = useUpdateItemVariant();
  const deleteVariant = useDeleteItemVariant();

  const variants = allVariants?.filter((v) => v.itemDefinitionId === id);

  const [isCreating, setIsCreating] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ItemVariant | null>(null);
  const [formData, setFormData] = useState({
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
          data: { ...formData, itemDefinitionId: id!, userId },
        });
      } else {
        await createVariant.mutateAsync({ ...formData, itemDefinitionId: id!, userId });
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save variant:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', sku: '', barcode: '' });
    setIsCreating(false);
    setEditingVariant(null);
  };

  const handleEdit = (variant: ItemVariant) => {
    setEditingVariant(variant);
    setFormData({
      name: variant.name,
      description: variant.description || '',
      sku: variant.sku || '',
      barcode: variant.barcode || '',
    });
    setIsCreating(true);
  };

  const handleDelete = async (variantId: string) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      await deleteVariant.mutateAsync(variantId);
    }
  };

  if (isLoadingDef || isLoadingVariants) return <div className="loading">Loading item definition details...</div>;
  if (errorDef || errorVariants) return <div className="error">Error loading item definition details</div>;
  if (!itemDefinition) return <div className="error">Item Definition not found.</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
        <button onClick={() => navigate('/item-definitions')} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          &larr; Back to Item Definitions
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            <h1>{itemDefinition.name}</h1>
            {itemDefinition.description && <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{itemDefinition.description}</p>}
          </div>
          {!isCreating && (
            <button onClick={() => setIsCreating(true)} className="btn-primary">
              Add Variant
            </button>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="form-container">
          <h2>{editingVariant ? 'Edit Variant' : `Add New Variant to ${itemDefinition.name}`}</h2>
          <form onSubmit={handleSubmit}>
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
                {editingVariant ? 'Update Variant' : 'Add Variant'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {variants && variants.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Barcode</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr key={variant.id}>
                  <td>{variant.name}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No variants created for this definition yet.</p>
        </div>
      )}
    </div>
  );
};
