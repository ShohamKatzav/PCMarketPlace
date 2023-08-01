using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DealRepository : IDealRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public DealRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<IEnumerable<DealDto>> GetAvailableDealsAsync(int userId, int currentPage, int tableSize)
        {
            int itemsToSkip = (currentPage - 1) * tableSize;

            return await _context.Deals.Where(deal => deal.AppUserId != userId && deal.Status == "Available")
            .Include(d => d.Products).ThenInclude(p => p.ProductPhoto)
            .ProjectTo<DealDto>(_mapper.ConfigurationProvider)
            .Skip(itemsToSkip)
            .Take(tableSize)
            .ToListAsync();
        }

        public async Task<IEnumerable<DealDto>> GetDealsForUserAsync(int userId, int currentPage, int tableSize)
        {
            int itemsToSkip = (currentPage - 1) * tableSize;

            return await _context.Deals.Where(deal => deal.AppUserId == userId)
            .Include(d => d.Products).ThenInclude(p => p.ProductPhoto)
            .ProjectTo<DealDto>(_mapper.ConfigurationProvider)
            .Skip(itemsToSkip)
            .Take(tableSize)
            .ToListAsync();
        }
        public async Task<DealDto> GetDealAsync(int dealid)
        {
            return await _context.Deals
            .Include(d => d.Products).ThenInclude(p => p.ProductPhoto)
            .ProjectTo<DealDto>(_mapper.ConfigurationProvider)
            .Where(d => d.Id == dealid).SingleOrDefaultAsync();
        }
        public async Task<int> GetDealTotalCountAsync(int userId, string listType)
        {
            return await _context.Deals
            .Where(deal => listType == "All Deals" ? (deal.AppUserId != userId && deal.Status == "Available") : deal.AppUserId == userId)
            .CountAsync();
        }

        public async Task<Deal> GetDealForUpdateAsync(int dealid)
        {
            return await _context.Deals.Include(p => p.Products)
            .ThenInclude(p => p.ProductPhoto)
            .Include(d => d.DealPhoto)
            .Where(d => d.Id == dealid).SingleOrDefaultAsync();
        }

        public async Task<Product> GetProductForUpdateAsync(int productid)
        {
            return await _context.Products.Include(p => p.ProductPhoto)
            .Where(p => p.Id == productid).SingleOrDefaultAsync();
        }

        public void Insert(Deal deal)
        {
            _context.Deals.Add(deal);
        }

        public void Remove(Deal deal)
        {
            _context.Deals.Remove(deal);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }


        public void Update(Deal deal)
        {
            _context.Entry(deal).State = EntityState.Modified;
        }
        public void Update(Product product)
        {
            _context.Entry(product.ProductPhoto).State = EntityState.Modified;
            _context.Entry(product).State = EntityState.Modified;
        }

    }
}