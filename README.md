# Interactive Neurodynamic Simulations App

[![Read the Docs][readthedocs]][readthedocs-url]

## Operating System
- Linux or macOS are officially supported by NEST.
- Windows is not officially supported by NEST.

## Setup Project

- Install NEST
  - Version 3.6
  - [Installation instructions](https://nest-simulator.readthedocs.io/en/stable/installation/user.html#user-install)
  - The recommended installation method is using the [conda forge install](https://nest-simulator.readthedocs.io/en/stable/installation/conda_forge.html#conda-forge-install) within a conda environment as follows:
    - _NOTE: This conda installation method will only work for Linux or macOS systems_
    - Install [anaconda](https://docs.anaconda.com/free/anaconda/install/index.html)
    - To install the latest version of NEST in a new environment called ENVVAME, run the following code in the terminal
    ```sh
    conda create --name ENVNAME -c conda-forge nest-simulator
    ```
    - To install a specific version of NEST, run the following code in the terminal:
    ```sh
    # this will install version 2.18.0
    conda create --name ENVNAME -c conda-forge nest-simulator=2.18.0=*
    ```
    - Activate your conda environment
    ```sh
    conda activate ENVNAME
    ```

  
- Setup backend
    - environment: python 3.9+
    - install the remaining requirements within your environment as follows:
```sh
# navigate to the app location
cd NeuroApp
cd backend
# install the requirements
pip install -r requirements.txt
# run the backend
uvicorn main:app --reload
```


- Setup frontend
    - Environment: node 16.14.0/16.16.0, yarn 1.22.19
   - Download node via [nvm node manager](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# open a new terminal window

# install nodejs
nvm install 16.16.0
nvm alias default 16.16.0
nvm use
# check node version
node -v
# navigate to the frontend and install yarn globally
cd frontend
npm install -g yarn

# install frontend dependencies
yarn
# run frontend
yarn dev
```

[readthedocs]: https://img.shields.io/readthedocs/web-app-template
[readthedocs-url]: https://web-app-template.readthedocs.io/en/latest/

## Important documentation

- [Nuxt 2](https://v2.nuxt.com/docs/get-started/routing)
- [Vuetift 2](https://v2.vuetifyjs.com/en/getting-started/installation/)
- [Fastapi](https://fastapi.tiangolo.com/)
- [Axios](https://axios-http.com/docs/intro)
- [Threejs](https://threejs.org/docs/)
- [Copper3d](https://github.com/LinkunGao/copper3d_visualisation)