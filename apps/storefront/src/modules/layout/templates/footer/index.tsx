import { listCategories } from "@lib/data/categories";
import { Text } from "@modules/common/components/ui";

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import WhatsAppButton from "@modules/common/components/whatsapp-button";

export default async function Footer() {
  const productCategories = await listCategories();

  return (
    <footer className="border-t border-black w-full bg-white">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-10 xsmall:flex-row items-start justify-between py-20">
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="text-lg tracking-[0.35em] font-light uppercase text-black"
            >
              Cross Docking
            </LocalizedClientLink>
            <WhatsAppButton
              message="Hi Cross Docking, I'd like to place an order."
              className="inline-block w-fit px-6 py-3 bg-black text-white text-xs uppercase tracking-widest hover:bg-black/80 transition-colors"
            >
              Order via WhatsApp
            </WhatsAppButton>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 small:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <span className="text-xs uppercase tracking-widest text-black">
                  Shop
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return;
                    }

                    return (
                      <li
                        className="flex flex-col gap-2 text-black/60 txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className="hover:text-black transition-colors"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-4">
              <span className="text-xs uppercase tracking-widest text-black">
                Info
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-black/60 txt-small">
                <li>
                  <LocalizedClientLink
                    className="hover:text-black transition-colors"
                    href="/store"
                  >
                    All Products
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-black transition-colors"
                    href="/account"
                  >
                    My Account
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="hover:text-black transition-colors"
                    href="/cart"
                  >
                    Cart
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-y-4">
              <span className="text-xs uppercase tracking-widest text-black">
                Visit
              </span>
              <p className="text-black/60 txt-small leading-relaxed">
                50 Fred Gwala Close
                <br />
                Umlazi, KwaZulu-Natal
                <br />
                South Africa
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-10 justify-between text-black/50 border-t border-black/10 pt-8">
          <Text className="txt-compact-small tracking-wide">
            &copy; {new Date().getFullYear()} Cross Docking. All rights reserved.
          </Text>
          <Text className="txt-compact-small tracking-wide">
            South Africa
          </Text>
        </div>
      </div>
    </footer>
  );
}
