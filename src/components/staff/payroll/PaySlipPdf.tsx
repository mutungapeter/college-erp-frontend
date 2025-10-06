import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';

import { PaySlipType } from '@/definitions/payroll';
import { formatCurrency } from '@/utils/currency';
import { CustomDate } from '@/utils/date';
import { AiOutlineClose } from 'react-icons/ai';
import { FiDownload } from 'react-icons/fi';
import { HiPrinter } from 'react-icons/hi2';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#f8fafc',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },

  container: {
    borderWidth: 1,
    borderColor: '#001f4d',
    borderStyle: 'solid',
  },

  headerContainer: {
    backgroundColor: '#f8fafc',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  universityName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 1,
    lineHeight: 1.2,
  },
  officeTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
    textAlign: 'center',
    marginTop: 5,
  },
  payslipTitle: {
    textAlign: 'center',
    color: '#374151',
    fontSize: 14,
    fontWeight: 'bold',

    marginTop: 15,
  },

  referenceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
  },

  referenceItem: {
    flexDirection: 'column',
  },
  referenceLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 2,
  },
  referenceValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },

  employeeSection: {
    backgroundColor: '#f1f5f9',
    padding: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 9,
    color: '#1e293b',
    fontWeight: 'normal',
  },

  summarySection: {
    backgroundColor: '#f9fafb',
    padding: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  paymentSection: {},

  earningsContainer: {
    backgroundColor: '#f0fdf4',
    padding: 12,
  },

  deductionsContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingVertical: 3,
  },
  paymentLabel: {
    fontSize: 9,
    color: '#374151',
  },
  paymentValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  netPayContainer: {
    padding: 15,
  },
  netPayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netPayLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  netPayValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  footer: {
    marginTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
  },
  footerText: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerBold: {
    fontSize: 8,
    color: '#374151',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  confidentialNotice: {
    padding: 8,
    marginTop: 10,
  },
  confidentialText: {
    fontSize: 7,
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const PaySlipPDF = ({ payslip }: { payslip: PaySlipType }) => {
  const totalEarnings =
    Number(payslip.basic_salary) +
    Number(payslip.total_overtime) +
    Number(payslip.total_allowances);
  const grossPay = totalEarnings;
  const netPay = Number(payslip.net_pay);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header with centered logo and text */}
          <View style={styles.headerContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={styles.logo} src="/logo/university_logo.png" />

            <Text style={styles.universityName}>
              Kathangaita University of Science and Technology
            </Text>
            <Text style={styles.contactInfo}>
              P.O. BOX. 190-50100 Kathangaita
            </Text>
            <Text style={styles.contactInfo}>
              TEL: +057-250523646/3,0745535335, FAX: +056-30150
            </Text>
            <Text style={styles.contactInfo}>
              Email: info@kaust.ac.ke, web: www.kaust.ac.ke
            </Text>
            <Text style={styles.officeTitle}>BY HUMAN RESOURCE MANAGEMENT</Text>
            <Text style={styles.payslipTitle}>PAYSLIP</Text>
          </View>

          <View style={styles.referenceSection}>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>Pay Period</Text>
              <Text style={styles.referenceValue}>
                {CustomDate(payslip.payroll_period_start)} -{' '}
                {CustomDate(payslip.payroll_period_end)}
              </Text>
            </View>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>Pay Date</Text>
              <Text style={styles.referenceValue}>
                {CustomDate(payslip.generated_at)}
              </Text>
            </View>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>Payslip ID</Text>
              <Text style={styles.referenceValue}>PS-{payslip.id}</Text>
            </View>
          </View>

          <View style={styles.employeeSection}>
            <Text style={styles.sectionTitle}>Employee Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Employee Name:</Text>
                <Text style={styles.infoValue}>
                  {payslip.staff.user.first_name} {payslip.staff.user.last_name}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Staff Number:</Text>
                <Text style={styles.infoValue}>
                  {payslip.staff.staff_number || 'N/A'}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email Address:</Text>
                <Text style={styles.infoValue}>{payslip.staff.user.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Department:</Text>
                <Text style={styles.infoValue}>
                  {payslip.staff.department.name || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gross Pay:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(grossPay)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Deductions:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(payslip.total_deductions)}
              </Text>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopStyle: 'solid',
                borderTopColor: '#d1d5db',
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              <View style={styles.summaryRow}>
                <Text
                  style={[
                    styles.summaryLabel,
                    { fontSize: 11, color: '#1f2937' },
                  ]}
                >
                  Net Pay:
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { fontSize: 11, color: '#1f2937' },
                  ]}
                >
                  {formatCurrency(netPay)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.paymentSection}>
            <View style={styles.earningsContainer}>
              <Text style={styles.sectionTitle}>Earnings</Text>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Basic Salary</Text>
                <Text style={styles.paymentValue}>
                  {formatCurrency(payslip.basic_salary)}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Overtime Pay</Text>
                <Text style={styles.paymentValue}>
                  {formatCurrency(payslip.total_overtime)}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Allowances</Text>
                <Text style={styles.paymentValue}>
                  {formatCurrency(payslip.total_allowances)}
                </Text>
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopStyle: 'solid',
                  borderTopColor: '#16a34a',
                  marginTop: 8,
                  paddingTop: 8,
                }}
              >
                <View style={styles.paymentRow}>
                  <Text
                    style={[
                      styles.paymentLabel,
                      { fontWeight: 'bold', color: '#15803d' },
                    ]}
                  >
                    Total Earnings
                  </Text>
                  <Text
                    style={[
                      styles.paymentValue,
                      { fontWeight: 'bold', color: '#15803d' },
                    ]}
                  >
                    {formatCurrency(totalEarnings)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Deductions */}
            <View style={styles.deductionsContainer}>
              <Text style={styles.sectionTitle}>Deductions</Text>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>NHIF</Text>
                <Text style={styles.paymentValue}>
                  {formatCurrency(payslip.nhif)}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Nssf</Text>
                <Text style={styles.paymentValue}>
                  {formatCurrency(payslip.nssf)}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>PAYE</Text>
                <Text style={styles.paymentValue}>
                  {formatCurrency(payslip.paye)}
                </Text>
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: '#ef4444',
                  marginTop: 8,
                  paddingTop: 8,
                }}
              >
                <View style={styles.paymentRow}>
                  <Text
                    style={[
                      styles.paymentLabel,
                      { fontWeight: 'bold', color: '#dc2626' },
                    ]}
                  >
                    Total Deductions
                  </Text>
                  <Text
                    style={[
                      styles.paymentValue,
                      { fontWeight: 'bold', color: '#dc2626' },
                    ]}
                  >
                    {formatCurrency(payslip.total_deductions)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.netPayContainer}>
            <View style={styles.netPayRow}>
              <Text style={styles.netPayLabel}>NET PAY</Text>
              <Text style={styles.netPayValue}>{formatCurrency(netPay)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBold}>CONFIDENTIAL DOCUMENT</Text>
          <Text style={styles.footerText}>
            This payslip is computer-generated and does not require a signature.
          </Text>
          <Text style={styles.footerText}>
            Generated on {CustomDate(payslip.generated_at)} by HR System
          </Text>
          <Text style={styles.footerText}>
            For any queries, please contact Human Resources Department
          </Text>
        </View>

        <View style={styles.confidentialNotice}>
          <Text style={styles.confidentialText}>
            This document contains confidential salary information. Handle with
            care and keep secure.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const PaySlipPDFViewer = ({
  payslip,
  onClose,
}: {
  payslip: PaySlipType;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col h-[90vh] z-[10000]">
        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiPrinter className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                PaySlip Preview
              </h2>
              <p className="text-sm text-gray-600">
                {payslip.staff.user.first_name} {payslip.staff.user.last_name} -{' '}
                {payslip.payroll_period_start}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative z-[10000]">
          <PDFViewer width="100%" height="100%" className="border-0">
            <PaySlipPDF payslip={payslip} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export const PaySlipDownloadButton = ({
  payslip,
  variant = 'button',
}: {
  payslip: PaySlipType;
  variant?: 'button' | 'link';
}) => {
  const fileName = `payslip_${payslip.staff.user.first_name}_${payslip.staff.user.last_name}_${payslip.payroll_period_start}.pdf`;

  const buttonClass =
    variant === 'link'
      ? 'text-blue-600 hover:text-blue-800 underline '
      : 'flex items-center justify-center p-2 rounded-xl bg-green-100 font-bold text-md shadow-md cursor-pointer text-green-600 hover:bg-green-500 hover:text-white transition duration-200 shadow-sm hover:shadow-md';

  return (
    <PDFDownloadLink
      document={<PaySlipPDF payslip={payslip} />}
      fileName={fileName}
      className={buttonClass}
      title="Download Payslip"
    >
      {({ loading }) => (
        <>
          {variant === 'button' && <FiDownload className="text-md" />}
          {variant === 'link' && (loading ? 'Preparing...' : 'Download')}
        </>
      )}
    </PDFDownloadLink>
  );
};

export default PaySlipPDF;
