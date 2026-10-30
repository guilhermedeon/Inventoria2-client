import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useInventoryQuery } from '../hooks/use-inventories';
import { useInventoryItems, useCreateInventoryItem, useUpdateInventoryItem, useDeleteInventoryItem } from '../hooks/use-inventory-items';
import { useItemVariants } from '../hooks/use-item-variants';
import { usePackDefinitions } from '../hooks/use-pack-definitions';
import type { InventoryItem } from '../types';

export const InventoryDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const { data: inventory, isLoading: isLoadingInventory, error: errorInventory } = useInventoryQuery(id!);
  const { data: allItems, isLoading: isLoadingItems, error: errorItems } = useInventoryItems();
  const { data: variants } = useItemVariants();
  const { data: packs } = usePackDefinitions();
  
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();

  const items = allItems?.filter((item) => item.inventoryId === id);

  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [itemType, setItemType] = useState<'variant' | 'pack'>('variant');
  const [actionError, setActionError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    itemVariantId: '',
    packDefinitionId: '',
    quantity: 1,
    notes: '',
    serialNumber: '',
    assetNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    const effectiveUserId = userId || '';

    const data = {
      ...formData,
      userId: effectiveUserId,
      inventoryId: id!,
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
      setActionError('Failed to save inventory item. Please check your input.');
    }
  };

  const resetForm = () => {
    setFormData({
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
      itemVariantId: item.itemVariantId || '',
      packDefinitionId: item.packDefinitionId || '',
      quantity: item.quantity,
      notes: item.notes || '',
      serialNumber: item.serialNumber || '',
      assetNumber: item.assetNumber || '',
    });
    setIsCreating(true);
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to remove this item from the inventory?')) {
      setActionError(null);
      try {
        await deleteItem.mutateAsync(itemId);
      } catch (error) {
        console.error('Failed to delete inventory item:', error);
        setActionError('Failed to delete inventory item.');
      }
    }
  };

  if (isLoadingInventory || isLoadingItems) return <div className="loading">Loading inventory details...</div>;
  if (errorInventory || errorItems) return <div className="error">Error loading inventory details</div>;
  if (!inventory) return <div className="error">Inventory not found.</div>;

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
        <button onClick={() => navigate('/inventories')} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          &larr; Back to Inventories
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            <h1>{inventory.name}</h1>
            {inventory.description && <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{inventory.description}</p>}
          </div>
          {!isCreating && (
            <button onClick={() => setIsCreating(true)} className="btn-primary">
              Add Item to Box
            </button>
          )}
        </div>
      </div>

      {actionError && <div className="error">{actionError}</div>}

      {isCreating && (
        <div className="form-container">
          <h2>{editingItem ? 'Edit Item' : `Add Item to ${inventory.name}`}</h2>
          <form onSubmit={handleSubmit}>
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
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setFormData({ ...formData, quantity: Number.isNaN(val) ? 1 : val });
                }}
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
                {editingItem ? 'Update Item' : 'Add to Box'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {items && items.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Serial #</th>
                <th>Asset #</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const variant = variants?.find((v) => v.id === item.itemVariantId);
                const pack = packs?.find((p) => p.id === item.packDefinitionId);
                const itemName = variant?.name || pack?.name || 'Unknown';
                const itemTypeLabel = variant ? 'Variant' : 'Pack';

                return (
                  <tr key={item.id}>
                    <td>{itemName}</td>
                    <td>{itemTypeLabel}</td>
                    <td>{item.quantity}</td>
                    <td>{item.serialNumber || '-'}</td>
                    <td>{item.assetNumber || '-'}</td>
                    <td>
                      <button onClick={() => handleEdit(item)} className="btn-secondary" style={{ marginRight: '0.5rem' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="btn-danger">
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>This box is empty.</p>
        </div>
      )}
    </div>
  );
};
