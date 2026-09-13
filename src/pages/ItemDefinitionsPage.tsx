import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItemDefinitionsQuery, useCreateItemDefinitionMutation, useDeleteItemDefinitionMutation } from '../hooks/use-item-definitions';
import { useCategoriesQuery } from '../hooks/use-categories';
import type { CreateItemDefinitionDto } from '../types';

export function ItemDefinitionsPage() {
  const navigate = useNavigate();
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

      <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {itemDefinitions?.map((item) => (
          <div 
            key={item.id} 
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
            onClick={() => navigate(`/item-definitions/${item.id}`)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-primary)', fontSize: '1.25rem' }}>{item.name}</h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {item.categoryId && (
                  <span><strong>Category:</strong> {categories?.find((c) => c.id === item.categoryId)?.name || 'Unknown'}</span>
                )}
                {item.brand && <span><strong>Brand:</strong> {item.brand}</span>}
                {item.model && <span><strong>Model:</strong> {item.model}</span>}
                {item.sku && <span><strong>SKU:</strong> {item.sku}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
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
