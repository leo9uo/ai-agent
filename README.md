# AI-Powered Investment Analysis Tool

An AI-Powered assistant that combines financial data with an intuitive chat interface to help users make informed investment decisions.

![Demo](public/demo.gif)

## Features

- **AI-Powered Chat**: Chat with an investment analyst AI assistant to get insights on a specific company.
- **Real-Time Stock Data**: Access up-to-date stock information and financial metrics.
- **Company Profile Analysis**: Explore detailed company profiles and latest news.
- **Financial Document Explorer**: Easily analyze income statements, SEC filings, and other financial documents.
- **Responsive Design**: Fully functional on both desktop and mobile devices.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: FastAPI, Python
- **AI LLM Model**: Mistral
- **Data Sources**: Finnhub, SEC API, Yahoo Finance

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.7 or later)
- npm or yarn
- API keys for Mistral, Finnhub, and SEC (users will need to obtain these themselves)


## Developing Locally

You can clone & create this repo with the following command

```bash
   git clone https://github.com/mernri/ai-agent
   cd ai-agent
```

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The FastApi server will be running on [http://127.0.0.1:8000](http://127.0.0.1:8000) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).


## Using the Application

When you first open the application, you'll be prompted to enter your API keys for Mistral, Finnhub, and SEC.
These keys are stored securely in your browser's memory and are not saved or transmitted elsewhere.
Once you've entered your API keys, you can start using the investment analysis tools.