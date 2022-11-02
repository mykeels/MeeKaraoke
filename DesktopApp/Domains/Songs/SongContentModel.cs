namespace MeeKaraoke.Songs;

using System.ComponentModel.DataAnnotations;

public class SongContentModel
{

    public Guid Id { get; set; }
    [Required]
    public string? Title { get; set; }
    public double Duration { get; set; }
    public string? AudioUrl { get; set; }
    public List<string> Images { get; set; } = new List<string>();
    public List<LyricLineModel> Lines { get; set; } = new List<LyricLineModel>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public static SongContentModel From(SongModel song, string appDirectory)
    {
        if (song.SongFilePath == null)
        {
            throw new NullReferenceException();
        }
        var text = System.IO.File.ReadAllText(song.SongFilePath);
        var content = Newtonsoft.Json.JsonConvert.DeserializeObject<SongContentModel>(text);
        content.Id = song.Id;
        content.CreatedAt = song.CreatedAt;
        content.UpdatedAt = song.UpdatedAt;
        content.AudioUrl = song.TransformPaths(appDirectory).AudioFilePath;
        return content;
    }

    public class LyricLineModel
    {
        public string Text { get; set; } = String.Empty;
        public double Duration { get; set; }
        public double From { get; set; }
    }
}

