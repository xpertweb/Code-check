module.exports = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Backend Invoice</title>
  <style>
    .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
        font-size: 10px;
        line-height: 16px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #000;
    }

    .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
        padding-bottom: 30px;
    }
    .invoice-box h1 {
        padding: 0;
        margin: 0;
        color: #00a399;
    }
    .invoice-box table td {
        padding: 5px 10px;
        vertical-align: top;
    }

    .invoice-box table tr td:last-child {
        text-align: right;
    }
    .invoice-box table tr td:first-child {
        text-align: left;
    }

    .invoice-box table tr.top table td {
        padding-bottom: 20px;
    }

    .invoice-box table tr.top table td.title {
        font-size: 34px;
        line-height: 36px;
        color: #333;
    }

    .invoice-box table tr.information table td {
        padding-bottom: 40px;
    }

    .invoice-box table tr.heading th {
        background: #00A399;
        border-bottom: none;
        font-weight: bold;
        color: #fff;
        padding: 5px 10px;
        height: 22px;
    }

    .invoice-box table tr.item.last td {
        border-bottom: none;
    }

    .invoice-box table tr.total td {
        border-top: 2px solid #777777;
        font-weight: bold;
    }
    .invoice-box table td table tr td {
        padding: 0;
    }
    .grey-table-wrap tr td {
        background: #F3F3F3;
    }

    @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
        }

        .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    }

    /** RTL **/
    .rtl {
        direction: rtl;
        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    }

    .rtl table {
        text-align: right;
    }

    .rtl table tr td:nth-child(2) {
        text-align: left;
    }
    </style>
</head>

<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
              <td colspan="2">
                <h1>Backend</h1>
              </td>
            </tr>
            <table cellpadding="0" cellspacing="0">
              <tbody>
                <tr class="heading">
                  <th> TO: </th>
                  <th> </th>
                </tr>
                <tr class="details">
                  <td> @@toName@@</td>
                    <td> Invoice Date: @@invoiceDate@@ </td>
                  </tr>
                  <tr class="details">
                    <td>@@toEmail@@</td>
                    <td>Invoice No.: @@invoiceNumber@@</td>
                  </tr>
                  <tr class="details">
                    <td> @@toAddress@@</td>
                  </tr>
              </tbody>
            </table>

            <table cellpadding="0" cellspacing="0">
              <tbody>
                <tr class="heading">
                  <th>From:</th>
                  <th></th>
                </tr>
                <tr class="details">
                  <td><b>Backend Home Services Pty Ltd</b></td>
                  <td></td>
                </tr>
                <tr class="details">
                  <td>ABN 17 609 442 622</td>
                  <td></td>
                </tr>
                <tr class="details">
                  <td>24/570 Bourke Street, Melbourne VIC 3000</td>
                  <td></td>
                </tr>
                <tr class="details">
                  <td>help@getjarvis.com.au</td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            <table cellpadding="0" cellspacing="0" class="grey-table-wrap">
              <tbody>
              <tr class="heading">
                <th>#</th>
                <th>Date</th>
                <th>Description</th>
                <th>Fee Payable</th>
              </tr>
                   @@htmlPaymentList@@
                </tbody>
            </table>
             <table cellpadding="0" cellspacing="0">
              <tbody>
                <tr class="heading">
                  <td><b>Bank Details for deposit</b></td>
                  <td></td>
                </tr>
                  <tr class="item">
                    <td>
                    <table cellpadding="0" cellspacing="0">
                      <tbody>
                        <tr>
                          <td> BSB: 063254 </td>
                        </tr>
                        <tr>
                          <td> Acct. No.: 10726846 </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
              <td>
                <table cellpadding="0" cellspacing="0">
                  <tbody>
                  <tr class="total">
                      <td><b>Amount Payable</b></td>
                      <td>$@@totalAmount@@</td>
                    </tr>

                    <tr>
                      <td>GST</td>
                      <td>$@@fees@@</td>
                    </tr>
                    <tr class="total">
                      <td> <b>TOTAL</b> </td>
                      <td> $@@totalAmount@@ </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

      </table>
    </div>
  </body>
</html>`;
