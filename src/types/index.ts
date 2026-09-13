export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ItemDefinition {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  sku?: string;
  categoryId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ItemVariant {
  id: string;
  itemDefinitionId: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PackItem {
  itemVariantId: string;
  quantity: number;
}

export interface PackDefinition {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  items: PackItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface Inventory {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  parentInventoryId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InventoryItem {
  id: string;
  inventoryId: string;
  itemVariantId?: string;
  packDefinitionId?: string;
  quantity: number;
  notes?: string;
  serialNumber?: string;
  assetNumber?: string;
  categoryId?: string;
  createdAt: string;
  updatedAt?: string;
}

// Form types for creation/updates
export interface CreateCategoryDto {
  userId: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface UpdateCategoryDto {
  userId: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface CreateTagDto {
  userId: string;
  name: string;
  slug: string;
}

export interface UpdateTagDto {
  userId: string;
  name: string;
  slug: string;
}

export interface CreateItemDefinitionDto {
  userId: string;
  name: string;
  description?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  sku?: string;
  categoryId?: string;
}

export interface UpdateItemDefinitionDto {
  userId: string;
  name: string;
  description?: string;
  brand?: string;
  manufacturer?: string;
  model?: string;
  sku?: string;
  categoryId?: string;
}

export interface CreateItemVariantDto {
  userId: string;
  itemDefinitionId: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
}

export interface UpdateItemVariantDto {
  userId: string;
  itemDefinitionId: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
}

export interface CreatePackDefinitionDto {
  userId: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  items: PackItem[];
}

export interface UpdatePackDefinitionDto {
  userId: string;
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  items: PackItem[];
}

export interface CreateInventoryDto {
  userId: string;
  name: string;
  description?: string;
  categoryId?: string;
  parentInventoryId?: string;
}

export interface UpdateInventoryDto {
  userId: string;
  name: string;
  description?: string;
  categoryId?: string;
  parentInventoryId?: string;
}

export interface CreateInventoryItemDto {
  userId: string;
  inventoryId: string;
  itemVariantId?: string;
  packDefinitionId?: string;
  quantity: number;
  notes?: string;
  serialNumber?: string;
  assetNumber?: string;
  categoryId?: string;
}

export interface UpdateInventoryItemDto {
  userId: string;
  inventoryId: string;
  itemVariantId?: string;
  packDefinitionId?: string;
  quantity: number;
  notes?: string;
  serialNumber?: string;
  assetNumber?: string;
  categoryId?: string;
}
