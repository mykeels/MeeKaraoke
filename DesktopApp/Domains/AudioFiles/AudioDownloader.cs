namespace MeeKaraoke;
using Mykeels.Processes;

public class AudioDownloadModel
{
    public string YoutubeUrl { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public List<string> Outputs { get; set; } = new List<string>();
}

public class AudioDownloader
{
    public static async Task<AudioDownloadModel> GetAudio(AudioDownloadModel model)
    {
        var songRepo = new SongRepository();
        var outFileDir = Path.Combine(songRepo.AppDirectory, $"Temp");
        var outFileName = $"{model.Title ?? Guid.NewGuid().ToString()}.webm";
        var outFilePath = Path.Combine(outFileDir, outFileName);
        if (File.Exists(outFilePath))
        {
            model.Url = $"{WebApp.Address}/Temp/{outFileName}";
            return model;
        }
        if (!Directory.Exists(outFileDir))
        {
            Directory.CreateDirectory(outFileDir);
        }

        await Task.Run(() =>
        {
            var process = Shell.Run(new List<string>()
            {
                $"npx ytdl {model.YoutubeUrl} --filter audioonly --output \"{outFilePath}\""
            },
            outputHandler: (output) =>
            {
                Console.WriteLine(output);
                model.Outputs.Add(output);
            });
            process.WaitForExit();
        });
        model.Url = $"{WebApp.Address}/Temp/{outFileName}";
        return model;
    }

    public static async Task<AudioDownloadModel> GetAudioInfo(AudioDownloadModel model)
    {
        await Task.Run(() =>
        {
            var process = Shell.Run(new List<string>()
            {
                $"npx ytdl {model.YoutubeUrl} --filter audioonly --info"
            },
            outputHandler: (output) =>
            {
                if (output.StartsWith("title:"))
                {
                    model.Title = output.Replace("title: ", "");
                }
                if (output.StartsWith("author:"))
                {
                    model.Author = output.Replace("author: ", "");
                }
                Console.WriteLine(output);
                model.Outputs.Add(output);
            });
            process.WaitForExit();
        });

        return model;
    }
}