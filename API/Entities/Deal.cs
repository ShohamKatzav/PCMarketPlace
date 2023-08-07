using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Deal
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "8 Chars description must be included.")][MinLength(8, ErrorMessage = "8 Chars description must be included.")]
        public string Description { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastModified { get; set; } = DateTime.Now;
        [Required(ErrorMessage = "At least one product must be included.")][MinLength(1, ErrorMessage = "At least one product must be included.")]
        public ICollection<Product> Products { get; set; }
        public string Status { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
        public DealPhoto DealPhoto { get; set; }

    }

}