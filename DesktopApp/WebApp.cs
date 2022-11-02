namespace MeeKaraoke;

using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.FileProviders;
using MeeKaraoke.Songs;

public class WebApp
{
    public static string Address = Environment.GetEnvironmentVariable("API_ROOT_URL") ?? "http://localhost:5000";
    public static bool StartWwwRootServer = false;
    public static WebApplication Start(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.WebHost.UseUrls(new string[] { Address });
        builder.Services.AddControllers(options =>
        {

        });
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policyBuilder => policyBuilder
                        .SetIsOriginAllowed(origin =>
                        {
                            var allowedOrigins = new List<string>() {
                                "localhost:5000",
                                "localhost:3456"
                            };
                            return allowedOrigins.Any(o => origin.Contains(o));
                        })
                        .AllowAnyMethod()
                        .AllowAnyHeader());
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        app.UseSwagger();
        app.UseSwaggerUI();
        app.MapControllers();
        var repo = new SongRepository();

        app.UseCors("CorsPolicy");
        app.UseAuthorization();
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(
                repo.AppDirectory
            ),
            RequestPath = "/Static",
            ServeUnknownFileTypes = true,
            OnPrepareResponse = ctx =>
            {
                ctx.Context.Response.Headers.Append(new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("Access-Control-Allow-Origin", "*"));
                ctx.Context.Response.Headers.Append(new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("Access-Control-Allow-Methods", "*"));
                ctx.Context.Response.Headers.Append(new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("Access-Control-Allow-Headers",
                  "Origin, X-Requested-With, Content-Type, Accept"));
            },
        });

        if (StartWwwRootServer)
        {
            Directory.SetCurrentDirectory(System.AppDomain.CurrentDomain.BaseDirectory);
            app.UseStatusCodePagesWithReExecute("/app/");
            var fileServerOptions = new FileServerOptions()
            {
                EnableDirectoryBrowsing = true,
                FileProvider = new PhysicalFileProvider(
                    System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot")
                ),
                EnableDefaultFiles = true,
                RequestPath = "/app"
            };
            fileServerOptions.DefaultFilesOptions.DefaultFileNames = new List<string>() { "index.html" };
            fileServerOptions.StaticFileOptions.OnPrepareResponse = ctx =>
                {
                    Console.WriteLine(ctx.Context.Request.Path);
                    ctx.Context.Response.Headers.Append(new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("Access-Control-Allow-Origin", "*"));
                    ctx.Context.Response.Headers.Append(new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("Access-Control-Allow-Methods", "*"));
                    ctx.Context.Response.Headers.Append(new KeyValuePair<string, Microsoft.Extensions.Primitives.StringValues>("Access-Control-Allow-Headers",
                      "Origin, X-Requested-With, Content-Type, Accept"));

                };
            fileServerOptions.StaticFileOptions.ServeUnknownFileTypes = true;
            app.UseFileServer(fileServerOptions);
        }

        app.Start();

        return app;

    }
}