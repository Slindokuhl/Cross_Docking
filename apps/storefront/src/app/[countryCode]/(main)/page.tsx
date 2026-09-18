import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"

export const metadata: Metadata = {
  title: "Born To Risk Win",
  description:
    "Cross Docking — premium streetwear. Clean, minimal, uncompromising.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: { fields: "*variants.calculated_price", limit: 12 },
  })

  return (
    <>
      <Hero />
      <div className="content-container py-16 small:py-24">
        <h2 className="text-center text-sm uppercase tracking-[0.3em] text-black mb-12">
          New Arrivals
        </h2>
        <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
