import { useState } from 'react';
import { usePackDefinitions, useCreatePackDefinition, useUpdatePackDefinition, useDeletePackDefinition } from '../hooks/use-pack-definitions';
import { useItemVariants } from '../hooks/use-item-variants';
import type { PackDefinition, PackItem } from '../types';

export const PackDefinitionsPage = () => {
  const { data: packs, isLoading, error } = usePackDefinitions();
  const { data: variants } = useItemVariants();
  const createPack = useCreatePackDefinition();
  const updatePack = useUpdatePackDefinition();
  const deletePack = useDeletePackDefinition();

  const [isCreating, setIsCreating] = useState(false);
  const [editingPack, setEditingPack] = useState<PackDefinition | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    barcode: '',
    items: [] as PackItem[],
  });

  const addPackItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemVariantId: '', quantity: 1 }],
    });
  };

  const updatePackItem = (index: number, field: keyof PackItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData({ ...formData, items: updatedItems });
  };

  const removePackItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId') || '';

    try {
      if (editingPack) {
        await updatePack.mutateAsync({
          id: editingPack.id,
          data: { ...formData, userId },
        });
      } else {
        await createPack.mutateAsync({ ...formData, userId });
      }
      setFormData({ name: '', description: '', sku: '', barcode: '', items: [] });
      setIsCreating(false);
      setEditingPack(null);
    } catch (error) {
      console.error('Failed to save pack:', error);
    }
  };

  const handleEdit = (pack: PackDefinition) => {
    setEditingPack(pack);
    setFormData({
      name: pack.name,
      description: pack.description || '',
      sku: pack.sku || '',
      barcode: pack.barcode || '',
      items: pack.items || [],
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this pack?')) {
      await deletePack.mutateAsync(id);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', sku: '', barcode: '', items: [] });
    setIsCreating(false);
    setEditingPack(null);
  };

  if (isLoading) return <div className="loading">Loading packs...</div>;
  if (error) return <div className="error">Error loading packs</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Pack Definitions</h1>
        {!isCreating && (
          <button onClick={() => setIsCreating(true)} className="btn-primary">
            Create Pack
          </button>
        )}
      </div>

      {isCreating && (
        <div className="form-container">
          <h2>{editingPack ? 'Edit Pack' : 'Create New Pack'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
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

            <div className="form-group">
              <label>Pack Contents</label>
              {formData.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <select
                    value={item.itemVariantId}
                    onChange={(e) => updatePackItem(index, 'itemVariantId', e.target.value)}
                    style={{ flex: 2 }}
                    required
                  >
                    <option value="">Select variant</option>
                    {variants?.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updatePackItem(index, 'quantity', parseInt(e.target.value))}
                    placeholder="Qty"
                    style={{ flex: 1 }}
                    required
                  />
                  <button type="button" onClick={() => removePackItem(index)} className="btn-danger">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addPackItem} className="btn-secondary">
                Add Item
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={createPack.isPending || updatePack.isPending}>
                {editingPack ? 'Update' : 'Create'}
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
              <th>Description</th>
              <th>Items Count</th>
              <th>SKU</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packs?.map((pack) => (
              <tr key={pack.id}>
                <td>{pack.name}</td>
                <td>{pack.description || '-'}</td>
                <td>{pack.items?.length || 0}</td>
                <td>{pack.sku || '-'}</td>
                <td>{new Date(pack.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(pack)} className="btn-secondary" style={{ marginRight: '0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(pack.id)} className="btn-danger">
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
};
