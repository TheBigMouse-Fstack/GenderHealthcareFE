import { Component, inject } from '@angular/core';

import { BLOGS, Blog } from '../../data/blogs.mock';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-blogs-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './blogs-page.component.html',
  styleUrl: './blogs-page.component.css',
})
export class BlogsPageComponent {
  private router = inject(Router);
  allBlogs: Blog[] = BLOGS;
  categories: string[] = [
    'All',
    'Community',
    'Mental Health',
    'Gender Stories',
    'Legal',
    'Education',
  ];
  selectedCategory: string = 'All';
  searchValue: string = '';
  // Pagination
  page = 1;
  perPage = 6;
  get maxPage() {
    return Math.ceil(this.filteredBlogs.length / this.perPage);
  }
  selectedTag: string | null = null;

  filterByTag(tag: string) {
    this.selectedTag = tag;
    this.selectedCategory = 'All'; // Clear category filter nếu muốn
    this.page = 1;
  }

  get filteredBlogs(): Blog[] {
    let result = this.allBlogs;
    if (this.selectedCategory !== 'All') {
      result = result.filter((b) => b.category === this.selectedCategory);
    }
    if (this.selectedTag) {
      result = result.filter((b) => b.tags.includes(this.selectedTag!));
    }
    if (this.searchValue) {
      const key = this.searchValue.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(key) ||
          b.desc.toLowerCase().includes(key) ||
          b.author.toLowerCase().includes(key) ||
          b.tags.some((tag) => tag.toLowerCase().includes(key))
      );
    }
    return result;
  }

  clearTagFilter() {
    this.selectedTag = null;
  }

  get pageArray() {
    return Array.from({ length: this.maxPage });
  }
  get paginatedBlogs() {
    const start = (this.page - 1) * this.perPage;
    return this.filteredBlogs.slice(start, start + this.perPage);
  }
  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.page = 1;
  }
  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement)?.value ?? '';
    this.searchValue = val;
    this.page = 1;
  }
  goToPage(pg: number) {
    if (pg < 1 || pg > this.maxPage) return;
    this.page = pg;
  }
}
