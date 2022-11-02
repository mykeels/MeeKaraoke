namespace MeeKaraoke.Songs;

using System.ComponentModel.DataAnnotations;

public class SongModel
{
    public Guid Id { get; set; }
    [Required]
    public string? Title { get; set; }
    public string? AudioFilePath { get; set; }
    public string? SongFilePath { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public SongModel() { }
    public SongModel(SongModel s)
    {
        this.Id = s.Id;
        this.Title = s.Title;
        this.AudioFilePath = s.AudioFilePath;
        this.SongFilePath = s.SongFilePath;
        this.CreatedAt = s.CreatedAt;
        this.UpdatedAt = s.UpdatedAt;
    }

    public SongModel Copy(SongModel s)
    {
        this.Title = s.Title ?? this.Title;
        this.AudioFilePath = s.AudioFilePath ?? this.Title;
        this.SongFilePath = s.SongFilePath ?? this.SongFilePath;
        return this;
    }

    public SongModel TransformPaths(string appDirectory, string? apiRootUrl = null)
    {
        apiRootUrl = apiRootUrl ?? WebApp.Address;
        this.AudioFilePath = this.AudioFilePath?
            .Replace(appDirectory, $"{apiRootUrl}/Static")?
            .Replace("\\", "/");
        this.SongFilePath = this.SongFilePath?.Replace(appDirectory, $"{apiRootUrl}/Static")?.Replace("\\", "/");
        return this;
    }
}
