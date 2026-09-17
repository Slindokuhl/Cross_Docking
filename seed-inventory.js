const MEDUSA_URL = process.env.MEDUSA_URL || "http://localhost:9000";
const STOCKED_QUANTITY = 100;

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
  return data.token;
}

async function main() {
  const token = await getAdminToken();
  const headers = { Authorization: `Bearer ${token}` };

  const locRes = await fetch(`${MEDUSA_URL}/admin/stock-locations`, { headers });
  const { stock_locations } = await locRes.json();
  const locationId = stock_locations[0].id;
  console.log(`Stocking at: ${stock_locations[0].name}`);

  const itemsRes = await fetch(
    `${MEDUSA_URL}/admin/inventory-items?limit=1000`,
    { headers }
  );
  const { inventory_items } = await itemsRes.json();

  for (const item of inventory_items) {
    const existing = item.location_levels?.find(
      (l) => l.location_id === locationId
    );
    if (existing) continue;

    const res = await fetch(
      `${MEDUSA_URL}/admin/inventory-items/${item.id}/location-levels`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          location_id: locationId,
          stocked_quantity: STOCKED_QUANTITY,
        }),
      }
    );
    const data = await res.json();
    console.log(
      data.inventory_item
        ? `Stocked: ${item.sku}`
        : `Failed: ${item.sku} ${JSON.stringify(data)}`
    );
  }

  console.log("\nDone.");
}

main().catch(console.error);
