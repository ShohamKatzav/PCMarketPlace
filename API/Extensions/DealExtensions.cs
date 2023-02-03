using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class DealExtensions
    {
        public static double GetTottalPrice(this ICollection<Product> products)
        {
             return products.Sum(p => p.Price);
        }
    }
}