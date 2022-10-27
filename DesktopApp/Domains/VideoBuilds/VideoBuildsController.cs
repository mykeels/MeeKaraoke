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

    [HttpPost]
    [Route("~/[controller]")]
    public async Task<IActionResult> BuildVideo([FromBody] VideoBuildModel model)
    {
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
        var builder = new VideoBuilder();
        await builder.Build(model);
        return Ok(builder);
    }
}
