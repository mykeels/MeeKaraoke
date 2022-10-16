namespace MeeKaraoke;

using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;

public class WebApp
{
    public static WebApplication Start(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            Console.WriteLine("Development");
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod());
        app.UseAuthorization();

        app.MapControllers();
        var repo = new SongRepository();
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                repo.AppDirectory
            ),
            RequestPath = "/Static"
        });

        app.Run();

        return app;

    }
}