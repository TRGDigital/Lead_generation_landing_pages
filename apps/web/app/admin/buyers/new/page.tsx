import BuyerForm from '@/components/admin/BuyerForm'
import { createBuyer } from '../actions'

export default function NewBuyerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add buyer</h1>
      <BuyerForm action={createBuyer} />
    </div>
  )
}
