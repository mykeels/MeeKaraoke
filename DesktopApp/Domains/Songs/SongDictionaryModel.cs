namespace MeeKaraoke.Songs;

public class SongDictionaryModel
{
    public int Version
    {
        get
        {
            return 2;
        }
    }
    public List<SongModel> Songs { get; set; } = new List<SongModel>();
}
