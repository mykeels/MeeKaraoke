using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Flurl;
using Flurl.Http;

namespace MeeKaraoke.Controllers;

[ApiController]
[Route("[controller]")]
public class LyricsController : ControllerBase
{

    private readonly ILogger<LyricsController> _logger;

    public LyricsController(ILogger<LyricsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Route("~/[controller]/{path}")]
    public async Task<string> Get([FromRoute] string path)
    {
        return await "https://genius.com"
            .AppendPathSegment(path)
            .GetStringAsync();
    }

    [HttpGet]
    [Route("~/[controller]/options")]
    public async Task<dynamic> GetOptions([FromQuery] string q, [FromQuery] string? per_page = "5")
    {
        return await "https://genius.com"
            .AppendPathSegment("/api/search/multi")
            .SetQueryParams(new { per_page, q })
            .GetJsonAsync();
    }
}
