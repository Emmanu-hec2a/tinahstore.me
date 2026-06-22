import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import DataTable from '../components/ui/DataTable';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import SearchInput from '../components/ui/SearchInput';
import SelectFilter from '../components/ui/SelectFilter';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { productsService } from '../services/products';
import { categoriesService } from '../services/categories';
import { toast } from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch categories once on mount for the filter dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoriesService.list();
        // DRF may return a paginated object { count, results: [...] } or a plain array
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setCategories([
          { label: 'All Categories', value: 'all' },
          ...list.map(c => ({ label: c.name, value: c.slug })),
        ]);
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };
    fetchCats();
  }, []);

  // Fetch products whenever search or category filter changes
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productsService.list({
        search,
        category: category === 'all' ? '' : category,
      });
      // Unwrap paginated response
      const list = Array.isArray(data) ? data : (data.results ?? []);
      setProducts(list);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const handleToggleActive = async (slug, currentState) => {
    try {
      await productsService.toggleActive(slug, !currentState);
      setProducts(prev =>
        prev.map(p => p.slug === slug ? { ...p, is_active: !currentState } : p)
      );
      toast.success(`Product ${!currentState ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await productsService.delete(confirmDelete);
      setProducts(prev => prev.filter(p => p.slug !== confirmDelete));
      toast.success('Product deleted');
    } catch (err) {
      toast.error('Failed to delete product');
    } finally {
      setConfirmDelete(null);
    }
  };

  const columns = [
    {
      header: 'Image',
      render: (row) => (
        <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
          {row.primary_image ? (
            <img
              src={row.primary_image}
              alt={row.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon size={16} className="text-neutral-400" />
          )}
        </div>
      ),
    },
    {
      header: 'Name',
      accessor: 'name',
      className: 'font-semibold text-neutral-900',
    },
    {
      header: 'Category',
      // category may be a nested object or a plain string depending on serializer
      render: (row) => (
        <span className="text-neutral-500">
          {typeof row.category === 'object' ? row.category?.name : row.category}
        </span>
      ),
    },
    {
      header: 'Price',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-mono text-xs font-bold">
            KSh {Number(row.price).toLocaleString()}
          </span>
          {row.original_price && (
            <span className="text-[10px] text-neutral-400 line-through">
              KSh {Number(row.original_price).toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Stock',
      render: (row) => {
        const stock = row.stock;
        const colorClass =
          stock > 10
            ? 'text-green-600 bg-green-50'
            : stock > 0
            ? 'text-orange-600 bg-orange-50'
            : 'text-red-600 bg-red-50';
        return (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
            {stock} in stock
          </span>
        );
      },
    },
    {
      header: 'Active',
      render: (row) => (
        <ToggleSwitch
          checked={row.is_active}
          onChange={() => handleToggleActive(row.slug, row.is_active)}
        />
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Link
            to={`/products/${row.slug}/edit`}
            className="p-1.5 text-neutral-400 hover:text-cyan-500 hover:bg-cyan-50 rounded-md transition-all"
            title="Edit Product"
          >
            <Pencil size={18} />
          </Link>
          <button
            onClick={() => setConfirmDelete(row.slug)}
            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
            title="Delete Product"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-neutral-900">Store Inventory</h2>
            <span className="bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {products.length} items
            </span>
          </div>
          <Link to="/products/new" className="btn btn-primary gap-2">
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-card shadow-sm border border-neutral-100">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name..."
          />
          <SelectFilter
            options={categories}
            value={category}
            onChange={setCategory}
          />
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
            }}
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700 ml-auto"
          >
            Reset
          </button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={products}
          isLoading={isLoading}
          emptyMessage="No products found. Add your first product to get started."
        />
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Product?"
        message="This will remove the product and its variants from the store. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </AdminLayout>
  );
};

export default Products;