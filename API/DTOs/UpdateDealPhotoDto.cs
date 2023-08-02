using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public record UpdateDealPhotoDto(int DealId, IFormFile File);
}