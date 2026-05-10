'use client'

export default function TripDetailLayout(props: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* Child Pages */}
      <div>{props.children}</div>
    </div>
  )
}
