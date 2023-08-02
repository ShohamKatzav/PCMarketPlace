using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public record MemberUpdateDto
    {
        public int Id { get; init; } 
        public string City { get; init; }
        public string Country { get; init; }
        public string Email { get; init; }
        public string Phone { get; init; }
        public string KnownAs { get; init; }
    }
}