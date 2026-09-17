type WhatsAppButtonProps = {
  message: string
  className?: string
  children: React.ReactNode
}

const WhatsAppButton = ({ message, className, children }: WhatsAppButtonProps) => {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27000000000"
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}

export default WhatsAppButton
