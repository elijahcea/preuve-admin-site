# Preuve — Admin Console

A single-page admin dashboard for managing the [Preuve E-Commerce Storefront](https://github.com/elijahcea/preuve-ecommerce-site). Authenticated users can create and manage products, product variants, and collections — with images uploaded directly to Cloudinary and surfaced on the storefront.

🌐 **Live site:** [www.admin.preuvenewyork.com](https://www.admin.preuvenewyork.com)

---

## Tech Stack

| Technology                                    | Purpose                                                  |
| --------------------------------------------- | -------------------------------------------------------- |
| [Vue.js 3](https://vuejs.org/)                |                                                          |
| [TypeScript](https://www.typescriptlang.org/) |                                                          |
| [Tailwind CSS](https://tailwindcss.com/)      |                                                          |
| [TanStack Query](https://tanstack.com/query)  |                                                          |
| [Vite](https://vitejs.dev/)                   |                                                          |
| [Auth0](https://auth0.com/)                   | User authentication and JWT token issuance for API calls |
| [Cloudinary](https://cloudinary.com/)         | Cloud image hosting for product images                   |
| [pnpm](https://pnpm.io/)                      |                                                          |

---

## Architecture Overview

The admin console is a **client-side SPA** that communicates with the Preuve Storefront backend:

- **Authentication** — Users log in via Auth0. The Auth0 SDK provides a JWT access token that is attached to all outgoing API requests.
- **Data management** — TanStack Query handles all fetching, caching, and mutation of products and collections from the storefront API.
- **Image uploads** — Product images are uploaded from the browser directly to Cloudinary via signed URLs, and the returned secured_url is stored in the storefront database.

---

## Project Structure

```
preuve-admin-site/
├── src/              # Vue 3 application source
│   ├── components/   # Reusable Vue components
│   ├── router/       # Vue Router configuration
│   └── views/        # Page-level components
├── public/           # Public static files
├── vite.config.ts    # Vite configuration
└── package.json
```

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- The **Preuve E-Commerce Storefront** running locally (the API this console talks to)
- An **Auth0** application configured for this SPA
- A **Cloudinary** account

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/elijahcea/preuve-admin-site.git
   cd preuve-admin-site
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   # Auth0
   VITE_AUTH0_DOMAIN="your-auth0-domain"
   VITE_AUTH0_CLIENT_ID="your-auth0-client-id"
   VITE_AUTH0_AUDIENCE="your-auth0-api-audience"
   VITE_AUTH0_CALLBACK_URL="http://localhost:5173/"


   # Storefront API
   VITE_PRODUCTS_API_URL="http://localhost:3000/api/products"
   VITE_COLLECTIONS_API_URL="http://localhost:3000/api/collections"
   VITE_IMAGES_API_URL="http://localhost:3000/api/products/images"

   # Cloudinary
   VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   ```

4. **Start the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:5173](http://localhost:5173)

### Other Available Commands

```bash
pnpm build   # Type-check, compile, and minify for production
pnpm lint    # Lint with ESLint
```

---

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) with the [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension (disable Vetur if installed)
- [Vue.js DevTools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) browser extension for debugging

---

## Related Projects

- **[Preuve E-Commerce Storefront](https://github.com/elijahcea/preuve-ecommerce-site)** — The Next.js storefront whose API this admin console manages.
