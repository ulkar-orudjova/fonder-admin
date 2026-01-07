import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/layout';
import { useAuth } from '../../context/AuthContext';
import type { Product } from '../../types';
import $api from '../../api/api';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineX, HiOutlineSearch, HiOutlineRefresh, HiOutlinePhotograph } from 'react-icons/hi';

export const ProductsPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', details: '', price: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const imageUrl = import.meta.env.VITE_IMAGE_URL;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await $api.products.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.details?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', details: '', price: '' });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, details: product.details, price: String(product.price) });
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', details: '', price: '' });
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.details || !formData.price) {
      toast.error(t('common.fillAllFields'));
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('details', formData.details);
    data.append('price', formData.price);
    if (imageFile) {
      data.append('productImage', imageFile);
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        await $api.products.update(editingProduct._id, data);
        toast.success(t('products.updated'));
      } else {
        await $api.products.add(data);
        toast.success(t('products.added'));
      }
      closeModal();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data || t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {

    try {
       
          console.log("User confirmed delete");
          await $api.products.delete(product._id);
          toast.success(t('products.deleted'));
          fetchProducts();

    } catch (error: any) {
      console.log("Delete error:", error);
      toast.error(error.response?.data || t('common.error'));
    }
  };

  return (
    <>
      <Header title={t('products.title')} />
      <div className="page-scroll-container">
        
        {/* Modern Header Section */}
        <div className="content-header">
          <div className="content-header-left">
            <h1>{t('products.allProducts')}</h1>
            <p className="content-header-subtitle">{t('products.productsFound', { count: products.length })}</p>
          </div>
          <div className="content-header-actions">
            <div className="search-box">
              <HiOutlineSearch className="search-icon" />
              <input 
                type="text" 
                placeholder={t('products.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={fetchProducts} className="icon-btn" title={t('common.refresh')}>
              <HiOutlineRefresh className={loading ? 'animate-spin' : ''} />
            </button>
            {isAdmin && (
              <button onClick={openAddModal} className="btn btn-primary">
                <HiOutlinePlus className="w-5 h-5" />
                {t('products.addProduct')}
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <HiOutlinePhotograph className="w-16 h-16" />
            <h3>{t('products.notFound')}</h3>
            <p>{t('products.notFoundDesc')}</p>
          </div>
        ) : (
          <div className="products-grid-modern">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card-modern">
                <div className="product-image-wrapper">
                  {product.productImage ? (
                    <img 
                      src={product.productImage}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      <HiOutlinePhotograph className="w-12 h-12" />
                    </div>
                  )}
                  {isAdmin && (
                    <div className="product-actions-overlay">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="product-action-btn edit"
                        title={t('common.edit')}
                      >
                        <HiOutlinePencil />
                      </button>
                      <button 
                        onClick={() => handleDelete(product)}
                        className="product-action-btn delete"
                        title={t('common.delete')}
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  )}
                </div>
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-details">{product.details}</p>
                  <div className="product-footer">
                    <span className="product-price">{product.price},000 $</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modern Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                    {editingProduct ? <HiOutlinePencil className="w-5 h-5" /> : <HiOutlinePlus className="w-5 h-5" />}
                  </div>
                  <h3>{editingProduct ? t('products.editProduct') : t('products.newProduct')}</h3>
                </div>
                <button onClick={closeModal} className="close-btn">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="name">{t('products.name')}</label>
                    <input
                      type="text"
                      id="name"
                      className="form-input"
                      placeholder={t('products.enterName')}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="details">{t('products.details')}</label>
                    <input
                      type="text"
                      id="details"
                      className="form-input"
                      placeholder={t('products.enterDetails')}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">{t('products.price')} (₼)</label>
                    <input
                      type="number"
                      id="price"
                      className="form-input"
                      placeholder={t('products.enterPrice')}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      disabled={submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">{t('products.image')}</label>
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        id="image"
                        className="file-input"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        disabled={submitting}
                      />
                      <div className="file-input-label">
                        <HiOutlinePhotograph className="w-6 h-6" />
                        <span>{imageFile ? imageFile.name : t('products.selectImage')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={closeModal} className="btn btn-secondary">
                    {t('common.cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? <span className="spinner"></span> : editingProduct ? t('common.save') : t('products.addProduct')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
