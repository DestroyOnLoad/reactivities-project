using Reactivities.Application.Interfaces;
using Reactivities.Domain;
using System;

namespace Reactivities.Additional.Security
{
    public class JwtGenerator : IJwtGenerator
    {
        public string CreateToken(AppUser user)
        {
            throw new NotImplementedException();
        }
    }
}
