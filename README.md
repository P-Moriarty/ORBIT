# Orbit 3D

Orbit 3D is a responsive, interactive concept storefront for a fictional collection of sound devices. It combines product discovery, real-time 3D previews, product configuration, and a local-only demo shopping flow.

The collection currently includes:

- **Orbit Pulse** — portable Bluetooth speaker concept
- **Orbit Monitor** — studio monitor speaker concept
- **Orbit Vinyl** — wireless turntable concept
- **Orbit One** — wireless over-ear headphones concept

Orbit is a design and learning project, not a real retailer. Product names, prices, specifications, reviews, and availability are illustrative. No products are sold or shipped, and the demo checkout does not collect payment or create a real order.

## Features

### Explore the collection

- Browse the four sound-device concepts and open their detail pages.
- Search by product name, category, or description.
- Filter by device type and maximum demo price; sort by featured order or price.
- View lazy-loaded 3D previews on product cards, including on mobile devices.
- Save products to a browser-local wishlist and share product links.

### Inspect and configure products

- Explore interactive 3D product models. Drag to rotate and use touch gestures to inspect them on supported devices.
- Choose from available finishes and product-specific configuration options.
- Switch between products, save configurations, compare selections, and add configured items to the demo cart.
- Copy or share configuration links. The selected product, finish, and options are encoded in the URL so the configuration can be reopened.

### Demo shopping flow

- Review configured items, change quantities, remove individual items, or clear the cart.
- Complete a demo checkout to view a local order confirmation.
- Cart contents and demo orders are stored in the current browser. There is no payment provider, fulfillment service, or backend order processing.

### Experience and accessibility

- Responsive layouts for desktop and mobile, with an animated desktop navigation and an opening/closing curtain-style mobile menu.
- Animated visual studies and browser-generated audio demonstrations.
- Accessibility settings for reduced motion and high contrast. Reduced motion also respects the operating system preference.
- Product configuration, wishlist, cart, demo orders, and accessibility settings are saved in browser storage; clearing site data removes them.

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page featuring Orbit One, finish selection, and interactive visual studies |
| `/products` | Searchable, filterable, and sortable product collection |
| `/products/[productId]` | Product details, 3D exploration, and related product actions |
| `/configure` | Interactive configurator for product, finish, and available options |
| `/wishlist` | Products saved in this browser |
| `/cart` | Demo cart and local-only checkout |
| `/order-confirmation/[orderId]` | Confirmation for a demo order stored in this browser |
| `/about` | Project concept and visual studies |
| `/accessibility` | Motion and contrast preferences |
| `/help` | Demo FAQs and a help form that does not send or store submissions |

## Technology

- [Next.js](https://nextjs.org/) 16 App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), and [Drei](https://github.com/pmndrs/drei) for 3D scenes
- [Tailwind CSS](https://tailwindcss.com/) 4 for styling
- ESLint for linting

The product catalog is defined in `src/data/productsList.ts`. Interactive 3D scenes are implemented with React Three Fiber and shared across the landing page, catalog previews, product details, and configurator.

## Getting started

### Requirements

- Node.js 20.9 or newer
- npm

### Install and run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The development server supports hot reloading as files change.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Check TypeScript types without emitting files |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build; run `npm run build` first |

## Project structure

```text
src/
  app/                 App Router pages and global styles
  components/          Shared navigation, product UI, 3D scenes, and cart UI
  data/                Product catalog and browser-storage data helpers
  hooks/               Client-side preference and wishlist hooks
public/                Static assets
```

## Notes and limitations

- This is a front-end concept demo. It has no authentication, database, payment integration, inventory service, or order fulfillment.
- Wishlist items, saved configurations, cart contents, accessibility preferences, and demo orders are local to the browser and are not synchronized between devices.
- 3D previews require browser WebGL support. Performance depends on the device and browser; reduced-motion preferences pause scene animation.
- Audio demonstrations generate simple tones in the browser. They are not recordings or representations of actual product performance.
- The help form only prepares a preview in the page; it does not transmit a support request.

## License

No license is currently specified for this project. Contact the project owner before redistributing or reusing its code or assets.
