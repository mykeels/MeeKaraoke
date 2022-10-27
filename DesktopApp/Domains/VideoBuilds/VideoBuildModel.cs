namespace MeeKaraoke;

using System.ComponentModel.DataAnnotations;

public class VideoBuildModel
{
    [Required]
    public Guid SongId { get; set; }
    public SongContentModel? Song { get; set; }
    public static string RendererUrl { get; set; } = String.Empty;
    public static void SetRendererUrl(string baseUrl)
    {
        RendererUrl = Environment.GetEnvironmentVariable("REMOTION_RENDERER_URL") ?? $"{baseUrl}/renderer/";
    }
}