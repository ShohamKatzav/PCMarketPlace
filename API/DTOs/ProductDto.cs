using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string PhotoUrl { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public int Price { get; set; }
    }
}