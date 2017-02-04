const EventEmitter = require('events');
const Promise = require('bluebird');

const emittersMap = new Map();

class ModelChangesEmitter extends EventEmitter {

  static modelChange({messageName, model, data, context}, ...args) {

    // Get a;
    var emitters = emittersMap.get(model);
    var baseEmitters = emittersMap.get(null);
    var proms = [];

    for (let set of [emitters, baseEmitters]) {
      if (set) {
        for (let emitter of set) {
          let listeners = emitter.listeners(messageName);
          for (let listener of listeners) {
            proms.push(Promise.resolve(listener(context, data, model, ...args)));
          }
        }
      }
    }

    return Promise.all(proms);
  }

  constructor(modelType) {
    super();

    // A falsey modelType will get changes for
    if (!modelType) {
      modelType = null;
    }

    var emitters = emittersMap.get(modelType);
    if (!emitters) {
      emitters = new Set();
      emittersMap.set(modelType, emitters);
    }

    emitters.add(this);
  }
}

module.exports = ModelChangesEmitter;
