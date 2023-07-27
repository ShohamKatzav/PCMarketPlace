using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class DealsResponseDto
    {
        public IEnumerable<DealDto> Deals { get; set; }
        public int totalCount { get; set; }
    }
}