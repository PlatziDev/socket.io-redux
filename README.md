# socket.io-redux
Redux middleware to emit actions to a socket.io server

## API
### Apply middleware
```javascript
import io from 'socket.io-client';
import { createStore, applyMiddleware } from 'redux';

import socketIO from 'socket.io-redux';

import reducer from './reducer';

const store = createStore(reducer, applyMiddleware(
  socketIO(io.connect(process.env.SOCKET_URL))
));
```
* `socketIO` receive a `socket` instance created by `io.connect(<url>)`.

### Example action
```javascript
const action = {
  type: 'ADD_TODO',
  payload: {
    message: 'Use socket.io-redux middleware',
  },
  meta: {
    socket: {
      channel: 'add:todo',
      namespace: 'ns',
      room: 'room',
    },
  },
};
```
* `meta.socket.channel` define the socket.io channel to use to emit the action.
* `meta.socket.namespace` (optional) use the given namespace, instead of the default, to emit the action.
* `meta.socket.room` (optional) emit the action to the given room, instead of a global broadcast.
