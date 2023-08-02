using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public record DealUpdateDto(int Id, string Description, ICollection<ProductDto> Products);
}