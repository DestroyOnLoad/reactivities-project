﻿using AutoMapper;
using Reactivities.Application.Activities;
using Reactivities.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Reactivities.Application
{
    class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, ActivityDto>();
            CreateMap<UserActivity, AttendeeDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName));
        }
    }
}
