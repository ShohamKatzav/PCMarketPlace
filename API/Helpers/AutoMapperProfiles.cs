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
                })
            .ForMember(
                dest => dest.Authorization,
                opt =>
                {
                    opt.MapFrom(d => d.Authorization == null ? "User" : d.Authorization);
                })
            .ForMember(
                dest => dest.UserName,
                opt =>
                {
                    opt.MapFrom(d => d.UserName == null ? "User" : d.UserName);
                });
            CreateMap<Photo, PhotoDto>()
            .ForMember(
                dest => dest.Url,
                opt =>
                {
                    opt.MapFrom(d => d.Url == null ? "https://res.cloudinary.com/diamedrhv/image/upload/v1675783506/user_p3sxnc.png" : d.Url);
                });
            CreateMap<PhotoDto, DealPhoto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<Deal, DealDto>();
            CreateMap<DealDto, Deal>();
            CreateMap<DealUpdateDto, Deal>();
            CreateMap<Product, ProductDto>();
            CreateMap<ProductDto, Product>();
            CreateMap<Deal, CreateDealDto>();
            CreateMap<CreateDealDto, Deal>();
            CreateMap<DealUpdateDto, DealDto>();

            CreateMap<DealPhoto, PhotoDto>()
            .ForMember(
                dest => dest.Url,
                opt =>
                {
                    opt.MapFrom(d => d.Url == null ? "https://www.creativefabrica.com/wp-content/uploads/2018/12/Deal-icon-by-back1design1.jpg" : d.Url);
                });
            CreateMap<PhotoDto, DealPhoto>();
            
        }
    }
}