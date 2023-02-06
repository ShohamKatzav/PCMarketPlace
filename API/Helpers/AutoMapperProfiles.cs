using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using AutoMapper;
using API.Extensions;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>()
            .ForMember(
                dest => dest.Age,
                opt =>
                {
                    opt.MapFrom(d => d.DateOfBirth.CalculateAge());
                });
            CreateMap<Photo, PhotoDto>();

            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<Deal, DealDto>()
            .ForMember(
                dest => dest.TottalPrice,
                opt =>
                {
                    opt.MapFrom(d => d.Products.GetTottalPrice());
                });
            CreateMap<DealDto, Deal>();

            CreateMap<DealUpdateDto, Deal>();


            CreateMap<Product, ProductDto>();
            CreateMap<ProductDto, Product>();
            CreateMap<Deal, CreateDealDto>();
            CreateMap<CreateDealDto, Deal>();
            CreateMap<DealUpdateDto, DealDto>();

            CreateMap<DealPhoto, PhotoDto>();
        }
    }
}