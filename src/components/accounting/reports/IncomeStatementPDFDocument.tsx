// IncomeStatementPDFDocument.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from '@react-pdf/renderer';

// Define types
interface Income {
  name: string;
  amount: string | number;
}

interface Expense {
  name: string;
  amount: string | number;
}

interface Totals {
  total_income: string | number;
  total_expenses: string | number;
  net_profit: string | number;
  profit_margin: number;
}

interface IncomeStatementData {
  income: Income[];
  expenses: Expense[];
  totals: Totals;
}

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
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
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: 'semibold',
    marginTop: 8,
    marginBottom: 7,
  },
  summarySection: {
    marginBottom: 20,
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
  summaryItem: {
    flex: 1,
    marginHorizontal: 5,
    padding: 8,
    // borderWidth: 1,
    // borderColor: '#E5E7EB',
    // borderStyle: 'solid',
    // borderRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summaryGrid: {
    paddingHorizontal: 12,
    flexDirection: 'column',
    gap: 10,
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
    textAlign: 'right',
  },
  positiveAmount: {
    color: '#059669',
  },
  negativeAmount: {
    color: '#DC2626',
  },
  blueAmount: {
    color: '#2563EB',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sectionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemsContainer: {
    paddingHorizontal: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderBottomStyle: 'solid',
  },
  itemName: {
    fontSize: 11,
    color: '#374151',
    flex: 1,
  },
  itemAmount: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  sectionTotal: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    borderTopStyle: 'solid',
    backgroundColor: '#F9FAFB',
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
  },
  sectionTotalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  netProfitSection: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    borderTopStyle: 'solid',
  },
  netProfitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  netProfitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  netProfitAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  netProfitDescription: {
    fontSize: 11,
    color: '#6B7280',
  },
});

interface IncomeStatementPDFDocumentProps {
  data: IncomeStatementData;
  periodText: string;
}

const IncomeStatementPDFDocument: React.FC<IncomeStatementPDFDocumentProps> = ({
  data,
  periodText,
}) => {
  const formatCurrency = (amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `KES ${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const { total_income, total_expenses, net_profit, profit_margin } =
    data.totals;

  interface SectionProps {
    title: string;
    items: Income[] | Expense[];
    sectionTotal: string | number;
    isExpense?: boolean;
  }

  const Section: React.FC<SectionProps> = ({
    title,
    items,
    sectionTotal,
    isExpense = false,
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text
          style={[
            styles.sectionAmount,
            isExpense ? styles.negativeAmount : styles.positiveAmount,
          ]}
        >
          {formatCurrency(sectionTotal)}
        </Text>
      </View>

      <View style={styles.itemsContainer}>
        {items.map((item, index) => {
          const amount =
            typeof item.amount === 'string'
              ? parseFloat(item.amount)
              : item.amount;
          if (amount > 0) {
            return (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text
                  style={[
                    styles.itemAmount,
                    isExpense ? styles.negativeAmount : styles.positiveAmount,
                  ]}
                >
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            );
          }
          return null;
        })}

        <View style={styles.sectionTotal}>
          <Text style={styles.sectionTotalLabel}>Total {title}:</Text>
          <Text
            style={[
              styles.sectionTotalAmount,
              isExpense ? styles.negativeAmount : styles.positiveAmount,
            ]}
          >
            {formatCurrency(sectionTotal)}
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
        {/* <View style={styles.header}>
          <Text style={styles.title}>Income Statement</Text>
          <Text style={styles.subtitle}>{periodText}</Text>
        </View> */}

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Profit & Loss Summary</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Revenue</Text>
              <Text style={[styles.summaryAmount, styles.positiveAmount]}>
                {formatCurrency(total_income)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryAmount, styles.negativeAmount]}>
                {formatCurrency(total_expenses)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Net Profit/Loss</Text>
              <Text
                style={[
                  styles.summaryAmount,
                  parseFloat(net_profit.toString()) >= 0
                    ? styles.positiveAmount
                    : styles.negativeAmount,
                ]}
              >
                {formatCurrency(net_profit)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Profit Margin</Text>
              <Text style={[styles.summaryAmount, styles.blueAmount]}>
                {profit_margin.toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Revenue Section */}
        <Section
          title="Revenue"
          items={data.income}
          sectionTotal={total_income}
        />

        {/* Expenses Section */}
        <Section
          title="Expenses"
          items={data.expenses}
          sectionTotal={total_expenses}
          isExpense={true}
        />

        {/* Net Profit Section */}
        <View style={styles.netProfitSection}>
          <View style={styles.netProfitHeader}>
            <Text style={styles.netProfitTitle}>Net Profit/Loss</Text>
            <Text
              style={[
                styles.netProfitAmount,
                parseFloat(net_profit.toString()) >= 0
                  ? styles.positiveAmount
                  : styles.negativeAmount,
              ]}
            >
              {formatCurrency(net_profit)}
            </Text>
          </View>
          <Text style={styles.netProfitDescription}>
            {parseFloat(net_profit.toString()) >= 0
              ? `Your business generated a profit of ${formatCurrency(
                  net_profit,
                )} for this period.`
              : `Your business incurred a loss of ${formatCurrency(
                  Math.abs(parseFloat(net_profit.toString())),
                )} for this period.`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const exportIncomeStatementToPDF = async (
  data: IncomeStatementData,
  periodText: string,
): Promise<void> => {
  const doc = (
    <IncomeStatementPDFDocument data={data} periodText={periodText} />
  );
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `income-statement-${
    new Date().toISOString().split('T')[0]
  }.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default IncomeStatementPDFDocument;
