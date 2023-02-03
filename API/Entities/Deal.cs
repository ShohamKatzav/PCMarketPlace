using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Deal
    {
        public int Id { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public ICollection<Product> Products { get; set; }
        public string Status { get; set; }

    }

}