using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public record MemberDto
    {
        public int Id { get; init; }
        public string UserName { get; init; }
        public string Email { get; init; }
        public string Authorization { get; init; }
        public string Phone { get; init; }
        public int Age { get; init; }
        public string KnownAs { get; init; }
        public DateTime Created { get; init; }
        public string City { get; init; }
        public string Country { get; init; }

        public PhotoDto AppUserPhoto { get; init; }
        public ICollection<DealDto> Deals { get; init; }
    }
}