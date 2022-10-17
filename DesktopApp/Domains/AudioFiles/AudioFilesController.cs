using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;

namespace MeeKaraoke.Controllers;

[ApiController]
[Route("[controller]")]
public class AudioFilesController : ControllerBase
{
    private readonly ILogger<AudioFilesController> _logger;

    public AudioFilesController(ILogger<AudioFilesController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [Route("~/songs/{id}/audio-files.{ext}")]
    public async Task<IActionResult> OnPostUploadAsync([FromRoute] Guid id, [FromRoute] string ext, List<IFormFile> files)
    {
        var repo = new SongRepository();
        var song = repo.GetSongById(id);
        if (song == null)
        {
            return NotFound(new {
                Message = $"No Song with Id {id} exists"
            });
        }
        string audioFilePath = Path.Join(repo.AppDirectory, id.ToString(), $"audio.{ext}");
        long size = files.Sum(f => f.Length);
        foreach (var formFile in files)
        {
            if (formFile.Length > 0)
            {
                using (var stream = System.IO.File.Create(audioFilePath))
                {
                    await formFile.CopyToAsync(stream);
                }
            }
        }
        
        song.AudioFilePath = audioFilePath;
        repo.Update(song);

        // Process uploaded files
        // Don't rely on or trust the FileName property without validation.

        return Ok(new { count = files.Count, size, song });
    }
}
