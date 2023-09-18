using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public record UpdateDealDto(
        [Required] int Id,
        [Required]
        [MinLength(8, ErrorMessage = "Description must be at least 8 characters.")]
        string Description,
        [Required]
        [MinLength(1, ErrorMessage = "At least one product must be included.")]
        ICollection<ProductDto> Products
    );
}