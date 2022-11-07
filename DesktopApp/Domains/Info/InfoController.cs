namespace MeeKaraoke.Info;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MeeKaraoke.Songs;
using MeeKaraoke.VideoBuilds;

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
        string operatingSystem = OperatingSystem.IsWindows() ? "windows" : 
            OperatingSystem.IsMacOS() ? "osx" : 
            OperatingSystem.IsLinux() ? "linux" : 
            "unknown";
        string currentDirectory = Directory.GetCurrentDirectory();
        string exportDirectory = ExportDirectory.GetExportDirectory();
        return Ok(new { 
            Address = WebApp.Address, 
            AppDirectory = repo.AppDirectory, 
            NodeJS, 
            Ffmpeg, 
            operatingSystem, 
            currentDirectory,
            exportDirectory
        });
    }
}
