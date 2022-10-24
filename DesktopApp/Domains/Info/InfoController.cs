using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;

namespace MeeKaraoke.Controllers.X;

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
    public IActionResult GetInfo()
    {
        var repo = new SongRepository();

        return Ok(new { Address = WebApp.Address, AppDirectory = repo.AppDirectory });
    }
}
