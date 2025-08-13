import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, deleteProduct, updateProduct } from '../store/slices/productsSlice.ts';
import { Product } from '../types';
import * as productsApi from "../api/productsApi";

import "../styles/Modal.css";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product }) => {
  const [name, setName] = useState('');
  const [count, setCount] = useState(0);
  const [width, setWidth] = useState(0);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCount(product.count);
      setWeight(product.weight);
      setImageUrl(product.imageUrl);
      setWidth(product.size.width); 
      setHeight(product.size.height);
    }
  }, [product]);

  const handleSave = async () => {
    if (!name || !count || !weight || !imageUrl) {
      alert("Fields can`t be empty!")
      return;
    }
    const newProduct: Product = {
      name,
      count,
      weight,
      imageUrl,
      size: { 
        width: width,
        height: height
      },
      comments: product ? product.comments : [],
    };
    try {
      if (product) {
        await productsApi.updateProduct(product.id, newProduct);
        dispatch(updateProduct({ ...newProduct, id: product.id }));
      } else {
        const createdProduct = await productsApi.addProduct(newProduct);
        dispatch(addProduct(createdProduct.data));
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = () => {
    if (product) {
      dispatch(deleteProduct(product.id));
      onClose();
    };
  }

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{product ? 'Edit Product' : 'Add Product'}</h2>

        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Count</label>
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </div>

        <div className="form-group">
          <label>Weight</label>
          <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Height</label>
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
        </div>

        <div className="form-group">
          <label>Width</label>
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="btn primary" onClick={handleSave}>
            {product ? 'Save Changes' : 'Add Product'}
          </button>
          {product && (
            <button className="btn danger" onClick={handleDelete}>
              Delete Product
            </button>
          )}
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;