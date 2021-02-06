using Microsoft.EntityFrameworkCore;
using Reactivities.Application.Errors;
using Reactivities.Application.Interfaces;
using Reactivities.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Reactivities.Application.Profiles
{
    public class ProfileReader : IProfileReader
    {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;

        public ProfileReader(DataContext context, IUserAccessor userAccessor)
        {
            _context = context;
            _userAccessor = userAccessor;
        }
        public async Task<Profile> ReadProfile(string username)
        {
            var user = await _context.Users
                .AsSingleQuery()
                .Include(x => x.Followers)
                .Include(x => x.Followings)
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                throw new RestException(HttpStatusCode.NotFound, new { User = "Not found" });

            var currentUser = await _context.Users
                .Include(x => x.Followings)
                .SingleOrDefaultAsync(x => 
                x.UserName == _userAccessor.GetCurrentUsername());

            var profile = new Profile
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Bio = user.Bio,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                Photos = user.Photos,
                FollowersCount = user.Followers.Count,
                FollowingsCount = user.Followers.Count
            };

            if (currentUser.Followings.Any(x => x.TargetId == user.Id))
            {
                profile.IsFollowed = true;
            }

            return profile;
        }
    }
}
