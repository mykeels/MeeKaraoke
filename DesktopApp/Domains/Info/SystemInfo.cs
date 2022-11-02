namespace MeeKaraoke.Info;

using System.Text.RegularExpressions;
using Mykeels.Processes;

public class SystemInfo
{
    public async static Task<string> GetNodeJSVersion()
    {
        string version = String.Empty;
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
                        version = output;
                    }
                }
            );
            process.WaitForExit();
            return version;
        });

    }

    public async static Task<string> GetFfmpegVersion()
    {
        string version = String.Empty;
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
                        version = Regex.Match(output, @"ffmpeg version (\d+\.\d+\.\d+)").Groups?.Values?.LastOrDefault()?.Value ?? version;
                    }
                }
            );
            process.WaitForExit();
            return version;
        });
    }
}