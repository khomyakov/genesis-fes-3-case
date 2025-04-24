# Weekend Tracks

A modern, feature-rich music track management application built with React, TypeScript, and TanStack technologies.

## Description

Weekend Tracks is a web application for managing and playing music tracks. The app allows users to browse, search, filter, and manage their music collection with an intuitive user interface. It provides comprehensive track management with features like creating, editing, and deleting tracks along with audio playback capabilities.

## Getting Started

### Prerequisites

- NodeJS version v20.13.1 or higher

### Installation and Running

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

After running these commands, the application will be available at http://localhost:3000

## Extra Features

### 1. Bulk Delete Functionality

The application implements a robust bulk deletion feature allowing users to select multiple tracks for deletion:

- **Selection Mode**: Users can enter selection mode and choose multiple tracks using checkboxes
- **Select All/None**: Ability to select all visible tracks with a single click
- **Implementation**: Found in `src/features/tracks/components/BulkBanner.tsx` and `src/features/tracks/hooks/useBulkDelete.ts`
- **UI Components**: Selection mode has a dedicated toolbar that shows the number of selected items and provides delete/cancel options

### 2. Optimistic Updates

The application uses optimistic UI updates to provide a responsive user experience:

- **Immediate Feedback**: When performing CRUD operations, the UI updates immediately before the server confirms the action
- **Fallback Handling**: If operations fail, the UI reverts to its previous state
- **Implementation**: 
  - Delete operation in `src/features/tracks/hooks/useDeleteTrack.ts` uses `onMutate` and `onError` to handle optimistic updates and rollbacks
  - Bulk deletion updates the cache immediately in `src/features/tracks/hooks/useBulkDelete.ts`

### 3. Audio Waveform Visualization

Tracks with audio files feature a visual waveform representation:

- **WaveSurfer Integration**: Uses the WaveSurfer.js library to render interactive audio waveforms
- **Playback Visualization**: Waveform shows progress as the track plays
- **Interactive Elements**: Users can click on the waveform to skip to different parts of the track
- **Implementation**: See `src/features/tracks/components/Waveform.tsx`

### 4. Persisting State in Local Storage

The application persists critical state to provide a seamless user experience across sessions:

- **Query Cache Persistence**: All track data is cached in localStorage for offline access
- **Theme Preference**: User's theme preference is stored and persisted
- **Implementation**:
  - Query persistence in `src/main.tsx` using TanStack Query's persistence capabilities
  - Theme storage in `src/components/providers/ThemeProvider.tsx`
- **Offline Indicator**: Shows when using cached data while offline

### 5. Theme Support

The application features comprehensive theme support:

- **Light/Dark Modes**: Users can toggle between light and dark themes
- **System Preference**: Automatically respects the user's system preference
- **Persistent Preference**: User's theme choice is stored in localStorage
- **Implementation**: 
  - Theme provider in `src/components/providers/ThemeProvider.tsx`
  - CSS variables in `src/index.css` define the color schemes for both themes

### 6. Animations

The application uses smooth animations to enhance the user experience:

- **Framer Motion**: Leverages Framer Motion for list and item animations
- **Transition Effects**: Smooth transitions between states like loading/loaded content
- **Micro-interactions**: Small animations on buttons, pagination, and other elements improve feedback
- **Implementation**:
  - List animations in `src/features/tracks/components/TrackList.tsx`
  - UI component animations in various components like dialog, alert, and pagination

### 7. Unit Tests

The application includes extensive unit tests to ensure reliability and maintainability:

- **Component Testing**: Tests for UI components like `TrackList`, `Cover`, `AudioPlayer`, and `Waveform`
- **Mock Implementation**: Uses Vitest's mocking capabilities to isolate components during testing
- **Test Coverage**: Testing critical functionality including audio playback, UI rendering, and user interactions
- **Implementation**:
  - Test files located in `src/features/tracks/components/__tests__/`
  - Global test setup in `vitest.config.ts`

#### Running Tests

The project includes several npm scripts for running tests:

```bash
# Run all tests once
npm run test

# Run tests in watch mode (rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Technical Implementation

The project utilizes a modern stack with:

- **React 19** with TypeScript for the UI
- **TanStack Query** for data fetching and caching
- **TanStack Router** for routing
- **Zustand** for state management
- **Shadcn** for the ui elements
- **Tailwind CSS** for styling
- **WaveSurfer.js** for audio visualization
- **Framer Motion** for animations
- **Vitest** for unit testing
