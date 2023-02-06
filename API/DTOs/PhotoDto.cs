using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class PhotoDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn2IRi5cxtjkZed0OKEB0mJTN7Uvb0QVS1lqiFHVh5&s";
    }
}