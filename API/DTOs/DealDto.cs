using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public class DealDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastModified { get; set; }
        public ICollection<ProductDto> Products { get; set; }
        public string Status { get; set; }
        public double TotalPrice { get; set; }
        public PhotoDto DealPhoto { get; set; }

    }
}