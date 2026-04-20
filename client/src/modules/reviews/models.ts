export interface Review {
  id: string;
  stayId: string;
  authorName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date
}
