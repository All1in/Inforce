export interface Product {
    id: string;
    imageUrl: string;
    name: string;
    count: number;
    size: { width: number; height: number };
    weight: string;
    comments: Comment[];
  }
  
  export interface Comment {
    id: string;
    productId: string;
    description: string;
    date: string;
  }  