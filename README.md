# Atelier Hotels

Atelier Hotels is a responsive, front-end web application for browsing and booking curated, luxury hotel stays. This project features an interactive map interface, dynamic content rendering, a fully functional shopping cart utilizing local storage, and a multi-step checkout process with regex-based form validation.

## ✨ Features

* **Interactive Map UI:** Utilizes Leaflet.js to plot hotel locations across Canada. Clicking a map marker dynamically fetches and renders specific hotel details, available rooms, and real-time weather.
* **Dynamic Data Fetching:** Asynchronously loads hotel and room inventory data from local JSON files (`hotels.json`, `rooms.json`) using the Fetch API and ES6 Classes.
* **Live Weather & Dynamic Pricing:** Integrates the WeatherAPI to display current weather conditions for the selected destination. Automatically calculates and applies weather-based promotional discounts during the checkout phase.
* **Persistent Shopping Cart:** Users can add and remove rooms from their cart. Cart data is preserved across sessions using `localStorage`. 
* **Smart Checkout System:** * Groups bookings by hotel to process single-location checkouts.
  * Multi-step modal interface separating personal details from payment information.
  * Comprehensive Regex form validation providing real-time UI feedback for errors and successful inputs.
* **Responsive UI/UX:** Built with Bootstrap 5, featuring a mobile-friendly offcanvas cart, responsive grid layouts, and custom CSS for a premium brand aesthetic.

## 🛠️ Technologies Used

* **Core:** HTML5, CSS3, JavaScript (ES6+)
* **Libraries & Frameworks:** * [Bootstrap 5](https://getbootstrap.com/) (Layout, Modals, Offcanvas, Icons)
  * [jQuery](https://jquery.com/) (DOM manipulation, Event handling)
  * [Leaflet.js](https://leafletjs.com/) (Interactive mapping)
* **APIs:** [WeatherAPI](https://www.weatherapi.com/)

## 🚀 Getting Started

Because this project uses the `fetch()` API to load local JSON files, it must be run on a local web server (opening the `index.html` file directly in the browser via `file://` will cause CORS errors).

### Prerequisites
You will need a local server environment. Some easy options include:
* **VS Code:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension.
* **Node.js:** Run `npx http-server` in the project directory.
* **Python:** Run `python -m http.server` in the project directory.

### Installation
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/atelier-hotels.git
   \`\`\`
2. Navigate to the project directory:
   \`\`\`bash
   cd atelier-hotels
   \`\`\`
3. Start your local server and open `index.html` in your browser.

## 📁 Project Structure

\`\`\`text
├── index.html          # Main HTML structure and layout
├── scripts/
│   ├── project.js      # Core logic: API calls, map initialization, dynamic rendering, cart management
│   └── validation.js   # Checkout math, weather promos, and regex form validation
├── style/
│   └── style.css       # Custom variables, UI overrides, and animations
├── public/
│   ├── hotels.json     # Hotel data (id, coordinates, description)
│   └── rooms.json      # Room inventory data
└── images/             # Video background, icons, and static assets
\`\`\`

## 👤 Author

**Emilia Bellido** ```

***

### How to add this to your repo:
1. In your code editor, create a new file named exactly `README.md` in the root folder of your project (right next to your `index.html`).
2. Paste the code above into it.
3. Save it, then use your terminal to commit and push it to GitHub just like you did with your code:
   * `git add README.md`
   * `git commit -m "Add project README"`
   * `git push`
