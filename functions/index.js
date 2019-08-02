/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const functions = require('firebase-functions');
const { dialogflow, HtmlResponse } = require('actions-on-google');

// map of human speakable colors to color values
const tints = {
  red: 0xFF0000,
  green: 0x00FF00,
  blue: 0x0000FF,
};

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const app = dialogflow({ debug: true });

app.intent('welcome', (conv) => {
  if (!conv.surface.capabilities
    .has('actions.capability.INTERACTIVE_CANVAS')) {
    conv.close("Sorry, this device does not support Interactive Canvas!");
    return;
  }
  conv.ask('Welcome! Do you want me to change color or pause spinning? ' +
    'You can also tell me to ask you later.');
  conv.ask(new HtmlResponse({
    url: `https://${firebaseConfig.projectId}.firebaseapp.com`,
  }));
});

app.intent('fallback', (conv) => {
  conv.ask(`I don't understand. You can change my color or pause spinning.`);
  conv.ask(new HtmlResponse({
    data: {
      query: conv.query,
    },
  }));
});

app.intent('color', (conv, { color }) => {
  if (color in tints) {
    conv.ask(`Ok, I changed my color to ${color}. What else?`);
    conv.ask(new HtmlResponse({
      data: {
        command: 'TINT',
        tint: tints[color],
      },
    }));
    return;
  }
  conv.ask(`Sorry, I don't know that color. ` +
    `I only know what red, blue, and green are.`);
  conv.ask(new HtmlResponse({
    data: {
      query: conv.query,
    },
  }));
});

app.intent('start', (conv) => {
  conv.ask(`Ok, I'm spinning. What else?`);
  conv.ask(new HtmlResponse({
    data: {
      command: 'SPIN',
      spin: true,
    },
  }));
});

app.intent('pause', (conv) => {
  conv.ask('Ok, I paused spinning. What else?');
  conv.ask(new HtmlResponse({
    data: {
      command: 'SPIN',
      spin: false,
    },
  }));
});

app.intent('timer', (conv) => {
  conv.ask(`Ok, I'll ask you again in 5 seconds`);
  conv.ask(new HtmlResponse({
    suppress: true,
    data: {
      timer: 5,
    },
  }));
});

app.intent('instructions', (conv) => {
  conv.ask('Do you want me to change color or pause spinning? ' +
    'You can also tell me to ask you later.');
  conv.ask(new HtmlResponse({
    data: {
      instructions: true,
    },
  }));
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
