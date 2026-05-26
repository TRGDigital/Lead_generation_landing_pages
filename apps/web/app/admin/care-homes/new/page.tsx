import CareHomeForm from '@/components/admin/CareHomeForm'

export default function NewCareHomePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Add Care Home</h1>
      <CareHomeForm />
    </div>
  )
}
