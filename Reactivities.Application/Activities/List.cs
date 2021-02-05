﻿using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Reactivities.Persistence;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Reactivities.Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<ActivityDto>>
        {

        }

        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                    .AsSingleQuery()
                    .Include(a => a.Comments)
                    .Include(a => a.UserActivities)
                    .ThenInclude(u => u.AppUser)
                    .ThenInclude(x => x.Photos)
                    .ToListAsync();

                return _mapper.Map<List<ActivityDto>>(activities);
            }
        }
    }
}
