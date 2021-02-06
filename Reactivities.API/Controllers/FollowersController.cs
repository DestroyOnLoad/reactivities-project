using MediatR;
using Microsoft.AspNetCore.Mvc;
using Reactivities.Application.Followers;
using Reactivities.Application.Profiles;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Reactivities.API.Controllers
{
    [Route("api/profiles")]
    public class FollowersController : BaseController
    {
        [HttpGet("{username}/follow")]
        public async Task<ActionResult<List<Profile>>> List(string username, string predicate)
        {
            return await Mediator.Send(new List.Query { Username = username, Predicate = predicate });
        }

        [HttpPost("{username}/follow")]
        public async Task<ActionResult<Unit>> Follow(string username)
        {
            return await Mediator.Send(new Add.Command { Username = username});
        }

        [HttpDelete("{username}/follow")]
        public async Task<ActionResult<Unit>> Unfollow(string username)
        {
            return await Mediator.Send(new Delete.Command { Username = username });
        }
    }
}
