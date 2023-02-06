using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Entities;
using API.DTOs;
using System.Security.Cryptography;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Services;
using API.Interfaces;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context, ITokenService tokenService)
        {
            this._context = context;
            this._tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterAccountDto registerAccount)
        {

            if (await UserExist(registerAccount.Username)) return BadRequest("Username is already exist");

            using var hmac = new HMACSHA512();
            var user = new AppUser
            {
                UserName = registerAccount.Username.ToLower(),
                PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(registerAccount.Password)),
                PasswordSalt = hmac.Key,
                
            };
            _context.AppUsers.Add(user);
            await _context.SaveChangesAsync();
            
            return new UserDto(){
                Username = registerAccount.Username,
                Token = _tokenService.CreateToken(user)
            };
            
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginAccountDto loginAccount)
        {
            
            var user = 
                await this._context.AppUsers
                .Include(p => p.AppUserPhoto)
                .SingleOrDefaultAsync(x => x.UserName == loginAccount.Username.ToLower());
            if (user == null) return Unauthorized("Invalid username or password");

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(loginAccount.Password));

            for(int i = 0; i< computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid username or password");
            }

            return new UserDto(){
                Username = loginAccount.Username,
                Token = _tokenService.CreateToken(user)
            };

        }

        private async Task<bool> UserExist(string username)
        {
            return await _context.AppUsers.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}