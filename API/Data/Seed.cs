using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(DataContext context)
        {
            if (await context.AppUsers.AnyAsync()) return;


            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var categoriesData = await System.IO.File.ReadAllTextAsync("Data/CategorySeedData.json");

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
            var categories = JsonSerializer.Deserialize<List<Category>>(categoriesData);

            foreach (var user in users)
            {
                using var hmac = new System.Security.Cryptography.HMACSHA512();
                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("Pa$$w0rd"));
                user.PasswordSalt = hmac.Key;

                if (user.Deals != null)
                    foreach (var deal in user?.Deals)
                        deal.LastModified = deal.Created;
                        
                context.AppUsers.Add(user);
            }

            foreach (var category in categories)
                context.Categories.Add(category);

            await context.SaveChangesAsync();

        }
    }
}