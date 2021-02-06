using MediatR;
using Reactivities.Application.Errors;
using Reactivities.Application.Interfaces;
using Reactivities.Persistence;
using System;
using System.Net;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.EntityFrameworkCore;

namespace Reactivities.Application.Followers
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var target = await _context.Users.FindAsync(request.Username);

                if (target == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Target = "Target user does not exist" });

                var following = await _context.Followings.SingleOrDefaultAsync(x => x.ObserverId == observer.Id && x.TargetId == x.TargetId);

                if (following == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { Target = "You are not following this target user" });

                _context.Followings.Remove(following);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}
