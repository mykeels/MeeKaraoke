# MeeKaraoke

The simplest creator of Karaoke music.

## 1. Planning Phase

See [How it should work](./docs/HOW_IT_SHOULD_WORK.md).

## 2. Defining Requirements

See [User Stories](./docs/USER_STORIES.md).

## 3. Design and Prototyping

See [Figma](https://www.figma.com/file/QnV0ZGBr4LKyFSA0xQ1MxK/MeeKaraoke?node-id=0%3A1).

## 4. Software Development

### Setup

Run

```sh
dotnet restore
npm install
```

Create `.env` files as siblings of both [.env.sample](./.env.sample) and [App/.env.sample](./App/.env.sample) and be sure to add the appropriate values.

### Run Locally

Run `npm start` and `dotnet run` in separate terminals.

To view Storybook, run `npm run storybook`.