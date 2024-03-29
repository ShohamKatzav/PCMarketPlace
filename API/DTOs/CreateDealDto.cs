using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using API.Helpers;

namespace API.DTOs
{
    public record CreateDealDto(
        [Required]
        [MinLength(8, ErrorMessage = "Description must be at least 8 characters.")]
        string Description,
        [Required]
        [MinLength(1, ErrorMessage = "At least one product must be included.")]
        ICollection<ProductDto> Products 
    );
}