using FluentValidation;
using System.Text.RegularExpressions;

namespace Reactivities.Application.Validator
{
    public static class ValidatorExtensions
    {
        public static IRuleBuilder<T, string> Password<T>(this IRuleBuilder<T, string> ruleBuilder)
        {
            var options = ruleBuilder
                .NotEmpty()
                .MinimumLength(6)
                .WithMessage("Password must be at least 6 characters")
                .Matches("[A-Z]")
                .WithMessage("Password must have at least 1 uppercase letter")
                .Matches("[a-z]")
                .WithMessage("Password must have at least 1 lowercase letter")
                .Matches("[0-9]")
                .WithMessage("Password must contain at least 1 numeric character")
                .Matches("[^a-zA-Z0-9]")
                .WithMessage("Password must contain at least 1 special character");

            return options;
        }
    }
}
