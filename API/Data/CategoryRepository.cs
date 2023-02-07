using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DataContext _context;

        public CategoryRepository(DataContext context)
        {
            _context = context;
        }
        public IEnumerable<Category> GetCategories()
        {
            return  _context.Categories.ToList();
        }
        public void Add(Category category)
        {
            _context.Categories.Add(category);
        }
        public void Remove(int categoryId)
        {
            Category categoryToRemove = _context.Categories.Where(c => c.Id == categoryId).SingleOrDefault();
            _context.Categories.Remove(categoryToRemove);
        }
        public async Task<Category> GetCategoryById(int categoryId)
        {
            return await _context.Categories.Where(c => c.Id == categoryId).SingleOrDefaultAsync();
        }
        public async Task<Category> GetCategoryByName(string categoryName)
        {
            return await _context.Categories.Where(c => c.Name == categoryName).SingleOrDefaultAsync();
        }

        public void Update(Category deal)
        {
            _context.Entry(deal).State = EntityState.Modified;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}