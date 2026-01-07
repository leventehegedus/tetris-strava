# Tetris-Strava

A modern Tetris game built with ReactJS, featuring Strava API integration to view your athletic activities.

![Tetris Game](https://github.com/user-attachments/assets/8309b584-1573-460e-b250-12b59300ea3a)

## Features

- 🎮 **Classic Tetris Gameplay** - Fully functional Tetris game with all standard features
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components
- 🏃 **Strava Integration** - Connect your Strava account to view recent activities
- ⚡ **Fast & Responsive** - Built with Vite for optimal performance
- 🎯 **TypeScript** - Type-safe codebase for better developer experience

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v3
- **UI Components:** shadcn/ui
- **Routing:** React Router DOM
- **API Integration:** Strava API v3

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/leventehegedus/tetris-strava.git
cd tetris-strava
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Game Controls

- **← →** - Move piece left/right
- **↑** - Rotate piece
- **↓** - Soft drop (move down faster)
- **Space** - Hard drop (instant drop)
- **P** - Pause/Resume game

## Strava Integration

To connect your Strava account:

1. Create a Strava API application at [Strava API Settings](https://www.strava.com/settings/api)
2. Set the authorization callback domain to your app's URL (e.g., `http://localhost:5173` for local development)
3. Click the "Connect" button in the app
4. Enter your Strava Client ID and Client Secret
5. Authorize the application
6. View your recent activities in the sidebar

### Strava API Configuration

When creating your Strava API application:
- **Application Name:** Choose any name (e.g., "Tetris Strava")
- **Category:** Choose the most appropriate category
- **Website:** Your app's URL
- **Authorization Callback Domain:** `localhost` (for development) or your production domain
- **Application Icon:** Optional

## Project Structure

```
tetris-strava/
├── src/
│   ├── components/
│   │   ├── tetris/          # Tetris game components
│   │   ├── strava/          # Strava integration components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/
│   │   ├── useTetris.ts     # Tetris game logic hook
│   │   └── useStrava.ts     # Strava API integration hook
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── constants/           # Game constants and configurations
│   ├── pages/               # Page components
│   └── lib/                 # Shared utilities
├── public/                  # Static assets
└── ...config files
```

## Development

### Running Linter

```bash
npm run lint
```

### Type Checking

TypeScript type checking is done automatically during the build process.

## Features in Detail

### Tetris Game
- Classic Tetris gameplay mechanics
- 7 different tetromino shapes (I, J, L, O, S, T, Z)
- Score tracking
- Level progression (speed increases every 10 lines)
- Line clearing with score multipliers
- Pause/Resume functionality
- Game over detection

### Strava Integration
- OAuth 2.0 authentication flow
- Secure token storage in localStorage
- Activity listing with:
  - Activity name and type
  - Distance and duration
  - Date information
- Refresh functionality
- Easy disconnect option

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Classic Tetris game mechanics
- [Strava API](https://developers.strava.com/) for activity data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
