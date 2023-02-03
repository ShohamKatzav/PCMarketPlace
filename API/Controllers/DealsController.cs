using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class DealsController : BaseApiController
    {
        private readonly IDealRepository _dealRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public DealsController(IDealRepository dealRepository, IMapper mapper, IUserRepository userRepository)
        {
            _dealRepository = dealRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DealDto>>> GetDeals()
        {
           var deals = await _dealRepository.GetDealsAsync();
           return Ok(deals);
        }

        [HttpGet("{dealid}", Name="GetDeal")] // api/users/lisa
        public async Task<ActionResult<DealDto>> GetDeal(int dealid)
        {
            var deal = await _dealRepository.GetDealAsync(dealid);
            return Ok(deal);
        }

        [HttpPost("create")]
        public async Task<ActionResult<DealDto>> Create(CreateDealDto newDeal)
        {

            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);

            var deal = new Deal
            {
                Products = _mapper.Map<List<Product>>(newDeal.Products),
                Created = DateTime.Now,
                Status = "Available",
            };
            _dealRepository.Insert(deal);
            await _dealRepository.SaveAllAsync();
            user.Deals.Add(deal);

            if (await _userRepository.SaveAllAsync())
                return CreatedAtRoute("GetDeal",new {dealid = deal.Id}, _mapper.Map<DealDto>(deal));

            return BadRequest("Problem adding deal");
            
    
            
        }
    }
}