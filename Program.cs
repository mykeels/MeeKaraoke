using System.Text;
using PhotinoNET;

namespace Photino.HelloPhotino.React;

class Program
{
    public static bool IsDebugMode = true;

    static string StartReleaseServer(string[] args)
    {
        PhotinoServer
            .CreateStaticFileServer(args, out string baseUrl)
            .RunAsync();

        return baseUrl;
    }

    static Task<string> StartDebugServer(string[] args)
    {
        var completion = new TaskCompletionSource<string>();
        var process = new System.Diagnostics.Process();
        string baseUrl = "http://localhost:3000";
        Uri baseUri = new Uri(baseUrl);
        process.StartInfo.FileName = "cmd";
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.RedirectStandardInput = true;
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.CreateNoWindow = true;
        process.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
        process.StartInfo.EnvironmentVariables.Add("BROWSER", "none");
        process.StartInfo.WorkingDirectory = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "./UserInterface");

        process.OutputDataReceived += (object sender, System.Diagnostics.DataReceivedEventArgs args) =>
        {
            string line = (args.Data ?? String.Empty);
            Console.WriteLine("received output: {0}", line);
            if (line.Contains("webpack compiled") && line.Contains("successfully"))
            {
                Console.WriteLine($"Task Complete: {baseUrl}");
                if (!completion.Task.IsCompleted)
                {
                    completion.SetResult(baseUrl);
                }
            }
            else if (line.Contains("Local:"))
            {
                baseUrl = line.Replace("Local:", "").Trim();
                baseUri = new Uri(baseUrl);
                Console.WriteLine($"URL: {baseUrl}");
            }
            else if (line.Contains("Something is already running on port"))
            {
                Console.WriteLine($"Something is already running on port {baseUri.Port}");
            }
        };
        process.Start();
        process.StandardInput.WriteLine($"npx kill-port {baseUri.Port}");
        process.StandardInput.WriteLine($"npm start");
        process.BeginOutputReadLine();

        Console.CancelKeyPress += (_, e) =>
        {
            e.Cancel = true;
            process.Kill();
            Console.WriteLine("Cancel KeyPress fired");
        };

        return completion.Task;
    }

    [STAThread]
    static void Main(string[] args)
    {

        Console.WriteLine("Start");
        string baseUrl = IsDebugMode ? StartDebugServer(args).Result : StartReleaseServer(args);
        Console.WriteLine($"Base Url: {baseUrl}");

        // Window title declared here for visibility
        string windowTitle = "Photino.React Demo App";

        // Creating a new PhotinoWindow instance with the fluent API
        var window = new PhotinoWindow()
            .SetTitle(windowTitle)
            // Resize to a percentage of the main monitor work area
            //.Resize(50, 50, "%")
            // Center window in the middle of the screen
            .Center()
            // Users can resize windows by default.
            // Let's make this one fixed instead.
            .SetResizable(true)
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

                // The message argument is coming in from sendMessage.
                // "window.external.sendMessage(message: string)"
                string response = $"Received message: \"{message}\"";

                // Send a message back the to JavaScript event handler.
                // "window.external.receiveMessage(callback: Function)"
                window?.SendWebMessage(response);
            })
            .Load($"{baseUrl}/index.html"); // Can be used with relative path strings or "new URI()" instance to load a website.

        window.WaitForClose(); // Starts the application event loop
    }
}
