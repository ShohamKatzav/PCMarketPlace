using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Name must be included.")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Category must be included.")]
        public string Category { get; set; }
        [Required(ErrorMessage = "Price must be included.")]
        public double? Price { get; set; }
        public PhotoDto ProductPhoto { get; set; }
    }
}