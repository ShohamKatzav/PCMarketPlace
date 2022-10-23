using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<Product> Products { get; set; }

        public void AddUser(AppUser newUser)
        {
            Users.AddAsync(newUser);
            SaveChanges();
        }
        public void DeleteUser(int id)
        {
            var user = Users.ToList().Where(user => user.Id == id).FirstOrDefault();
            if (user != null)
                Users.Remove(user);
            SaveChanges();
        }
    }
}