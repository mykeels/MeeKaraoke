using System.Text;
using PhotinoNET;
using System;
using System.IO;

namespace MeeKaraoke;

class Program
{
    public static bool IsDebugMode = true;

    static string StartReleaseServer(string[] args)
    {
        WebApp.StartWwwRootServer = true;

        return "http://localhost:5000/app/index.html";
    }

    [STAThread]
    static void Main(string[] args)
    {
#if RELEASE
        IsDebugMode = false;
#endif
        dotenv.net.DotEnv.Load();
        Directory.SetCurrentDirectory(System.AppDomain.CurrentDomain.BaseDirectory);

        // Window title declared here for visibility
        string windowTitle = "MeeKaraoke - The Ultimate Karaoke Creator";
        string baseUrl = IsDebugMode ? Environment.GetEnvironmentVariable("APP_URL") ?? "http://localhost:3456" : StartReleaseServer(args);

        // Creating a new PhotinoWindow instance with the fluent API
        var window = new PhotinoWindow()
            .SetGrantBrowserPermissions(true)
            .SetTitle(windowTitle)
            // Resize to a percentage of the main monitor work area
            //.Resize(50, 50, "%")
            // Center window in the middle of the screen
            .Center()
            // Users can resize windows by default.
            // Let's make this one fixed instead.
            .SetDevToolsEnabled(true)
            .SetContextMenuEnabled(true)
            .SetUseOsDefaultSize(false)
            .SetSize(1366, 880)
            .RegisterWindowCreatedHandler((object? sender, EventArgs e) =>
            {
                var window = (PhotinoWindow?)sender;
                Console.WriteLine("Window created");
                System.Threading.Tasks.Task.Run(() =>
                {
                    Directory.SetCurrentDirectory(System.AppDomain.CurrentDomain.BaseDirectory);
                    Console.WriteLine("Starting Server");
                    WebApp.Start(args);
                    Console.WriteLine("Server Started");
                    window?.Load(baseUrl);
                    Console.WriteLine(baseUrl);
                });
            })
            .RegisterCustomSchemeHandler("app", (object sender, string scheme, string url, out string contentType) =>
            {
                contentType = "text/javascript";
                return new MemoryStream(Encoding.UTF8.GetBytes(@"
                        (() =>{
                            window.setTimeout(() => {
                                alert(`🎉 Dynamically inserted JavaScript.`);
                            }, 1000);
                        })();
                    "));
            })
            // Most event handlers can be registered after the
            // PhotinoWindow was instantiated by calling a registration 
            // method like the following RegisterWebMessageReceivedHandler.
            // This could be added in the PhotinoWindowOptions if preferred.
            .RegisterWebMessageReceivedHandler((object? sender, string message) =>
            {
                var window = (PhotinoWindow?)sender;

                window?.SetHeight(1024);

                // The message argument is coming in from sendMessage.
                // "window.external.sendMessage(message: string)"
                string response = $"Received message: \"{message}\"";

                // Send a message back the to JavaScript event handler.
                // "window.external.receiveMessage(callback: Function)"
                window?.SendWebMessage(response);
            })
            .LoadRawString($"<script>location.href = \"{baseUrl}\"</script>");

        bool IsWindows = System.Runtime.InteropServices.RuntimeInformation.IsOSPlatform(
                System.Runtime.InteropServices.OSPlatform.Windows
            );
        if (IsWindows)
        {
            window.SetIconFile("./Resources/favicon.ico");
        }

        window.WaitForClose(); // Starts the application event loop
    }
}
