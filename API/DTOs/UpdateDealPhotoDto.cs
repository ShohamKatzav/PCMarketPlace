using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class UpdateDealPhotoDto
    {
        public int DealId { get; set; }
        public IFormFile File { get; set; }
    }
}