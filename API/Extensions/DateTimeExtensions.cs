using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dob)
        {
            var age = DateTime.Today.Year - dob.Year;
            if (dob.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }
    }
}