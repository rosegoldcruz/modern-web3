import { redirect } from "next/navigation"

const GHL_FORM_URL =
  "https://api.leadconnectorhq.com/widget/form/qpgdvqKFjq0AJlASGq9T?notrack=true"

export default function SalesPage() {
  redirect(GHL_FORM_URL)
}
