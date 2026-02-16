# 3D Portfolio Website

A stunning, immersive 3D portfolio website built with Next.js, Three.js, Framer Motion, GSAP, and other cutting-edge web technologies.

![3D Portfolio](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop)

## ✨ Features

- **Immersive 3D Experiences**: Interactive 3D models and animations using Three.js and React Three Fiber
- **Smooth Animations**: Buttery-smooth scroll animations with Lenis, GSAP, and Framer Motion
- **Modern UI/UX**: Clean, professional design with glass morphism and gradient effects
- **Responsive Design**: Fully responsive across all devices
- **Performance Optimized**: Fast loading times and optimized 3D rendering
- **Interactive Elements**: Custom cursor, scroll indicators, and hover effects
- **Project Showcase**: Beautiful project carousel with Swiper
- **Contact Form**: Functional contact form with validation
- **TypeScript**: Full type safety throughout the project

## 🛠️ Technologies Used

### Core
- **Next.js 14** - React framework for production
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript

### 3D & Graphics
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **@react-three/postprocessing** - Post-processing effects

### Animations
- **Framer Motion** - Production-ready motion library
- **GSAP** - Professional-grade animation
- **Lenis** - Smooth scroll library
- **Locomotive Scroll** - Detection of elements in viewport

### UI Components
- **Swiper** - Modern touch slider
- **Tailwind CSS** - Utility-first CSS framework

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/3d-portfolio.git
cd 3d-portfolio
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
3d-portfolio/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── 3d/
│   │   ├── AnimatedSphere.tsx
│   │   ├── AnimatedTorus.tsx
│   │   ├── DNAHelix.tsx
│   │   ├── FloatingCube.tsx
│   │   └── Particles.tsx
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx
│   ├── sections/
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Experience.tsx
│   │   ├── Hero.tsx
│   │   ├── Projects.tsx
│   │   └── Skills.tsx
│   └── ui/
│       ├── CustomCursor.tsx
│       ├── Footer.tsx
│       ├── LoadingScreen.tsx
│       └── Navigation.tsx
├── public/                   # Static assets
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 🎨 Customization

### Colors

Edit the color scheme in `tailwind.config.js`:

```javascript
colors: {
  primary: '#0a0a0a',
  secondary: '#1a1a1a',
  accent: '#ff6b6b',
  'accent-blue': '#4ecdc4',
  'accent-purple': '#a855f7',
}
```

### Content

1. **Personal Info**: Update the content in each section component
2. **Projects**: Modify the projects array in `components/sections/Projects.tsx`
3. **Skills**: Update skills in `components/sections/Skills.tsx`
4. **Experience**: Edit timeline in `components/sections/Experience.tsx`

### 3D Models

Add custom 3D models:
1. Create new components in `components/3d/`
2. Import and use in your sections
3. Customize materials, lighting, and animations

## 🎯 Key Components

### Hero Section
- Animated 3D sphere with particles
- Floating cubes
- Smooth scroll indicator

### About Section
- DNA helix 3D model
- Animated skill bars
- Stats overlay

### Projects Section
- Swiper 3D carousel
- Project cards with hover effects
- Coverflow effect

### Skills Section
- 3D torus animation
- Categorized skills
- Interactive tool badges

### Experience Section
- Vertical timeline
- Animated cards
- Progress indicators

### Contact Section
- 3D wireframe spheres
- Contact form with validation
- Social media links

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ⚡ Performance Optimization

- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Components load on demand
- **3D Optimization**: Efficient geometry and material usage
- **Smooth Scroll**: Hardware-accelerated animations

## 🔧 Environment Variables

Create a `.env.local` file for environment variables:

```env
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_EMAIL_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAIL_TEMPLATE_ID=your_template_id
```

## 📦 Build for Production

```bash
npm run build
npm run start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with one click

### Other Platforms

- **Netlify**: Connect GitHub repo
- **AWS Amplify**: Follow AWS deployment guide
- **Docker**: Use included Dockerfile

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Three.js community
- React Three Fiber team
- Framer Motion
- GSAP
- All open-source contributors

## 📧 Contact

- Email: hello@portfolio.com
- LinkedIn: [Your LinkedIn](https://linkedin.com)
- Twitter: [@yourhandle](https://twitter.com)

---

Made with ❤️ and Three.js

