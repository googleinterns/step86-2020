# STEP Capstone Project
## Cloud Debugger Extension

### Development
#### Structure

##### `/api`
Standalone module for the API. This has been separated out to allow reuse in VSCode in the future. 

##### `/app`
Standalone module for the extension itself. It imports the API as a node module.

#### Developing the API
TODO: Write this in more detail. In summary, it's pretty flexible as long as src/index.js exports all the required methods.

#### Developing the App
Developing the extension side is a bit trickier since it has both UI and non UI elements, and multiple mounting points.

Within src, feel free to make directories as required. `/popup` will be shown as a chrome-browser popup, wihle `/injected` with be injected into specific websites (todo).

#### Running
To run the entire extension, 
1. Run `npm run clean-build` to package the extension.
2. Within chrome, go to Extensions > Load Unpacked Extension
3. Select the `/app/dist` directory, this is the extension.

