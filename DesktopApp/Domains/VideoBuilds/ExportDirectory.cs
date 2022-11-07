namespace MeeKaraoke.VideoBuilds;

internal sealed class ExportDirectory
{
    private static string OneOf(params string[] directories) {
        foreach (var dir in directories)
        {
            if (!String.IsNullOrEmpty(dir) && Directory.Exists(dir))
            {
                return dir;
            }
        }
        throw new DirectoryNotFoundException();
    }

    public static string GetExportDirectory()
    {
        return Path.Combine(
            OneOf(
                Environment.GetFolderPath(
                    Environment.SpecialFolder.MyVideos
                ),
                Environment.GetFolderPath(
                    Environment.SpecialFolder.MyDocuments
                ),
                Environment.GetFolderPath(
                    Environment.SpecialFolder.UserProfile
                )
            ),
            "MeeKaraoke"
        );
    }
}