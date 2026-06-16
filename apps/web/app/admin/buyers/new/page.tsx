import BuyerForm from '@/components/admin/BuyerForm'
import { createBuyer } from '../actions'
import { getPublishedAreas } from '@/lib/areas'

export const dynamic = 'force-dynamic'

export default async function NewBuyerPage() {
  const areaOptions = await getPublishedAreas()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Add buyer</h1>
      <BuyerForm action={createBuyer} areaOptions={areaOptions} />
    </div>
  )
}
