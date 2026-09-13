import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventoriesQuery, useCreateInventoryMutation, useDeleteInventoryMutation } from '../hooks/use-inventories';
import { useCategoriesQuery } from '../hooks/use-categories';
import type { CreateInventoryDto } from '../types';

export function InventoriesPage() {
  const navigate = useNavigate();
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

      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {inventories?.map((inventory) => (
          <div 
            key={inventory.id} 
            className="box-card"
            style={{ 
              background: 'var(--bg-tertiary)', 
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all var(--transition-normal)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '200px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => navigate(`/inventories/${inventory.id}`)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '1.25rem' }}>{inventory.name}</h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {inventory.description || 'No description provided.'}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {inventory.categoryId && (
                  <span><strong>Category:</strong> {categories?.find((c) => c.id === inventory.categoryId)?.name || 'Unknown'}</span>
                )}
                {inventory.parentInventoryId && (
                  <span><strong>Inside:</strong> {inventories.find((i) => i.id === inventory.parentInventoryId)?.name || 'Unknown'}</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(inventory.createdAt).toLocaleDateString()}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(inventory.id);
                }}
                className="btn-danger"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
