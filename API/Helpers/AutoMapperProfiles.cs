using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // AppUser => MemberDto
            CreateMap<AppUser, MemberDto>();

            // Product => ProductDto
            CreateMap<Product, ProductDto>();
        }
    }
}