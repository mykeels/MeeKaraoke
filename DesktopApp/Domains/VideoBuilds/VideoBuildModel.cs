namespace MeeKaraoke.VideoBuilds;

using System.ComponentModel.DataAnnotations;
using MeeKaraoke.Songs;

public class VideoBuildModel
{
    [Required]
    public Guid SongId { get; set; }
    public SongContentModel? Song { get; set; }
}