using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;

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
        public void Add(string categoryName)
        {
            _context.Categories.Add(new Category(){Name=categoryName});
        }
        public void Remove(int categoryId)
        {
            Category categoryToRemove = _context.Categories.Where(c => c.Id == categoryId).SingleOrDefault();
            _context.Categories.Remove(categoryToRemove);
        }
        public void GetCategories(Category category)
        {
            Category categoryToUpdate = _context.Categories.Where(c => c.Id == category.Id).SingleOrDefault();
            categoryToUpdate.Name = category.Name;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}