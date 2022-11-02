namespace MeeKaraoke.SongFiles;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using MeeKaraoke.Songs;

[ApiController]
[Route("[controller]")]
public class SongFilesController : ControllerBase
{
    private readonly ILogger<SongFilesController> _logger;

    public SongFilesController(ILogger<SongFilesController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [Route("~/songs/{id}/files")]
    public async Task<IActionResult> OnPostUploadAsync([FromRoute] Guid id, List<IFormFile> files)
    {
        var repo = new SongRepository();
        var song = repo.GetSongById(id);
        if (song == null)
        {
            return NotFound(new {
                Message = $"No Song with Id {id} exists"
            });
        }
        string songFilePath = Path.Join(repo.AppDirectory, id.ToString(), $"karaoke.mee.json");
        long size = files.Sum(f => f.Length);
        foreach (var formFile in files)
        {
            if (formFile.Length > 0)
            {
                using (var stream = System.IO.File.Create(songFilePath))
                {
                    await formFile.CopyToAsync(stream);
                }
            }
        }
        
        song.SongFilePath = songFilePath;
        repo.Update(song);

        // Process uploaded files
        // Don't rely on or trust the FileName property without validation.

        return Ok(new { count = files.Count, size, song });
    }
}
