
module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '104.248.22.84',
      username: 'root',
      pem: '~/.ssh/id_rsa'
    }
  },

  app: {
    name: 'Peer2Panel',
    path: '../',

    servers: {
      one: {},
    },

    // does not build mobile apps apparently?
    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: "https://demo.peer2panel.com",
      MONGO_URL: 'mongodb+srv://dbUser:j5fHHFHEon3bGuLk@cluster0.5j1cz.mongodb.net/myFirstDatabase',
      PORT: 3009,  
      //MONGO_OPLOG_URL: 'mongodb://mongodb/local',
      
      // MONGO_URL: 'mongodb+srv://Milliways:Bistromath.42@cluster0-vovky.mongodb.net/test',
      
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-12-base',
      //buildInstructions: [
      //  'RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget'
      //]
    },

    volumes: {
        // passed as '-v /host/path:/container/path' to the docker run command
        '/home': '/home',
    },

    // This is the maximum time in seconds it will wait
    // for your app to start
    // Add 30 seconds if the server has 512mb of ram
    // And 30 more if you have binary npm dependencies.
    deployCheckWaitTime: 60,
    deployCheckPort: 3009,

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  /*mongo: {
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {}
    }
  },*/

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  proxy: {
    domains: 'demo.peer2panel.com',
    ssl: {
      // Enable let's encrypt to create free certificates.
      // The email is used by Let's Encrypt to notify you when the
      // certificates are close to expiring.
      letsEncryptEmail: 'jonathan@mail.milliwayszurich.com',
      forceSSL: true 
    }
  }

};
