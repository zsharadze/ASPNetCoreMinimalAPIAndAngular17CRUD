using ASPNetCoreMinimalAPI.Data;
using ASPNetCoreMinimalAPI.Models;
using Azure;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;
using System.Net;

string MyAllowSpecificOrigins = "localhost-angular";

var builder = WebApplication.CreateBuilder(args);

var allowedCorsOrigins = builder.Configuration.GetSection("Cors").Get<string[]>();

builder.Services.AddCors(o => o.AddPolicy(MyAllowSpecificOrigins, b =>
{
    b.WithOrigins(allowedCorsOrigins)
           .AllowAnyMethod()
           .AllowAnyHeader()
           .AllowCredentials();
}));


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlServer(builder.Configuration.GetValue<string>("ConnectionStrings:DefaultConnection")));
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(MyAllowSpecificOrigins);


var employeeEndpointGroup = app.MapGroup("/api/Employee");

//Get
employeeEndpointGroup.MapGet("/{id}", async (
 int id, ApplicationDbContext dbContext) =>
{
    var employee = await dbContext.Employees.FindAsync(id);
    if (employee is null)
        return Results.NotFound();
    return Results.Ok(employee);
});

//Get all
employeeEndpointGroup.MapGet("/", async (
 ApplicationDbContext dbContext, HttpContext httpContext) =>
{
    var employees = await dbContext.Employees.ToListAsync();
    return Results.Ok(employees);
});

//Create
employeeEndpointGroup.MapPost("/", async (
 [FromBody] Employee employee,
 ApplicationDbContext dbContext, IValidator<Employee> validator) =>
{
    var validationResult = validator.Validate(employee);
    if (validationResult.IsValid)
    {
        await dbContext.Employees.AddAsync(employee);
        await dbContext.SaveChangesAsync();
        return Results.Ok(employee);
    }
    return Results.ValidationProblem(validationResult.ToDictionary(), statusCode: (int)HttpStatusCode.BadRequest);
});

//Update
employeeEndpointGroup.MapPut("/", async (
 [FromBody] Employee employee,
 ApplicationDbContext dbContext, IValidator<Employee> validator) =>
{
    if (employee.Id <= 0)
        return Results.NotFound();
    var validationResult = validator.Validate(employee);
    if (validationResult.IsValid)
    {
        dbContext.Employees.Update(employee);
        await dbContext.SaveChangesAsync();
        return Results.Ok(employee);
    }

    return Results.ValidationProblem(validationResult.ToDictionary(), statusCode: (int)HttpStatusCode.BadRequest);
});

//Delete
employeeEndpointGroup.MapDelete("/{id}", async (
 int id, ApplicationDbContext dbContext) =>
{
    var employee = await dbContext.Employees.FindAsync(id);
    if (employee == null)
        return Results.NotFound();
    dbContext.Employees.Remove(employee);
    await dbContext.SaveChangesAsync();
    return Results.Ok();
});

app.Run();