using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class DealUpdateDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public ICollection<ProductDto> Products { get; set; }
    }
}