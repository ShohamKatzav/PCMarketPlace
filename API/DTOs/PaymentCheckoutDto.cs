using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public record PaymentCheckoutDto(int DealId, string PaymentIntentId, string PaymentMethodId);
}