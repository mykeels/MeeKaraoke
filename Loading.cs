namespace Photino.HelloPhotino.React;

class Loading
{
    public static string Html = @"
        <!-- Displays animations that shows when loading -->
        <!DOCTYPE html>
        <html lang=""en"">
            <head>
                <meta charset=""utf-8"" />
                <meta name=""theme-color"" content=""#181818"" />
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"">
                <style>
                    .spinner {
                        display: inline-block;
                        border-width: 5px;
                        width: 4rem;
                        height: 4rem;
                        border-style: solid;
                        border-color: white;
                        border-right-color: transparent !important;
                        border-radius: 50%;
                        animation: spin 0.5s linear infinite;
                        margin-right: 1rem;
                        margin-left: 1rem;
                    }

                    @keyframes spin {
                        0% {
                        transform: rotate(0deg);
                        }
                        100% {
                        transform: rotate(360deg);
                        }
                    }

                    body {
                        background: #181818;
                    }
                    .wrapper {
                        background-color: #181818;
                        display: block;
                        height: 100%;
                        width: 100%;
                        text-align: center;
                        margin: 0px;
                        padding-top: calc(25% - 4rem);
                    }
                </style>
            </head>
            <body>
                <div class=""wrapper"">
                    <div class=""spinner""></div>
                </div>
            </body>
        </html>
    ";
}