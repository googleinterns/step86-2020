import chromeApi from "sinon-chrome";

import { BackgroundRequestType, BackgroundRequestData, BackgroundRequest } from "../src/common/requests/BackgroundRequest";

class SampleRequestData extends BackgroundRequestData {
    sampleProp: string;

    constructor(sampleProp: string) {
        super(BackgroundRequestType.FETCH_PROJECTS);
        this.sampleProp = sampleProp;
    }
}

interface SampleResponse {
    foo: string;
}

class SampleRequest extends BackgroundRequest<SampleRequestData, SampleResponse> {}

describe("BackgroundRequestData", () => {
    it("can be instantiated", () => {
        const data = new SampleRequestData("test");
        expect(data.type).toBe(BackgroundRequestType.FETCH_PROJECTS);
        expect(data.sampleProp).toBe("test");
    });
});

describe("BackgroundRequest", () => {
    beforeEach(() => {
        // Resets the stub for each test
        chromeApi.runtime.sendMessage.flush();
    });

    it("can be instantiated with default chrome", () => {
        const req = new SampleRequest();
    });

    it("can be instantiated with chrome mock", () => {
        const req = new SampleRequest(chromeApi as unknown as typeof chrome);
    });

    it("can send a message", () => {
        const data = new SampleRequestData("test");
        const req = new SampleRequest(chromeApi as unknown as typeof chrome);

        req.run(data);
        expect(chromeApi.runtime.sendMessage.calledOnceWith(data)).toBe(true);
    });

    it("can get a response", async () => {
        const data = new SampleRequestData("test");
        const req = new SampleRequest(chromeApi as unknown as typeof chrome);

        const stub = {foo: "bar"} as SampleResponse;

        // Intercept the message and send a stubbed response.
        // "1" represents the index of the sendMessage response function.
        chromeApi.runtime.sendMessage.callsArgWith(1, stub);

        // Need to explicitly declare number of assertions to expect if async.
        expect.assertions(1);
        const response = await req.run(data);
        expect(response).toEqual(stub);
    });
});