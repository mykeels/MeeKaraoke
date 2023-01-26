# Contribution Guide

As prerequisites, you need

- [NodeJS >16.x](https://nodejs.org/en/)
- [dotnet >6.x](https://dotnet.microsoft.com/en-us/download)

## Setup

Execute the following script to setup the project locally:

```sh
git clone https://github.com/mykeels/MeeKaraoke.git
cd MeeKaraoke

# setup Web app
cd App
npm install
echo "PORT=3456\n" >> .env
echo "REACT_APP_API_ROOT=http://localhost:5000\n" >> .env

# setup Desktop App
cd ../DesktopApp
dotnet restore
echo "APP_URL=http://localhost:3456\n" >> .env
echo "ASPNETCORE_ENVIRONMENT=Development\n" >> .env
```

### Run Locally

Run `npm start` and `dotnet run` in separate terminals.

To view Storybook, run `npm run storybook`.
