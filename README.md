# Ntalk

Ntalk is a desktop messaging application with a focus on anonymity and secure communication. The application provides real-time messaging (if both users are online) and guarantees message delivery later if the recipient was offline. All messages are encrypted on the client side, making them inaccessible to third parties.

![Welcome to Ntalk](https://github.com/ilrosch/Ntalk/blob/main/src/asserts/img/welcome.png?raw=true)

## Contents

- [Features of the project](#features-of-the-project)
- [Current development status](#current-development-status)
- [Tech Stack](#tech-stack)
  - [Client application](#client-application)
  - [Server application](#server-application)
- [Get start](#get-start)
  - [Get start development](#get-start-development)
- [Future plans](#future-plans)
- [Licence](#licence)

---

## Features of the project

- **Anonymity**: Users are identified by a unique ID that is not associated with personal information.
- **Security**: Messages are encrypted before sending and remain encrypted at all stages of transmission.
- **Messaging Modes**:
  - Peer-to-peer (P2P): Direct transmission of messages through a server in real time.
  - Offline Delivery: Temporarily store messages on the server for later delivery.
- **Usable Interface**: Minimalistic design with emphasis on usability.

---

## Current development status

The client interface of the application has been implemented so far. However, network requests and interaction with the server have not yet been integrated. This means that the messaging functionality is only available in local mode.

---

## Tech Stack

### Client application

- **Language**: JavaScript (ES6+)
- **Framework**: [Electron.js](https://www.electronjs.org/)
- **State application**: [Redux](https://redux.js.org/), [Redux Toolkit](https://redux-toolkit.js.org/)
- **Testing**: [Jest](https://jestjs.io/)

### Server application

To be implemented later.

- **Platform**: [Node.js](https://nodejs.org/) ([Express](https://expressjs.com/) or [Fastify](https://fastify.dev/))
- **Networking**: [WebSocket](https://nodejs.org/en/learn/getting-started/websocket) for [P2P](https://en.wikipedia.org/wiki/Peer-to-peer) interaction.
- **Database**: [PostgreSQL](https://www.postgresql.org/) (main version), [SQLite](https://www.sqlite.org/) (for test environment).

---

## Get start

For personal use and familiarisation, [download](https://github.com/ilrosch/Ntalk/releases/tag/v1.0.0) the application image for your operating system ([Linux](https://github.com/ilrosch/Ntalk/releases/download/v1.0.0/Ntalk-1.0.0-1.x86_64.rpm), [Windows](https://github.com/ilrosch/Ntalk/releases/download/v1.0.0/Ntalk-1.0.0.Setup.exe))

### Get start development

- Clone repository

```console
  git clone git@github.com:ilrosch/Ntalk.git
  # or
  # git clone https://github.com/ilrosch/Ntalk.git
```

- Install dependencies

```console
  npm ci
```

- Run application

```console
  npm run start
```

- Build application

```console
  npm run make
  # or
  # npm run package (build at host OC)
```

---

## Future plans

- **Integration of the server application**:
  - Implementation of message routing via WebSocket.
  - Temporary storage of messages in a database for offline delivery.
- **Message encryption**: Adding client-side encryption functionality.
- **Automatic synchronisation**: Checking for unread messages when users reconnect.
- **Additional features**:
  - Notifications of new messages.
  - Group chats.

---

## Licence

This project is distributed under the MIT licence.

![Logo Ntalk](https://github.com/ilrosch/Ntalk/blob/main/src/asserts/img/icon.png?raw=true)
