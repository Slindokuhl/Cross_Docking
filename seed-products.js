const MEDUSA_URL = process.env.MEDUSA_URL || "http://localhost:9000";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// price is in whole Rand; the API is fed price * 100 ("cents") to match the
// storefront's convertToLocale(), which divides by 100 for display.
const products = [
  {
    title: "Cross Docking Oversized Tee",
    handle: "oversized-tee",
    category: "T-Shirts",
    description:
      "Heavyweight cotton oversized tee. Boxy fit, dropped shoulder. Street. Style. Statement.",
    price: 299,
  },
  {
    title: "Cross Docking Logo Tee",
    handle: "logo-tee",
    category: "T-Shirts",
    description:
      "Regular fit cotton tee with a minimal chest print. Clean, everyday essential.",
    price: 279,
  },
  {
    title: "Cross Docking Pullover Hoodie",
    handle: "pullover-hoodie",
    category: "Hoodies",
    description:
      "Heavyweight fleece pullover hoodie with kangaroo pocket and ribbed cuffs.",
    price: 649,
  },
  {
    title: "Cross Docking Zip Hoodie",
    handle: "zip-hoodie",
    category: "Hoodies",
    description: "Full-zip fleece hoodie in a relaxed fit. Built for layering.",
    price: 699,
  },
  {
    title: "Cross Docking Cargo Joggers",
    handle: "cargo-joggers",
    category: "Joggers",
    description:
      "Tapered fit cargo joggers with side pockets and an elasticated cuff.",
    price: 549,
  },
  {
    title: "Cross Docking Essential Joggers",
    handle: "essential-joggers",
    category: "Joggers",
    description: "Everyday fleece joggers, tapered fit, elastic waistband.",
    price: 499,
  },
  {
    title: "Cross Docking Signature Cap",
    handle: "signature-cap",
    category: "Caps",
    description:
      "Structured six-panel cap with an embroidered logo and adjustable strap.",
    price: 249,
    sizes: ["One Size"],
  },
];

async function getAdminToken() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables");
    process.exit(1);
  }
  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!data.token) {
    console.error("Login failed:", data);
    process.exit(1);
  }
  console.log("Logged in");
  return data.token;
}

async function getSalesChannelId(token) {
  const res = await fetch(`${MEDUSA_URL}/admin/sales-channels`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.sales_channels[0].id;
}

async function getCategoryMap(token) {
  const res = await fetch(`${MEDUSA_URL}/admin/product-categories?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const map = {};
  for (const cat of data.product_categories) map[cat.name] = cat.id;
  return map;
}

async function createProduct(token, salesChannelId, categoryMap, product) {
  const sizes = product.sizes || SIZES;
  const body = {
    title: product.title,
    handle: product.handle,
    description: product.description,
    status: "published",
    categories: categoryMap[product.category]
      ? [{ id: categoryMap[product.category] }]
      : [],
    sales_channels: [{ id: salesChannelId }],
    options: [{ title: "Size", values: sizes }],
    variants: sizes.map((size) => ({
      title: size,
      sku: `${product.handle.toUpperCase()}-${size}`,
      options: { Size: size },
      prices: [{ currency_code: "zar", amount: product.price * 100 }],
    })),
  };

  const res = await fetch(`${MEDUSA_URL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.product) console.log(`Created: ${product.title}`);
  else console.error(`Failed: ${product.title}`, JSON.stringify(data));
}

async function main() {
  console.log("Cross Docking product seed starting...\n");
  const token = await getAdminToken();
  const salesChannelId = await getSalesChannelId(token);
  const categoryMap = await getCategoryMap(token);

  for (const product of products) {
    await createProduct(token, salesChannelId, categoryMap, product);
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\nDone. Check http://localhost:9000/app/products");
}

main().catch(console.error);
