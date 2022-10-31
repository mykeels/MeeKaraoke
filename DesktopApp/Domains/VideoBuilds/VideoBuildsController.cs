using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;

namespace MeeKaraoke.Controllers;

[ApiController]
[Route("[controller]")]
public class VideoBuildsController : ControllerBase
{
    private readonly ILogger<InfoController> _logger;

    public VideoBuildsController(ILogger<InfoController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Route("~/video-builds")]
    public IActionResult GetVideoBuilds()
    {
        return Ok(
            VideoBuilder.Storage.Values.Select(build => new
            {
                Id = build.SongId,
                OutputFilepath = build.OutputFilepath,
                Duration = build.Duration,
                Progress = build.Progress
            }).ToList()
        );
    }

    [HttpGet]
    [Route("~/video-builds/{songId}")]
    public async Task<IActionResult> ListenToVideoBuild([FromRoute] Guid songId)
    {
        if (!VideoBuilder.Storage.ContainsKey(songId))
        {
            return NotFound(new
            {
                Message = $"Build {songId} not found"
            });
        }
        Response.ContentType = "text/event-stream";
        var completion = new TaskCompletionSource<bool>();
        var builder = VideoBuilder.Storage[songId];
        builder.OnProgress = async (output) =>
        {
            if (output.Contains("exit"))
            {
                if (VideoBuilder.Storage.ContainsKey(songId))
                {
                    completion.SetResult(true);
                    VideoBuilder.Storage.Remove(songId);
                    if (builder?.Process?.ExitCode == 0)
                    {
                        Mykeels.Processes.Shell.Run(new List<string>() { builder.OutputFilepath });
                    }
                }
            }
            await Response.WriteAsync(
                    string.Format("data: {0}\n\n", Newtonsoft.Json.JsonConvert.SerializeObject(new { output }))
                );
            await Response.Body.FlushAsync();
        };
        if (builder.Process != null)
        {
            if (!builder.Process.HasExited)
            {
                await builder.Process.WaitForExitAsync();
            }
            else
            {
                await Response.WriteAsync(
                    string.Format("data: {0}\n\n", Newtonsoft.Json.JsonConvert.SerializeObject(new { output = "exit" }))
                );
                await Response.Body.FlushAsync();
            }
        }
        await completion.Task;
        return NoContent();
    }

    [HttpDelete]
    [Route("~/video-builds/{songId}")]
    public IActionResult StopVideoBuild([FromRoute] Guid songId)
    {
        if (!VideoBuilder.Storage.ContainsKey(songId))
        {
            return NotFound(new
            {
                Message = $"Build {songId} not found"
            });
        }
        var build = VideoBuilder.Storage[songId];
        if (build == null)
        {
            return NotFound(new
            {
                Message = $"Build {songId} not found"
            });
        }
        Console.WriteLine($"Process Exited {build?.Process?.HasExited}");
        if (build?.Process != null && !build.Process.HasExited)
        {
            Console.WriteLine("Process Killed");
            build.Process.Kill(true);
        }
        VideoBuilder.Storage.Remove(songId);
        return Ok(new
        {
            Id = build?.SongId,
            ExitCode = build?.Process?.ExitCode
        });
    }

    [HttpGet]
    [Route("~/video-builds/{songId}/start")]
    public async Task<IActionResult> StartVideoBuild([FromRoute] Guid songId)
    {
        var model = new VideoBuildModel()
        {
            SongId = songId
        };
        var repo = new SongRepository();
        var song = repo.GetSongById(model.SongId);
        if (song == null)
        {
            return NotFound(model.SongId);
        }
        var songContent = SongContentModel.From(song, repo.AppDirectory);
        if (songContent == null)
        {
            return NotFound($"Content: {model.SongId}");
        }
        model.Song = songContent;

        var httpResponse = Response;

        Response.ContentType = "text/event-stream";

        VideoBuilder builder;
        if (VideoBuilder.Storage.ContainsKey(model.SongId))
        {
            return await this.ListenToVideoBuild(model.SongId);
        }
        else
        {
            builder = new VideoBuilder();
            builder.OnProgress = async (output) =>
            {
                await Response.WriteAsync(
                    string.Format("data: {0}\n\n", Newtonsoft.Json.JsonConvert.SerializeObject(new { output }))
                );
                await Response.Body.FlushAsync();
            };
            Response.HttpContext.RequestAborted.Register(() =>
            {
                builder.OnProgress = (output) =>
                {
                    Console.WriteLine("Connection Ended: " + output);
                };
            });
            if (!VideoBuilder.Storage.ContainsKey(model.SongId))
            {
                VideoBuilder.Storage.Add(model.SongId, builder);
                await builder.Build(model);
            }
            if (VideoBuilder.Storage.ContainsKey(model.SongId))
            {
                VideoBuilder.Storage.Remove(model.SongId);
            }
            if (builder?.Process?.ExitCode == 0)
            {
                Mykeels.Processes.Shell.Run(new List<string>() { builder.OutputFilepath });
            }
        }
        return NoContent();
    }
}
