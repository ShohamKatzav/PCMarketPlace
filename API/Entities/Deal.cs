using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Deal
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastModified { get; set; } = DateTime.Now;
        public ICollection<Product> Products { get; set; }
        public string Status { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }

    }

}