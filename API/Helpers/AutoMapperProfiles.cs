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
                    opt.MapFrom(d => d.Authorization ?? "User");
                })
            .ForMember(
                dest => dest.UserName,
                opt =>
                {
                    opt.MapFrom(d => d.UserName ?? "User");
                })
                .ForMember(
                dest => dest.KnownAs,
                opt =>
                {
                    opt.MapFrom(d => d.KnownAs ?? "User");
                });
            CreateMap<Photo, PhotoDto>()
            .ForMember(
                dest => dest.Url,
                opt =>
                {
                    opt.MapFrom(d => d.Url ?? "https://res.cloudinary.com/diamedrhv/image/upload/v1675783506/user_p3sxnc.png");
                });
            CreateMap<DealPhoto, PhotoDto>();
            CreateMap<Deal, DealDto>()
            .ForMember(
                dest => dest.TotalPrice,
                opt =>
                {
                    opt.MapFrom(d => d.Products.GetTotalPrice());
                })
                .ForMember(
                dest => dest.DealPhoto,
                opt =>
                {
                    opt.MapFrom(d => d.Products.GetPhoto());
                });

            CreateMap<PhotoDto, DealPhoto>();
            CreateMap<PhotoDto, ProductPhoto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<DealDto, Deal>();
            CreateMap<UpdateDealDto, Deal>();
            CreateMap<ProductPhoto, PhotoDto>()
            .ForMember(
                dest => dest.Url,
                opt =>
                {
                    opt.MapFrom(d => d.Url ?? "https://www.creativefabrica.com/wp-content/uploads/2018/12/Deal-icon-by-back1design1.jpg");
                });
            CreateMap<Product, ProductDto>();
            CreateMap<ProductDto, Product>();
            CreateMap<Deal, CreateDealDto>();
            CreateMap<CreateDealDto, Deal>();
            CreateMap<UpdateDealDto, DealDto>();

        }
    }
}