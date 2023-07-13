using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Extensions
{
    public static class DealExtensions
    {
        public static double GetTottalPrice(this ICollection<Product> products)
        {
            return products.Sum(p => p.Price);
        }
        public static PhotoDto GetPhoto(this ICollection<Product> products)
        {
            foreach (Product p in products)
                if (p?.ProductPhoto?.Url != null && p.ProductPhoto.Url != "./assets/no-image.jpeg")
                    return new PhotoDto { Url = p.ProductPhoto.Url };
            return new PhotoDto { Url = "https://www.creativefabrica.com/wp-content/uploads/2018/12/Deal-icon-by-back1design1.jpg" };
        }
    }
}