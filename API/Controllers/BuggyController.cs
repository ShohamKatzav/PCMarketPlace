using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;
        public BuggyController(DataContext context)
        {
            _context = context;
        }

        [Authorize] // 401
        [HttpGet("auth")]
        public ActionResult<string> GetSecret(){
            return "sectet";
        }
        // 404
        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound(){
            var user = _context.AppUsers.Find(-1);
            if (user == null) return NotFound();
            return Ok(user);
        }
        // 500
        [HttpGet("server-error")]
        public ActionResult<string> GetServerError(){
            var user = _context.AppUsers.Find(-1);
            var toReturn = user.ToString();
            return toReturn;
        }
        [HttpGet("bad-request")]
        public ActionResult<string> GetSBadRequest(){
            return BadRequest("Your request wasn't good enough for us");
        }
    }
}