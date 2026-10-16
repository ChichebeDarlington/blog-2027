export interface Post {
  _id: string; title: string; slug: string; excerpt: string; content?: string; coverImage: string;
  category: string; tags: string[]; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; status: 'draft' | 'published' | 'archived';
  featured: boolean; readingTime: number; publishedAt?: string; createdAt: string; updatedAt: string;
  seoTitle?: string; seoDescription?: string;
}
export interface Project {
  _id: string; title: string; slug: string; summary: string; content: string; coverImage: string;
  technologies: string[]; repositoryUrl: string; liveUrl: string; featured: boolean; status: 'draft' | 'published';
}
export interface ApiError { error?: { code?: string; message?: string } }
