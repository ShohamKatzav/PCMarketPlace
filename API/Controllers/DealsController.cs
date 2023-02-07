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
                DealPhoto = new DealPhoto{Url="https://www.creativefabrica.com/wp-content/uploads/2018/12/Deal-icon-by-back1design1.jpg"}
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
            deal.LastModified = DateTime.Now;
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

        [HttpPost("add-photo")] // api/users/add-photo
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            Request.Headers.TryGetValue("DealId", out var headerValue);

            var dealId = headerValue;
            var deal = await _dealRepository.GetDealForUpdateAsync(int.Parse(dealId));
            var result = await _photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new DealPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            deal.DealPhoto = photo;

            if (await _dealRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetDeal", new { dealId = deal.Id }, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");

        }
        [HttpDelete("delete-photo/{dealId}")] // api/users/delete-photo/1
        public async Task<ActionResult> DeletePhoto(int dealId)
        {
            var deal = await _dealRepository.GetDealForUpdateAsync(dealId);

            var photo = deal.DealPhoto;

            if (photo == null) return NotFound();

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            deal.DealPhoto = new DealPhoto() { Url = "https://www.creativefabrica.com/wp-content/uploads/2018/12/Deal-icon-by-back1design1.jpg" };

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete the photo");
        }
    }
}