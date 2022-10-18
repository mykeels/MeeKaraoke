#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

cd bin/Release/net6.0; zip -r ../win-x64.zip . -i *

cd $DIR/../

# publish
#dotnet publish -c Release -o bin/Release/net6.0/win-x64 -p:PublishReadyToRun=true -p:PublishSingleFile=true -p:PublishTrimmed=true --self-contained true -p:IncludeNativeLibrariesForSelfExtract=true -p:RuntimeIdentifier=win-x64
#dotnet publish -c Release -o bin/Release/net6.0/linux-x64 -p:PublishReadyToRun=true -p:PublishSingleFile=true -p:PublishTrimmed=true --self-contained true -p:IncludeNativeLibrariesForSelfExtract=true -p:RuntimeIdentifier=linux-x64
#dotnet publish -c Release -o bin/Release/net6.0/osx-x64 -p:PublishReadyToRun=true -p:PublishSingleFile=true -p:PublishTrimmed=true --self-contained true -p:IncludeNativeLibrariesForSelfExtract=true -p:RuntimeIdentifier=osx-x64
#dotnet build -c Release -r win-x64 --no-self-contained
dotnet build -c Release -r linux-x64 --no-self-contained
dotnet build -c Release -r osx-x64 --no-self-contained

# zip
#cd $DIR/../bin/Release/net6.0/win-x64; zip -r ../../win-x64-self-contained.zip . -i wwwroot/* MeeKaraoke.exe
cd $DIR/../bin/Release/net6.0/linux-x64; zip -r ../../linux-x64.zip . -i *
cd $DIR/../bin/Release/net6.0/osx-x64; zip -r ../../osx-x64.zip . -i *
