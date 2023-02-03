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
        Task<DealDto> GetDealAsync(int dealid);
        void Insert(Deal deal);
        Task<bool> SaveAllAsync();
    }
}