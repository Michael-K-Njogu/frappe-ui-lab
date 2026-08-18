const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const CUSTOMER_IMAGE_BUCKET = 'customer-images'

export async function uploadCustomerImage(
  customerId,
  file
) {
  if (!(file instanceof File)) {
    throw new Error('A valid image file is required.')
  }

  const extension =
    file.name.split('.').pop()?.toLowerCase() || 'jpg'

  const filePath =
    `${customerId}/logo-${crypto.randomUUID()}.${extension}`

  const response = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${CUSTOMER_IMAGE_BUCKET}/${filePath}`,
    {
      method: 'POST',
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: file,
    }
  )

  const data =
    response.status === 204
      ? null
      : await response.json()

  if (!response.ok) {
    console.error('Customer image upload failed:', {
      status: response.status,
      data,
      filePath,
      fileType: file.type,
    })

    throw new Error(
      data?.message ||
      data?.error ||
      `Image upload failed (${response.status}).`
    )
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${CUSTOMER_IMAGE_BUCKET}/${filePath}`
}