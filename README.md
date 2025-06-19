# Walther's Room | Flags Around The World 🌍

Welcome to **Walther's Room** - A beautiful, interactive web application showcasing flags and information about countries from around the world. Built with modern web technologies for a fast and engaging user experience.

🌐 **Live Site**: [walthersroom.com](https://walthersroom.com)

## ✨ Features

- **🌐 Complete Country Database**: Access to 250+ countries with detailed information
- **🔍 Smart Search**: Search countries by name, capital, or region
- **📊 Advanced Filtering**: Filter by regions (Africa, Americas, Asia, Europe, Oceania)
- **🔄 Flexible Sorting**: Sort by name, population, or area (ascending/descending)
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **⌨️ Keyboard Navigation**: Full keyboard support with arrow keys for navigation
- **🎯 Accessibility**: ARIA labels, focus management, and screen reader support
- **🚀 Fast Performance**: Built with Vite 6 for lightning-fast loading
- **🎨 Modern UI**: Clean design with Tailwind CSS and DaisyUI components
- **📖 Detailed View**: Modal with comprehensive country information
- **🗺️ Interactive Maps**: Direct links to Google Maps for each country
- **🔄 Error Handling**: Robust error handling with retry functionality
- **📝 Code Quality**: ESLint and Prettier for consistent code formatting

## 🛠️ Technology Stack

- **⚡ Vite 6**: Next-generation build tool for fast development
- **📝 TypeScript**: Type-safe JavaScript with modern features
- **🎨 Tailwind CSS 3.4.17**: Utility-first CSS framework
- **🔤 Google Fonts**: Inter font family for beautiful typography
- **🎯 Google Material Icons**: Consistent iconography
- **🌐 REST Countries API**: Comprehensive country data source

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/walthers-room/flags-around-the-world.git
   cd flags-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Optional: Copy environment variables**
   ```bash
   cp .env.example .env
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Check TypeScript types
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

4. **Open your browser**
   Navigate to `http://localhost:8090`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## � Deployment

This project is deployed at [walthersroom.com](https://walthersroom.com) and can be deployed to various platforms:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Use GitHub Actions for automated deployment
3. Build and deploy to `gh-pages` branch

## �📁 Project Structure

```
src/
├── components/
│   ├── CountryCard.ts      # Individual country card component
│   ├── CountryModal.ts     # Detailed country information modal
│   └── FlagsApp.ts         # Main application component
├── services/
│   └── countriesService.ts # API service for fetching country data
├── types/
│   └── country.ts          # TypeScript interfaces
├── utils/
│   └── helpers.ts          # Utility functions
├── style.css               # Global styles with Tailwind
└── main.ts                 # Application entry point
```

## 🌟 Key Features Explained

### Country Information
Each country displays:
- **Flag Image**: High-quality SVG/PNG flags
- **Basic Info**: Official and common names, region, capital
- **Demographics**: Population and area with formatted numbers
- **Culture**: Languages and currencies
- **Geography**: Timezones, continents, driving side

### Smart Filtering
- **Region Filter**: Narrow down by continental regions
- **Search**: Real-time search with debouncing for performance
- **Sorting**: Multiple sort options with ascending/descending order
- **Clear Filters**: One-click reset to show all countries

### User Experience
- **Loading States**: Smooth loading indicators
- **Error Handling**: Graceful error messages with retry options
- **Responsive**: Mobile-first design that scales to desktop
- **Accessibility**: Semantic HTML and keyboard navigation

## 🔧 API Integration

The application uses the [REST Countries API](https://restcountries.com/) which provides:
- Comprehensive country data
- High-quality flag images
- No authentication required
- CORS-enabled for client-side requests

### API Endpoints Used:
- `GET /v3.1/all` - All countries
- `GET /v3.1/region/{region}` - Countries by region
- `GET /v3.1/name/{name}` - Search countries by name

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (from blue-600 to indigo-600)
- **Background**: Gradient from blue-50 to indigo-100
- **Cards**: Clean white with subtle shadows
- **Text**: Gray scale for hierarchy

### Typography
- **Font**: Inter (Google Fonts) for excellent readability
- **Hierarchy**: Multiple font weights (400, 500, 600, 700)
- **Icons**: Google Material Icons for consistency

### Layout
- **Grid**: Responsive CSS Grid for country cards
- **Spacing**: Consistent Tailwind spacing scale
- **Shadows**: Layered shadows for depth
- **Transitions**: Smooth hover and loading animations

## 🌐 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **ES Modules**: Native ES module support required

## 📈 Performance Features

- **Debounced Search**: Reduces API calls during typing
- **Caching**: In-memory caching of country data
- **Lazy Loading**: Deferred image loading for better performance
- **Optimized Images**: Fallback handling for failed image loads
- **Minimal Bundle**: Tree-shaking and optimized builds with Vite

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **REST Countries API** for providing comprehensive country data
- **Google Fonts** for the beautiful Inter font family
- **Google Material Icons** for the consistent icon system
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool

---

Built with ❤️ using modern web technologies
