namespace MeeKaraoke.Songs;

public class SongDictionaryModel
{
    public int Version
    {
        get
        {
            return 1;
        }
    }
    public List<SongModel> Songs { get; set; } = new List<SongModel>();
}
