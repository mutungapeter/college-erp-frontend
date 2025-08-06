
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { BalanceSheetItem, BalanceSheetType } from "@/definitions/finance/accounts/reports";






// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  logoSection: {
    marginBottom: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  universityHeaderText: {
    alignItems: "center",
  },
  universityName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 8,
    textAlign: "center",
    marginBottom: 2,
    lineHeight: 1.2,
  },
  documentType: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 9,
    color: "#6B7280",
    fontWeight: "semibold",
    marginTop: 8,
    marginBottom: 7,
    textAlign: "center",
  },
  summarySection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
    paddingBottom: 15,
  },
  summaryHeader: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  summaryGrid: {
    paddingHorizontal: 12,
    flexDirection: "column",
    gap: 10,
  },
  summaryItem: {
    flex: 1,
    marginHorizontal: 5,
    padding: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  summaryAmount: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "right",
  },
  blueAmount: {
    color: "#2563EB",
  },
  purpleAmount: {
    color: "#7C3AED",
  },
  positiveAmount: {
    color: "#059669",
  },
  negativeAmount: {
    color: "#DC2626",
  },
  section: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    borderBottomStyle: "solid",
    paddingBottom: 15,
  },
  sectionHeader: {
    backgroundColor: "#EFF6FF",
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F2937",
  },
  sectionAmount: {
    fontSize: 10,
    fontWeight: "bold",
  },
  itemsContainer: {
    paddingHorizontal: 12,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    borderBottomStyle: "solid",
  },
  itemName: {
    fontSize: 11,
    color: "#374151",
    flex: 1,
  },
  itemAmount: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
  },
  sectionTotal: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
    borderTopStyle: "solid",
    backgroundColor: "#F9FAFB",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
  },
  sectionTotalAmount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  balanceVerificationSection: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
    borderTopStyle: "solid",
  },
  balanceVerificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  balanceVerificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  balanceStatus: {
    fontSize: 16,
    fontWeight: "bold",
  },
  balanceGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  balanceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginHorizontal: 10,
  },
  balanceLabel: {
    fontSize: 11,
    color: "#6B7280",
  },
  balanceAmount: {
    fontSize: 11,
    fontWeight: "bold",
  },
  balanceDescription: {
    fontSize: 11,
    color: "#6B7280",
  },
});

interface BalanceSheetPDFDocumentProps {
  data: BalanceSheetType;
  asOfDateText: string;
}

const BalanceSheetPDFDocument: React.FC<BalanceSheetPDFDocumentProps> = ({
  data,
  asOfDateText,
}) => {
  const formatCurrency = (amount: number): string => {
    return `KES ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const { Assets: totalAssets, "Liabilities + Equity": totalLiabilitiesEquity, Balanced: isBalanced } = data.Totals;
  const totalLiabilities = data.Liabilities.reduce((sum, item) => sum + item.balance, 0);
  const totalEquity = data.Equity.reduce((sum, item) => sum + item.balance, 0);

  interface SectionProps {
    title: string;
    items: BalanceSheetItem[];
    sectionTotal: number;
    sectionType: 'assets' | 'liabilities' | 'equity';
  }

  const Section: React.FC<SectionProps> = ({
    title,
    items,
    sectionTotal,
    sectionType,
  }) => {
    const getSectionAmountColor = () => {
      switch (sectionType) {
        case 'assets':
          return styles.blueAmount;
        case 'liabilities':
          return styles.negativeAmount;
        case 'equity':
          return styles.positiveAmount;
        default:
          return {};
      }
    };

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={[styles.sectionAmount, getSectionAmountColor()]}>
            {formatCurrency(sectionTotal)}
          </Text>
        </View>

        <View style={styles.itemsContainer}>
          {items.map((item, index) => {
            if (item.balance > 0) {
              return (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={[styles.itemAmount, getSectionAmountColor()]}>
                    {formatCurrency(item.balance)}
                  </Text>
                </View>
              );
            }
            return null;
          })}

          <View style={styles.sectionTotal}>
            <Text style={styles.sectionTotalLabel}>Total {title}:</Text>
            <Text style={[styles.sectionTotalAmount, getSectionAmountColor()]}>
              {formatCurrency(sectionTotal)}
            </Text>
          </View>
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
          <Text style={styles.documentType}>Balance Sheet</Text>
          <Text style={styles.subtitle}>{asOfDateText}</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Balance Sheet Summary</Text>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Assets</Text>
              <Text style={[styles.summaryAmount, styles.blueAmount]}>
                {formatCurrency(totalAssets)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Liabilities + Equity</Text>
              <Text style={[styles.summaryAmount, styles.purpleAmount]}>
                {formatCurrency(totalLiabilitiesEquity)}
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

        {/* Assets Section */}
        <Section
          title="Assets"
          items={data.Assets}
          sectionTotal={totalAssets}
          sectionType="assets"
        />

        {/* Liabilities Section */}
        <Section
          title="Liabilities"
          items={data.Liabilities}
          sectionTotal={totalLiabilities}
          sectionType="liabilities"
        />

        {/* Equity Section */}
        <Section
          title="Equity"
          items={data.Equity}
          sectionTotal={totalEquity}
          sectionType="equity"
        />

        {/* Balance Verification Section */}
        <View style={[styles.balanceVerificationSection, isBalanced ? { backgroundColor: '#F0FDF4' } : { backgroundColor: '#FEF2F2' }]}>
          <View style={styles.balanceVerificationHeader}>
            <Text style={styles.balanceVerificationTitle}>Balance Verification</Text>
            <Text
              style={[
                styles.balanceStatus,
                isBalanced ? styles.positiveAmount : styles.negativeAmount,
              ]}
            >
              {isBalanced ? '✓ BALANCED' : '✗ NOT BALANCED'}
            </Text>
          </View>
          
          <View style={styles.balanceGrid}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Assets:</Text>
              <Text style={[styles.balanceAmount, styles.blueAmount]}>
                {formatCurrency(totalAssets)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Liabilities + Equity:</Text>
              <Text style={[styles.balanceAmount, styles.purpleAmount]}>
                {formatCurrency(totalLiabilitiesEquity)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.balanceDescription}>
            {isBalanced 
              ? "The balance sheet is balanced. Assets equal Liabilities plus Equity."
              : `The balance sheet is not balanced. Difference: ${formatCurrency(Math.abs(totalAssets - totalLiabilitiesEquity))}`
            }
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const exportBalanceSheetToPDF = async (
  data: BalanceSheetType,
  asOfDateText: string
): Promise<void> => {
  const doc = (
    <BalanceSheetPDFDocument data={data} asOfDateText={asOfDateText} />
  );
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `balance-sheet-${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default BalanceSheetPDFDocument;