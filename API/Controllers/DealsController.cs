using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class DealsController : BaseApiController
    {
        private readonly IDealRepository _dealRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public DealsController(IDealRepository dealRepository, IMapper mapper, IUserRepository userRepository, IPhotoService photoService)
        {
            _dealRepository = dealRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<DealsResponseDto>> GetDeals(int userId, int currentPage, int tableSize)
        {
            var deals = await _dealRepository.GetAvailableDealsAsync(userId, currentPage, tableSize);
            var totalCount = await _dealRepository.GetDealTotalCountAsync(userId, "All Deals");
            var dealsResponse = new DealsResponseDto{
                Deals = deals,
                totalCount = totalCount
            };
            return Ok(dealsResponse);
        }

        [HttpGet("GetDealsForUser/{userId}", Name = "GetDealsForUser")]
        public async Task<ActionResult<DealsResponseDto>> GetDealsForUser(int userId, int currentPage, int tableSize)
        {
            var deals = await _dealRepository.GetDealsForUserAsync(userId, currentPage, tableSize);
            var totalCount = await _dealRepository.GetDealTotalCountAsync(userId, "My Deals");
            var dealsResponse = new DealsResponseDto{
                Deals = deals,
                totalCount = totalCount
            };
            return Ok(dealsResponse);
        }
        
        [HttpGet("GetDeal/{dealId}", Name = "GetDeal")]
        public async Task<ActionResult<DealDto>> GetDealDto(int dealId)
        {
            var deal = await _dealRepository.GetDealAsync(dealId);
            return Ok(deal);
        }
        [HttpGet("GetProduct{productId}", Name = "GetProduct")]
        public async Task<ActionResult<ProductDto>> GetProductDto(int productId)
        {
            var product = await _dealRepository.GetProductForUpdateAsync(productId);
            return Ok(product);
        }

        [HttpPost("create")]
        public async Task<ActionResult<DealDto>> Create(CreateDealDto newDeal)
        {

            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            var deal = new Deal
            {
                Created = DateTime.Now,
                Status = "Available"
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
            deal.LastModified = DateTime.Now;
            _mapper.Map(dealUpdateDto, deal);

            _dealRepository.Update(deal);

            try
            {
                await _dealRepository.SaveAllAsync();
                return NoContent();
            }
            catch
            {
                return BadRequest("Failed to update deal.");
            }
        }

        [HttpDelete("delete-deal/{dealId}")]
        public async Task<ActionResult> DeleteDeal(int dealId)
        {

            var deal = await _dealRepository.GetDealForUpdateAsync(dealId);
            if (deal == null)
                return NotFound();

            _dealRepository.Remove(deal);

            if (await _dealRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to delete the deal");
        }

        [HttpPost("add-photo")] // api/deals/add-photo
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            Request.Headers.TryGetValue("ProductId", out var headerValue);

            var procuctId = headerValue;
            var product = await _dealRepository.GetProductForUpdateAsync(int.Parse(procuctId));
            var result = await _photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new ProductPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };
            if (product != null)
                product.ProductPhoto = photo;
            else
                return CreatedAtRoute("GetProduct", new { productId = -1 }, _mapper.Map<PhotoDto>(photo));

            if (await _dealRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetProduct", new { productId = product.Id }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");

        }
        [HttpDelete("delete-photo/{productId}")] // api/deals/delete-photo/1/1
        public async Task<ActionResult> DeletePhoto(int productId)
        {
            var product = await _dealRepository.GetProductForUpdateAsync(productId);

            if (product == null) return NotFound();
            var photo = product.ProductPhoto;

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            product.ProductPhoto = new ProductPhoto(){Url="./assets/no-image.jpeg"};

            try{
                if (await _dealRepository.SaveAllAsync()) return Ok();
            }
            catch
            {
                return BadRequest("Failed to delete the photo");
            }
            return BadRequest("Failed to delete the photo");

        }
    }
}
