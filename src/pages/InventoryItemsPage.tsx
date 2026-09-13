import { useState } from 'react';
import { useInventoryItems, useCreateInventoryItem, useUpdateInventoryItem, useDeleteInventoryItem } from '../hooks/use-inventory-items';
import { useInventoriesQuery } from '../hooks/use-inventories';
import { useItemVariants } from '../hooks/use-item-variants';
import { usePackDefinitions } from '../hooks/use-pack-definitions';
import type { InventoryItem, Inventory } from '../types';

export const InventoryItemsPage = () => {
  const { data: items, isLoading, error } = useInventoryItems();
  const { data: inventories } = useInventoriesQuery();
  const { data: variants } = useItemVariants();
  const { data: packs } = usePackDefinitions();
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();

  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemType, setItemType] = useState<'variant' | 'pack'>('variant');
  const [formData, setFormData] = useState({
    inventoryId: '',
    itemVariantId: '',
    packDefinitionId: '',
    quantity: 1,
    notes: '',
    serialNumber: '',
    assetNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId') || '';

    const data = {
      ...formData,
      userId,
      itemVariantId: itemType === 'variant' ? formData.itemVariantId : undefined,
      packDefinitionId: itemType === 'pack' ? formData.packDefinitionId : undefined,
    };

    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, data });
      } else {
        await createItem.mutateAsync(data);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save inventory item:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      inventoryId: '',
      itemVariantId: '',
      packDefinitionId: '',
      quantity: 1,
      notes: '',
      serialNumber: '',
      assetNumber: '',
    });
    setIsCreating(false);
    setEditingItem(null);
    setItemType('variant');
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setItemType(item.itemVariantId ? 'variant' : 'pack');
    setFormData({
      inventoryId: item.inventoryId,
      itemVariantId: item.itemVariantId || '',
      packDefinitionId: item.packDefinitionId || '',
      quantity: item.quantity,
      notes: item.notes || '',
      serialNumber: item.serialNumber || '',
      assetNumber: item.assetNumber || '',
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      await deleteItem.mutateAsync(id);
    }
  };

  if (isLoading) return <div className="loading">Loading inventory items...</div>;
  if (error) return <div className="error">Error loading inventory items</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Inventory Items</h1>
        {!isCreating && (
          <button onClick={() => setIsCreating(true)} className="btn-primary">
            Add Item
          </button>
        )}
      </div>

      {isCreating && (
        <div className="form-container">
          <h2>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="inventoryId">Inventory Location</label>
              <select
                id="inventoryId"
                value={formData.inventoryId}
                onChange={(e) => setFormData({ ...formData, inventoryId: e.target.value })}
                required
              >
                <option value="">Select inventory</option>
                {inventories?.map((inv: Inventory) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Item Type</label>
              <div>
                <label style={{ marginRight: '1rem' }}>
                  <input
                    type="radio"
                    value="variant"
                    checked={itemType === 'variant'}
                    onChange={(e) => setItemType(e.target.value as 'variant' | 'pack')}
                  />{' '}
                  Item Variant
                </label>
                <label>
                  <input
                    type="radio"
                    value="pack"
                    checked={itemType === 'pack'}
                    onChange={(e) => setItemType(e.target.value as 'variant' | 'pack')}
                  />{' '}
                  Pack
                </label>
              </div>
            </div>

            {itemType === 'variant' ? (
              <div className="form-group">
                <label htmlFor="itemVariantId">Item Variant</label>
                <select
                  id="itemVariantId"
                  value={formData.itemVariantId}
                  onChange={(e) => setFormData({ ...formData, itemVariantId: e.target.value })}
                  required
                >
                  <option value="">Select variant</option>
                  {variants?.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="packDefinitionId">Pack Definition</label>
                <select
                  id="packDefinitionId"
                  value={formData.packDefinitionId}
                  onChange={(e) => setFormData({ ...formData, packDefinitionId: e.target.value })}
                  required
                >
                  <option value="">Select pack</option>
                  {packs?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="serialNumber">Serial Number</label>
                <input
                  id="serialNumber"
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="assetNumber">Asset Number</label>
                <input
                  id="assetNumber"
                  type="text"
                  value={formData.assetNumber}
                  onChange={(e) => setFormData({ ...formData, assetNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={createItem.isPending || updateItem.isPending}>
                {editingItem ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
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
              <th>Inventory</th>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Serial #</th>
              <th>Asset #</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => {
              const inventory = inventories?.find((i: Inventory) => i.id === item.inventoryId);
              const variant = variants?.find((v) => v.id === item.itemVariantId);
              const pack = packs?.find((p) => p.id === item.packDefinitionId);
              const itemName = variant?.name || pack?.name || 'Unknown';
              const itemType = variant ? 'Variant' : 'Pack';

              return (
                <tr key={item.id}>
                  <td>{inventory?.name || item.inventoryId}</td>
                  <td>{itemName}</td>
                  <td>{itemType}</td>
                  <td>{item.quantity}</td>
                  <td>{item.serialNumber || '-'}</td>
                  <td>{item.assetNumber || '-'}</td>
                  <td>
                    <button onClick={() => handleEdit(item)} className="btn-secondary" style={{ marginRight: '0.5rem' }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="btn-danger">
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
