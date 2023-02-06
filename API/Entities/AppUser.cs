using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;

namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; } 
        public string UserName { get; set; }= string.Empty;
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Authorization { get; set; } = "User";
        public int Phone { get; set; }
        public DateTime DateOfBirth { get; set; } 
        public string KnownAs { get; set; } = string.Empty;
        public DateTime Created { get; set; } = DateTime.Now;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public Photo AppUserPhoto { get; set; } 
        public ICollection<Deal> Deals { get; set; }

    }
}