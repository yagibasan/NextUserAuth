import Parse from 'parse';

// Initialize Parse SDK for client-side use
const BACK4APP_APPLICATION_ID = import.meta.env.VITE_BACK4APP_APPLICATION_ID;
const BACK4APP_JAVASCRIPT_KEY = import.meta.env.VITE_BACK4APP_JAVASCRIPT_KEY;

if (!BACK4APP_APPLICATION_ID || !BACK4APP_JAVASCRIPT_KEY) {
  throw new Error(
    'Missing required environment variables: VITE_BACK4APP_APPLICATION_ID and VITE_BACK4APP_JAVASCRIPT_KEY'
  );
}

Parse.initialize(BACK4APP_APPLICATION_ID, BACK4APP_JAVASCRIPT_KEY);
Parse.serverURL = 'https://parseapi.back4app.com';

export default Parse;
