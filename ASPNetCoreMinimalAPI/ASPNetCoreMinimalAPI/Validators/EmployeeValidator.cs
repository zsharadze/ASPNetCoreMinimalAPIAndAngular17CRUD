using ASPNetCoreMinimalAPI.Models;
using FluentValidation;

namespace ASPNetCoreMinimalAPI.Validators
{
    public class EmployeeValidator : AbstractValidator<Employee>
    {
        public EmployeeValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .MaximumLength(150)
                .WithMessage("{PropertyName} should be maximum 150 characters");

            RuleFor(x => x.Age)
                .NotEmpty()
                .WithMessage("{PropertyName} is required")
                .InclusiveBetween(18, 65)
                .WithMessage("{PropertyName} should be between 18 and 65");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("{PropertyName} address is required")
                .EmailAddress()
                .WithMessage("A valid email is required");
        }
    }
}
