using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs
{
    public record DealDto
    {
        public int Id { get; init; }
        public string Description { get; init; }
        public DateTime Created { get; init; }
        public DateTime LastModified { get; init; }
        public ICollection<ProductDto> Products { get; init; }
        public string Status { get; init; }
        public double TotalPrice { get; init; }
        public PhotoDto DealPhoto { get; init; }
    }
}