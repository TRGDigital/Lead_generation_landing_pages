import { createServiceClient } from '@/lib/supabase/server'
import CampaignControls from '@/components/admin/CampaignControls'
import type { Tables } from '@db/types'

type HomeRow = Pick<Tables<'care_homes'>, 'id' | 'name' | 'is_active'>

async function getCareHomes() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('care_homes')
    .select('id, name, is_active')
    .order('name')
  return (data ?? []) as unknown as HomeRow[]
}

export default async function CampaignsPage() {
  const homes = await getCareHomes()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Toggle a care home on or off to activate or pause its landing page and lead capture.
        </p>
      </div>

      <div className="space-y-3">
        {homes.map((home) => (
          <CampaignControls
            key={home.id}
            homeId={home.id}
            isActive={home.is_active}
            homeName={home.name}
          />
        ))}
        {homes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No care homes yet. Add one from the Care Homes page.
          </p>
        )}
      </div>
    </div>
  )
}
