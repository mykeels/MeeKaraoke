namespace MeeKaraoke.Songs;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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
    public ActionResult<List<SongModel>> GetSongs()
    {
        var repo = new SongRepository();
        return repo.GetSongs().Select(song => song.TransformPaths(repo.AppDirectory)).ToList();
    }

    [HttpGet]
    [Route("~/[controller]/{id}")]
    public ActionResult<SongContentModel?> GetSongById([FromRoute] Guid id)
    {
        var repo = new SongRepository();
        var song = repo.GetSongById(id);
        if (song == null)
        {
            return NotFound(new
            {
                Message = $"Song with Id {id} not found"
            });
        }
        return SongContentModel.From(song, repo.AppDirectory);
    }

    [HttpPost]
    [Route("~/[controller]/")]
    public ActionResult<SongModel?> CreateSong([FromBody] SongModel song)
    {
        var repo = new SongRepository();
        return repo.CreateSong(song.TransformPaths(repo.AppDirectory));
    }

    [HttpPut]
    [Route("~/[controller]/{id}")]
    public ActionResult<SongModel?> UpdateSong([FromRoute] Guid id, [FromBody] SongModel song)
    {
        var repo = new SongRepository();
        song.Id = id;
        return repo.Update(song.TransformPaths(repo.AppDirectory));
    }

    [HttpDelete]
    [Route("~/[controller]/{id}")]
    public ActionResult DeleteSong([FromRoute] Guid id)
    {
        var repo = new SongRepository();
        repo.DeleteSong(id);
        return NoContent();
    }
}
