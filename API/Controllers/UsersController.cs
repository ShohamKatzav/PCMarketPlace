using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{       
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet] // api/users
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
           var users = await _userRepository.GetMembersAsync();
           return Ok(users);
        }


        [HttpPut] // api/users PUT
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUserNameAsync(username);
            if(user.Authorization=="Admin")
            {
                user = await _userRepository.GetUserByIdAsync(memberUpdateDto.Id);
            }

            _mapper.Map(memberUpdateDto, user);

            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpGet("{username}", Name="GetUser")] // api/users/lisa
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var user = await _userRepository.GetMemberAsync(username);
            return Ok(user);
        }

        [HttpPost("add-photo")] // api/users/add-photo
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var UserNameToUpload  = User.GetUsername();
            var UserToUpdate = await _userRepository.GetUserByUserNameAsync(UserNameToUpload);
            if (UserToUpdate.Authorization == "Admin")
            {
                Request.Headers.TryGetValue("UserName", out var headerValue);
                UserToUpdate = await _userRepository.GetUserByUserNameAsync(headerValue);
            }

            var result = await _photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            UserToUpdate.AppUserPhoto = photo;

            if (await _userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser",new {username = UserToUpdate.UserName}, _mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem adding photo");

        }
        [HttpDelete("delete-photo")] // api/users/delete-photo/1
        public async Task<ActionResult> DeletePhoto()
        {
            var username = User.GetUsername();
            var UserToUpdate = await _userRepository.GetUserByUserNameAsync(username);
            if (UserToUpdate.Authorization == "Admin")
            {
                Request.Headers.TryGetValue("UserName", out var headerValue);
                UserToUpdate = await _userRepository.GetUserByUserNameAsync(headerValue);
            }

            var photo = UserToUpdate.AppUserPhoto;
            
            if (photo == null) return NotFound();

            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            UserToUpdate.AppUserPhoto = new Photo(){Url="./assets/user.png"};

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete the photo");
        }

    }
    
}