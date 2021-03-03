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
4. Create `config.js` in `shared`

   Example (also in `shared/config-example.js`):
   ```js
    const config = {
        db      : {
            host: 'SQL-Server adress',
            user: 'SQL-Server user',
            password: 'Password for the user',
            database: 'Name of the database'
        },

        port    : 3000,
        url     : 'URL for Open Graph tags. Example: http://localhost/'
    }


    exports.config = config
   ```
   If you use the `setup.sql` file the database name should be `pollx`
5. Start it
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
