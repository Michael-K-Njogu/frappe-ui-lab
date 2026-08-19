export function printInvoice() {
  const invoice = document.querySelector('#invoice-print-container .invoice-document')

  if (!invoice) {
    throw new Error('Invoice document is not available for printing.')
  }

  const printWindow = window.open('', '_blank', 'width=900,height=1200')

  if (!printWindow) {
    throw new Error('Unable to open the print window. Please allow pop-ups and try again.')
  }

  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((element) => element.outerHTML)
    .join('\n')

  printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice</title>

                ${styles}

                <style>
                    @page {
                        size: A4;
                        margin: 12mm;
                    }

                    html,
                    body {
                        margin: 0;
                        padding: 0;
                        background: #fff !important;
                    }

                    body {
                        font-family:
                            Arial,
                            Helvetica,
                            sans-serif;
                    }

                    #invoice-print-container {
                        display: block !important;
                    }

                    .invoice-document {
                        width: 100% !important;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }

                    .invoice-preview-overlay,
                    .invoice-preview-panel {
                        display: none !important;
                    }

                    @media print {
                        .invoice-document {
                            box-shadow: none !important;
                        }

                        .invoice-items {
                            page-break-inside: auto;
                        }

                        .invoice-items tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }

                        .invoice-items thead {
                            display: table-header-group;
                        }

                        .invoice-footer {
                            page-break-inside: avoid;
                        }

                        .totals-section {
                            page-break-inside: avoid;
                        }
                    }
                </style>
            </head>

            <body>
                ${invoice.outerHTML}
            </body>
        </html>
    `)

  printWindow.document.close()

  printWindow.focus()

  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}
