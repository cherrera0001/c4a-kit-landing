import EvaluationForm from "@/components/evaluations/evaluation-form"

export default function EditEvaluationPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <EvaluationForm evaluationId={params.id} />
    </div>
  )
}
