![POLLX](src/logo/logo-with-text.png)

> Simple online polls

# Requirements

- NodeJS & npm
- MySQL/MarinaDB Server

# Installation

1. Download Code
   ```shell
   $ git clone https://github.com/nimajneBG/pollx.git
   ```
2. Prepare Database
   ```shell
   $ mysql -u [your username] < setup.sql
   ```
3. Install Dependencies
   ```shell
   $ npm i
   ```
4. Create `.env`

   Example (also in `.env.example`):
   ```txt
   PORT = The port the server should run on (default: 3000)
   SECRET = The secret for the cookies
   DB_HOST = The adress of your mysql server (default: localhost)
   DB_USER = Your DB User (default: root)
   DB_PASSWORD = Your DB Password
   URL = The public URL of your app
   DB_MAX_CONNECTIONS = Max number of connections in the poll (default: 10)
   ```
5. Build the CSS
   ```shell
   $ npm run build
   ```
6. Start it
   ```shell
   $ npm run start
   ```

# License 
MIT

# Todos

See `TODOS.md`

# Credits

- Fonts from fonts.google.com
- ASCII Art created with http://www.patorjk.com/software/
- Pop-up Library under `MIT` by Gregor Parzefall and Benjamin Grau https://github.com/nimajneBG/Pop-up-Library
