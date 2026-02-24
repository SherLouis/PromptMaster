# PromptMaster

PromptMaster is a powerful, beautifully designed Chrome extension for managing, building, and generating high-quality prompt templates for large language models (LLMs). It allows you to create specific templates with user inputs, dropdowns, and static instructional text, making it incredibly easy to quickly fill out complex prompts and copy them to your clipboard.

## Features

- **Built-in Templates**: Comes equipped with a robust set of starter templates for a variety of use-cases (Learning, Coding, Business, Creative Writing, Academic, etc.).
- **Smart Variable Fields**: Define templates with static context buffers, free-form user inputs, and predefined dropdown options (e.g., Tone, Complexity, Length).
- **Template Designer Mode**: Built-in template editor allowing you to create personalized prompt structures. Drag, drop, add, and re-order prompt variables.
- **Global Search**: Easily filter down to the exact prompt template you need with lightning-fast real-time search.
- **Format-Aware Copying**: Automatically formats the prompt sections with optimal whitespace, ensuring that the copied output is structurally clean and ready to paste into any LLM.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion & Lucide React (for UI/animations)

## Installation Guide (Chrome / Chromium-based Browsers)

PromptMaster is designed as an unpacked Chrome Extension. To install it manually on your local machine, follow these steps:

### 1. Build the Extension
First, ensure you have [Node.js](https://nodejs.org/) installed on your machine.
Clone the repository, navigate to the project directory, and install dependencies, then build the project:

```bash
# Install the project dependencies
npm install

# Build the project
npm run build
```
This will compile the application and generate a new `dist/` folder in your project directory containing the extension files.

### 2. Load the Extension into Chrome
1. Open Google Chrome (or any Chromium-based browser like Brave or Edge).
2. Type `chrome://extensions/` into your address bar and press Enter.
3. In the top right corner of the Extensions page, toggle **Developer mode** to ON.
4. Click the **Load unpacked** button that appears in the top left.
5. In the file dialog, navigate to your cloned `PromptMaster` directory and select the `dist` folder.
6. Click **Select** (or Open).

**PromptMaster** should now appear in your list of installed extensions! You can click the puzzle icon in your Chrome toolbar and "pin" PromptMaster for easy access.

## Development Setup

To test UI changes without constantly reloading the extension, you can run the localized dev server.

```bash
npm run dev
```

This will mock the Chrome Storage API using `localStorage` so you can visually test creating, editing, and using templates exactly as you would in the extension.

## Usage

1. **Pick a Goal**: Click on a high-level category like "Coding" or "Business", or use the Global Search.
2. **Select a Template**: Choose a template that matches what you are trying to do (e.g., Code Refactoring).
3. **Fill out fields**: Select your dropdown options (Tone, Main Focus, Level) and enter your specific context.
4. **Copy Prompt**: Hit the "Copy Prompt" button. Your fully customized prompt is ready to be pasted!

