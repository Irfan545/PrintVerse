# PrintVerse - Custom Print Solutions

A modern e-commerce platform for custom printing and merchandise design, built with Next.js, TypeScript, and cutting-edge design tools.

## 🚀 Features

### Frontend

- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better development experience
- **Tailwind CSS** + **ShadCN UI** for beautiful, responsive design
- **Zustand** for lightweight state management
- **Fabric.js** for advanced canvas-based design tools
- **Framer Motion** for smooth animations
- **React Hook Form** with Zod validation

### Backend

- **Next.js API Routes** for serverless backend
- **PostgreSQL** with **Prisma ORM** for robust data management
- **NextAuth.js** for secure authentication
- **Cloudinary** for image upload and management
- **Razorpay** for payment processing
- **Resend** for email notifications

### Design Tools

- Real-time canvas editor with Fabric.js
- Text, shapes, and image manipulation
- Custom product templates
- Design preview and download
- Community design marketplace

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Zustand
- **Design Tools**: Fabric.js
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

### Backend

- **API**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Storage**: Cloudinary
- **Payments**: Razorpay
- **Email**: Resend

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/printverse.git
   cd printverse
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/printverse"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-key"

   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"

   # Razorpay
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

   # Resend (Email)
   RESEND_API_KEY="your-resend-api-key"
   ```

4. **Set up the database**

   **Option A: Using Docker Compose (Recommended)**

   ```bash
   # Start PostgreSQL and pgAdmin
   docker-compose up -d

   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push
   ```

   **Option B: Local PostgreSQL Installation**

   ```bash
   # Install PostgreSQL locally
   # Then run:
   npm run db:generate
   npm run db:push
   ```

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Prisma Schema

The project includes a comprehensive Prisma schema with the following models:

- **User**: Authentication and user management
- **Product**: Product catalog with customization options
- **Order**: Order management with status tracking
- **OrderItem**: Individual items in orders with customization data
- **Review**: Product reviews and ratings
- **Account & Session**: NextAuth.js integration

### Database Migrations

```bash
# Create a new migration
npm run db:migrate

# View database in Prisma Studio
npm run db:studio
```

## 🎨 Design System

### Components

- **Button**: Multiple variants and sizes
- **Card**: Content containers with headers and footers
- **Badge**: Status indicators and labels
- **Input**: Form inputs with validation
- **Modal**: Overlay dialogs
- **Toast**: Notification system

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: High-quality component library
- **Dark Mode**: Built-in dark theme support
- **Responsive**: Mobile-first design approach

## 🔐 Authentication

### NextAuth.js Configuration

- **Credentials Provider**: Email/password authentication
- **JWT Strategy**: Stateless session management
- **Role-based Access**: User and admin roles
- **Protected Routes**: Middleware for route protection

### User Roles

- **USER**: Standard customer access
- **ADMIN**: Administrative dashboard access

## 🛒 E-commerce Features

### Product Management

- Product catalog with categories
- Search and filtering
- Product customization
- Image gallery support

### Shopping Cart

- Persistent cart state with Zustand
- Add/remove items
- Quantity management
- Customization data storage

### Order Processing

- Order creation and tracking
- Payment integration with Razorpay
- Email notifications
- Order status updates

## 🎨 Design Tools

### Fabric.js Integration

- **Canvas Editor**: Real-time design creation
- **Text Tools**: Add and edit text with various fonts
- **Image Upload**: Drag and drop image support
- **Shape Tools**: Rectangles, circles, and custom shapes
- **Layer Management**: Object positioning and ordering
- **Export Options**: PNG download and cart integration

### Customization Features

- **Product Templates**: Pre-designed product layouts
- **Design Preview**: Real-time product visualization
- **Customization Data**: Store design specifications
- **Design Download**: Export designs as images

## 📧 Email Integration

### Resend Configuration

- **Order Confirmations**: Automatic order emails
- **Password Reset**: Secure password recovery
- **Welcome Emails**: New user onboarding
- **Marketing**: Promotional campaigns

## 💳 Payment Integration

### Razorpay Setup

- **Payment Gateway**: Secure payment processing
- **Order Management**: Payment status tracking
- **Refund Support**: Automated refund processing
- **Webhook Handling**: Payment status updates

## 🐳 Docker Compose Management

### Database Services

The project includes a `docker-compose.yml` file for easy database setup:

```bash
# Start all services (PostgreSQL + pgAdmin)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v

# Restart services
docker-compose restart
```

### Accessing Services

- **PostgreSQL**: `localhost:5432`

  - Database: `printverse`
  - Username: `printverse_user`
  - Password: `printverse_password`

- **pgAdmin**: `http://localhost:8080`
  - Email: `admin@printverse.com`
  - Password: `admin123`

### Database Connection

When using Docker Compose, your `.env.local` should contain:

```env
DATABASE_URL="postgresql://printverse_user:printverse_password@localhost:5432/printverse"
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
RESEND_API_KEY="your-resend-api-key"
```

## 📁 Project Structure

```
printverse/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── design/            # Design tool page
│   │   ├── products/          # Product catalog
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # ShadCN UI components
│   │   └── providers/        # Context providers
│   ├── lib/                  # Utility functions
│   ├── store/                # Zustand stores
│   └── types/                # TypeScript types
├── prisma/                   # Database schema
├── public/                   # Static assets
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@printverse.com or join our Discord community.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [ShadCN UI](https://ui.shadcn.com/) for the beautiful components
- [Fabric.js](http://fabricjs.com/) for the canvas library
- [Prisma](https://www.prisma.io/) for the database toolkit
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

1.  Advanced Design Tools
    Layer Management: Add layer panel with visibility, locking, and ordering
    Advanced Text Tools: Font selection, text effects, kerning, leading
    Shape Library: More shapes (polygons, stars, arrows)
    Effects & Filters: Drop shadows, gradients, blur effects
    Templates: Pre-designed product templates
2.  E-commerce Features
    Shopping Cart: Full cart functionality with quantity management
    Checkout Process: Multi-step checkout with address forms
    Order Management: Order tracking and status updates
    Payment Integration: Complete Razorpay integration
    User Dashboard: Order history, saved designs
3.  Database & Backend
    User Authentication: Complete signup/login system
    Product Management: Admin panel for managing products
    Order Processing: Backend order management
    Image Upload: Cloudinary integration for design storage
4.  Advanced UI/UX
    Responsive Design: Mobile-optimized design tools
    Dark Mode: Complete dark theme implementation
    Animations: Smooth transitions and micro-interactions
    Accessibility: ARIA labels, keyboard navigation
5.  Performance & Optimization
    Image Optimization: Lazy loading, compression
    Caching: Redis for session management
    SEO: Meta tags, structured data
    Analytics: User behavior tracking

                ***

                Phase 1: Advanced Design Tools
                ✅ Layer Management Panel: Visibility, locking, reordering, deletion
                ✅ Advanced Text Tools: Font selection, styling, kerning, leading, alignment
                ✅ Enhanced Shape Library: 15+ shapes including polygons, stars, arrows
                ✅ Professional UI: Tabbed interface with contextual tools

                    Phase 2: E-commerce Features

                ✅ Enhanced Shopping Cart: Quantity management, price calculations, tax/shipping
                ✅ Multi-step Checkout: Personal info, shipping, payment, review
                ✅ Order Management: Status tracking, admin dashboard
                ✅ Cart Drawer: Slide-out cart with real-time updates

                ️ Phase 3: Database & Backend

            ✅ User Authentication: Sign-in with social login options
            ✅ Admin Dashboard: Product management, order tracking, analytics
            ✅ Role-based Access: Admin vs user permissions
            ✅ Comprehensive Forms: Validation and error handling
            🎨 Phase 4: Advanced UI/UX
             Dark Mode: Complete theme system with system preference detection

        ✅ Theme Toggle: Smooth animations and dropdown menu
        ✅ Responsive Design: Mobile-optimized layouts
        ✅ Professional Components: Consistent design system

        Phase 5: Performance & Optimization

    ✅ Image Optimization: Lazy loading, blur placeholders, error handling
    ✅ SEO Optimization: Meta tags, structured data, Open Graph
    ✅ Performance: Optimized components and caching
    ✅ Accessibility: ARIA labels and keyboard navigation
