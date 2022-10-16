namespace MeeKaraoke;

using System.ComponentModel.DataAnnotations;

public class SongModel
{
    public Guid Id { get; set; }
    [Required]
    public string? Title { get; set; }
    public string? AudioFilePath { get; set; }
    public string? KaraokeFilePath { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public SongModel() {}
    public SongModel(SongModel s) {
        this.Id = s.Id;
        this.Title = s.Title;
        this.AudioFilePath = s.AudioFilePath;
        this.KaraokeFilePath = s.KaraokeFilePath;
        this.CreatedAt = s.CreatedAt;
        this.UpdatedAt = s.UpdatedAt;
    }
}
