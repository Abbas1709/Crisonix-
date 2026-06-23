# Crisonix — AI-Powered Crisis Resilience Platform

Crisonix is a cutting-edge, integrated digital platform designed to enhance disaster preparedness, emergency response, and humanitarian coordination on a global scale. By bridging the critical gaps in emergency management, Crisonix connects affected individuals, volunteers, and NGOs in real-time to save lives and build resilient communities.

## 🚀 Key Features

- **Advanced Geospatial Mapping**: Real-time interactive crisis mapping for immediate situational awareness and aid distribution tracking.
- **AI-Powered Predictive Analytics**: Machine learning models that predict risks and intelligently route resources to where they are needed most.
- **Intelligent Coordination**: Automated algorithms that seamlessly connect donors, volunteers, and rescue teams with those in need.
- **Gamified Community Engagement**: Rewards and achievements to encourage sustained community involvement and long-term participation.
- **Multi-Role Support**: Dedicated workflows and dashboards for **Affected Individuals**, **Volunteers**, and **NGOs/Organizations**.
- **Secure & Scalable**: A production-grade architecture built to handle large-scale emergencies while ensuring data privacy and security.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Validation**: [Zod](https://zod.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)

## 📂 Project Structure

```bash
src/
 ├── assets/          # Static assets (images, icons, etc.)
 ├── components/
 │     └── common/    # Reusable UI components (Button, Text, Navbar, Footer)
 ├── features/        # Feature-based architecture
 │     ├── auth/      # Authentication flow (Login, Signup, Role Select)
 │     ├── home/      # Landing page and related components
 │     ├── dashboard/ # User dashboards
 │     ├── troubleshoot/ # Support and reporting modules
 │     └── about/     # Mission and team information
 ├── layouts/         # Page layouts
 ├── store/           # Global state management
 ├── constants/       # Global constants
 └── routes/          # Navigation and route definitions
```

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hameedabdullah/crisonix.git
   cd crisonix
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 🤝 Contributing

We welcome contributions to help make Crisonix better! Whether it's reporting a bug, suggesting a feature, or submitting a pull request, your help is appreciated.

## 📄 License

This project is licensed under the **ISC License**.
