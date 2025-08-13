import axios from 'axios';
import { Product } from '../types';

const BASE_URL = 'http://localhost:3001/products';

export const fetchProducts = () => axios.get<Product[]>(BASE_URL);

export const addProduct = (product: Omit<Product, 'id'>) =>
  axios.post<Product>(BASE_URL, product);

export const updateProduct = (id: string, product: Product) =>
  axios.put<Product>(`${BASE_URL}/${id}`, product);

export const deleteProductById = (id: string) =>
  axios.delete(`${BASE_URL}/${id}`);

export const addCommentToProduct = async (productId: string, comment: { id: string, productId: string, description: string, date: string }) => {
  const productRes = await axios.get(`${BASE_URL}/${productId}`);
  const product = productRes.data;
  const updatedComments = [...(product.comments || []), comment];
  await axios.patch(`${BASE_URL}/${productId}`, {
    comments: updatedComments,
  });

  return comment;
}

export const deleteCommentFromProduct = async (productId: string, commentId: string) => {
  const productRes = await axios.get(`${BASE_URL}/${productId}`);
  const product = productRes.data;

  const updatedComments = (product.comments || []).filter(
    (comment: { id: string }) => comment.id !== commentId
  );

  return axios.patch(`${BASE_URL}/${productId}`, { comments: updatedComments });
}