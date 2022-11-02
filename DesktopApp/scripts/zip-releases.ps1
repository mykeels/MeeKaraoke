$DIR="$($(Get-Item .).FullName)"

function zip-self-contained($RUNTIME)
{
    echo "Zipping $RUNTIME-self-contained"
    cd $DIR/../bin/Release/net6.0/$RUNTIME-self-contained
    Compress-Archive -Path .\* -DestinationPath ../../$RUNTIME-self-contained.zip
    echo "---------------------------------------------------------------------"
}

build-self-contained osx-x64