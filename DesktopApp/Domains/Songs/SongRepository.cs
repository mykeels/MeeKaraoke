namespace MeeKaraoke.Songs;

using System.IO;
using Newtonsoft.Json;

public class SongRepository
{
    public string LocalAppDataDirectory = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
    public string AppDirectory
    {
        get
        {
            return Path.Join(LocalAppDataDirectory, "MeeKaraoke");
        }
    }
    public string DictionaryFilePath
    {
        get
        {
            return Path.Join(AppDirectory, "index.json");
        }
    }
    public SongDictionaryModel Dictionary
    {
        get
        {
            if (!File.Exists(DictionaryFilePath))
            {
                File.WriteAllText(DictionaryFilePath, JsonConvert.SerializeObject(new SongDictionaryModel()));
            }
            string text = File.ReadAllText(DictionaryFilePath);
            return JsonConvert.DeserializeObject<SongDictionaryModel>(text);
        }
        set
        {
            File.WriteAllText(DictionaryFilePath, JsonConvert.SerializeObject(value));
        }
    }

    public SongRepository()
    {
        if (!Directory.Exists(AppDirectory))
        {
            Directory.CreateDirectory(AppDirectory);
        }
    }

    public List<SongModel> GetSongs()
    {
        return this.Dictionary.Songs;
    }

    public SongModel CreateSong(SongModel song)
    {
        song.Id = Guid.NewGuid();
        song.CreatedAt = DateTime.Now;
        song.UpdatedAt = DateTime.Now;
        this.Dictionary = new SongDictionaryModel()
        {
            Songs = this.Dictionary.Songs.Append(song).ToList()
        };
        string directory = Path.Join(AppDirectory, song.Id.ToString());
        if (!Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }
        return song;
    }

    public SongModel? GetSongById(Guid id)
    {
        var song = this.Dictionary.Songs.FirstOrDefault(song => song.Id == id);
        return song;
    }

    public void DeleteSong(Guid id)
    {
        this.Dictionary = new SongDictionaryModel()
        {
            Songs = this.Dictionary.Songs.Where(song => song.Id != id).ToList()
        };
        string directory = Path.Join(AppDirectory, id.ToString());
        if (Directory.Exists(directory))
        {
            Directory.Delete(directory, true);
        }
    }

    public SongModel Update(SongModel song)
    {
        song.UpdatedAt = DateTime.Now;
        this.Dictionary = new SongDictionaryModel()
        {
            Songs = this.Dictionary.Songs.Select(s => s.Id == song.Id ? new SongModel(s).Copy(song) : s).ToList()
        };
        return this.GetSongById(song.Id) ?? song;
    }
}