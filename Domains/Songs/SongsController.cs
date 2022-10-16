using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace MeeKaraoke.Controllers;

[ApiController]
[Route("[controller]")]
public class SongsController : ControllerBase
{
    

    private readonly ILogger<SongsController> _logger;

    public SongsController(ILogger<SongsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    [Route("~/[controller]/directory")]
    public string Get()
    {
        var repo = new SongRepository();
        return repo.AppDirectory;
    }

    [HttpGet]
    [Route("~/[controller]/dictionary")]
    public SongDictionaryModel GetDictionary()
    {
        var repo = new SongRepository();
        return repo.Dictionary;
    }

    [HttpGet]
    [Route("~/[controller]/")]
    public List<SongModel> GetSongs()
    {
        var repo = new SongRepository();
        return repo.GetSongs();
    }

    [HttpGet]
    [Route("~/[controller]/{id}")]
    public SongModel? GetSongById([FromRoute] Guid id)
    {
        var repo = new SongRepository();
        return repo.GetSongById(id);
    }

    [HttpPost]
    [Route("~/[controller]/")]
    public SongModel? CreateSong([FromBody] SongModel song)
    {
        var repo = new SongRepository();
        return repo.CreateSong(song);
    }

    [HttpPatch]
    [Route("~/[controller]/{id}")]
    public SongModel? UpdateSong([FromRoute] Guid id, [FromBody] SongModel song)
    {
        var repo = new SongRepository();
        song.Id = id;
        return repo.Update(song);
    }

    [HttpDelete]
    [Route("~/[controller]/{id}")]
    public string DeleteSong([FromRoute] Guid id)
    {
        var repo = new SongRepository();
        repo.DeleteSong(id);
        return "DELETED";
    }
}
