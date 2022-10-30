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
    [Route("~/songs/{songId}/build-video")]
    public async Task<IActionResult> BuildVideo([FromRoute] Guid songId)
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
            var completion = new TaskCompletionSource<bool>();
            builder = VideoBuilder.Storage[model.SongId];
            builder.OnProgress = async (output) =>
            {
                if (output.Contains("exit"))
                {
                    if (VideoBuilder.Storage.ContainsKey(model.SongId))
                    {
                        completion.SetResult(true);
                        VideoBuilder.Storage.Remove(model.SongId);
                        Mykeels.Processes.Shell.Run(new List<string>() { builder.OutputFilepath });
                    }
                }
                await httpResponse.WriteAsync(
                        string.Format("data: {0}\n\n", Newtonsoft.Json.JsonConvert.SerializeObject(new { output }))
                    );
                await httpResponse.Body.FlushAsync();
            };
            if (builder.Process != null) {
                await builder.Process.WaitForExitAsync();
            }
            await completion.Task;
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
            Mykeels.Processes.Shell.Run(new List<string>() { builder.OutputFilepath });
        }
        return NoContent();
    }
}
