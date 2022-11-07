namespace MeeKaraoke.AudioFiles;

using Mykeels.Processes;
using MeeKaraoke.Songs;

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
    public static async Task<AudioDownloadModel> GetAudio(AudioDownloadModel model, bool hasFfmpeg = false)
    {
        var songRepo = new SongRepository();
        var outFileDir = Path.Combine(songRepo.AppDirectory, $"Temp");
        var outFileName = $"{model.Title ?? Guid.NewGuid().ToString()}.webm";
        var outFilePath = Path.Combine(outFileDir, outFileName);
        string mp3Suffix = hasFfmpeg && !outFileName.EndsWith(".mp3") ? ".mp3" : "";
        if (File.Exists($"{outFilePath}{mp3Suffix}"))
        {
            model.Url = $"{WebApp.Address}/Static/Temp/{outFileName}{mp3Suffix}";
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
        if (hasFfmpeg && !String.IsNullOrEmpty(mp3Suffix))
        {
            await Task.Run(() =>
            {
                var process = Shell.Run(new List<string>()
                {
                    $"ffmpeg -i \"{outFilePath}\" -vn -ab 128k -ar 44100 -y \"{outFilePath}{mp3Suffix}\""
                },
                outputHandler: (output) =>
                {
                    Console.WriteLine(output);
                    model.Outputs.Add(output);
                });
                process.WaitForExit();
            });
        }
        model.Url = $"{WebApp.Address}/Static/Temp/{outFileName}{mp3Suffix}";
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