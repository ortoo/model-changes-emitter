const EventEmitter = require('events');

const emittersMap = new Map();

class ModelChangesEmitter extends EventEmitter {

  static modelChange({messageName, model, data}) {

    // Get a;
    var emitters = emittersMap.get(model);
    var baseEmitters = emittersMap.get(null);

    for (let set of [emitters, baseEmitters]) {
      if (set) {
        for (let emitter of set) {
          emitter.emit(messageName, data, model);
        }
      }
    }
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
