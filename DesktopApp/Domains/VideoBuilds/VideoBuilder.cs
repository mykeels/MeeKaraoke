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
    public static Dictionary<Guid, VideoBuilder> Storage = new Dictionary<Guid, VideoBuilder>();

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
        this.Command = $"node {this.ScriptPath} --out=\"{outputFilepath}\" --duration={Math.Floor(model.Song.Duration + 3)}" +
            $" --karaokeUrl={karaokeUrl} --rendererUrl={VideoBuildModel.RendererUrl}";

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
}