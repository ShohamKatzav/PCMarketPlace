using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IDealRepository
    {
        Task<IEnumerable<DealDto>> GetAvailableDealsAsync(int userId, int currentPage, int tableSize, string category = null, string minPrice = null, string maxPrice = null);
        Task<IEnumerable<DealDto>> GetDealsForUserAsync(int userId, int currentPage, int tableSize, string category = null, string minPrice = null, string maxPrice = null);
        Task<int> GetDealTotalCountAsync(int userId, string listType, string category = null, string minPrice = null, string maxPrice = null);
        Task<DealDto> GetDealAsync(int dealid);
        Task<Deal> GetDealForUpdateAsync(int dealid);
        Task<Product> GetProductForUpdateAsync(int productid);
        void Insert(Deal deal);
        void Remove(Deal deal);
        Task<bool> SaveAllAsync();
        void Update(Deal deal);
        void Update(Product product);
        Task<bool> ApplyCategoryChangesForProducts(string oldCategory, string NewCategory = "Other");
    }
}