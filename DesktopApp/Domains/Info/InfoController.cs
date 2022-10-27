using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;

namespace MeeKaraoke.Controllers;

[ApiController]
[Route("[controller]")]
public class InfoController : ControllerBase
{
    private readonly ILogger<InfoController> _logger;

    public InfoController(ILogger<InfoController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Route("~/[controller]")]
    public async Task<IActionResult> GetInfo()
    {
        var repo = new SongRepository();

        string NodeJS = await SystemInfo.GetNodeJSVersion();
        string Ffmpeg = await SystemInfo.GetFfmpegVersion();
        return Ok(new { Address = WebApp.Address, AppDirectory = repo.AppDirectory, NodeJS, Ffmpeg });
    }
}
