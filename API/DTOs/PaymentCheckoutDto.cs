using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class PaymentCheckoutDto
    {
        public int dealId { get; set; } 
        public string paymentIntentId { get; set; }
        public string paymentMethodId { get; set; }
    }
}