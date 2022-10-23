using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string PhotoUrl { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public int Price { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}