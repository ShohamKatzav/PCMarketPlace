using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public record CreateDealDto(string Description, ICollection<ProductDto> Products);
}