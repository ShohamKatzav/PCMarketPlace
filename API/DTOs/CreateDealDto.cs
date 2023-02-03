using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class CreateDealDto
    {
        public ICollection<ProductDto> Products { get; set; }
    }
}