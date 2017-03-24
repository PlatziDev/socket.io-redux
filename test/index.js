import test from 'tape';
import socketIO from '../build/index';

function next(action) { return action; }

function mockSocket(t, expected) {
  let emit = (channel, data) => {
    if (expected.channel) {
      t.equals(channel, expected.channel, `it should have the channel "${expected.channel}"`);
    }
    if (expected.action) {
      t.deepEquals(data, expected.action, 'it should have the action as data');
    }
  };

  let to = room => {
    if (expected.room) {
      t.equals(room, expected.room, `it should have the room "${expected.room}"`);
    }
    return { emit };
  };

  let of = namespace => {
    if (expected.namespace) {
      t.equals(namespace, expected.namespace, `it should have the namespace "${expected.namespace}"`);
    }
    return { to, emit };
  };

  return { of, to, emit };
}

test('socket.io middleware', t => {
  t.plan(3);

  const testAction = {
    type: 'ADD_NEW',
    payload: 'hello world!',
    meta: {
      socket: {
        channel: 'add:new',
      },
    },
  };

  const socket = mockSocket(t, {
    channel: 'add:new',
    action: testAction,
  });

  const action = socketIO(socket)()(next)(testAction);
  t.deepEquals(action, testAction, 'it should the return the passed action');
});

test('socket.io middleware with namespace', t => {
  t.plan(4);

  const testAction = {
    type: 'ADD_NEW',
    payload: 'hello world!',
    meta: {
      socket: {
        channel: 'add:new',
        namespace: 'test:ns',
      },
    },
  };

  const socket = mockSocket(t, {
    channel: 'add:new',
    action: testAction,
    namespace: 'test:ns',
  });

  const action = socketIO(socket)()(next)(testAction);
  t.deepEquals(action, testAction, 'it should return the passed action');
});

test('socket.io middleware with namespace and room', t => {
  t.plan(5);

  const testAction = {
    type: 'ADD_NEW',
    payload: 'hello world!',
    meta: {
      socket: {
        channel: 'add:new',
        namespace: 'test:ns',
        room: 'test:room',
      },
    },
  };

  const socket = mockSocket(t, {
    channel: 'add:new',
    action: testAction,
    namespace: 'test:ns',
    room: 'test:room',
  });

  const action = socketIO(socket)()(next)(testAction);
  t.deepEquals(action, testAction, 'it should return the passed action');
});
