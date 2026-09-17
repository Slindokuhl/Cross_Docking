const fs = require("fs");
const path = require("path");

const MEDUSA_URL = process.env.MEDUSA_URL || "http://localhost:9000";

// Map a product handle to one or more local image file paths.
// Fill these in once photos are available, e.g.:
// "oversized-tee": ["./images/oversized-tee-front.jpg", "./images/oversized-tee-back.jpg"],
const productImages = {
  "oversized-tee": [],
  "logo-tee": [],
  "pullover-hoodie": [],
  "zip-hoodie": [],
  "cargo-joggers": [],
  "essential-joggers": [],
  "signature-cap": [],
};

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

async function uploadFile(token, filePath) {
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer]);
  const form = new FormData();
  form.append("files", blob, path.basename(filePath));

  const res = await fetch(`${MEDUSA_URL}/admin/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!data.files || !data.files[0]) {
    throw new Error(`Upload failed for ${filePath}: ${JSON.stringify(data)}`);
  }
  return data.files[0].url;
}

async function getProductByHandle(token, handle) {
  const res = await fetch(
    `${MEDUSA_URL}/admin/products?handle=${encodeURIComponent(handle)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  return data.products && data.products[0];
}

async function setProductImages(token, productId, urls) {
  const res = await fetch(`${MEDUSA_URL}/admin/products/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      thumbnail: urls[0],
      images: urls.map((url) => ({ url })),
    }),
  });
  const data = await res.json();
  return !!data.product;
}

async function main() {
  const token = await getAdminToken();

  for (const [handle, filePaths] of Object.entries(productImages)) {
    if (!filePaths.length) {
      console.log(`Skipping ${handle}: no local image paths configured`);
      continue;
    }

    const product = await getProductByHandle(token, handle);
    if (!product) {
      console.log(`No product found for handle: ${handle}`);
      continue;
    }

    const existing = filePaths.filter((p) => fs.existsSync(p));
    if (!existing.length) {
      console.log(`No image files found on disk for ${handle}`);
      continue;
    }

    const urls = [];
    for (const filePath of existing) {
      const url = await uploadFile(token, filePath);
      urls.push(url);
    }

    const ok = await setProductImages(token, product.id, urls);
    console.log(ok ? `Updated images: ${handle}` : `Failed to update: ${handle}`);
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("\nDone.");
}

main().catch(console.error);
