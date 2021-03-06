﻿using Microsoft.AspNetCore.Mvc;
using Reactivities.Application.Profiles;
using System.Threading.Tasks;

namespace Reactivities.API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> Details(string username)
        {
            return await Mediator.Send(new Details.Query { Username = username });
        }
    }
}
