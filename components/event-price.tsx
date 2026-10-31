import { formatPrice, getMemberPrice, type UpcomingEvent } from "@/lib/events"

export default function EventPrice({ event }: { event: UpcomingEvent }) {
  const { price, memberDiscountPercent } = event

  if (price === null) return null

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white text-sm">
      <span className="font-medium">{price === 0 ? "Gratuit" : formatPrice(price)}</span>
      {price > 0 && !!memberDiscountPercent && (
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/90 text-xs">
          Membres : {formatPrice(getMemberPrice(price, memberDiscountPercent))} (-{memberDiscountPercent} %)
        </span>
      )}
    </p>
  )
}
