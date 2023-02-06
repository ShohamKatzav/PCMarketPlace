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
        Task<IEnumerable<DealDto>> GetDealsAsync();
        Task<IEnumerable<DealDto>> GetDealsForUserAsync(int userId);
        Task<DealDto>GetDealAsync(int dealid);
        Task<Deal>GetDealForUpdateAsync(int dealid);
        void Insert(Deal deal);
        void Remove(Deal deal);
        Task<bool> SaveAllAsync();
        void Update(Deal deal);
    }
}