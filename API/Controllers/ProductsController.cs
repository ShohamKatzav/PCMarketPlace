using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;


        public ProductsController(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        [HttpGet] // api/products
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
           var products = await _productRepository.GetProductsAsync();
           return Ok(products);
        }
    }
}