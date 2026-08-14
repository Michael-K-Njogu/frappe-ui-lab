export function mapOrderItem(apiOrderItem) {
  if (!apiOrderItem) return null

  return {
    id: apiOrderItem.id,

    orderId: apiOrderItem.order_id,
    productId: apiOrderItem.product_id,

    sku: apiOrderItem.sku,
    productName: apiOrderItem.product_name,
    unit: apiOrderItem.unit,

    quantity: apiOrderItem.quantity,
    unitPrice: apiOrderItem.unit_price,
    discount: apiOrderItem.discount,
    lineTotal: apiOrderItem.line_total,

    createdAt: apiOrderItem.created_at,
    updatedAt: apiOrderItem.updated_at,
  }
}

export function mapOrderItemToApi(orderItem) {
  return {
    id: orderItem.id,

    order_id: orderItem.orderId,
    product_id: orderItem.productId,

    sku: orderItem.sku,
    product_name: orderItem.productName,
    unit: orderItem.unit,

    quantity: orderItem.quantity,
    unit_price: orderItem.unitPrice,
    discount: orderItem.discount,
    line_total: orderItem.lineTotal,

    created_at: orderItem.createdAt,
    updated_at: orderItem.updatedAt,
  }
}