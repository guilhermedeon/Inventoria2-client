import { useState } from 'react';
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '../hooks/use-tags';
import type { Tag } from '../types';

export const TagsPage = () => {
  const { data: tags, isLoading, error } = useTags();
  const createTag = useCreateTag();
  const updateTag = useUpdateTag();
  const deleteTag = useDeleteTag();

  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId') || '';

    try {
      if (editingTag) {
        await updateTag.mutateAsync({
          id: editingTag.id,
          data: { ...formData, userId },
        });
      } else {
        await createTag.mutateAsync({ ...formData, userId });
      }
      setFormData({ name: '', slug: '' });
      setIsCreating(false);
      setEditingTag(null);
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({ name: tag.name, slug: tag.slug });
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      await deleteTag.mutateAsync(id);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', slug: '' });
    setIsCreating(false);
    setEditingTag(null);
  };

  if (isLoading) return <div className="loading">Loading tags...</div>;
  if (error) return <div className="error">Error loading tags</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Tags</h1>
        {!isCreating && (
          <button onClick={() => setIsCreating(true)} className="btn-primary">
            Create Tag
          </button>
        )}
      </div>

      {isCreating && (
        <div className="form-container">
          <h2>{editingTag ? 'Edit Tag' : 'Create New Tag'}</h2>
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
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={createTag.isPending || updateTag.isPending}>
                {editingTag ? 'Update' : 'Create'}
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
              <th>Slug</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags?.map((tag) => (
              <tr key={tag.id}>
                <td>{tag.name}</td>
                <td>{tag.slug}</td>
                <td>{new Date(tag.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleEdit(tag)} className="btn-secondary" style={{ marginRight: '0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(tag.id)} className="btn-danger">
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
