# Economic Calendar Frontend

A modern, responsive web application for viewing and managing economic events, built with React, TypeScript, Vite, and TailwindCSS. This project provides an interactive economic calendar, allowing users to filter, view, and submit economic events by country, impact, and date.

## Features

- **Economic Calendar Dashboard**: View economic events in a calendar format, filterable by country and impact (high, medium, low).
- **Event Details**: Click on any event to view detailed information, including actual, previous, consensus, and forecast values.
- **Country & Impact Filters**: Easily filter events by one or more countries and by event impact.
- **Month Navigation**: Navigate between months to explore past and upcoming events.
- **Responsive UI**: Fully responsive design for desktop and mobile devices.
- **Add Economic Event**: Dedicated form to submit new economic events, with country autocomplete and validation.
- **Live Data**: Fetches events from a backend API, supporting dynamic updates.

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd economic-calendar-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Variables

Create a `.env` file in the project root with the following variable:

```
VITE_API_URL_DEVLOPMENT=<your-backend-api-url>
```

- Example: `VITE_API_URL_DEVLOPMENT=http://localhost:5000`
- This variable is used for all API requests (fetching and submitting events).

### Running the App

- **Development mode:**
  ```bash
  npm run dev
  # or
  yarn dev
  ```
- The app will be available at `http://localhost:5173` by default.

- **Production build:**
  ```bash
  npm run build
  npm run preview
  ```

## Usage

- **View Events:**
  - The main dashboard displays a calendar with economic events.
  - Filter by country and impact using the dropdowns.
  - Click on an event for more details.
- **Add Event:**
  - Go to `/form` or use the navigation to access the event submission form.
  - Fill in the details and submit to add a new event.

## Project Structure

- `src/TradingChart.tsx` — Main calendar dashboard and event filtering logic.
- `src/routes/form/Form.tsx` — Form for submitting new economic events.
- `public/countries.json` — List of countries used for filtering and form autocomplete.
- `src/main.tsx` — App entry point and routing.

## Technologies Used

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — Fast build tool
- [TailwindCSS](https://tailwindcss.com/) — Utility-first CSS framework
- [React Router](https://reactrouter.com/) — Routing
- [ECharts for React](https://github.com/hustcc/echarts-for-react) — (if charting is used)

## Customization

- **Countries List:** Edit `public/countries.json` to add or remove countries.
- **API URL:** Change the `VITE_API_URL_DEVLOPMENT` variable in your `.env` file.

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements or bug fixes.

## License

[MIT](LICENSE)

---

_This project is for educational and demonstration purposes. For production use, ensure proper backend security and validation._
