# Prescription Scheduler

This project is a tech test solution for the following brief:

> Create a system that collects user input (availability, prescription type, dose information) and generates a 14-day medication pick-up schedule, accounting for user availability and UK bank holidays.

---

## Requirements
- Node.js v20.x recommended

## Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/garyoconnor89/prescription-tech-test
cd prescription-tech-test
```

2. **Install dependencies:**

```bash
npm install
```

---

## Running the Application Locally

Start the development server:

```bash
npm run dev
```

Once started, access the application by visiting:

```
http://localhost:5173
```

---

## Testing

This project uses **Vitest** for unit testing.

To run the test suite:

```bash
npm run test
```

To open the **Vitest UI** (for an interactive test dashboard):

```bash
npm run test:ui
```

---

## Project Structure

```
src/
└── lib/
    ├── components/    # Svelte components for UI and user input
    ├── data/          # Static data (days of week, prescription types, bank holidays)
    ├── types/         # TypeScript types
    ├── utils/         # Utility functions and testing
└── routes/
    └── +page.svelte   # Main page component
```

---

## Future Project Improvements

### More Comprehensive Testing
- Write tests for more cases and edge cases (e.g multiple bank holidays, min/max dosages)
- Validate user inputs more robustly (e.g prevent negative numbers, handle invalid formats or empty input)

### Improve UI
- Improve the very basic input to make the app more attractive
- Display the schedule with a closeable modal

### Real-Time Bank Holidays
- Replace hardcoded bank holidays with live data from the [Gov UK Bank Holidays API](https://www.gov.uk/bank-holidays)
- Or hold the holidays in data and schedule a script to update periodically, to avoid repeated API calls for pretty static data

---

## Tech Stack

- **SvelteKit** — modern frontend framework
- **TypeScript** — typed JavaScript
- **Vitest** — fast unit testing framework
- **Vite** — development server and build tool

---