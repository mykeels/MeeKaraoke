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
    [Route("~/[controller]/{songId}")]
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

        Response.ContentType = "text/event-stream";

        var builder = new VideoBuilder();
        await builder.Build(model, async (output) =>
        {
            await Response.WriteAsync(
                string.Format("data: {0}\n\n", Newtonsoft.Json.JsonConvert.SerializeObject(new { output }))
            );
            await Response.Body.FlushAsync();
        });
        return NoContent();
    }
}
