import { Grid, List } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as productsApi from '../api/productsApi';
import { deleteProduct, setProducts } from '../store/slices/productsSlice.ts';
import { RootState } from '../store/store';
import { Product } from '../types';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import ProductModal from './ProductModal';

import '../styles/ProductList.css';


const ProductList: React.FC = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.products.products);
    console.log('products', products)

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [sortOption, setSortOption] = useState<'alphabetical' | 'count' | 'date'>('alphabetical');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOption === 'alphabetical') {
            return a.name.localeCompare(b.name) || a.count - b.count;
        }
        if (sortOption === 'count') {
            return b.count - a.count || a.name.localeCompare(b.name);
        }
        if (sortOption === 'date') {
            return Number(b.id) - Number(a.id);
        }
        return 0;
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productsApi.fetchProducts();
                dispatch(setProducts(response.data));
            }
            catch (error) {
                console.error('Failed to fetch products', error);
            }
        };
        fetchProducts();
    }, [dispatch]);

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProductClick = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);

    };

    const confirmDelete = async () => {
        if (productToDelete) {
            try {
                await productsApi.deleteProductById(productToDelete.id);
                dispatch(deleteProduct(productToDelete.id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    return (
        <div className="product-list-container">
            <div className="top-bar">
                <button onClick={handleAddProduct}>Add Product</button>

                <select className='' value={sortOption} onChange={(e) => setSortOption(e.target.value as any)}>
                    <option value="alphabetical">Sort: Alphabetical</option>
                    <option value="count">Sort: By Count</option>
                    <option value="date">Sort: By Date Added</option>
                </select>

                <div className="view-toggle">
                    <button
                        className={viewMode === 'grid' ? 'active' : ''}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        className={viewMode === 'list' ? 'active' : ''}
                        onClick={() => setViewMode('list')}
                        title="List View"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            <div className={`product-list ${viewMode}`}>
                {sortedProducts.length === 0 ? (
                    <div className="empty-state">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                            alt="No products"
                            className="empty-icon"
                        />
                        <h2>No products found</h2>
                        <p>Your product list is empty. Click the button below to add your first product!</p>
                        <button className="btn add-btn" onClick={handleAddProduct}>Add Product</button>
                    </div>
                ) : (
                    sortedProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <Link to={`/product/${product.id}`}>
                                <img src={product.imageUrl} alt={product.name} />
                                <h3>{product.name}</h3>
                            </Link>
                            <p>Count: {product.count}</p>
                            <p>Size: {product.size.width} x {product.size.height}</p>
                            <p>Weight: {product.weight}</p>
                            <div className="actions">
                                <button className="btn" onClick={() => handleEditProduct(product)}>✏️ Edit</button>
                                <button className="btn" onClick={() => handleDeleteProductClick(product)}>🗑️ Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct ?? undefined}
            />

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                productName={productToDelete?.name}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

        </div>
    );
};

export default ProductList;

