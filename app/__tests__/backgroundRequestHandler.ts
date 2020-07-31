import chromeApi from "sinon-chrome";
window['chrome'] = chromeApi as unknown as typeof chrome;

import { BackgroundRequestHandler, MessageEmitter, RequestHandler, MessageHandler } from "../src/background/backgroundRequestHandler";
import { BackgroundRequestType, BackgroundRequestData, BackgroundRequestResponseFactory, BackgroundRequestError } from "../src/common/requests/BackgroundRequest";

describe("BackgroundRequestHandler", () => {
  beforeEach(() => {
    chromeApi.flush();
  });

  it("registers with chrome in prod.", () => {
    expect(chromeApi.runtime.onMessage.addListener.calledOnce);
  });

  it("allows callbacks to be registered", () => {
    const type = 0 as BackgroundRequestType;
    const callback: RequestHandler<any> = () => new Promise<any>(() => {});

    // Create a background req handler and register our type/callback.
    const brh: BackgroundRequestHandler = new BackgroundRequestHandler({} as MessageEmitter);
    brh.on(type, callback);
  });

  it("calls the right handler for a given type.", () => {
    const type = 0 as BackgroundRequestType;
    const callback = jest.fn().mockReturnValue(new Promise(() => {})) as RequestHandler<any>;
    
    const messageEmitter = new MockableMessageEmitter();

    // Create a new background request handler, registering our type, callback, and emitter.
    const brh = new BackgroundRequestHandler(messageEmitter.getRegularMessageEmitter());
    brh.on(type, callback);
    brh.listen();

    // Pass in a message of the above type, making sure the associated callback is called.
    const mockData = {type, data: "foo"} as BackgroundRequestData;
    messageEmitter.sendMessage(mockData);
    expect(callback).toHaveBeenCalledWith(mockData);
  });

  it("can get a response.", (done) => {
    const type = 0 as BackgroundRequestType;
    const response = {foo: "bar"};

    const callback = jest.fn().mockResolvedValue(response) as RequestHandler<any>;
    const responseCallback = jest.fn();
    
    const messageEmitter = new MockableMessageEmitter();

    // Create a new background request handler, registering our type, callback, and emitter.
    const brh = new BackgroundRequestHandler(messageEmitter.getRegularMessageEmitter());
    brh.on(type, callback);
    brh.listen();

    // Pass in a message of the above type, making sure the associated callback is called.
    const mockData = {type, data: "foo"} as BackgroundRequestData;
    messageEmitter.sendMessage(mockData, responseCallback);
    expect(callback).toHaveBeenCalledWith(mockData);
    
    // The response test must be in a setImmediate, because the promise calling it
    // will not return right away.
    // This delay will wait for that 'tick' to complete.
    setImmediate(() => {
      expect(responseCallback).toHaveBeenCalledWith(
        BackgroundRequestResponseFactory.fromData(response)
      );
      done();
    });
  });

  it("can handle an error", (done) => {
    const type = 0 as BackgroundRequestType;
    const error = {message: "foo"} as BackgroundRequestError;

    const callback = jest.fn().mockRejectedValue(error) as RequestHandler<any>;
    const responseCallback = jest.fn();
    
    const messageEmitter = new MockableMessageEmitter();

    // Create a new background request handler, registering our type, callback, and emitter.
    const brh = new BackgroundRequestHandler(messageEmitter.getRegularMessageEmitter());
    brh.on(type, callback);
    brh.listen();

    // Pass in a message of the above type, making sure the associated callback is called.
    const mockData = {type, data: "foo"} as BackgroundRequestData;
    messageEmitter.sendMessage(mockData, responseCallback);
    expect(callback).toHaveBeenCalledWith(mockData);
    
    // The response test must be in a setImmediate, because the promise calling it
    // will not return right away.
    // This delay will wait for that 'tick' to complete.
    setImmediate(() => {
      expect(responseCallback).toHaveBeenCalledWith(
        BackgroundRequestResponseFactory.fromError(error)
      );
      done();
    });
  });
});

/** This allows us to control the messages passed into background request handler, instead
 * of using chrome runtime messaging.
 */
class MockableMessageEmitter {
  /** The handler provided by background req handler when this is registered.
   * This will be used to pass messages.
   */
  messageHandler: MessageHandler;

  /** Send a data object to the associated message handler. */
  sendMessage<D extends BackgroundRequestData>(data: D, responseCallback = () => {}) {
    this.messageHandler(data, undefined, responseCallback);
  }

  /** Get a normal message emitter to pass to background request handler.
   * This emitter will 'pass through' its handler to this instance, allowing control.
   */
  getRegularMessageEmitter(): MessageEmitter {
    return {
      register: (handler: MessageHandler) => this.messageHandler = handler
    }
  }
}