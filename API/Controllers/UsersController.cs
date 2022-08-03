using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
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
        public ActionResult<IEnumerable<AppUser>> GetUsers()
        {
           var users = _context.Users.ToList();
           return users;
        }

        [HttpGet("{id}")] // api/users/1
        public ActionResult<AppUser> GetUser(int id)
        {
            var user = _context.Users.Find(id);
            return user;
        }
    }
    
}