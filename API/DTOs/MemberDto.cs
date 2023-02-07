using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class MemberDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Authorization { get; set; }
        public string Phone { get; set; }
        public int Age { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public PhotoDto AppUserPhoto { get; set; }
        public ICollection<DealDto> Deals { get; set; }
    }
}