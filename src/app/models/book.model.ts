export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  copiesAvailable: number;
  
  coverUrl?: string; 
  
  borrowings: any[]; 
  reviews: any[];    
}