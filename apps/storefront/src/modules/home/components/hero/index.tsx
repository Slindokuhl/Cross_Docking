import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WhatsAppButton from "@modules/common/components/whatsapp-button"

const Hero = () => {
  return (
    <div className="h-screen w-full bg-white relative flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl small:text-8xl font-light tracking-[0.15em] uppercase text-black mb-4">
        Cross Docking
      </h1>
      <p className="text-sm small:text-base italic tracking-wide text-black/70 mb-10">
        Born To Risk Win
      </p>
      <div className="flex flex-col small:flex-row items-center gap-4">
        <LocalizedClientLink href="/store">
          <button className="px-12 py-4 bg-black text-white text-xs uppercase tracking-[0.25em] hover:bg-black/80 transition-colors">
            Shop Now
          </button>
        </LocalizedClientLink>
        <WhatsAppButton
          message="Hi Cross Docking, I'd like to place an order."
          className="px-12 py-4 border border-black text-black text-xs uppercase tracking-[0.25em] hover:bg-black hover:text-white transition-colors"
        >
          Order via WhatsApp
        </WhatsAppButton>
      </div>
    </div>
  )
}

export default Hero
