using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public ProductRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<IEnumerable<ProductDto>> GetProductsAsync()
        {
            return await _context.Products
            .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
        }
    }
}