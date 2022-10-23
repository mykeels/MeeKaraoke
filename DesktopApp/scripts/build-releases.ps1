$DIR="$($(Get-Item .).FullName)"

function build-simple($RUNTIME)
{
    echo "Building $RUNTIME"
    cd $DIR/../
    pwd
    ls
    dotnet build -c Release -r $RUNTIME --no-self-contained
    ls $DIR/../bin/Release/net6.0/win-x64
    echo "Zip $RUNTIME"
    cd $DIR/../bin/Release/net6.0/$RUNTIME
    Compress-Archive -Path .\* -DestinationPath ../../$RUNTIME.zip
    echo "---------------------------------------------------------------------"
}

function build-self-contained($RUNTIME)
{
    echo "Building $RUNTIME-self-contained"
    cd $DIR/../
    pwd
    ls
    dotnet publish -c Release -o bin/Release/net6.0/$RUNTIME-self-contained `
        -p:PublishReadyToRun=true -p:PublishSingleFile=true -p:PublishTrimmed=true `
        --self-contained true -p:IncludeNativeLibrariesForSelfExtract=true `
        -p:RuntimeIdentifier=$RUNTIME
    cp -R $DIR/../Resources $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    cp -R $DIR/../bin/Release/net6.0/win-x64/wwwroot $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    ls $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    echo "Zip $RUNTIME-self-contained"
    cd $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    Compress-Archive -Path .\* -DestinationPath ../../$RUNTIME-self-contained.zip
    echo "---------------------------------------------------------------------"
}

build-simple win-x64
build-simple linux-x64
build-simple osx-x64

build-self-contained win-x64
build-self-contained osx-x64