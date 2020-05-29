const EventEmitter = require("events");
export const emitter = new EventEmitter();
emitter.setMaxListeners(0)