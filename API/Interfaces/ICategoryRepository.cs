using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Interfaces
{
    public interface ICategoryRepository
    {
        IEnumerable<Category> GetCategories();
        Task<bool> SaveAllAsync();
        Task<Category> GetCategoryById(int categoryId);
        Task<Category> GetCategoryByName(string categoryName);
        void Remove(int categoryId);
        void Add(Category category);
        void Update(Category deal);
    }
}