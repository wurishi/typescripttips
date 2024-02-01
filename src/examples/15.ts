export type Event =
    | {
        type: 'LOG_IN';
        payload: {
            userId: string;
        };
    }
    | {
        type: 'SIGN_OUT';
    };

// const sendEvent = (eventType: Event['type'], payload?: any) => { };

// const sendEvent = <Type extends Event['type']>
//     (...args: Extract<Event, { type: Type }> extends { payload: infer TPayload }
//         ? [Type, TPayload]
//         : [Type]
//     ) => { };

const sendEvent = <Type extends Event['type']>
    (...args: Extract<Event, { type: Type }> extends { payload: infer TPayload }
        ? [type: Type, payload: TPayload]
        : [type: Type]
    ) => { };

sendEvent('LOG_IN', { userId: '123' });
sendEvent('SIGN_OUT');

// // SIGN_OUT 不需要任何 payload
// sendEvent('SIGN_OUT', {});
// // userId 类型不正确
// sendEvent('LOG_IN', {
//     userId: 123,
// });
// // payload 缺少 userId
// sendEvent('LOG_IN', {});
// // 缺少 payload
// sendEvent('LOG_IN');
