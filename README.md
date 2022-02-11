
# Google place autocomplete assignment

Google Place Autocomplete is to find places and show at map.

## Features

- React v7.0.2
- React-redux v7.2.6
- React-redux toolkit (For async actions)
- MUI v5.4.0

## Getting Started

1. Make sure you have a fresh version of [Node.js](https://nodejs.org/en/) and NPM installed. The current Long Term Support (LTS) release is an ideal starting point

2. Clone this repository to your computer: 
    ```sh
    git clone https://github.com/sureshbakshi/SearchLocation.git
    ```


3. From the project's root directory, install the required packages (dependencies):

    ```sh
    cd search-location
    npm install
    ```

4. To run and test the app on your local machine (http://localhost:3000):

    ```sh
    # it will start a server instance and begin listening for connections from localhost on port 8080
    npm run start
    ```

5. To build/deploye the app, you can run:

    ```sh
    # it will place all files needed for deployment into the /dist directory 
    npm run build
    ```

## Project Structure

```sh
├── public  
    ├── favicon.ico
    ├── index.html              # html template for the app
    ├── thumbnail.jpg           # an image will be used in og:image meta tag
├── src                         # Source code.
    ├── features              # reusable UI components
        ├── search_location              # building blocks for the Map Interface API for JavaScript (e.g. MapView, Search Widget)
    ├── Store                   # reducers to manage app's state
    ├── App.js                   # Root component
    └── index.js               # entry point for the app
├── package.json
```