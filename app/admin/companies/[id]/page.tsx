import CompanyDetail from "@/components/companies/company-detail"

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <CompanyDetail companyId={params.id} />
    </div>
  )
}
