using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;

namespace API.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string UserName { get; set; } = "";
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Email { get; set; } = "";
        public string Authorization { get; set; } = "User";
        [Display(Name = "Home Phone")]
        [DataType(DataType.PhoneNumber)]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Not a valid phone number")]
        public string Phone { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string KnownAs { get; set; } = "";
        public DateTime Created { get; set; } = DateTime.Now;
        public string City { get; set; } = "";
        public string Country { get; set; } = "";
        public Photo AppUserPhoto { get; set; }
        public ICollection<Deal> Deals { get; set; }

    }
}