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
        Task<IEnumerable<DealDto>> GetAvailableDealsAsync(int userId, int currentPage, int tableSize);
        Task<IEnumerable<DealDto>> GetDealsForUserAsync(int userId, int currentPage, int tableSize);
        Task<int> GetDealTotalCountAsync(int userId, string listType);
        Task<DealDto> GetDealAsync(int dealid);
        Task<Deal> GetDealForUpdateAsync(int dealid);
        Task<Product> GetProductForUpdateAsync(int productid);
        void Insert(Deal deal);
        void Remove(Deal deal);
        Task<bool> SaveAllAsync();
        void Update(Deal deal);
        void Update(Product product);
    }
}