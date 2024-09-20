declare module 'sockjs-client/dist/sockjs' {
  import SockJS from '@types/sockjs-client';

  //See: https://github.com/sockjs/sockjs-client/issues/439 for more information

  export = SockJS;
  export as namespace SockJS;
}
