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
        public async Task<IEnumerable<DealDto>> GetDealsAsync()
        {
            return await _context.Deals
            .ProjectTo<DealDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }
        public async Task<DealDto> GetDealAsync(int dealid)
        {
            return await _context.Deals
            .ProjectTo<DealDto>(_mapper.ConfigurationProvider)
            .Where(d=> d.Id == dealid).SingleOrDefaultAsync();
        }

        public void Insert(Deal deal)
        {
            _context.Deals.Add(deal);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }


        public void Update(Deal deal)
        {
            _context.Entry(deal).State = EntityState.Modified;
        }
    }
}