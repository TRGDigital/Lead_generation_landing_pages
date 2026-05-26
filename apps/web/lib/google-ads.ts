import { GoogleAdsApi, enums } from 'google-ads-api'

export type SpendRow = {
  campaignId: string
  campaignName: string
  impressions: number
  clicks: number
  costMicros: number
  date: string
}

function isConfigured(): boolean {
  return !!(
    process.env.GOOGLE_ADS_CLIENT_ID &&
    process.env.GOOGLE_ADS_CLIENT_SECRET &&
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN &&
    process.env.GOOGLE_ADS_REFRESH_TOKEN
  )
}

function makeCustomer(customerId: string) {
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  })
  return client.Customer({
    customer_id: customerId,
    login_customer_id: process.env.GOOGLE_ADS_MCC_CUSTOMER_ID ?? undefined,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  })
}

export async function getCampaignSpend(
  customerId: string,
  startDate: string,
  endDate: string
): Promise<SpendRow[]> {
  if (!isConfigured()) return []
  const customer = makeCustomer(customerId)
  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      segments.date,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM campaign
    WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      AND campaign.status != 'REMOVED'
  `)
  return rows.map((r) => ({
    campaignId: String(r.campaign?.id ?? ''),
    campaignName: String(r.campaign?.name ?? ''),
    impressions: Number(r.metrics?.impressions ?? 0),
    clicks: Number(r.metrics?.clicks ?? 0),
    costMicros: Number(r.metrics?.cost_micros ?? 0),
    date: String(r.segments?.date ?? startDate),
  }))
}

export async function getCampaignStatus(
  customerId: string,
  campaignId: string
): Promise<'ENABLED' | 'PAUSED' | 'REMOVED' | null> {
  if (!isConfigured()) return null
  const customer = makeCustomer(customerId)
  const [row] = await customer.query(`
    SELECT campaign.id, campaign.status
    FROM campaign
    WHERE campaign.id = ${campaignId}
  `)
  return (row?.campaign?.status as 'ENABLED' | 'PAUSED' | 'REMOVED') ?? null
}

export async function syncCampaignStatus(
  customerId: string,
  campaignId: string,
  isActive: boolean
): Promise<void> {
  if (!isConfigured()) {
    console.warn('[google-ads] Not configured — skipping campaign status sync')
    return
  }
  const customer = makeCustomer(customerId)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (customer.campaigns.update as any)([{
    resource_name: `customers/${customerId}/campaigns/${campaignId}`,
    status: isActive ? enums.CampaignStatus.ENABLED : enums.CampaignStatus.PAUSED,
  }])
}
