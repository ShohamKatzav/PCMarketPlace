using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
        
    [ApiController]
    [Route("api/[controller]")] // api/users
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            _context = context;
        }

        [HttpGet] // api/users
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
           var users = await _context.Users.ToListAsync();
           return Ok(users);
        }

        [HttpGet("{id}")] // api/users/1
        public async Task<ActionResult<AppUser>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return Ok(user);
        }
    }
    
}