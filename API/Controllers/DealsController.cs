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

        [HttpGet("GetDealsForUser/{userId}", Name = "GetDealsForUser")]
        public async Task<ActionResult<IEnumerable<DealDto>>> GetDealsForUser(int userId)
        {
            var deals = await _dealRepository.GetDealsForUserAsync(userId);
            return Ok(deals);
        }

        

        [HttpGet("GetDeal/{dealId}", Name = "GetDeal")]
        public async Task<ActionResult<DealDto>> GetDealDto(int dealId)
        {
            var deal = await _dealRepository.GetDealAsync(dealId);
            return Ok(deal);
        }

        [HttpPost("create")]
        public async Task<ActionResult<DealDto>> Create(CreateDealDto newDeal)
        {

            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            var deal = new Deal
            {
                Created = DateTime.Now,
                Status = "Available",
            };
            _mapper.Map(newDeal, deal);
            user.Deals.Add(deal);

            if (await _userRepository.SaveAllAsync())
                return CreatedAtRoute("GetDeal", new { dealid = deal.Id }, _mapper.Map<DealDto>(deal));

            return BadRequest("Problem adding deal");
        }

        [HttpPut]
        public async Task<ActionResult> UpdateDeal(DealUpdateDto dealUpdateDto)
        {
            var deal = await _dealRepository.GetDealForUpdateAsync(dealUpdateDto.Id);
            deal.Description = dealUpdateDto.Description;
            List<Product> Products = _mapper.Map<List<Product>>(dealUpdateDto.Products);
            deal.Products = Products; 
            _dealRepository.Update(deal);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update deal");
        }

        [HttpDelete("delete-deal/{dealId}")]
        public async Task<ActionResult> DeleteDeal(int dealId)
        {

            var dealDto = await _dealRepository.GetDealAsync(dealId);
            if (dealDto == null)
                return NotFound();
            var deal = _mapper.Map<Deal>(dealDto);
            _dealRepository.Remove(deal);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete the deal");
        }
    }
}