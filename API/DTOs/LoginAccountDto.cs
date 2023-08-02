using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public record LoginAccountDto
    {
        [Required]
        public string Username { get; init; }
        [Required]
        public string Password { get; init; }
    }
}