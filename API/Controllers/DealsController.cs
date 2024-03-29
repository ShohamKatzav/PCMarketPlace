using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Stripe;

namespace API.Controllers
{
    [Authorize]
    public class DealsController : BaseApiController
    {

        private readonly string secretKey;
        private readonly IDealRepository _dealRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IConfiguration _config;

        public DealsController(IDealRepository dealRepository, IMapper mapper, IUserRepository userRepository, IPhotoService photoService, IConfiguration config)
        {
            _dealRepository = dealRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _photoService = photoService;
            _config = config;
            secretKey = _config["StripeSettings:SecretKey"];
        }

        [HttpGet]
        public async Task<ActionResult<DealsResponseDto>> GetDeals(int userId, int currentPage, int tableSize, string category, string minPrice, string maxPrice)
        {
            var deals = await _dealRepository.GetAvailableDealsAsync(userId, currentPage, tableSize, category, minPrice, maxPrice);
            var totalCount = await _dealRepository.GetDealTotalCountAsync(userId, "All Deals", category, minPrice, maxPrice);
            var dealsResponse = new DealsResponseDto(deals, totalCount);
            return Ok(dealsResponse);
        }

        [HttpGet("GetDealsForUser", Name = "GetDealsForUser")]
        public async Task<ActionResult<DealsResponseDto>> GetDealsForUser(int userId, int currentPage, int tableSize, string category, string minPrice, string maxPrice)
        {
            var deals = await _dealRepository.GetDealsForUserAsync(userId, currentPage, tableSize, category, minPrice, maxPrice);
            var totalCount = await _dealRepository.GetDealTotalCountAsync(userId, "My Deals", category, minPrice, maxPrice);
            var dealsResponse = new DealsResponseDto(deals, totalCount);
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
        public async Task<ActionResult<DealDto>> Create([FromBody] CreateDealDto newDeal)
        {
            long totalPrice = (long)newDeal.Products.Sum(product => product.Price);
            if (totalPrice < 5)
                return BadRequest("Deal price has to be 5 ILS and above");
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
        public async Task<ActionResult> UpdateDeal([FromBody]UpdateDealDto dealUpdateDto)
        {
            var deal = await _dealRepository.GetDealForUpdateAsync(dealUpdateDto.Id);
            deal.LastModified = DateTime.Now;
            _mapper.Map(dealUpdateDto, deal);

            _dealRepository.Update(deal);

            if(await _dealRepository.SaveAllAsync()) return NoContent();
            
            return BadRequest("Failed to update deal.");
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

            var result = await _photoService.UploadPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new ProductPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };

            API.Entities.Product product;
            try
            {
                product =  await _dealRepository.GetProductForUpdateAsync(int.Parse(procuctId));
            }
            catch (Exception)
            {
                product = null;
            }
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

            product.ProductPhoto = new ProductPhoto() { Url = "./assets/no-image.jpeg" };

            try
            {
                if (await _dealRepository.SaveAllAsync()) return Ok();
            }
            catch
            {
                return BadRequest("Failed to delete the photo");
            }
            return BadRequest("Failed to delete the photo");

        }

        [HttpPut("checkout")]
        public async Task<ActionResult> Checkout(PaymentCheckoutDto paymentCheckout)
        {
            var deal = await _dealRepository.GetDealForUpdateAsync(paymentCheckout.DealId);
            if (deal == null)
                return NotFound();
            try
            {
                // Create a PaymentIntent object using the provided paymentIntentId
                var paymentIntentService = new PaymentIntentService();
                var paymentIntentResponse = paymentIntentService.Get(paymentCheckout.PaymentIntentId, null);

                // Attach the payment method to the PaymentIntent
                var paymentMethodService = new PaymentMethodService();
                var paymentMethod = paymentMethodService.Get(paymentCheckout.PaymentMethodId, null);

                // Confirm the PaymentIntent to complete the payment
                var confirmOptions = new PaymentIntentConfirmOptions
                {
                    PaymentMethod = paymentCheckout.PaymentMethodId,
                    ReturnUrl = "https://example.com/return",
                };
                paymentIntentService.Confirm(paymentCheckout.PaymentIntentId, confirmOptions);

                deal.Status = "Sold";
                if (await _dealRepository.SaveAllAsync())
                    // Payment confirmed successfully + deal marked as "Sold"
                    return NoContent();

                else
                {
                    return BadRequest("Failed to mark the deal as \"sold\"");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Payment failed: " + ex.Message);
            }

        }


        [HttpPost("secret-key")]
        public async Task<ActionResult> SecretKey([FromBody] int dealId)
        {
            StripeConfiguration.ApiKey = secretKey;
            var deal = await _dealRepository.GetDealForUpdateAsync(dealId);
            if (deal == null)
                return NotFound("Deal not found");

            var paymentIntent = await CreatePaymentIntentAsync(deal);
            return Ok(new { paymentIntent });
        }
        private async Task<ActionResult<PaymentIntent>> CreatePaymentIntentAsync(Deal deal)
        {
            var paymentIntentService = new PaymentIntentService();
            var paymentIntent = await paymentIntentService.CreateAsync(new PaymentIntentCreateOptions
            {
                Amount = (long)deal.Products.Sum(product => product.Price) * 100,
                Currency = "ils",
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
                {
                    Enabled = true,
                },
            });
            return paymentIntent;
        }

        [HttpGet("publishable-key")]
        public IActionResult PublishableKey()
        {
            var publishableKey = _config["StripeSettings:PublishableKey"];
            return Ok(new { publishableKey });
        }

    }
}