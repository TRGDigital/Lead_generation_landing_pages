import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import BuyerForm, { type BuyerInitial } from '@/components/admin/BuyerForm'
import { updateBuyer } from '../../actions'
import { getPublishedAreas } from '@/lib/areas'

export const dynamic = 'force-dynamic'

export default async function EditBuyerPage({ params }: { params: { id: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db.from('buyers').select('*').eq('id', params.id).single()
  const buyer = data as unknown as BuyerInitial | null
  if (!buyer) notFound()

  const areaOptions = await getPublishedAreas()
  const update = updateBuyer.bind(null, params.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit buyer</h1>
      <BuyerForm action={update} initial={buyer} areaOptions={areaOptions} />
    </div>
  )
}
