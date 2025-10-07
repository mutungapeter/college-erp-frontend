"use client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import { formatCurrency } from "@/utils/currency";

// ---------------- Interfaces ----------------
interface FeeStatementStudent {
  id: number;
  name: string;
  registration_number: string;
  programme: string;
  cohort: string;
  balance: string; // ✅ added backend balance
  statements: FeeStatementRecord[];
}

interface FeeStatementRecord {
  reference: string;
  statement_type: string;
  debit: string;
  credit: string;
  balance: string;
  payment_method: string | null;
  semester: string;
  created_on: string;
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.2,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#10b981",
    paddingBottom: 15,
    alignItems: "center",
  },
  logo: { width: 80, height: 80, marginBottom: 5 },
  schoolName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  contactInfo: { fontSize: 8, color: "#6b7280" },
  documentTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 8,
    color: "#374151",
  },
  studentInfoSection: {
    marginBottom: 15,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
  },
  infoColumn: { width: "40%" },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 2,
  },
  infoLabel: { fontSize: 9, fontWeight: "bold", marginRight: 4 },
  infoValue: { fontSize: 9 },
  table: { marginBottom: 15, borderWidth: 1, borderColor: "#d1d5db" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f3f4f6" },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: "bold",
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    fontSize: 8,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    textAlign: "center",
  },
  tableCellLeft: { textAlign: "left" },
  summarySection: { marginTop: 10, padding: 10 },
  summaryTitle: { fontSize: 11, fontWeight: "bold", marginBottom: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#10b981",
  },
  summaryRowLast: { borderBottomWidth: 0 },
  footer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    alignItems: "center",
  },
  footerText: { fontSize: 7, color: "#6b7280", marginBottom: 2 },
});

// ---------------- Component ----------------
const FeeStatementPDFDocument = ({ data }: { data: FeeStatementStudent[] }) => {
  if (!data || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No fee statement data available</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {data.map((student) => {
        const { statements } = student;
        if (!statements || statements.length === 0) return null;

        const totalDebits = statements.reduce(
          (sum, s) => sum + parseFloat(s.debit || "0"),
          0
        );
        const totalCredits = statements.reduce(
          (sum, s) => sum + parseFloat(s.credit || "0"),
          0
        );

        const currentBalance = parseFloat(student.balance || "0");

        return (
          <Page key={student.id} size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image
                style={styles.logo}
                src="/logo/university_logo.png"
                cache={false}
              />
              <Text style={styles.schoolName}>MAWENG COLLEGE</Text>
              <Text style={styles.contactInfo}>P.O. BOX. 180-90119 Matuu</Text>
              <Text style={styles.contactInfo}>TEL: 0728715810</Text>
              <Text style={styles.contactInfo}>
                Email: mawengcollege@gmail.com
              </Text>
              <Text style={styles.documentTitle}>FEE STATEMENT</Text>
            </View>

            {/* Student Info */}
            <View style={styles.studentInfoSection}>
              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Student:</Text>
                  <Text style={styles.infoValue}>{student.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Adm No:</Text>
                  <Text style={styles.infoValue}>
                    {student.registration_number}
                  </Text>
                </View>
              </View>

              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Programme:</Text>
                  <Text style={styles.infoValue}>{student.programme}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cohort:</Text>
                  <Text style={styles.infoValue}>{student.cohort}</Text>
                </View>
              </View>

              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Semester:</Text>
                  <Text style={styles.infoValue}>
                    {statements[0]?.semester || "—"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Year:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(
                      statements[0]?.created_on || new Date()
                    ).getFullYear()}
                  </Text>
                </View>
              </View>

              <View style={styles.infoColumn}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Balance:</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      {
                       
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {formatCurrency(currentBalance)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Date</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Type</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                  Reference
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                  Semester
                </Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Debit</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Credit</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                  Balance
                </Text>
              </View>

              {statements.map((s) => (
                <View key={s.reference} style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, { flex: 0.8 }, styles.tableCellLeft]}
                  >
                    {new Date(s.created_on).toLocaleDateString("en-GB")}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 1 }, styles.tableCellLeft]}
                  >
                    {s.statement_type}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 2 }, styles.tableCellLeft]}
                  >
                    {s.reference}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 1 }, styles.tableCellLeft]}
                  >
                    {s.semester}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 1 }, styles.tableCellLeft]}
                  >
                    {parseFloat(s.debit) > 0 ? formatCurrency(s.debit) : "-"}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 1 }, styles.tableCellLeft]}
                  >
                    {parseFloat(s.credit) > 0 ? formatCurrency(s.credit) : "-"}
                  </Text>
                  <Text
                    style={[styles.tableCell, { flex: 1 }, styles.tableCellLeft]}
                  >
                    {formatCurrency(parseFloat(s.balance))}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary */}
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>STATEMENT SUMMARY</Text>
              <View>
                <View style={styles.summaryRow}>
                  <Text>Total Invoiced:</Text>
                  <Text>{formatCurrency(totalDebits)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>Total Paid:</Text>
                  <Text>{formatCurrency(totalCredits)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.summaryRowLast]}>
                  <Text>Outstanding Balance:</Text>
                  <Text
                    style={{
                      
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(currentBalance)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                This is an official fee statement of Maweng College.
              </Text>
              <Text style={styles.footerText}>
                For queries regarding this statement, please contact the bursar.
              </Text>
              <Text style={styles.footerText}>
                Generated on {new Date().toLocaleDateString()}
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

// ---------------- Export Helper ----------------
export const exportFeeStatementToPDF = async (data: FeeStatementStudent[]) => {
  const doc = <FeeStatementPDFDocument data={data} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();

  const student = data[0];
  const studentName = student ? student.name.replace(/\s+/g, "_") : "student";
  const admissionNumber = student?.registration_number || "unknown";

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `fee-statement-${studentName}-${admissionNumber}-${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

export default FeeStatementPDFDocument;
