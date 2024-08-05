import initializeApp from './express/index.js';
import initiateMongoConnection from './lib/mongoose.js';

(async () => {
  await initiateMongoConnection();
  initializeApp();
})();
