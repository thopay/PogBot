<!-- PROJECT LOGO -->
<br />
<p align="center">
  <img src="https://media.discordapp.net/attachments/562041975797317643/761764121627852830/pogbotshadow.png?width=256&height=256">
  <h3 align="center">PogBot</h3>

  <p align="center">
    Automating the process of adding to cart and autofilling information with Supreme.
    <br />
    <a href="https://github.com/th-ms/PogBot"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://github.com/th-ms/PogBot">Report Bug</a>
    ·
    <a href="https://github.com/th-ms/PogBot">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

<img src="https://media.discordapp.net/attachments/562041975797317643/761773171346374676/carbon_3.png?width=960&height=496">

I've been working with requests and Supreme for a while now, so I figured it makes sense to open-source a simple ATC script.

Current Features
* Searches API for product, size, and color
* Has to option to pick random size (random color soon)
* Opens a browser autofilled with information for user to complete checkout

### Built With
* [Node](https://nodejs.org/)
* [Puppeteer](https://github.com/puppeteer/puppeteer)
* [Axios](https://github.com/axios/axios)
* [Tough-Cookie](https://github.com/salesforce/tough-cookie)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
```sh
npm install npm@latest -g
```

### Installation

1. Clone the repo
```sh
git clone https://github.com/th-ms/PogBot.git
```
2. Install NPM packages
```sh
npm install
```
3. Edit main.js with keywords for product, sizing, and color
4. Edit main.js with checkout information
5. Run the bot
```sh
npm start
```



<!-- USAGE EXAMPLES -->
## Usage

Open main.js and replace default keywords with for desired keywords for product, sizing, and color.
After that also replace the default checkout information with yours (this is what's autofilled).
Save it and run the script.

<!-- ROADMAP -->
## Roadmap

* Edit the script so that it monitors item if it's OOS or not live yet
* Add random color option

See the [open issues](https://github.com/th-ms/PogBot/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License.



<!-- CONTACT -->
## Contact

Thomas - [@th___mas](https://twitter.com/th___mas) - contact@th-mas.dev 

Project Link: [https://github.com/th-ms/PogBot](https://github.com/th-ms/PogBot)
