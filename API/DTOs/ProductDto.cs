using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public record ProductDto
    {
        public int Id { get; init; }
        public string Name { get; init; }
        public string Category { get; init; }
        public double Price { get; init; }
        public PhotoDto ProductPhoto { get; init; }
    }
}