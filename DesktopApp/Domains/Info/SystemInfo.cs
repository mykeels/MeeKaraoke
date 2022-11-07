namespace MeeKaraoke.Info;

using System.Text.RegularExpressions;
using Mykeels.Processes;

public class SystemInfo
{
    private static string? nodeJS = null;
    private static string? ffmpeg = null;

    public async static Task<string> GetNodeJSVersion()
    {
        if (nodeJS != null)
        {
            return nodeJS;
        }
        nodeJS = String.Empty;
        return await Task.Run(() =>
        {
            var process = Shell.Run(
                new List<string>() {
                    "node -v"
                },
                outputHandler: (string output) =>
                {
                    Console.WriteLine(output);
                    if (Regex.IsMatch(output, @"^v\d+(\.\d+){2}$"))
                    {
                        nodeJS = output;
                    }
                }
            );
            process.WaitForExit();
            return nodeJS;
        });

    }

    public async static Task<string> GetFfmpegVersion()
    {
        if (ffmpeg != null)
        {
            return ffmpeg;
        }
        ffmpeg = String.Empty;
        return await Task.Run(() =>
        {
            var process = Shell.Run(
                new List<string>() {
                    "ffmpeg -version"
                },
                outputHandler: (string output) =>
                {
                    Console.WriteLine(output);
                    if (output.Contains("ffmpeg version"))
                    {
                        ffmpeg = Regex.Match(output, @"ffmpeg version (\d+\.\d+\.\d+)").Groups?.Values?.LastOrDefault()?.Value ?? ffmpeg;
                    }
                }
            );
            process.WaitForExit();
            return ffmpeg;
        });
    }
}