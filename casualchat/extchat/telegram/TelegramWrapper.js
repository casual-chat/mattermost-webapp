// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import TdClient from 'tdweb';
import {addTelegramUserToCasualChat, setUserLinked} from 'casualchat/actions/telegram_action';
import 'casualchat/include_prebuilt.js_tsignore';
import store from 'stores/redux_store';

//const TdClient = require("tdweb");
let client;
let isReadyToSendCode = false;

export function startClient(phoneNumber, whackyLinkCallback) {
    client = new TdClient({
        onUpdate: createUpdateFunction(phoneNumber, whackyLinkCallback),
        jsLogVerbosityLevel: 'INFO',
        instanceName: 'casualchat-tdweb',
        isBackground: true,
    });

    //start();
}
export const start = async () => {
    /* eslint-disable no-console */
    console.log('starting');
    const result = await send({
        '@type': 'random',
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

export async function sendVerificationCode(code) {
    if (!isReadyToSendCode) {
        throw new Error('Not Ready to Send Code');
    }
    await checkAuthenticationCode(code);
}

export async function logOut() {
    /* eslint-disable no-console */
    console.log('Logging Out');
    const result = await send({
        '@type': 'logout',
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
}

export async function pullContacts(dispatch) {
    console.log('Pulling Contacts');
    const result = await send({
        '@type': 'getContacts',
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
    dispatch(
        addTelegramUserToCasualChat(result.user_ids),
    );
}

export async function receiveMessage() {
    console.log('Receive Messages');
    const result = await send({
        '@type': 'updateNewMessage',
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log('sender:', result.message.sender.user_id);
    console.log('message:', result.message.content.text.text);

    // dispatch(
    //     receiveMessageFromCasualChat(externalMessage,sender)
    // );
}

export async function sendMessage() {
    console.log('Send Messages');
    const getResult = await send({
        '@type': 'createPrivateChat',
        user_id: 1359977993,
    });

    console.log('result');
    console.log(getResult);

    const result = await send({
        '@type': 'sendMessage',
        chat_id: 1359977993,
        reply_to_message_id: 0,
        disable_notifications: false,
        from_background: false,
        reply_markup: null,
        input_message_content:
        {
            '@type': 'inputMessageText',
            text: {
                '@type': 'formattedText',
                text: 'Test pjn',
                entities: null,
            },
            disable_web_page_preview: false,
            clear_draft: false,
        },
    });
    /* eslint-disable no-console */
    console.log('result');
    console.log(result);
    /* eslint-disable no-console */
}

const send = async (messageObject) => {
    return client.send(messageObject);
};

const createUpdateFunction = (phoneNumber, whackyLinkCallback) => {
    return (updateObject) => {
        console.log(updateObject);
        if (updateObject['@type'] === 'updateAuthorizationState') {
            if (updateObject.authorization_state['@type'] === 'authorizationStateWaitTdlibParameters') {
                setTdLibParameters();
            } else if (updateObject.authorization_state['@type'] === 'authorizationStateWaitEncryptionKey') {
                checkDatabaseEncryptionKey();
            } else if (updateObject.authorization_state['@type'] === 'authorizationStateWaitPhoneNumber') {
                setAuthenticationPhoneNumber(phoneNumber);
            } else if (updateObject.authorization_state['@type'] === 'authorizationStateWaitCode') {
                isReadyToSendCode = true;
                /* eslint-disable no-console */
                console.log('Ready for code');
            } else if (updateObject.authorization_state['@type'] === 'authorizationStateReady') {
                /* eslint-disable no-console */
                console.log('Ready to go');
                store.dispatch(setUserLinked(true));
                whackyLinkCallback();
            }
        }
    };
};

const setTdLibParameters = async () => {
    /* eslint-disable no-console */
    console.log('Sending tdlibparam');
    const result = await send({
        '@type': 'setTdlibParameters',
        parameters: {
            database_directory: './td-db',
            api_id: 2727981,
            api_hash: 'f74bb617138e30e349a7c93bed9477ca',
            system_language_code: 'en',
            device_model: 'Windows Machine',
            application_version: '1',
        },
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

const checkDatabaseEncryptionKey = async () => {
    /* eslint-disable no-console */
    console.log('Sending encryption key');
    const result = await send({
        '@type': 'checkDatabaseEncryptionKey',
        encryption_key: null,
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

const setAuthenticationPhoneNumber = async (phoneNumber) => {
    /* eslint-disable no-console */
    console.log('Sending phone number');
    const result = await send({
        '@type': 'setAuthenticationPhoneNumber',
        phone_number: phoneNumber,
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

const checkAuthenticationCode = async (code) => {
    /* eslint-disable no-console */
    console.log('Sending code');
    const result = await send({
        '@type': 'checkAuthenticationCode',
        code,
    });
    /* eslint-disable no-console */
    console.log('result');
    /* eslint-disable no-console */
    console.log(result);
};

// const getContacts = async () => {
//     /* eslint-disable no-console */
//     console.log('Pulling Contacts');
//     const result = await send({
//         '@type': 'getContacts',
//     });
//     /* eslint-disable no-console */
//     console.log('result');
//     /* eslint-disable no-console */
//     console.log(result);
// };

