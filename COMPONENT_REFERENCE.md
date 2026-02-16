# 📖 Component Reference Guide

Complete documentation for all components in the 3D portfolio.

---

## 🎭 3D Components (`components/3d/`)

### AnimatedSphere.tsx
**Purpose**: Main hero 3D sphere with distortion effect

**Features**:
- Distorted mesh material
- Auto-rotation on X and Y axis
- Floating animation on Y axis
- Metallic/rough material

**Usage**:
```tsx
import AnimatedSphere from '@/components/3d/AnimatedSphere'

<Canvas>
  <AnimatedSphere />
</Canvas>
```

**Customization**:
- Change `color` prop for different colors
- Adjust `distort` value (0-1) for distortion intensity
- Modify `speed` for animation speed
- Scale with `scale` prop

---

### AnimatedTorus.tsx
**Purpose**: Animated torus knot for visual interest

**Features**:
- Continuous 3-axis rotation
- Metallic material
- Environment map reflection

**Usage**:
```tsx
import AnimatedTorus from '@/components/3d/AnimatedTorus'

<Canvas>
  <AnimatedTorus />
</Canvas>
```

**Parameters**:
- `args={[radius, tube, tubularSegments, radialSegments]}`
- Default: `[1, 0.3, 128, 16]`

---

### Particles.tsx
**Purpose**: Particle system for atmospheric effects

**Props**:
- `count` (number): Number of particles (default: 5000)

**Features**:
- Spherical distribution
- Auto-rotation
- Additive blending for glow effect
- Size attenuation

**Usage**:
```tsx
import Particles from '@/components/3d/Particles'

<Canvas>
  <Particles count={3000} />
</Canvas>
```

**Performance**:
- Reduce `count` on mobile devices
- Use `InstancedMesh` for better performance

---

### FloatingCube.tsx
**Purpose**: Floating animated cube with customizable properties

**Props**:
- `position`: [x, y, z] coordinates
- `color`: Hex color string
- `speed`: Animation speed multiplier (default: 1)

**Usage**:
```tsx
<FloatingCube 
  position={[-3, 2, -2]} 
  color="#ff6b6b" 
  speed={0.5} 
/>
```

---

### DNAHelix.tsx
**Purpose**: Double helix structure for About section

**Features**:
- 50 points per strand
- Connecting bars every 3 points
- Auto-rotation
- Three-color scheme (red, cyan, purple)

**Customization**:
```tsx
// Adjust in component
const helixPoints = 50  // Number of points
const radius = 1        // Helix radius
const height = 4        // Helix height
```

---

### GeometricBackground.tsx
**Purpose**: Animated geometric shapes background

**Props**:
- `count`: Number of shapes (default: 100)

**Features**:
- Multiple geometries (box, cone, tetrahedron)
- Organic movement patterns
- Color-coded by shape type

---

### InteractiveModelViewer.tsx
**Purpose**: Interactive 3D model display with controls

**Props**:
- `modelPath`: Path to GLTF model
- `scale`: Model scale (default: 1)
- `autoRotate`: Enable auto-rotation (default: false)

**Features**:
- Presentation controls
- Shadows and lighting
- Grid floor
- Stage setup

---

## 🎨 Section Components (`components/sections/`)

### Hero.tsx
**Location**: Top of page

**Features**:
- Full-screen 3D canvas
- Animated text entry (GSAP)
- CTA buttons
- Scroll indicator
- Gradient overlay

**3D Elements**:
- AnimatedSphere
- Particles (3000)
- 3x FloatingCubes

**Customization**:
```tsx
// Update text
<h1>Your Title</h1>
<p>Your subtitle</p>

// Modify 3D elements
<AnimatedSphere /> // Change color in component
```

---

### About.tsx
**Features**:
- Two-column layout
- DNA helix 3D model
- Animated skill bars
- Stats cards with glass effect

**Scroll Animations**:
- Skill bars animate on scroll (GSAP ScrollTrigger)
- Fade-in animations (Framer Motion)

**Skills Array**:
```tsx
const skills = [
  { name: 'React & Next.js', level: 95 },
  { name: 'Three.js & WebGL', level: 90 },
  // Add more...
]
```

---

### Projects.tsx
**Features**:
- Swiper 3D carousel
- Coverflow effect
- Auto-play with pause on interaction
- Navigation arrows
- Pagination dots
- Active project counter

**Swiper Configuration**:
```tsx
effect="coverflow"
coverflowEffect={{
  rotate: 50,
  stretch: 0,
  depth: 100,
  modifier: 1,
  slideShadows: true,
}}
```

**Projects Array**:
```tsx
const projects = [
  {
    id: 1,
    title: 'Project Name',
    description: 'Description',
    tech: ['React', 'Three.js'],
    image: 'image-url',
    color: '#ff6b6b',
  },
]
```

---

### Skills.tsx
**Features**:
- 3D torus background
- Skill categories grid
- Animated progress bars
- Tool badges
- Certification badge

**Skill Categories**:
```tsx
{
  title: 'Frontend',
  skills: [
    { name: 'React', level: 95 },
  ],
  color: '#ff6b6b',
}
```

**Animations**:
- GSAP scroll-triggered animations
- Framer Motion hover effects
- Progress bar fill animations

---

### Experience.tsx
**Features**:
- Vertical timeline
- Alternating card layout
- Gradient timeline line
- Achievement bullets
- Year badges

**Experience Object**:
```tsx
{
  year: '2023 - Present',
  title: 'Job Title',
  company: 'Company Name',
  description: 'Description',
  achievements: ['Achievement 1', 'Achievement 2'],
  color: '#ff6b6b',
}
```

---

### Contact.tsx
**Features**:
- 3D wireframe background
- Contact form with validation
- Contact info cards
- Social media links
- Availability badge

**Form Fields**:
- Name
- Email
- Subject
- Message

**Form Handling**:
```tsx
const handleSubmit = async (e) => {
  e.preventDefault()
  // Add your form submission logic
  // Email service integration (EmailJS, etc.)
}
```

---

## 🎯 UI Components (`components/ui/`)

### Navigation.tsx
**Features**:
- Sticky navigation
- Scroll progress bar
- Desktop/mobile menus
- Smooth scroll to sections
- Glass morphism effect

**Nav Items**:
```tsx
const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  // Add more...
]
```

**Scroll Handler**:
```tsx
const handleNavClick = (href: string) => {
  gsap.to(window, {
    duration: 1,
    scrollTo: { y: element, offsetY: 80 },
    ease: 'power3.inOut',
  })
}
```

---

### LoadingScreen.tsx
**Features**:
- Progress bar animation
- Percentage counter
- Gradient text
- Pulse dots
- Auto-hide after 3 seconds

**GSAP Timeline**:
```tsx
tl.to(progressRef.current, {
  width: '100%',
  duration: 2.5,
  ease: 'power2.inOut',
})
```

---

### CustomCursor.tsx
**Features**:
- Custom cursor design
- Follower dot
- Hover state detection
- Mix-blend-mode effects

**Cursor States**:
- Default: 20px circle
- Hover: 40px circle with background

**Hover Targets**:
- Links (`<a>`)
- Buttons (`<button>`)
- Elements with `.cursor-hover` class

---

### Footer.tsx
**Features**:
- Three-column layout
- Quick links
- Newsletter signup
- Social media icons
- Copyright notice

**Sections**:
1. Brand + Social icons
2. Quick links
3. Newsletter form

---

## 🔧 Provider Components (`components/providers/`)

### SmoothScrollProvider.tsx
**Purpose**: Enables smooth scrolling throughout the app

**Features**:
- Lenis smooth scroll
- GSAP ScrollTrigger integration
- Custom easing function
- Auto-scroll to top on mount

**Configuration**:
```tsx
{
  duration: 1.2,          // Scroll duration
  easing: easingFunction, // Custom easing
  smooth: true,           // Enable smooth scroll
  mouseMultiplier: 1,     // Mouse wheel sensitivity
}
```

---

## 🎨 Styling Reference

### Global Classes (globals.css)

**Gradient Text**:
```css
.gradient-text {
  background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Glass Morphism**:
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Animations**:
```css
.animate-float        /* Floating animation */
.animate-rotate       /* Rotation animation */
.animate-pulse-glow   /* Pulse glow effect */
```

---

## 🔄 Animation Patterns

### Framer Motion
```tsx
// Fade in from bottom
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
```

### GSAP ScrollTrigger
```tsx
gsap.from('.element', {
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top center',
  },
  y: 100,
  opacity: 0,
  duration: 1,
})
```

### Three.js useFrame
```tsx
useFrame((state) => {
  meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
})
```

---

## 💡 Best Practices

1. **Performance**:
   - Keep particle count reasonable (< 5000)
   - Use `InstancedMesh` for repeated geometry
   - Implement LOD (Level of Detail) for complex models

2. **Accessibility**:
   - Add `aria-label` to interactive elements
   - Ensure keyboard navigation works
   - Test with screen readers

3. **Responsiveness**:
   - Test on mobile, tablet, desktop
   - Reduce 3D complexity on mobile
   - Use responsive Tailwind classes

4. **Code Organization**:
   - Keep components small and focused
   - Extract reusable logic to hooks
   - Use TypeScript for type safety

---

## 🚀 Extension Ideas

1. **Add Blog Section**:
   - Create `Blog.tsx` section
   - Use MDX for blog posts
   - Add pagination

2. **Implement CMS**:
   - Integrate Contentful or Sanity
   - Dynamic project loading
   - Easy content updates

3. **Add Animations**:
   - Page transitions
   - Micro-interactions
   - Scroll-triggered animations

4. **Enhance 3D**:
   - Load custom GLTF models
   - Add post-processing effects
   - Implement ray-casting interactions

---

**Last Updated**: February 2026
**Version**: 1.0.0
