using System.IO;
using System.Text.RegularExpressions;
using Mykeels.Processes;

namespace MeeKaraoke;

public class VideoBuilder
{
    public Guid SongId { get; set; }
    public string OutputFilepath { get; set; } = String.Empty;
    public string Command { get; set; } = String.Empty;
    public double Duration { get; set; }
    public VideoBuildProgress Progress { get; set; } = new VideoBuildProgress();
    public void ProcessOutput(string output)
    {
        if (output.Contains("Muxing Audio"))
        {
            this.Progress.MuxingAudio++;
        }
        else if (output.Contains("Encoded in ") || output == "exit")
        {
            this.Progress.Complete = true;
        }
        else if (Regex.IsMatch(output, @"(\d+) rendered, (\d+) encoded")) {
            var match = Regex.Match(output, @"(\d+) rendered, (\d+) encoded");
            string rendered = match.Groups[1].Value;
            string encoded = match.Groups[2].Value;
            this.Progress.Rendered = Convert.ToInt32(rendered);
            this.Progress.Encoded = Convert.ToInt32(encoded);
        }
    }
    public int DurationInFrames
    {
        get
        {
            return Convert.ToInt32(Math.Ceiling(this.Duration * 60));
        }
    }
    public System.Diagnostics.Process? Process { get; set; }
    public Action<string> OnProgress { get; set; } = (string output) =>
    {
        Console.WriteLine(output);
    };
    public string ScriptPath
    {
        get
        {
            return Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/scripts/render-media.script.js"
            );
        }
    }
    

    public async Task<string> Build(VideoBuildModel model)
    {
        this.SongId = model.SongId;
        if (model.Song == null)
        {
            throw new NullReferenceException();
        }
        this.Duration = model.Song.Duration;
        var outputFilepath = Path.Combine(
            Environment.GetFolderPath(
                Environment.SpecialFolder.MyVideos
            ),
            "MeeKaraoke",
            $"{model.SongId.ToString()}.mp4"
        );
        this.OutputFilepath = outputFilepath;
        var karaokeUrl = $"{WebApp.Address}/Songs/{model.SongId}";
        int duration = Convert.ToInt32(Math.Floor(model.Song.Duration + 3));
        this.Command = $"node \"{this.ScriptPath}\" --out=\"{outputFilepath}\" --duration={duration}" +
            $" --karaokeUrl=\"{karaokeUrl}\" --rendererUrl=\"{VideoBuildModel.RendererUrl}\"";

        return await Task.Run(() =>
        {
            this.Process = Shell.Run(
                new List<string>() {
                    this.Command
                },
                outputHandler: (output) =>
                {
                    var notAllowed = new List<string>() { String.Empty, "Error: " };
                    if (!notAllowed.Contains(output))
                    {
                        if (output.StartsWith("Error:"))
                        {
                            if (this.OnProgress != null)
                            {
                                this.OnProgress(Regex.Replace(output, "^Error: ", ""));
                            }
                        }
                        else
                        {
                            this.ProcessOutput(output.Replace($"{Directory.GetCurrentDirectory()}>", ""));
                            if (this.OnProgress != null)
                            {
                                this.OnProgress(output.Replace($"{Directory.GetCurrentDirectory()}>", ""));
                            }
                        }
                    }
                }
            );
            this.Process.WaitForExit();
            return outputFilepath;
        });
    }

    public static Dictionary<Guid, VideoBuilder> Storage = new Dictionary<Guid, VideoBuilder>();
}

public class VideoBuildProgress
{
    public int Encoded { get; set; }
    public int Rendered { get; set; }
    public int MuxingAudio { get; set; }
    public bool Complete { get; set; }
}