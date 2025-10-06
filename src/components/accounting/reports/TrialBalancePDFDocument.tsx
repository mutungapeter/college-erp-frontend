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
import {
  TrialBalanceAccount,
  TrialBalanceType,
} from '@/definitions/finance/accounts/reports';

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
  documentType: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: 'semibold',
    marginTop: 8,
    marginBottom: 7,
    textAlign: 'center',
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
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 8,
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
  blueAmount: {
    color: '#2563EB',
  },
  redAmount: {
    color: '#DC2626',
  },
  positiveAmount: {
    color: '#059669',
  },
  negativeAmount: {
    color: '#DC2626',
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
    padding: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 8,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    borderBottomStyle: 'solid',
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  codeColumn: {
    width: '15%',
  },
  nameColumn: {
    width: '35%',
    textAlign: 'left',
  },
  debitColumn: {
    width: '17%',
    textAlign: 'right',
  },
  creditColumn: {
    width: '17%',
    textAlign: 'right',
  },
  balanceColumn: {
    width: '16%',
    textAlign: 'right',
  },
  accountRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    borderBottomStyle: 'solid',
  },
  accountCell: {
    fontSize: 9,
    color: '#374151',
    paddingVertical: 2,
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
  },
  sectionTotalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  sectionTotalAmount: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  balanceVerificationSection: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#D1D5DB',
    borderTopStyle: 'solid',
  },
  balanceVerificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceVerificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  balanceStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 10,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  balanceAmount: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  balanceDescription: {
    fontSize: 11,
    color: '#6B7280',
  },
});

interface TrialBalancePDFDocumentProps {
  data: TrialBalanceType;
  asOfDateText: string;
}

const TrialBalancePDFDocument: React.FC<TrialBalancePDFDocumentProps> = ({
  data,
  asOfDateText,
}) => {
  const formatCurrency = (amount: number): string => {
    return `KES ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const {
    total_debit: totalDebit,
    total_credit: totalCredit,
    balanced: isBalanced,
  } = data.totals;

  // Group accounts by type
  const assetAccounts = data.accounts.filter(
    (account) => account.type === 'Asset',
  );
  const liabilityAccounts = data.accounts.filter(
    (account) => account.type === 'Liability',
  );
  const equityAccounts = data.accounts.filter(
    (account) => account.type === 'Equity',
  );
  const incomeAccounts = data.accounts.filter(
    (account) => account.type === 'Income',
  );
  const expenseAccounts = data.accounts.filter(
    (account) => account.type === 'Expense',
  );

  interface SectionProps {
    title: string;
    accounts: TrialBalanceAccount[];
    sectionType: 'assets' | 'liabilities' | 'equity' | 'income' | 'expenses';
  }

  const Section: React.FC<SectionProps> = ({
    title,
    accounts,
    sectionType,
  }) => {
    const getSectionAmountColor = () => {
      switch (sectionType) {
        case 'assets':
          return styles.blueAmount;
        case 'liabilities':
          return styles.redAmount;
        case 'equity':
          return styles.positiveAmount;
        case 'income':
          return { color: '#7C3AED' }; // Purple
        case 'expenses':
          return { color: '#EA580C' }; // Orange
        default:
          return {};
      }
    };

    const sectionTotalDebit = accounts.reduce(
      (sum, account) => sum + account.debit,
      0,
    );
    const sectionTotalCredit = accounts.reduce(
      (sum, account) => sum + account.credit,
      0,
    );

    // Only show accounts with non-zero balances
    const activeAccounts = accounts.filter(
      (account) => account.debit > 0 || account.credit > 0,
    );

    if (activeAccounts.length === 0) {
      return null;
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.codeColumn]}>Code</Text>
          <Text style={[styles.tableHeaderCell, styles.nameColumn]}>
            Account Name
          </Text>
          <Text style={[styles.tableHeaderCell, styles.debitColumn]}>
            Debit
          </Text>
          <Text style={[styles.tableHeaderCell, styles.creditColumn]}>
            Credit
          </Text>
          <Text style={[styles.tableHeaderCell, styles.balanceColumn]}>
            Balance
          </Text>
        </View>

        {/* Account Rows */}
        {activeAccounts.map((account, index) => (
          <View key={index} style={styles.accountRow}>
            <Text
              style={[
                styles.accountCell,
                styles.codeColumn,
                { fontFamily: 'Courier' },
              ]}
            >
              {account.code}
            </Text>
            <Text style={[styles.accountCell, styles.nameColumn]}>
              {account.name}
            </Text>
            <Text
              style={[
                styles.accountCell,
                styles.debitColumn,
                styles.blueAmount,
              ]}
            >
              {account.debit > 0 ? formatCurrency(account.debit) : '-'}
            </Text>
            <Text
              style={[
                styles.accountCell,
                styles.creditColumn,
                styles.redAmount,
              ]}
            >
              {account.credit > 0 ? formatCurrency(account.credit) : '-'}
            </Text>
            <Text
              style={[
                styles.accountCell,
                styles.balanceColumn,
                getSectionAmountColor(),
              ]}
            >
              {account.balance > 0 ? formatCurrency(account.balance) : '-'}
            </Text>
          </View>
        ))}

        {/* Section Totals */}
        <View style={styles.sectionTotal}>
          <Text style={[styles.sectionTotalLabel, styles.codeColumn]}></Text>
          <Text style={[styles.sectionTotalLabel, styles.nameColumn]}>
            Total {title}:
          </Text>
          <Text
            style={[
              styles.sectionTotalAmount,
              styles.debitColumn,
              styles.blueAmount,
            ]}
          >
            {sectionTotalDebit > 0 ? formatCurrency(sectionTotalDebit) : '-'}
          </Text>
          <Text
            style={[
              styles.sectionTotalAmount,
              styles.creditColumn,
              styles.redAmount,
            ]}
          >
            {sectionTotalCredit > 0 ? formatCurrency(sectionTotalCredit) : '-'}
          </Text>
          <Text
            style={[
              styles.sectionTotalAmount,
              styles.balanceColumn,
              getSectionAmountColor(),
            ]}
          >
            {formatCurrency(Math.abs(sectionTotalDebit - sectionTotalCredit))}
          </Text>
        </View>
      </View>
    );
  };

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
          <Text style={styles.documentType}>Trial Balance</Text>
          <Text style={styles.subtitle}>{asOfDateText}</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Trial Balance Summary</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Debits</Text>
              <Text style={[styles.summaryAmount, styles.blueAmount]}>
                {formatCurrency(totalDebit)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Credits</Text>
              <Text style={[styles.summaryAmount, styles.redAmount]}>
                {formatCurrency(totalCredit)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Balance Status</Text>
              <Text
                style={[
                  styles.summaryAmount,
                  isBalanced ? styles.positiveAmount : styles.negativeAmount,
                ]}
              >
                {isBalanced ? 'Balanced' : 'Not Balanced'}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Sections */}
        <Section title="Assets" accounts={assetAccounts} sectionType="assets" />

        <Section
          title="Liabilities"
          accounts={liabilityAccounts}
          sectionType="liabilities"
        />

        <Section
          title="Equity"
          accounts={equityAccounts}
          sectionType="equity"
        />

        <Section
          title="Income"
          accounts={incomeAccounts}
          sectionType="income"
        />

        <Section
          title="Expenses"
          accounts={expenseAccounts}
          sectionType="expenses"
        />

        {/* Grand Totals Section */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Grand Totals</Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.codeColumn]}></Text>
            <Text style={[styles.tableHeaderCell, styles.nameColumn]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, styles.debitColumn]}>
              Debit
            </Text>
            <Text style={[styles.tableHeaderCell, styles.creditColumn]}>
              Credit
            </Text>
            <Text style={[styles.tableHeaderCell, styles.balanceColumn]}>
              Difference
            </Text>
          </View>

          <View style={styles.accountRow}>
            <Text style={[styles.accountCell, styles.codeColumn]}></Text>
            <Text
              style={[
                styles.accountCell,
                styles.nameColumn,
                { fontWeight: 'bold' },
              ]}
            >
              Total All Accounts
            </Text>
            <Text
              style={[
                styles.accountCell,
                styles.debitColumn,
                styles.blueAmount,
                { fontWeight: 'bold' },
              ]}
            >
              {formatCurrency(totalDebit)}
            </Text>
            <Text
              style={[
                styles.accountCell,
                styles.creditColumn,
                styles.redAmount,
                { fontWeight: 'bold' },
              ]}
            >
              {formatCurrency(totalCredit)}
            </Text>
            <Text
              style={[
                styles.accountCell,
                styles.balanceColumn,
                isBalanced ? styles.positiveAmount : styles.negativeAmount,
                { fontWeight: 'bold' },
              ]}
            >
              {formatCurrency(Math.abs(totalDebit - totalCredit))}
            </Text>
          </View>
        </View>

        {/* Balance Verification Section */}
        <View
          style={[
            styles.balanceVerificationSection,
            isBalanced
              ? { backgroundColor: '#F0FDF4' }
              : { backgroundColor: '#FEF2F2' },
          ]}
        >
          <View style={styles.balanceVerificationHeader}>
            <Text style={styles.balanceVerificationTitle}>
              Balance Verification
            </Text>
            <Text
              style={[
                styles.balanceStatus,
                isBalanced ? styles.positiveAmount : styles.negativeAmount,
              ]}
            >
              {isBalanced ? 'BALANCED' : 'NOT BALANCED'}
            </Text>
          </View>

          <View style={styles.balanceGrid}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Debits:</Text>
              <Text style={[styles.balanceAmount, styles.blueAmount]}>
                {formatCurrency(totalDebit)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Credits:</Text>
              <Text style={[styles.balanceAmount, styles.redAmount]}>
                {formatCurrency(totalCredit)}
              </Text>
            </View>
          </View>

          <Text style={styles.balanceDescription}>
            {isBalanced
              ? 'The trial balance is balanced. Total debits equal total credits.'
              : `The trial balance is not balanced. Difference: ${formatCurrency(Math.abs(totalDebit - totalCredit))}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const exportTrialBalanceToPDF = async (
  data: TrialBalanceType,
  asOfDateText: string,
): Promise<void> => {
  const doc = (
    <TrialBalancePDFDocument data={data} asOfDateText={asOfDateText} />
  );
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `trial-balance-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default TrialBalancePDFDocument;
