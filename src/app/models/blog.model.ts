export interface Blog {
  blog_id: string;
  title: string;
  excerpt: string;
  image_link?: string; // có thể null
  created_at: string;
  updated_at: string;
  doctor_id: string;
}
