#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

function build-simple
{
    RUNTIME=$1
    echo "Building $RUNTIME"
    cd $DIR/../
    dotnet build -c Release -r $RUNTIME --no-self-contained
    ls $DIR/../bin/Release/net6.0/win-x64
    echo "Zip $RUNTIME"
    cd $DIR/../bin/Release/net6.0/$RUNTIME; zip -r ../../$RUNTIME.zip *
    echo "---------------------------------------------------------------------"
}

function build-self-contained
{
    RUNTIME=$1
    echo "Building $RUNTIME-self-contained"
    cd $DIR/../
    dotnet publish -c Release -o bin/Release/net6.0/$RUNTIME-self-contained \
        -p:PublishReadyToRun=true -p:PublishSingleFile=true -p:PublishTrimmed=true \
        --self-contained true -p:IncludeNativeLibrariesForSelfExtract=true \
        -p:RuntimeIdentifier=$RUNTIME
    cp -R $DIR/../Resources $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    cp -R $DIR/../../App/build $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    mv $DIR/../bin/Release/net6.0/$RUNTIME-self-contained/build $DIR/../bin/Release/net6.0/$RUNTIME-self-contained/wwwroot
    ls $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    
    echo "Making $DIR/../bin/Release/net6.0/$RUNTIME-self-contained/MeeKaraoke executable"
    chmod 755 $DIR/../bin/Release/net6.0/$RUNTIME-self-contained/MeeKaraoke

    echo "Zip $RUNTIME-self-contained"
    cd $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    #zip -r ../../$RUNTIME-self-contained.zip *
    echo "---------------------------------------------------------------------"
}

#build-self-contained linux-x64
build-self-contained osx-x64
