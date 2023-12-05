using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Components.Forms;
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

        private async Task<IEnumerable<DealDto>> ApplyFilters(IQueryable<Deal> query, int currentPage, int tableSize,
        string category = null, string minPrice = null, string maxPrice = null)
        {
            // Calculate items to skip
            int itemsToSkip = (currentPage - 1) * tableSize;


            // Apply category filter on the server side
            query = ApplyCategoryFilter(query, category);
            query = ApplyPriceFilter(query, minPrice, maxPrice);

            // Execute the query up to this point and bring the results into memory
            var dealsInMemory = await query
                .ToListAsync();

            var filteredDeals = dealsInMemory
                .Skip(itemsToSkip)
                .Take(tableSize);

            return _mapper.Map<IEnumerable<DealDto>>(filteredDeals);
        }

        private IQueryable<Deal> ApplyCategoryFilter(IQueryable<Deal> query, string category)
        {
            if (category != null && category != "Any")
            {
                query = query.Where(deal => deal.Products.Any(product => product.Category == category));
            }

            return query;
        }

        private IQueryable<Deal> ApplyPriceFilter(IQueryable<Deal> query, string minPrice, string maxPrice)
        {
            if (!string.IsNullOrEmpty(minPrice))
            {
                double.TryParse(minPrice, out double parsedMinPrice);
                query = query.Where(deal => deal.Products.Sum(product => product.Price) >= parsedMinPrice);
            }

            if (!string.IsNullOrEmpty(maxPrice))
            {
                double.TryParse(maxPrice, out double parsedMaxPrice);
                query = query.Where(deal => deal.Products.Sum(product => product.Price) <= parsedMaxPrice);
            }
            return query;
        }

        public async Task<IEnumerable<DealDto>> GetAvailableDealsAsync(int userId, int currentPage, int tableSize,
            string category = null, string minPrice = null, string maxPrice = null)
        {
            var query = _context.Deals
                .Where(deal => deal.AppUserId != userId)
                .Where(deal => deal.Status == "Available")
                .Include(d => d.Products).ThenInclude(p => p.ProductPhoto)
                .AsNoTracking();

            return await ApplyFilters(query, currentPage, tableSize, category, minPrice, maxPrice);
        }

        public async Task<IEnumerable<DealDto>> GetDealsForUserAsync(int userId, int currentPage, int tableSize,
            string category = null, string minPrice = null, string maxPrice = null)
        {
            var query = _context.Deals
                .Where(deal => deal.AppUserId == userId)
                .Include(d => d.Products).ThenInclude(p => p.ProductPhoto)
                .AsNoTracking();

            return await ApplyFilters(query, currentPage, tableSize, category, minPrice, maxPrice);
        }

        public async Task<int> GetDealTotalCountAsync(int userId, string listType, string category = null, string minPrice = null, string maxPrice = null)
        {
            IQueryable<Deal> dealsQuery = _context.Deals;

            dealsQuery = listType == "All Deals" ?
                dealsQuery.Where(deal => deal.AppUserId != userId)
                          .Where(deal => deal.Status == "Available")
                          .Include(d => d.Products) :
                dealsQuery.Where(deal => deal.AppUserId == userId)
                          .Include(d => d.Products);

            // Apply category and price filters
            dealsQuery = ApplyCategoryFilter(dealsQuery, category);
            dealsQuery = ApplyPriceFilter(dealsQuery, minPrice, maxPrice);
            var dealsInMemory = await dealsQuery
                .ToListAsync();

            return dealsInMemory.Count;
        }


        public async Task<DealDto> GetDealAsync(int dealid)
        {
            return await _context.Deals
            .Include(d => d.Products).ThenInclude(p => p.ProductPhoto)
            .AsNoTracking()
            .ProjectTo<DealDto>(_mapper.ConfigurationProvider)
            .Where(d => d.Id == dealid).SingleOrDefaultAsync();
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

        public async Task<bool> ApplyCategoryChangesForProducts(string oldCategory, string NewCategory = "Other")
        {
            var productsToUpdate = await _context.Products.Where(p => p.Category == oldCategory).ToListAsync();
            if (productsToUpdate.Count > 0)
            {
                foreach (var product in productsToUpdate)
                    product.Category = NewCategory;
                return true;
            }
            return false;

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