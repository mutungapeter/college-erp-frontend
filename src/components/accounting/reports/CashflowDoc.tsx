// CashflowPDFDocument.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from '@react-pdf/renderer';

// Define types
interface Transaction {
  account: string;
  amount: string;
  type: string;
}

interface Journal {
  journal_id: number;
  date: string;
  description: string;
  reference: string;
  transactions: Transaction[];
}

interface Total {
  inflows: string;
  outflows: string;
  net_cash_flow: string;
}

interface ActivityData {
  journals: Journal[];
  totals: Total;
}

interface Summary {
  opening_balance: string;
  gross_inflows: string;
  gross_outflows: string;
  net_cash_change: string;
  ending_balance: string;
}

interface CashFlowData {
  Operating: ActivityData;
  Investing: ActivityData;
  Financing: ActivityData;
  summary: Summary;
}

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  logoSection: {
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  universityHeaderText: {
    alignItems: 'center',
  },
  universityName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 1.2,
  },
  officeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 3,
  },
  documentType: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    paddingBottom: 15,
  },
  sectionHeader: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  positiveAmount: {
    color: '#059669',
  },
  negativeAmount: {
    color: '#DC2626',
  },
  totalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  totalItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  totalLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 3,
  },
  totalAmount: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  summarySection: {
    marginTop: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    paddingBottom: 15,
  },
  summaryHeader: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryGrid: {
    paddingHorizontal: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderBottomStyle: 'solid',
  },
  summaryRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  summaryAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  summaryDate: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
});

interface CashflowPDFDocumentProps {
  data: CashFlowData;
  periodText: string;
}

const CashflowPDFDocument: React.FC<CashflowPDFDocumentProps> = ({
  data,
  periodText,
}) => {
  const formatCurrency = (amount: string): string => {
    const num = parseFloat(amount);
    return `KES ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  interface ActivitySectionProps {
    title: string;
    activityData: ActivityData;
  }

  const ActivitySection: React.FC<ActivitySectionProps> = ({
    title,
    activityData,
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title} Activities</Text>
        <Text
          style={[
            styles.sectionAmount,
            parseFloat(activityData.totals.net_cash_flow) >= 0
              ? styles.positiveAmount
              : styles.negativeAmount,
          ]}
        >
          {formatCurrency(activityData.totals.net_cash_flow)}
        </Text>
      </View>

      <View style={styles.totalsGrid}>
        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>Total Inflows:</Text>
          <Text style={[styles.totalAmount, styles.positiveAmount]}>
            {formatCurrency(activityData.totals.inflows)}
          </Text>
        </View>
        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>Total Outflows:</Text>
          <Text style={[styles.totalAmount, styles.negativeAmount]}>
            {formatCurrency(activityData.totals.outflows)}
          </Text>
        </View>
        <View style={styles.totalItem}>
          <Text style={styles.totalLabel}>Net {title}:</Text>
          <Text
            style={[
              styles.totalAmount,
              parseFloat(activityData.totals.net_cash_flow) >= 0
                ? styles.positiveAmount
                : styles.negativeAmount,
            ]}
          >
            {formatCurrency(activityData.totals.net_cash_flow)}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={styles.logo} src="/logo/university_logo.png" />
            <View style={styles.universityHeaderText}>
              <Text style={styles.universityName}>
                Kathangaita University of Science and Technology
              </Text>
            </View>
          </View>
          <Text style={styles.contactInfo}>
            P.O. BOX. 190-50100 Kathangaita,
          </Text>
          <Text style={styles.contactInfo}>
            TEL: +057-250523646/3,0745535335, FAX: +056-30150
          </Text>
          <Text style={styles.contactInfo}>
            Email: info@kaust.ac.ke, web: www.kaust.ac.ke
          </Text>
          {/* <Text style={styles.officeTitle}>
                             OFFICE OF THE REGISTRAR - ACADEMICS
                           </Text> */}
          <Text style={styles.documentType}>Income Statement</Text>
          <Text style={styles.subtitle}>{periodText}</Text>
        </View>

        {/* Activity Sections */}
        <ActivitySection title="Operating" activityData={data.Operating} />
        <ActivitySection title="Investing" activityData={data.Investing} />
        <ActivitySection title="Financing" activityData={data.Financing} />

        {/* Summary Section at Bottom */}
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Overview</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Starting Balance{' '}
                <Text style={styles.summaryDate}>(As of 26 July, 2024)</Text>
              </Text>
              <Text style={styles.summaryAmount}>
                {formatCurrency(data.summary.opening_balance)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gross Cash Inflow</Text>
              <Text style={[styles.summaryAmount, styles.positiveAmount]}>
                {formatCurrency(data.summary.gross_inflows)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Gross Cash Outflow</Text>
              <Text style={[styles.summaryAmount, styles.negativeAmount]}>
                {formatCurrency(data.summary.gross_outflows)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Net Cash Change</Text>
              <Text
                style={[
                  styles.summaryAmount,
                  parseFloat(data.summary.net_cash_change) >= 0
                    ? styles.positiveAmount
                    : styles.negativeAmount,
                ]}
              >
                {formatCurrency(data.summary.net_cash_change)}
              </Text>
            </View>

            <View style={styles.summaryRowLast}>
              <Text style={styles.summaryLabel}>
                Ending Balance{' '}
                <Text style={styles.summaryDate}>(As of 26 July, 2025)</Text>
              </Text>
              <Text style={styles.summaryAmount}>
                {formatCurrency(data.summary.ending_balance)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const exportCashflowToPDF = async (
  data: CashFlowData,
  periodText: string,
): Promise<void> => {
  const doc = <CashflowPDFDocument data={data} periodText={periodText} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cashflow-statement-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default CashflowPDFDocument;
