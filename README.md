# Crypto Mining Platform

A modern web application for simulated cryptocurrency mining with real-time tracking, VIP plans, and withdrawal functionality.

## Features

- 🔐 Secure authentication system with email/password
- ⚡ Real-time mining simulation with progressive rates
- 💰 Support for Bitcoin, Ethereum, and Dogecoin mining
- 👑 VIP plans with up to 10x mining rates
- 💳 Cryptocurrency payment integration
- 📊 Live mining statistics and earnings tracking
- 💸 Secure withdrawal system with wallet management
- 🎨 Beautiful, responsive UI with modern animations

## Screenshots
Checkout the Screenshots: https://github.com/mytrialsacc/Crypto-Mining-Platform/tree/main/Screenshots

## Tech Stack

- **Frontend:**
  - React 18.3.1
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - React Router DOM 6.22.2
  - Zustand 4.5.2 (State Management)

- **Backend:**
  - Supabase (Database & Authentication)
  - PostgreSQL with Row Level Security

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm (v9 or higher)
- A Supabase account (free tier works fine)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-mining-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Database Setup

1. Create a new Supabase project
2. Click "Connect to Supabase" in the top right of your project
3. The following tables will be automatically created:

### Core Tables
- `mining_sessions`: Tracks active mining operations
- `user_balances`: Manages user earnings
- `user_plans`: Stores VIP plan subscriptions
- `withdrawals`: Handles withdrawal requests
- `user_wallets`: Saves cryptocurrency wallet addresses
- `crypto_payments`: Processes cryptocurrency payments

### Security Features
- Row Level Security (RLS) enabled on all tables
- Secure policies for CRUD operations
- Authentication handled by Supabase Auth

## Project Structure

```
├── src/
│   ├── lib/
│   │   └── supabase.ts     # Supabase client configuration
│   ├── pages/
│   │   ├── Dashboard.tsx   # Main mining interface
│   │   ├── Login.tsx       # Authentication
│   │   ├── Register.tsx    # User registration
│   │   ├── VipPlans.tsx    # Premium plans
│   │   ├── Payment.tsx     # Plan purchase
│   │   └── Withdraw.tsx    # Withdrawal system
│   ├── store/
│   │   ├── authStore.ts    # Authentication state
│   │   ├── miningStore.ts  # Mining operations
│   │   └── planStore.ts    # VIP plans management
│   └── main.tsx            # Application entry
├── supabase/
│   └── migrations/         # Database schema
└── public/                 # Static assets
```

## Key Features

### Mining System
- Progressive mining rates increasing every 6 hours
- Real-time earnings calculation
- Support for multiple cryptocurrencies
- Automatic session management

### VIP Plans
- Six tiers of mining plans:
  - Free Plan: Base rate
  - Bronze: 3x rate
  - Gold: 4x rate
  - Platinum: 6x rate
  - Diamond: 8x rate
  - Elite: 10x rate

### Withdrawal System
- Minimum withdrawal: $10
- Multiple cryptocurrency options
- Secure transaction verification
- Wallet address management
- Automatic balance updates

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Environment Variables

Required variables for your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security Features

- Secure authentication with email/password
- Row Level Security (RLS) on all database tables
- Protected API routes
- Secure payment processing
- Transaction verification system

## Best Practices

- TypeScript for type safety
- Component-based architecture
- State management with Zustand
- Responsive design with Tailwind CSS
- Real-time updates with Supabase

## Contributing

1. Fork the repository
2. Create your feature branch:
```bash
git checkout -b feature/amazing-feature
```
3. Commit your changes:
```bash
git commit -m 'Add amazing feature'
```
4. Push to the branch:
```bash
git push origin feature/amazing-feature
```
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Supabase](https://supabase.io/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [React Router](https://reactrouter.com/) - Routing
